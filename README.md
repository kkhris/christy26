# Christal Lyu Portfolio

Personal portfolio website for Christal Lyu.

## Pages

- `index.html` — homepage
- `about.html` — about page
- `accenture.html` — Wildlight / Accenture case study
- `blue-guardian.html` — Blue Guardian case study
- `nus-iss.html` — NUS-ISS case study

## Project Structure

```text
.
├── index.html
├── about.html
├── accenture.html
├── blue-guardian.html
├── nus-iss.html
├── styles.css
├── script.js
└── assets/
```

## Local Preview

Run a simple static server from this folder:

```sh
python3 -m http.server 4321
```

Then open:

```text
http://localhost:4321
```

## Deploying to GitHub Pages

1. Upload all project files to your GitHub repository.
2. Keep the folder structure intact, especially the `assets/` folder.
3. In GitHub, go to `Settings` → `Pages`.
4. Under `Source`, choose `Deploy from a branch`.
5. Select the `main` branch and `/root`.

Your portfolio will then be published through GitHub Pages.

## Notes

- This is a static site with no build step.
- All styling is in `styles.css`.
- Basic page behavior and navigation logic are in `script.js`.
