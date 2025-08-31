# Diya Dilusso – The Cake Studio

A simple static landing page for the Diya Dilusso cake studio. The site lives in the `bakery-landing-page-main/` directory and uses HTML, SCSS, and a bit of JavaScript.

## Project structure

```
.
├── README.md
└── bakery-landing-page-main/
    ├── README.md
    ├── app/
    │   ├── js/
    │   └── scss/
    ├── dist/
    ├── vendor/
    ├── index.html
    ├── menu.html
    ├── about.html
    └── contact.html
```

## Viewing the site

1. Open `bakery-landing-page-main/index.html` directly in your browser, or
2. Serve the directory with a static server:

   ```bash
   npx serve bakery-landing-page-main
   ```

   Then visit the printed URL in your browser.

## Editing styles

The `app/scss` source files are compiled to `dist/style.css`. To rebuild the CSS you will need [Node.js](https://nodejs.org/) and a Sass compiler:

```bash
npm install -g sass
cd bakery-landing-page-main
sass --no-source-map app/scss:dist --watch
```

This watches the SCSS files and outputs updated CSS into `dist/` without generating source maps.

