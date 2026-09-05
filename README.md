# Devendra & Priti — Wedding Invitation Website

A single-page wedding invitation site. Pure HTML/CSS/JS — no build step, no dependencies to install.

## Files
- `index.html` — the page
- `style.css` — all styling
- `script.js` — intro animation, marigold garland generator, countdown timer, "Add to Calendar"
- `assets/` — your photos (already compressed for fast loading)

## View it locally
Just double-click `index.html`, or run a tiny local server:
```
python3 -m http.server 8000
```
then open http://localhost:8000

## Publish for free with GitHub Pages
1. Create a new GitHub repository (e.g. `devendra-priti-wedding`).
2. Upload all the files in this folder, keeping the `assets/` folder structure intact.
3. Go to **Settings → Pages** in the repo.
4. Under "Build and deployment", set **Source: Deploy from a branch**, branch: `main`, folder: `/ (root)`.
5. Save — GitHub will give you a live link like:
   `https://<your-username>.github.io/devendra-priti-wedding/`
6. Share that link with your guests!

## Customizing later
- Countdown target date is set in `script.js` near the top (`TARGET`).
- Colors/fonts are defined as CSS variables at the top of `style.css` (`:root { ... }`).
- Swap any photo by replacing the file in `assets/` with the same filename, or update the `src` in `index.html`.
