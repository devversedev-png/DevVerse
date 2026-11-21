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

## Real projects
Added to `src/data/site.js` with cropped screenshots in `src/assets/projects/`:
- Thulirkum Ver Book Store: https://thulirkum-ver.vercel.app/home
- Akshay Dance Portfolio: https://akshay-aks-portfolio.vercel.app
The "technologies" tags for these two are generic (Storefront, Admin dashboard, Hosted on Vercel).
Replace them in `data/site.js` with the real tech stack if you want.

## Digital card
- Open `/card` (for example https://dev-verse-dev.vercel.app/card). It is made for phones.
- Buttons: Save contact (downloads a .vcf), Share, Call, WhatsApp, Email, Website, Location.
- Also shows services, recent work, social links and a QR code that opens the card.
- The QR code is generated in the browser from the site's own address, so it stays correct on any domain.
- WhatsApp uses the same phone number (`whatsappHref` in `src/data/site.js`). Remove it if that number is not on WhatsApp.
- The email pop-up does not appear on `/card`.

## Admin projects (new)
- `/admin/projects` lets the admin add, edit and delete projects with screenshots.
  They appear on the home page and the Portfolio page right away, newest first.
- Only the two built-in projects (Thulirkum Ver, Akshay) are in the code; the placeholder projects were removed.
- Backend: `GET /api/projects` (public), `GET /api/projects/manage/all`, `POST`, `PUT /:id`, `DELETE /:id` (admin only).
  Screenshots are resized in the browser and stored in MongoDB.
- Redeploy the backend (Render) after copying this version. The new routes do not exist on the old deployment.

## Other updates
- Digital card: the QR code, "Copy link" and "Share" open the home page. Change the address in `site.url` (`src/data/site.js`).
- Leads: click an email to open your mail app with a new message to that person.
- Admin login (`/admin/login`) uses the same admin email and password as before (ADMIN_EMAIL and ADMIN_PASSWORD_HASH in the backend .env).

## Shareable card image with link
- Link preview: `index.html` has Open Graph tags that use `public/devverse-og.jpg` (1200x630, 68 KB).
  When the site link is shared on WhatsApp, Instagram, LinkedIn, Facebook or Telegram, this picture
  shows as a big card. Tapping it opens the site. It only works on the deployed https site.
- `/card` page: "Share image" sends `public/devverse-card.jpg` with the site link as the caption;
  "Download" saves it. Tapping the picture on the page opens the site.
- If you change the domain, update the three https://dev-verse-dev.vercel.app addresses in `index.html`
  and `site.url` in `src/data/site.js`.
- WhatsApp and Facebook cache previews. To refresh after a change, share the link with ?v=2 at the end,
  or use the Facebook Sharing Debugger (developers.facebook.com/tools/debug).
