# Publishing ISRM

Pushes to `codex/network-workflow-batch` run the Cloudflare Pages workflow. The workflow installs locked dependencies, runs the application tests, builds the Pages preset and publishes the agreed public files to the existing `isrm` project at https://isrm.pages.dev/. Other branches and pull requests do not deploy production.

The repository already stores `CLOUDFLARE_ACCOUNT_ID` and `CLOUDFLARE_API_TOKEN` as GitHub Actions secrets. Their values are never committed or printed. The token is passed only to the destination check and the official Cloudflare deployment action, after the build. No new account access is created by this workflow.

The destination check verifies that the credentials address the existing `isrm.pages.dev` project, then reads its production branch label. This label determines the Pages environment and may differ from the Git source branch. Neither the project nor its address is recreated.

`prepare-pages-release.mjs` copies client assets and the two agreed Markdown documents, bundles the SSR worker and adds `release.json` with the source commit. Internal documentation, archive files and partner workbooks are not uploaded. The final check waits for that commit to appear on production and verifies the briefing, graph, scope and approved documents.

The workflow uses pinned action commits, a read-only GitHub token and serial deployment concurrency. The Actions run records any installation, build, authentication or deployment failure. The existing production deployment remains available when a pre-deployment step fails. Cloudflare retains versioned deployments for rollback.

For a local build:

```
npm ci
node --import tsx --test src/lib/*.test.ts
NITRO_PRESET=cloudflare-pages npm run build
node scripts/prepare-pages-release.mjs
```

Manual ZIP upload is no longer needed once a successful workflow run has been verified.
