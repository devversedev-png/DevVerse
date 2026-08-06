# DevVerse chat authentication fix

## Fixed
- Admin accounts can no longer open the customer `/chat` page. They are redirected to `/admin/chats`.
- Customer chat creation now uses the authenticated JWT user ID instead of trusting `userId`, name, and email from the request body.
- The backend blocks admin tokens from the customer conversation endpoint.
- Customers can only read their own conversation messages; admins can read all conversations.
- Expired or invalid tokens are cleared automatically and the user is redirected to login.
- Restored and exported `adminOnly` correctly.
- Removed JWT/token debug logging from production middleware.
- Fixed the conditional React hook-order issue in `Login.jsx`.
- Removed committed `.env`, `.git`, and secrets from this fixed archive.

## After replacing the project
1. Run `npm install` in the project root.
2. Run `npm install` inside `backend`.
3. Create root `.env` from `.env.example`.
4. Create `backend/.env` from `backend/.env.example`.
5. Update Render/Vercel environment variables.
6. Redeploy backend and frontend.
7. Clear the old browser session and log in again:
   `localStorage.removeItem("devverse_user"); localStorage.removeItem("devverse_token"); location.href="/login";`

## Security
The original archive contained live MongoDB, JWT, Gmail app-password, and Brevo API credentials. Rotate all of them before redeploying.
