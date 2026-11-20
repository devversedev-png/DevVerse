import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import AdminTopBar from "../../components/Admin/AdminTopBar";
import { useAuth } from "../../context/AuthContext";
import { useProjects } from "../../context/ProjectsContext";
import {
  createProject,
  deleteProject,
  fetchAllProjects,
  imageUrl,
  updateProject,
} from "../../services/projectApi";

import "./AdminProjects.css";

const STATUSES = ["Live", "In progress", "Completed", "Coming soon"];
const MAX_IMAGES = 8;

const emptyForm = {
  title: "",
  category: "Website",
  status: "Live",
  description: "",
  href: "",
  technologies: "",
  overview: "",
  scope: "",
  fit: "",
};

/* Shrinks a photo in the browser so uploads stay small and fast. */
function compressImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      const scale = Math.min(1, 1600 / image.width);
      const canvas = document.createElement("canvas");

      canvas.width = Math.round(image.width * scale);
      canvas.height = Math.round(image.height * scale);
      canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);

      let dataUrl = canvas.toDataURL("image/webp", 0.82);

      if (!dataUrl.startsWith("data:image/webp")) {
        dataUrl = canvas.toDataURL("image/jpeg", 0.85);
      }

      resolve(dataUrl);
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error(`${file.name} could not be read as an image.`));
    };

    image.src = url;
  });
}

const splitLines = (text) =>
  text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

