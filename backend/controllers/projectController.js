const Project = require("../models/Project");
const {
  MAX_IMAGES,
  slugify,
  parseImageDataUrl,
  validateProjectInput,
} = require("../utils/projectInput");

/* Image URLs are relative to the API base (e.g. https://host/api). */
const toClient = (doc) => {
  const version = doc.updatedAt ? new Date(doc.updatedAt).getTime() : 0;

  return {
    id: String(doc._id),
    slug: doc.slug,
    title: doc.title,
    category: doc.category,
    description: doc.description,
    status: doc.status,
    href: doc.href || "",
    technologies: doc.technologies || [],
    details: {
      overview: doc.details?.overview || [],
      scope: doc.details?.scope || [],
      fit: doc.details?.fit || [],
    },
    published: doc.published,
    createdAt: doc.createdAt,
    imagePaths: (doc.images || []).map(
      (_, index) => `/projects/${doc._id}/image/${index}?v=${version}`
    ),
  };
};

// Lists use a projection that leaves the heavy image bytes out.
const LIST_FIELDS = "-images.data";

const uniqueSlug = async (title, ignoreId) => {
  const base = slugify(title);
  let slug = base;
  let counter = 2;

  // eslint-disable-next-line no-await-in-loop
  while (await Project.exists({ slug, _id: { $ne: ignoreId } })) {
    slug = `${base}-${counter}`;
    counter += 1;
  }

  return slug;
};

const parseNewImages = (list) => {
  const items = Array.isArray(list) ? list : [];
  return items.map(parseImageDataUrl);
};

/* ==============================
   PUBLIC
============================== */

const listPublic = async (req, res) => {
  try {
    const docs = await Project.find({ published: true })
      .select(LIST_FIELDS)
      .sort({ createdAt: -1 });

    res.set("Cache-Control", "public, max-age=60");
    return res.status(200).json({ success: true, projects: docs.map(toClient) });
  } catch (error) {
    console.error("List projects error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Could not load projects." });
  }
};

const getImage = async (req, res) => {
  try {
    const index = Number.parseInt(req.params.index, 10);
    const doc = await Project.findOne({
      _id: req.params.id,
      published: true,
    }).select("images");

    if (!doc || Number.isNaN(index) || !doc.images[index]) {
      return res.status(404).end();
    }

    const image = doc.images[index];

    res.set("Content-Type", image.contentType);
    res.set("Cache-Control", "public, max-age=31536000, immutable");
    return res.send(image.data);
  } catch (error) {
    return res.status(404).end();
  }
};

/* ==============================
   ADMIN
============================== */

const listAll = async (req, res) => {
  try {
    const docs = await Project.find()
      .select(LIST_FIELDS)
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, projects: docs.map(toClient) });
  } catch (error) {
    console.error("Admin list projects error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Could not load projects." });
  }
};

const create = async (req, res) => {
  try {
    const { errors, value } = validateProjectInput(req.body || {});

    if (errors.length) {
      return res.status(400).json({ success: false, message: errors[0] });
    }

    const images = parseNewImages(req.body.newImages);

    if (images.length > MAX_IMAGES) {
      return res.status(400).json({
        success: false,
        message: `You can add up to ${MAX_IMAGES} screenshots.`,
      });
    }

    const doc = await Project.create({
      ...value,
      slug: await uniqueSlug(value.title),
      images,
    });

    const saved = await Project.findById(doc._id).select(LIST_FIELDS);
    return res.status(201).json({ success: true, project: toClient(saved) });
  } catch (error) {
    if (/image|WebP/i.test(error.message)) {
      return res.status(400).json({ success: false, message: error.message });
    }

    console.error("Create project error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Could not save the project." });
  }
};

const update = async (req, res) => {
  try {
    const doc = await Project.findById(req.params.id);

    if (!doc) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found." });
    }

    const { errors, value } = validateProjectInput(req.body || {});

    if (errors.length) {
      return res.status(400).json({ success: false, message: errors[0] });
    }

    const keep = Array.isArray(req.body.keepImages) ? req.body.keepImages : [];
    const kept = keep
      .map((i) => Number.parseInt(i, 10))
      .filter((i) => Number.isInteger(i) && doc.images[i])
      .map((i) => doc.images[i]);

    const added = parseNewImages(req.body.newImages);

    if (kept.length + added.length > MAX_IMAGES) {
      return res.status(400).json({
        success: false,
        message: `You can have up to ${MAX_IMAGES} screenshots.`,
      });
    }

    if (value.title !== doc.title) {
      doc.slug = await uniqueSlug(value.title, doc._id);
    }

    doc.set({
      ...value,
      images: [...kept, ...added],
      published:
        typeof req.body.published === "boolean"
          ? req.body.published
          : doc.published,
    });

    await doc.save();

    const saved = await Project.findById(doc._id).select(LIST_FIELDS);
    return res.status(200).json({ success: true, project: toClient(saved) });
  } catch (error) {
    if (/image|WebP/i.test(error.message)) {
      return res.status(400).json({ success: false, message: error.message });
    }

    console.error("Update project error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Could not update the project." });
  }
};

const remove = async (req, res) => {
  try {
    const doc = await Project.findByIdAndDelete(req.params.id);

    if (!doc) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found." });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Delete project error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Could not delete the project." });
  }
};

module.exports = { listPublic, getImage, listAll, create, update, remove };
