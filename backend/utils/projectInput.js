/*
 * Pure helpers for validating project input from the admin form.
 * No database access here, so they are easy to test.
 */

const STATUSES = ["Live", "In progress", "Completed", "Coming soon"];
const ALLOWED_IMAGE_TYPES = ["image/webp", "image/jpeg", "image/png"];

const MAX_IMAGES = 8;
const MAX_IMAGE_BYTES = 2.5 * 1024 * 1024;

function slugify(text) {
  const slug = String(text || "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

  return slug || "project";
}

function cleanText(value, max) {
  return String(value ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, max);
}

function cleanList(value, maxItems, maxLength) {
  const items = Array.isArray(value) ? value : [];

  return items
    .map((item) => cleanText(item, maxLength))
    .filter(Boolean)
    .slice(0, maxItems);
}

function cleanParagraphs(value, maxItems, maxLength) {
  const items = Array.isArray(value) ? value : [];

  return items
    .map((item) => String(item ?? "").trim().slice(0, maxLength))
    .filter(Boolean)
    .slice(0, maxItems);
}

function isHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

/* Turns "data:image/webp;base64,...." into { contentType, data }. */
function parseImageDataUrl(dataUrl) {
  const match = /^data:([a-z]+\/[a-z0-9.+-]+);base64,([A-Za-z0-9+/=]+)$/.exec(
    String(dataUrl || "")
  );

  if (!match) {
    throw new Error("One of the images is not a valid image file.");
  }

  const contentType = match[1];

  if (!ALLOWED_IMAGE_TYPES.includes(contentType)) {
    throw new Error("Images must be WebP, JPEG or PNG.");
  }

  const data = Buffer.from(match[2], "base64");

  if (data.length === 0 || data.length > MAX_IMAGE_BYTES) {
    throw new Error("Each image must be under 2.5 MB after compression.");
  }

  return { contentType, data };
}

/*
 * Returns { errors: string[], value } where value holds the cleaned fields.
 * Images are handled separately by the controller.
 */
function validateProjectInput(body) {
  const errors = [];

  const title = cleanText(body.title, 80);
  const category = cleanText(body.category, 60) || "Website";
  const description = cleanText(body.description, 400);
  const href = cleanText(body.href, 300);
  const status = STATUSES.includes(body.status) ? body.status : "Live";

  if (!title) errors.push("Please enter a project title.");
  if (!description) errors.push("Please enter a short description.");

  if (href && !isHttpUrl(href)) {
    errors.push("The live link must start with http:// or https://");
  }

  return {
    errors,
    value: {
      title,
      category,
      description,
      href,
      status,
      technologies: cleanList(body.technologies, 10, 30),
      details: {
        overview: cleanParagraphs(body.overview, 6, 900),
        scope: cleanList(body.scope, 8, 160),
        fit: cleanList(body.fit, 6, 160),
      },
    },
  };
}

module.exports = {
  STATUSES,
  MAX_IMAGES,
  slugify,
  parseImageDataUrl,
  validateProjectInput,
};
