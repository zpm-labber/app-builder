# ZPMLabber Astro Blog

High-tech static personal developer blog and project hub for ZPMLabber.

## Visual Direction

The site uses a hacker-style, terminal-inspired visual system: shell prompts, workstation top bars, tmux-like panels, command-style links, status badges, and readable prose surfaces. The intent is a polished developer command center, not a novelty terminal page.

Reusable design primitives live in:

- `src/components/TerminalWindow.astro`
- `src/components/PromptLabel.astro`
- `src/components/Card.astro`
- `src/components/Badge.astro`
- `src/styles/global.css`

When adding new pages or components, prefer section labels that read like shell commands, such as `ls packages/`, `cat about.md`, or `find ./blog`. Keep body copy in readable sans/prose styles and reserve monospace for commands, paths, metadata, badges, and install snippets.

## Tech Stack

- Astro with TypeScript
- Tailwind CSS via the official Tailwind Vite plugin for Astro 6
- Markdown/MDX content collections
- Pagefind static search
- Giscus comments and reactions
- Private-source to public GitHub Pages deployment through GitHub Actions

## Local Setup

```bash
npm install
npm run dev
```

Open the local URL printed by Astro.

## Build And Preview

```bash
npm run build
npm run preview
```

`npm run build` runs `astro build` and then creates the Pagefind index from `dist`.

## Search

Search is powered by Pagefind.

The header search icon opens the command-palette style modal, and these keyboard shortcuts open it from anywhere on the site:

- Ctrl + K
- Cmd + K
- /

The standalone `/search` page remains available as a direct-link fallback and uses the same static index.

Search works after production build because Pagefind indexes the generated `dist/` output.

Test locally with:

```bash
npm run build
npm run preview
```

## Adding A Blog Post

Create a Markdown or MDX file in `src/content/blog`. Collection schemas live in `src/content.config.ts`.

```yaml
---
title: "Building Community SDKs"
description: "Why I started building open-source SDKs for external APIs."
date: 2026-05-04
updated: 2026-05-04
tags:
  - open-source
featured: true
draft: false
canonicalUrl:
---
```

The file name becomes the URL slug, for example `my-post.md` becomes `/blog/my-post`.

## Adding A Project

Create a file in `src/content/projects`.

```yaml
---
title: "Community SDKs"
description: "Open-source SDKs and integrations for external APIs and services."
status: "active"
tags:
  - sdk
github: "https://github.com/community-sdks"
website: "https://community-sdks.github.io"
featured: true
---
```

## Adding A Package

Create a file in `src/content/packages`.

```yaml
---
name: "Unlayer Livewire"
description: "Livewire wrapper for the Unlayer email editor."
ecosystem: "Community SDKs"
category: "Unlayer"
language: "PHP"
frameworks:
  - Laravel
  - Livewire
repo: "https://github.com/community-sdks/unlayer-livewire"
registry: "https://packagist.org/packages/community-sdks/unlayer-livewire"
install: "composer require community-sdks/unlayer-livewire"
status: "beta"
featured: true
---
```

## Configuring Giscus

Copy `.env.example` to `.env` and fill these public values:

```bash
PUBLIC_GISCUS_REPO=
PUBLIC_GISCUS_REPO_ID=
PUBLIC_GISCUS_CATEGORY=
PUBLIC_GISCUS_CATEGORY_ID=
PUBLIC_GISCUS_MAPPING=pathname
PUBLIC_GISCUS_THEME=preferred_color_scheme
```

If any required value is missing, the comments component fails gracefully with a short setup note.

Recommended Giscus repository: `zpm-labber/zpm-labber.github.io`.

The source repository may be private, so Giscus should use a public repository where visitors can access Discussions and reactions. Giscus is optional during local development and the site still builds when these environment variables are missing.

## Configuring GitHub Pages

For the user or organization repo `zpm-labber.github.io`, the default base path is `/`.

If you deploy from a project repository, set:

```bash
SITE_URL=https://zpm-labber.github.io
BASE_PATH=/repo-name/
```

In the public repo settings:

- Source: Deploy from a branch
- Branch: `main`
- Folder: `/root`

The site is configured for `https://zpm-labber.github.io` and root path `/`.

## Private Source -> Public GitHub Pages Deployment

This setup keeps the editable Astro source, Markdown/MDX content, drafts, package files, and workflows in a private repository while publishing only generated static files to the public GitHub Pages repository.

Private source repo:

```txt
zpm-labber/app-builder
```

Public output repo:

```txt
zpm-labber/zpm-labber.github.io
```

The deployment workflow is `.github/workflows/deploy-to-public-pages.yml`. It checks out the private source repo, installs dependencies, runs `npm run build`, adds `dist/.nojekyll`, and pushes only the contents of `dist/` to the public repository.

Create a fine-grained GitHub Personal Access Token and add it to the private source repo as this Actions secret:

```txt
GH_PAGES_DEPLOY_TOKEN
```

Minimum token permission:

```txt
Contents: Read and write
```

Scope the token only to the target public repo whenever possible. Do not hardcode tokens in workflow files, `.env` files, Markdown content, or local scripts.

To change the target public repository, edit `PUBLIC_PAGES_REPOSITORY` in `.github/workflows/deploy-to-public-pages.yml`:

```yaml
env:
  PUBLIC_PAGES_REPOSITORY: zpm-labber/zpm-labber.github.io
```

If the public repo lives under a personal account, change it to:

```yaml
PUBLIC_PAGES_REPOSITORY: YOUR_USERNAME/zpm-labber.github.io
```

The public repo should contain generated output such as:

```txt
index.html
assets/
blog/
projects/
packages/
pagefind/
.nojekyll
```

The public repo must never contain:

```txt
src/
node_modules/
.env
.env.example
package.json
package-lock.json
astro.config.mjs
private drafts
API keys
deploy tokens
```

Do not commit secrets, private drafts, unpublished notes, or API keys to the public output repository.

## Deployment Notes

No backend, database, CMS, or paid hosting is required. Content is edited by adding Markdown or MDX files to the repository. Search works after production build because Pagefind indexes the generated static HTML.
