# Additional Codex Instructions — Private Source Repo to Public GitHub Pages Repo

## Goal

Update the Astro blog project so the full source code can live in a private repository, while the built static site is deployed into a separate public GitHub Pages repository.

The intended setup is:

```txt
Private source repo:
zpmlabber-site-source

Public GitHub Pages repo:
zpmlabber.github.io
```

The private repo contains:

```txt
Astro source code
Markdown/MDX content
drafts if needed
package.json
GitHub Actions workflow
```

The public repo contains only generated static output:

```txt
index.html
assets/
blog/
projects/
packages/
pagefind/
.nojekyll
```

Do not require paid hosting, backend, database, CMS, or server-side rendering.

## Deployment Strategy

The private repository must build the Astro project and push the generated `dist/` folder into the public repository.

Use a GitHub Actions workflow in the private source repo.

The workflow must:

1. Checkout the private source repo.
2. Install Node.js.
3. Install dependencies.
4. Build the Astro site.
5. Generate the Pagefind index.
6. Add `.nojekyll` to the output.
7. Push the contents of `dist/` to the public `zpmlabber.github.io` repository.
8. Replace the previous generated files cleanly.

## Required Secret

The private source repository must define this GitHub Actions secret:

```txt
GH_PAGES_DEPLOY_TOKEN
```

This token must be a fine-grained GitHub Personal Access Token or another valid token that can write to the public GitHub Pages repo.

Minimum required repository permission:

```txt
Contents: Read and write
```

The token should have access only to the target public repo if possible.

Do not hardcode tokens anywhere.

## Public Repo Settings

The target public repository should be:

```txt
zpmlabber.github.io
```

In the public repo settings:

```txt
Settings -> Pages
Source: Deploy from a branch
Branch: main
Folder: /root
```

The public repo should not contain Astro source files. It should only contain generated static files.

## Astro Config

Because the target repository is a user/org GitHub Pages repo named:

```txt
zpmlabber.github.io
```

the site should be served from the root path `/`.

Configure Astro accordingly.

In `astro.config.mjs`, use something like:

```js
import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://zpmlabber.github.io",
  base: "/",
  integrations: [
    tailwind(),
    mdx(),
    sitemap(),
  ],
});
```

If the site URL changes later, keep it easy to change in one place.

## Package Scripts

Keep scripts simple.

`package.json` must include:

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build && pagefind --site dist",
    "preview": "astro preview"
  }
}
```

If Pagefind needs a different command based on the final setup, adjust it, but the production build must generate the static search index.

## GitHub Actions Workflow

Create this file in the private source repo:

```txt
.github/workflows/deploy-to-public-pages.yml
```

Use this workflow as the base implementation:

```yaml
name: Build and deploy to public GitHub Pages repo

on:
  push:
    branches:
      - main
  workflow_dispatch:

permissions:
  contents: read

concurrency:
  group: deploy-zpmlabber-pages
  cancel-in-progress: true

jobs:
  build-and-deploy:
    name: Build Astro and deploy static output
    runs-on: ubuntu-latest

    steps:
      - name: Checkout private source repo
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Build Astro site and Pagefind index
        run: npm run build

      - name: Add .nojekyll
        run: touch dist/.nojekyll

      - name: Deploy dist to public GitHub Pages repo
        uses: peaceiris/actions-gh-pages@v4
        with:
          personal_token: ${{ secrets.GH_PAGES_DEPLOY_TOKEN }}
          external_repository: ZPMLabber/zpmlabber.github.io
          publish_branch: main
          publish_dir: ./dist
          force_orphan: true
          user_name: github-actions[bot]
          user_email: 41898282+github-actions[bot]@users.noreply.github.com
```

Important:

- `external_repository` must be easy to change.
- If the public repo is under a personal account instead of the `ZPMLabber` org, update it to:

```yaml
external_repository: YOUR_USERNAME/zpmlabber.github.io
```

- `force_orphan: true` is acceptable because the public repo is generated output only.
- Do not deploy source files.
- Do not deploy `.env`, `.env.example`, `src/`, `node_modules/`, or config files to the public repo.

## Optional Config File

Create a small deployment config note in the README.

Example:

```txt
Private source repo:
ZPMLabber/zpmlabber-site-source

Public output repo:
ZPMLabber/zpmlabber.github.io
```

If the repository owner is unknown, use placeholders and document where to change them.

## README Updates

Update `README.md` with a section:

```md
## Private Source -> Public GitHub Pages Deployment
```

Include:

1. Why this setup exists.
2. Which repo is private.
3. Which repo is public.
4. How to create `GH_PAGES_DEPLOY_TOKEN`.
5. Which workflow file handles deployment.
6. Where to change the target public repo.
7. How to configure GitHub Pages in the public repo.
8. What files should appear in the public repo.
9. What files must never appear in the public repo.

Add a clear warning:

```md
Do not commit secrets, private drafts, unpublished notes, or API keys to the public output repository.
```

## Giscus Notes

Giscus comments should use a public repository.

Recommended:

```txt
Giscus repo:
ZPMLabber/zpmlabber.github.io
```

Reason:

- the source repo may be private
- public users need to access Discussions
- comments/reactions should belong to the public site

Add this note to README.

Do not require Giscus to work during local development.

The site must still build if Giscus env variables are missing.

## Security Requirements

- Do not expose the deploy token.
- Do not print secrets in logs.
- Do not use a classic PAT with broad permissions unless explicitly needed.
- Prefer a fine-grained token scoped only to the public output repo.
- Public repo must contain only static output.
- The public repo should not contain private drafts.
- `.env` must be ignored.
- `.env.example` may stay only in the private source repo.

## .gitignore

Ensure `.gitignore` in the private source repo includes:

```txt
node_modules/
dist/
.astro/
.env
.env.*
!.env.example
```

The generated public repo should not need a complex `.gitignore` because it only receives static output.

## Acceptance Checklist

This task is complete when:

- The Astro project builds locally.
- `npm run build` creates `dist/`.
- Pagefind index is included in `dist/`.
- `.nojekyll` is added during deployment.
- The private repo contains `.github/workflows/deploy-to-public-pages.yml`.
- The workflow pushes only `dist/` contents to `ZPMLabber/zpmlabber.github.io`.
- The public repo can serve the site from the root path.
- README explains private-source/public-output deployment clearly.
- Giscus is documented as using the public repo.
- No private source files are deployed publicly.
