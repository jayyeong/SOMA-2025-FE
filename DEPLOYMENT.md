# KUAD 2025 build and deployment

Source: https://github.com/jayyeong/SOMA-2025-FE (default branch `master`).
Production: https://kuadarchive.com/2025/.

## Baseline verified on 2026-09-25

Original fork commit: `c3fcba0c6132117dab17dad8cd8ff01a8890d661`.
The 26 application JS/JSX files in the deployed source map match this commit.
An unchanged local build produced byte-identical `index.html`,
`static/js/main.4c7b1468.js`, and `static/css/main.3c9c6eae.css` compared with production.
This establishes the application baseline; it does not establish byte identity for every image.

The complete production snapshot is in the private bucket:
`s3://kuadarchive-backup-696592521871/snapshots/2026-09-25-2025-baseline/2025/`.
All 751 object keys and sizes were checked against production (1,971,480,955 bytes).
Multipart source ETags may change during server-side copy and are not treated as content hashes.

## CI and publishing

Initial validation [run 36041363313](https://github.com/jayyeong/SOMA-2025-FE/actions/runs/36041363313)
passed on commit `35b0eed524025f16008c38af0e3acf4150373f22`: dependency installation,
five deployment guard tests, production build, artifact verification, AWS OIDC authentication,
and the non-mutating deployment dry run. Production publishing was intentionally skipped.

Pushes to `master` and `dev/**`, and pull requests, build and verify without publishing.
Actions → **Archive 2025** → **Run workflow** on `master`:

- Leave `deploy` unchecked for build, OIDC authentication, and a non-mutating deployment dry run.
- Check `deploy` to publish the verified build.

Node 22 and `npm ci` use the committed lock file. Build verification checks generated asset
paths and public file presence. Five deployment guard tests cover account/branch restrictions,
dry-run behavior, failed upload behavior, and upload order and scope.

GitHub Actions variable `AWS_ROLE_ARN` refers to
`arn:aws:iam::696592521871:role/GitHub-KUAD-2025-Deploy`.
The role trusts only this repository's immutable subject on `master`:
`repo:jayyeong@48705640/SOMA-2025-FE@1373920298:ref:refs/heads/master`.
No persistent AWS access key is required. Reviewed role documents are in `infrastructure/`.

The target is `s3://kuadarchive/2025/` in `ap-northeast-2`, account `696592521871`.
The old `kuad-archive` destination is not used. The role permits no object deletion and no writes
to other years. CloudFront permission is limited to distribution `ESQ6WE0AL18SD`;
the deployment script limits invalidation to `/2025/*`.

Each deployment backs up the current entry point to
`s3://kuadarchive-backup-696592521871/releases/2025/RUN-ATTEMPT/index.html`,
uploads assets first, publishes HTML last, refreshes CloudFront, and compares public HTML.
HTML uses revalidation; other assets use a one-hour cache. Deployments are serialized.

## Rollback and subsequent edits

Operators can restore the baseline snapshot or rerun a known good source commit through the
current workflow. The deployment role cannot restore backups itself. Retained hashed assets
allow an entry-point rollback, but changes to unhashed public images must use new filenames
or a versioned directory so older releases keep working.

Frontend API configuration and the 2025 backend are unchanged. API availability and
commerce/admin behavior need separate verification before changes to those features.
