# KUAD 2025 — SOMA archive

React exhibition archive at https://kuadarchive.com/2025/.

## Local work

```sh
npm ci
npm start
```

Production preview:

```sh
npm run build
python3 scripts/verify-build.py
python3 scripts/preview.py
```

Open http://localhost:4175/2025/.

## Structure

- `src/pages/Home.jsx`: home video selector.
- `src/pages/project/`: main theme, teams, portfolios, lookbook, runway.
- `src/pages/behind/`: show, brochure, and making galleries.
- `src/pages/info/`: exhibition information and previous archives.
- `src/components/layout/`: navigation and route scroll handling.
- `src/components/media/`: shared image gallery, video gallery, and lightbox.
- `src/data/`: exhibition content, navigation, gallery sequences, and explicit image imports.
- `src/assets/`: active member images grouped by team/type, plus fonts.
- `src/styles/`: global typography and Tailwind styles.
- `public/`: directly served media grouped by content type; existing public URLs are retained.
- `src/legacy/`: retained search, store, cart, checkout, and admin code and assets. These are disconnected from the archive router and excluded from production bundles and Tailwind scanning.
- `scripts/`: content preservation, build validation, deployment guards, and local preview.
- `infrastructure/`: scoped AWS role trust and permission documents.

The archive itself uses local exhibition data and does not depend on the unavailable API.
Backend code, axios, environment configuration, and store images remain available for restoration.
`src/legacy/AppWithBackend.js` and `HeaderWithBackend.js` retain the previous routes/navigation.

## Content and validation

All 52 member records, their 260 images, six team descriptions, 252 displayed lookbook pages,
and the original gallery sequences are preserved. `scripts/content-baseline.json` protects
content hashes and gallery order. Update it deliberately when exhibition content changes.

After changing member image paths, run `node scripts/sync-member-images.cjs`.
Explicit imports avoid webpack scanning and bundling every source file.

```sh
python3 scripts/check-content.py
node scripts/sync-member-images.cjs --check
python3 scripts/test-deploy.py
CI=true npm run build
python3 scripts/verify-build.py
```

Secondary pages load only when visited. Shared galleries avoid component remounts caused by
nested component definitions. Home video progress uses React media events without repeatedly
registering event handlers or scheduling transition timers.

Removed template files, duplicate fonts, and unused public images remain recoverable in Git.
`scripts/cleanup-report.json` distinguishes removed files from retained legacy images.
No image quality or video encoding was changed in this code cleanup.

See [DEPLOYMENT.md](DEPLOYMENT.md) for CI/CD, backup verification, and rollback instructions.
