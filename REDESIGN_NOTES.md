# DevVerse redesign notes

## Setup
    npm install                      (project root, frontend)
    cd backend && npm install        (backend, includes nodemon)
    npm run build                    (root) / npm run dev

## What changed
- Whole site (home, inner pages, admin) uses a light cream / apricot / gold palette.
- New light logo: `src/assets/devverse-logo.png`, `devverse-mark.png`, `public/devverse-logo.png`.
- No user login. The public website and /chat are open.
- Admin has its own URLs (not linked from the public site):
  - `/admin/login`  sign in (uses ADMIN_EMAIL + ADMIN_PASSWORD_HASH from backend .env)
  - `/admin/leads`  lead list: email, visit count, first/last visit, last page
  - `/admin/chats`  existing chat inbox
- Lead counting: visitors are asked for an email once per session (they can pick
  "Not now"). Each separate visit (30+ minutes apart) adds 1 to that email's count.
  Backend: `POST /api/leads/visit` (public), `GET /api/leads` (admin only).
- Chat without login: `POST /api/auth/visitor-session`. A random key stored in the
  visitor's browser keeps a chat tied to that browser.
- Removed: customer OTP login routes and the /login page.

## Homepage content
Projects/services/process text lives in `src/data/site.js`. Add real screenshots with
`images: [...]` on a project (see comments in that file).

## Deploying the backend (important)
The Render service must run this version of `backend/`. If it is old, these return 404:
`POST /api/leads/visit` and `GET /api/leads`. After deploying, opening
`<your-backend-url>/api/leads` in a browser should show "Authentication required" (401), not 404.

## Detail pages
- `/portfolio/:slug` explains each project (text lives in `src/data/site.js`, `details`).
- Services "Explore" opens `/services/:slug`; "Read the full process" opens `/process`; "More about us" opens `/about`.
