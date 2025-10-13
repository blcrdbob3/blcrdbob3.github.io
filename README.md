# Personal Website Portfolio

![React](https://img.shields.io/badge/React-18.2.0-blue)  
![Vite](https://img.shields.io/badge/Vite-4.5.0-yellowgreen)

This is my **personal portfolio website**, built with **React** and **Vite**, deployed on **GitHub Pages**.  
The site uses a multi-page application (MPA) structure, where each HTML page mounts the React component(s) needed for that page. This ensures clean URLs and full compatibility with GitHub Pages.

---

## Pages

| Page | URL |
|------|-----|
| Home | `/index.html` |
| About | `/about.html` |
| Projects | `/projects.html` |
| Mechatronics Project | `/projects/mechatronics.html` |
| Intro to AI Project | `/projects/intro-to-ai.html` |

---

## Technologies

- **React** — Component-based UI  
- **Vite** — Fast development server and build tool  
- **JavaScript (ES6+)** — Logic and interactivity  
- **HTML / CSS** — Page structure and styling  
- **GitHub Pages** — Deployment  

---

## Local Development

1. Clone the repository:

```bash
git clone https://github.com/blcrdbob3/blcrdbob3.github.io.git
cd blcrdbob3.github.io
````

2. Install dependencies:

```bash
npm install
```

3. Start the Vite development server:

```bash
npm run dev
```

* Visit `http://localhost:####` to view your site locally.

---

## Build and Preview

Build the production version:

```bash
npm run build
```

---

## Deployment to GitHub Pages

The project uses the `gh-pages` package for deployment:

```json
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}
```

Deploy with:

```bash
npm run deploy
```

After deployment, all pages are accessible at their respective URLs.

---