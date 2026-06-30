# WTF — Personal Blog

A personal blog built with a CRT/HUD aesthetic inspired by `portal.thenifty.com` and the ASCII-face animation technique from Yannick Grégoire's portfolio. Frontend is plain HTML/CSS/JS deployed free on GitHub Pages. Backend is a fully custom Node.js + Express + Nodemailer service deployed free on Render. Contact-form submissions land directly in your Gmail inbox.

---

## Live URLs (after deploy)

- **Site:** `https://sashank2006.github.io/WTF/`
- **API:** `https://wtf-api.onrender.com` (your Render URL — see step 5)

---

## Tech stack

| Layer | Tech | Hosting |
|---|---|---|
| Frontend | Static HTML + CSS + vanilla JS | **GitHub Pages** (free) |
| Backend | Node.js + Express + Nodemailer | **Render** (free tier) |
| Email | Gmail SMTP via App Password | Free |
| Auto-deploy | GitHub Actions | Free |

No frameworks, no build step on the frontend, no paid services.

---

## Project structure

```
WTF/
├── client/                          # frontend (deployed to GitHub Pages)
│   ├── index.html                   # home: ASCII face hero + intro card
│   ├── posts.html                   # 4 topic folders with cover-art slots
│   ├── contact.html                 # contact form (POSTs to Render API)
│   ├── 404.html                     # custom 404 page
│   └── assets/
│       ├── css/
│       │   ├── tokens.css           # CSS custom properties (design tokens)
│       │   ├── base.css             # reset + body + typography
│       │   ├── components.css       # hud-window, ticker, pill, scroll-rail
│       │   └── pages.css            # per-page layout overrides
│       ├── js/
│       │   ├── config.js            # API_BASE URL (edit after Render deploy)
│       │   ├── ascii-hero.js        # face rasterizer + glitch animation
│       │   ├── ticker.js            # top status bar marquee
│       │   ├── scroll-rail.js       # bottom nav keyboard + scroll behavior
│       │   └── contact.js           # form fetch wrapper + validation
│       ├── img/
│       │   ├── fallback-hero.svg    # urban photo fallback (auto-used)
│       │   ├── covers/              # 4 manga-style cover arts (TODO: add)
│       │   └── glyphs/              # SVG decorative chrome (favicon, etc.)
│       └── fonts/                   # (empty — using Google Fonts CDN)
│
├── server/                          # backend (deployed to Render)
│   ├── src/
│   │   ├── index.js                 # entry: loads env, mounts routes, CORS
│   │   ├── config/mailer.js         # Nodemailer Gmail transport factory
│   │   ├── routes/contact.js        # POST /api/contact → sends email
│   │   ├── routes/health.js         # GET  /api/health  → { ok: true }
│   │   ├── middleware/cors.js       # CORS whitelist
│   │   ├── middleware/rateLimit.js  # 5 submissions / IP / hour
│   │   ├── middleware/validate.js   # contact form input validation
│   │   └── utils/htmlEscape.js      # XSS guard
│   ├── .env.example                 # copy to .env and fill in
│   ├── .gitignore
│   └── package.json
│
├── .github/workflows/deploy-pages.yml   # auto-deploys client/ to Pages
├── .gitignore
├── LICENSE
└── README.md                        # you are here
```

---

## 1. Run locally

You need **Node.js 18+** installed.

### Backend (in one terminal)

```bash
cd server/
cp .env.example .env          # then edit .env with your real values
npm install
npm run dev                   # starts on http://localhost:3000
```

### Frontend (in another terminal)

The frontend is plain static files — no install needed. Easiest way to serve it:

```bash
cd client/
npx serve .                   # or: python -m http.server 5000
```

Open `http://localhost:5000` in your browser.

> **Heads-up:** the contact form on `localhost:5000` posts to `http://localhost:3000/api/contact` (configured in `client/assets/js/config.js`). Make sure both are running.

---

## 2. Set up Gmail App Password

The backend uses Gmail's SMTP to send contact-form messages to you. Gmail no longer allows "less secure apps," so you must generate an **App Password**.

**Prerequisite:** your Google account must have **2-Step Verification** turned on.

