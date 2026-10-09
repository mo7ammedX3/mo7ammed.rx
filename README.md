# Mohammed H. F. Alafifi — Portfolio / المعرض الشخصي

Static personal portfolio website (HTML, CSS, JavaScript). No build step and no dependencies.

- Languages: English and Arabic (RTL), switch with the language button.
- Themes: dark and light, switch with the sun/moon button. Both choices are remembered.
- On the first visit the site follows the browser language and the device theme.

## Publish on GitHub Pages
1. Create a new public repository on GitHub, for example `portfolio` (or `USERNAME.github.io` to get the address `https://USERNAME.github.io`).
2. Upload **all** files and the `assets` folder to the repository root (drag and drop in the GitHub web page works). Keep `.nojekyll` too.
3. Open **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**, select branch `main` and folder `/ (root)`, then **Save**.
4. After about one minute the site is live at the address shown on that page.

## Structure
- `index.html` — page content (English and Arabic)
- `style.css` — design, dark/light themes, RTL support
- `script.js` — language and theme switch, menu, certificate filter and viewer
- `assets/photo.jpg` — portrait
- `assets/certs/` — certificate images (full size and thumbnails)
