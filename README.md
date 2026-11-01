# sveit.org

The Sveit site. Static HTML, CSS and JavaScript, no build step, served by GitHub Pages from the `main` branch through the workflow in `.github/workflows/pages.yml`.

- `index.html`: the page.
- `css/site.css`: tokens, type and layout from the Sveit design system v0.1.
- `js/hero.js`: the workshop on the hero, a simulated lane. Project `nord`, lane `api`, owner `k.vale` and the ticket numbers are invented.
- `fonts/`: Fragment Mono and Familjen Grotesk, Latin subsets, under the SIL Open Font License 1.1 (`OFL-FragmentMono.txt`, `OFL-FamiljenGrotesk.txt`).
- `favicon.svg`: the Sowilō rune on bottle green.

Local preview: open `index.html` in a browser, or run any static file server in this directory.

Custom domain: add a `CNAME` file holding `sveit.org` and point the domain's DNS at GitHub Pages.