function AdminProjects() {
  const { token, logout } = useAuth();
  const { refresh } = useProjects();
  const navigate = useNavigate();

  const formRef = useRef(null);
  const fileRef = useRef(null);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [existingImages, setExistingImages] = useState([]); // { index, url }
  const [newImages, setNewImages] = useState([]); // { id, dataUrl }
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const handleAuthError = useCallback(
    (err) => {
      if (err.status === 401 || err.status === 403) {
        logout();
        navigate("/admin/login", { replace: true });
        return true;
      }

      return false;
    },
    [logout, navigate]
  );

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      setItems(await fetchAllProjects(token));
    } catch (err) {
      if (!handleAuthError(err)) setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token, handleAuthError]);

  useEffect(() => {
    load();
  }, [load]);

  const setField = (field) => (event) =>
    setForm((current) => ({ ...current, [field]: event.target.value }));

  const resetForm = () => {
    setEditingId(null);
    setForm(emptyForm);
    setExistingImages([]);
    setNewImages([]);
    setFormError("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const startEdit = (project) => {
    setEditingId(project.id);
    setForm({
      title: project.title,
      category: project.category || "",
      status: project.status,
      description: project.description,
      href: project.href || "",
      technologies: (project.technologies || []).join(", "),
      overview: (project.details?.overview || []).join("\n\n"),
      scope: (project.details?.scope || []).join("\n"),
      fit: (project.details?.fit || []).join("\n"),
    });
    setExistingImages(
      (project.imagePaths || []).map((path, index) => ({
        index,
        url: imageUrl(path),
      }))
    );
    setNewImages([]);
    setFormError("");
    setMessage("");
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleFiles = async (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";

    if (!files.length) return;

    const room = MAX_IMAGES - existingImages.length - newImages.length;

    if (files.length > room) {
      setFormError(`You can add ${room} more screenshot(s) at most.`);
      return;
    }

    try {
      setFormError("");
      const converted = [];

      // one at a time keeps memory use low on phones
      for (const file of files) {
        // eslint-disable-next-line no-await-in-loop
        const dataUrl = await compressImage(file);
        converted.push({ id: `${Date.now()}-${converted.length}`, dataUrl });
      }

      setNewImages((current) => [...current, ...converted]);
    } catch (err) {
      setFormError(err.message);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");
    setMessage("");

    if (!form.title.trim()) {
      setFormError("Please enter a project title.");
      return;
    }

    if (!form.description.trim()) {
      setFormError("Please enter a short description.");
      return;
    }

    const payload = {
      title: form.title,
      category: form.category,
      status: form.status,
      description: form.description,
      href: form.href.trim(),
      technologies: form.technologies.split(","),
      overview: form.overview.split(/\n\s*\n/),
      scope: splitLines(form.scope),
      fit: splitLines(form.fit),
      keepImages: existingImages.map((image) => image.index),
      newImages: newImages.map((image) => image.dataUrl),
    };

    try {
      setSaving(true);

      if (editingId) {
        await updateProject(token, editingId, payload);
        setMessage("Project updated. It is now live on the website.");
      } else {
        await createProject(token, payload);
        setMessage("Project added. It now shows on the website home page.");
      }

      resetForm();
      await load();
      refresh();
    } catch (err) {
      if (!handleAuthError(err)) setFormError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (project) => {
    const sure = window.confirm(
      `Delete "${project.title}"? It will disappear from the website.`
    );

    if (!sure) return;

    try {
      setMessage("");
      await deleteProject(token, project.id);
      if (editingId === project.id) resetForm();
      setMessage("Project deleted.");
      await load();
      refresh();
    } catch (err) {
      if (!handleAuthError(err)) setError(err.message);
    }
  };

  const imageCount = existingImages.length + newImages.length;

  return (
    <div className="apj-page">
      <AdminTopBar current="/admin/projects" />

      <main className="apj-main">
        <h1>Projects</h1>
        <p className="apj-sub">
          Add the projects you build. They appear on the website home page and
          the Portfolio page straight away, newest first.
        </p>

        {message && (
          <p className="apj-message" role="status">
            {message}
          </p>
        )}

        <section className="apj-panel" ref={formRef} aria-labelledby="apj-form-title">
          <h2 id="apj-form-title">
            {editingId ? "Edit project" : "Add a project"}
          </h2>

          <form onSubmit={handleSubmit} noValidate>
            <div className="apj-grid">
              <div className="apj-field apj-wide">
                <label htmlFor="apj-title">Project name</label>
                <input
                  id="apj-title"
                  value={form.title}
                  onChange={setField("title")}
                  maxLength={80}
                />
              </div>

              <div className="apj-field">
                <label htmlFor="apj-category">Type</label>
                <input
                  id="apj-category"
                  value={form.category}
                  onChange={setField("category")}
                  placeholder="E-commerce, Portfolio website…"
                  maxLength={60}
                />
              </div>

              <div className="apj-field">
                <label htmlFor="apj-status">Status</label>
                <select
                  id="apj-status"
                  value={form.status}
                  onChange={setField("status")}
                >
                  {STATUSES.map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div className="apj-field apj-wide">
                <label htmlFor="apj-description">Short description</label>
                <textarea
                  id="apj-description"
                  rows="3"
                  value={form.description}
                  onChange={setField("description")}
                  maxLength={400}
                />
              </div>

              <div className="apj-field apj-wide">
                <label htmlFor="apj-href">
                  Live website link <span>optional</span>
                </label>
                <input
                  id="apj-href"
                  type="url"
                  value={form.href}
                  onChange={setField("href")}
                  placeholder="https://"
                />
              </div>

              <div className="apj-field apj-wide">
                <label htmlFor="apj-tech">
                  Technologies <span>separate with commas</span>
                </label>
                <input
                  id="apj-tech"
                  value={form.technologies}
                  onChange={setField("technologies")}
                  placeholder="React, Node.js, MongoDB"
                />
              </div>

              <div className="apj-field apj-wide">
                <label htmlFor="apj-overview">
                  About this project <span>optional, blank line between paragraphs</span>
                </label>
                <textarea
                  id="apj-overview"
                  rows="5"
                  value={form.overview}
                  onChange={setField("overview")}
                />
              </div>

              <div className="apj-field">
                <label htmlFor="apj-scope">
                  What it covers <span>one per line</span>
                </label>
                <textarea
                  id="apj-scope"
                  rows="4"
                  value={form.scope}
                  onChange={setField("scope")}
                />
              </div>

              <div className="apj-field">
                <label htmlFor="apj-fit">
                  A good fit if <span>one per line</span>
                </label>
                <textarea
                  id="apj-fit"
                  rows="4"
                  value={form.fit}
                  onChange={setField("fit")}
                />
              </div>
            </div>

            <div className="apj-field">
              <label htmlFor="apj-files">
                Screenshots{" "}
                <span>
                  {imageCount} of {MAX_IMAGES}. They are resized automatically.
                </span>
              </label>
              <input
                id="apj-files"
                ref={fileRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                multiple
                onChange={handleFiles}
              />
            </div>

            {imageCount > 0 && (
              <ul className="apj-thumbs">
                {existingImages.map((image) => (
                  <li key={`old-${image.index}`}>
                    <img src={image.url} alt="" />
                    <button
                      type="button"
                      aria-label="Remove this screenshot"
                      onClick={() =>
                        setExistingImages((current) =>
                          current.filter((item) => item.index !== image.index)
                        )
                      }
                    >
                      Remove
                    </button>
                  </li>
                ))}
                {newImages.map((image) => (
                  <li key={image.id}>
                    <img src={image.dataUrl} alt="" />
                    <button
                      type="button"
                      aria-label="Remove this screenshot"
                      onClick={() =>
                        setNewImages((current) =>
                          current.filter((item) => item.id !== image.id)
                        )
                      }
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {formError && (
              <p className="apj-error" role="alert">
                {formError}
              </p>
            )}

            <div className="apj-actions">
              <button type="submit" className="apj-btn apj-btn--solid" disabled={saving}>
                {saving
                  ? "Saving\u2026"
                  : editingId
                    ? "Save changes"
                    : "Add project"}
              </button>

              {editingId && (
                <button type="button" className="apj-btn" onClick={resetForm}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section aria-labelledby="apj-list-title">
          <h2 id="apj-list-title" className="apj-list-title">
            Your projects
          </h2>

          {loading && <p className="apj-note">Loading projects… (the server may take up to a minute to wake up)</p>}
          {error && (
            <p className="apj-error" role="alert">
              {error}
            </p>
          )}

          {!loading && !error && items.length === 0 && (
            <p className="apj-note">
              You have not added any projects yet. Use the form above to add
              your first one.
            </p>
          )}

          <ul className="apj-list">
            {items.map((project) => (
              <li className="apj-item" key={project.id}>
                <div className="apj-item__img">
                  {project.imagePaths?.[0] ? (
                    <img src={imageUrl(project.imagePaths[0])} alt="" />
                  ) : (
                    <span>No image</span>
                  )}
                </div>

                <div className="apj-item__text">
                  <strong>{project.title}</strong>
                  <small>
                    {project.status} · {project.category}
                    {project.href ? ` · ${project.href.replace(/^https?:\/\//, "")}` : ""}
                  </small>
                </div>

                <div className="apj-item__actions">
                  <button type="button" className="apj-btn" onClick={() => startEdit(project)}>
                    Edit
                  </button>
                  <button type="button" className="apj-btn apj-btn--danger" onClick={() => handleDelete(project)}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <p className="apj-note">
            Thulirkum Ver Book Store and Akshay Dance Portfolio are built into
            the website, so they always show and are not listed here.
          </p>
        </section>
      </main>
    </div>
  );
}

export default AdminProjects;
