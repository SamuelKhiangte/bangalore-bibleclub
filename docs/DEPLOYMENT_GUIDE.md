# 🚀 Bangalore BibleClub — PWA Deployment & Sharing Guide

Bangalore BibleClub is configured as a standalone **Progressive Web App (PWA)**. Users can install it directly onto their phone's home screen with zero app store delays and zero installations required.

---

## ⚡ Option 1: Free Instant Hosting on Vercel (Recommended — 2 minutes)

Vercel provides free HTTPS hosting, custom domains, and automatic deployments.

### Step 1: Push Code to GitHub
```bash
git push origin feature/bible-bereal-app
```
*(Or merge into your repository's `main` branch)*

### Step 2: Import into Vercel
1. Go to [vercel.com](https://vercel.com/) and log in with your GitHub account.
2. Click **"Add New..."** $\to$ **"Project"**.
3. Select your `vibecode_app` (or repository name) from the list.
4. Framework Preset: **Vite** (Vercel detects this automatically).
5. Build Command: `npm run build`
6. Output Directory: `dist`
7. Click **"Deploy"**!

### Step 3: Get Your Live Link
Within 30 seconds, Vercel will give you a live production link (e.g. `https://bangalore-bibleclub.vercel.app`).
You can immediately text or WhatsApp this link to your friends and church reading group!

---

## 🌐 Option 2: Free Hosting on GitHub Pages

The repository already includes an automated GitHub Actions workflow (`.github/workflows/deploy-pages.yml`).

### Step 1: Enable GitHub Pages in Repository Settings
1. Open your repository on [github.com](https://github.com/).
2. Click **Settings** $\to$ **Pages** (under Code and automation).
3. Under **Build and deployment** $\to$ **Source**, choose **"GitHub Actions"**.

### Step 2: Push Your Code
```bash
git push origin feature/bible-bereal-app
```
GitHub Actions will automatically run the build, package the service worker, and deploy your site to:
`https://<your-username>.github.io/<repo-name>/`

---

## 📲 How Friends Install & Access the App

Send the link to your friends. They don't need to visit Google Play or the Apple App Store:

### On iPhone & iPad (Safari)
1. Open the URL in Safari.
2. Tap the **Share** button (box with an arrow pointing up at the bottom).
3. Scroll down and tap **"Add to Home Screen"**.
4. Tap **"Add"**.
5. The **Bangalore BibleClub** app icon appears on their iPhone home screen and opens in clean full-screen mode with no URL bars!

### On Android (Chrome / Brave / Samsung Internet)
1. Open the URL in Chrome.
2. A banner or prompt **"Add Bangalore BibleClub to Home Screen"** will appear automatically.
3. Or tap the **Install** button inside the app header / profile.
4. Tap **Install** — it will be placed in the app drawer and home screen just like a native app.

---

## 🛠️ PWA Features Included
- **`manifest.webmanifest`**: Configured with name, theme color (`#4A7C59`), app icons (192px, 512px, maskable).
- **Service Worker (`sw.js`)**: Caches static assets for lightning-fast loads and offline reading.
- **In-App Install Prompt**: Built-in modal guiding users on both iOS and Android.
- **Dual-Camera Capture**: Direct camera access on mobile devices.
- **Push & In-App Alerts**: Web Audio chimes and simulated group alerts when friends finish readings.