1. Go to https://myaccount.google.com/security
2. Confirm **2-Step Verification** is ON. If not, set it up first.
3. Go back to Security → **App passwords** (https://myaccount.google.com/apppasswords)
4. App name: `wtf-blog` (or anything you like) → **Create**
5. Google shows a 16-character password. Copy it.
6. Open `server/.env` and fill in:
   ```
   EMAIL_USER=youraddress@gmail.com
   EMAIL_PASS=abcd efgh ijkl mnop
   TO_EMAIL=where-you-want-messages@gmail.com
   ```
   `TO_EMAIL` can be the same as `EMAIL_USER`, or a different inbox.

> If you don't see "App passwords," your account may not have 2-Step Verification enabled, or your Google Workspace admin has disabled app passwords.

---

## 3. Customize the site

| What | Where |
|---|---|
| Site name "WTF" | All four HTML files — search `WTF` |
| Author name & bio | `client/index.html` (`.home-hero__bio`) and `client/contact.html` |
| Page titles & descriptions | Each page's `<title>` and `<meta name="description">` |
| Color palette | `client/assets/css/tokens.css` (`--bg`, `--ink`, `--accent`, etc.) |
| Ticker items | `client/assets/*.html` — look for `.ticker__track` |
| Cover art (4 posts) | Drop JPGs into `client/assets/img/covers/` named `book-reviews.jpg`, `random-tech.jpg`, `personal-thoughts.jpg`, `life-wisdom.jpg` |
| Hero face photo | Drop a JPG into `client/assets/img/face.jpg` — the ASCII engine picks it up automatically |
| Section labels & copy | Each HTML file's `<main>` section |

---

## 4. Push to GitHub

If this repo isn't yet on GitHub:

1. Go to https://github.com/new
2. Repository name: **WTF** (capital letters are fine)
3. **Public**, **do not** initialize with README/license/.gitignore (we already have those)
4. Click **Create repository**
5. From your local `WTF/` folder:
   ```bash
   cd WTF/
   git init
   git add .
   git commit -m "Initial WTF blog build"
   git branch -M main
   git remote add origin https://github.com/Sashank2006/WTF.git
   git push -u origin main
   ```

For future changes:
```bash
git add .
git commit -m "Describe what changed"
git push
```

---

## 5. Deploy the frontend to GitHub Pages

1. Go to https://github.com/Sashank2006/WTF/settings/pages
2. **Source:** select **GitHub Actions**
3. Save
4. The `.github/workflows/deploy-pages.yml` workflow I included auto-deploys `client/` on every push to `main`
5. After ~1 minute, your site is live at:

   **https://sashank2006.github.io/WTF/**

> First push to a new repo may take a few minutes for GitHub Pages to provision the environment. Watch the **Actions** tab.

---

## 6. Deploy the backend to Render

1. Sign up at https://render.com (free — use "GitHub" sign-in)
2. Dashboard → **New** → **Web Service**
3. Connect your GitHub account → select the **`WTF`** repo
4. Configure:
   - **Name:** `wtf-api` (or anything)
   - **Region:** Oregon (or closest to you)
   - **Branch:** `main`
   - **Root Directory:** `server`
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free
5. Click **Advanced** → add these **Environment Variables**:
   ```
   EMAIL_USER   = youraddress@gmail.com
   EMAIL_PASS   = <your 16-char Gmail App Password>
   TO_EMAIL     = where-you-want-messages@gmail.com
   ALLOWED_ORIGIN = https://sashank2006.github.io
   ```
   (`PORT` is set automatically by Render — don't add it.)
6. Click **Create Web Service**
7. Wait ~3 minutes for the first deploy
8. Once live, Render shows you a URL like `https://wtf-api-xxxx.onrender.com`
9. Test: `https://wtf-api-xxxx.onrender.com/api/health` should return `{"ok":true,...}`

---

## 7. Wire the frontend to the backend

Now that your backend is live, update the frontend config:

1. Open `client/assets/js/config.js`
2. Replace the placeholder URL:
   ```js
   window.WTF_CONFIG = {
     API_BASE: 'https://wtf-api-xxxx.onrender.com',  // ← your Render URL
   };
   ```
3. Also update `server/.env` on Render (via the Render dashboard → Environment → `ALLOWED_ORIGIN`) so the CORS allowlist matches exactly. The default in `server/.env.example` already includes `https://sashank2006.github.io`.
4. Commit and push:
   ```bash
   git add client/assets/js/config.js
   git commit -m "Wire API_BASE to Render URL"
   git push
   ```
5. GitHub Pages redeploys in ~1 minute. Test the contact form.

---

## 8. Verify everything

1. Visit `https://sashank2006.github.io/WTF/` — home page loads with HUD aesthetic, ticker animates.
2. Click `002 // WRITINGS` — posts page loads with 4 folder cards.
3. Click `003 // CONTACT` — contact page loads.
4. Fill the contact form (name, email, message) and submit.
   - **Note:** on Render's free tier, the service sleeps after 15 min of inactivity. The first form submission takes ~30 seconds (cold start). After that, it's instant.
5. Check the inbox you set in `TO_EMAIL` — the message arrives within seconds.

---

## Troubleshooting

### "Message not sent" / network error in the browser

- Open browser DevTools → Network tab → click the failed request.
- If it's a CORS error: the origin on the request doesn't match `ALLOWED_ORIGIN`. Update the env var on Render.
- If it's a 5xx: check Render logs (Dashboard → Logs).
- If you see `Server misconfigured`: `EMAIL_USER` or `TO_EMAIL` is missing from Render env.

### Gmail rejects the login ("Invalid login")

- You're using your normal Gmail password instead of an App Password. Generate one at https://myaccount.google.com/apppasswords.
- Or: 2-Step Verification is not enabled — enable it first.

### Render: "No open ports detected" or deploy fails

- Make sure **Root Directory** is set to `server`, not the repo root.
- Build command should be `npm install`, start command `npm start`.

### GitHub Pages deploys but shows 404 on all pages

- Repo Settings → Pages → Source must be **GitHub Actions** (not "Deploy from a branch").
- Check the Actions tab for workflow errors.

### ASCII hero doesn't render

- You haven't dropped a photo at `client/assets/img/face.jpg` yet. The fallback SVG (`fallback-hero.svg`) should render fine — but the ASCII rasterizer only works with bitmap images (JPG/PNG). If you want the ASCII hero to start, drop a JPG face photo into `client/assets/img/` and refresh.

### Local contact form fails with "Failed to fetch"

- CORS. Make sure `ALLOWED_ORIGIN` in `server/.env` includes `http://localhost:5000` and `http://127.0.0.1:5000`. Restart the server after editing `.env`.

---

## Customization ideas (Phase 2 — not built)

- Generate the 4 cover-art JPGs in `client/assets/img/covers/` using your favorite AI image tool. Reference 2 (Cowboy Bebop manga/zine) is the inspiration: cream paper, black ink, screentone, rotated panels, oversized display type.
- Add real posts under `client/posts/<folder>/<slug>/index.html`.
- Wire up an analytics tool like Plausible (free tier for personal sites).
- Add an RSS feed at `/feed.xml`.

---

## License

MIT — see `LICENSE`.