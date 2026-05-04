# Codex Instructions — ZPMLabber Astro Blog

## Goal

Build a high-tech personal developer blog and project hub for `ZPMLabber` using Astro.

The site must run fully static on GitHub Pages. Content must be editable by adding Markdown/MDX files to the repository. The site should feel like a polished tech/devtools brand: dark-first, futuristic, clean, fast, and professional.

## Stack

Use:

- Astro
- TypeScript
- Tailwind CSS
- Markdown/MDX content collections
- GitHub Pages deployment through GitHub Actions
- Giscus for comments and reactions
- Pagefind for static search
- No backend
- No database
- No paid hosting

Astro is preferred because this is a content-driven static site. Keep JavaScript minimal and avoid turning the site into a heavy SPA.

## Branding Direction

Brand name:

```txt
ZPMLabber
```

Positioning:

```txt
Open-source developer tools, SDKs, packages, experiments, and engineering notes.
```

Tone:

- personal but professional
- technical
- founder/maintainer style
- build-in-public friendly
- not too corporate
- not too childish

Visual style:

- dark-first
- high-tech
- command-center feel
- glassmorphism cards
- subtle neon purple/cyan accents
- grid/mesh background
- code/terminal-inspired details
- animated but not annoying
- fast and accessible

Do not use heavy animation libraries unless needed. CSS transitions are enough for MVP.

## Required Pages

Create these pages:

```txt
/
 /blog
 /blog/[slug]
 /projects
 /projects/[slug]
 /packages
 /packages/[slug]
 /ecosystems
 /about
 /search
```

### Home Page

The home page must include:

1. Hero section
   - ZPMLabber title
   - short tagline
   - GitHub/social buttons
   - high-tech visual block, such as terminal/card/orbit/dashboard mock

2. Featured ecosystems
   - Community SDKs
   - ZPM Packages
   - i18n Audit
   - PlayRoom
   - ApiDocsKit
   - Legacy Refactoring

3. Featured packages/projects

4. Latest blog posts

5. CTA section
   - “Explore projects”
   - “Read the blog”
   - “View GitHub”

### Blog Index

The blog page must:

- list all blog posts
- support tags
- show date
- show description
- show reading time if simple to implement
- have search link/input
- have featured posts section

### Blog Detail Page

Each blog post page must:

- render Markdown/MDX content
- show title, description, date, tags
- include table of contents if simple to implement
- include Giscus comments at the bottom
- include previous/next post navigation if simple to implement
- have proper SEO metadata

### Projects Page

The projects page must show cards for larger initiatives:

- Community SDKs
- ZPM Packages
- i18n Audit
- ApiDocsKit
- PlayRoom
- Smart ZPM
- Legacy Refactoring
- ZPM Experiments

Each project card should show:

- title
- short description
- status
- tags
- GitHub link
- website link if available

### Packages Page

The packages page must show package cards grouped by ecosystem/category.

Example categories:

- PHP
- Laravel
- Filament
- JavaScript / TypeScript
- Vue
- React
- Alpine.js
- SDKs
- Integrations

Each package card should show:

- package name
- description
- ecosystem
- language/framework
- install command
- status badge
- GitHub link
- package registry link if provided

### Ecosystems Page

Explain how the ecosystem is organized:

```txt
ZPMLabber = personal creator/maintainer identity
ZPMLabs = company/umbrella brand
Community SDKs = SDKs and wrappers for external APIs/services/libraries
ZPM Packages = reusable packages, plugins, adapters, and developer tools
```

This page should help visitors understand the difference between Community SDKs and ZPM Packages.

### About Page

Short personal/maintainer page:

- who ZPMLabber is
- what he builds
- focus areas
- links to GitHub organizations
- contact/social links placeholders

### Search Page

Use Pagefind.

Search must work fully static after build. If Pagefind cannot run during `astro dev`, that is fine, but production build must generate the index.

## Content Collections

Use Astro content collections.

Create:

```txt
src/content/blog
src/content/projects
src/content/packages
```

Create schemas in:

```txt
src/content/config.ts
```

### Blog Frontmatter

Support this shape:

```yaml
title: "Building Community SDKs"
description: "Why I started building open-source SDKs for external APIs."
date: 2026-05-04
updated: 2026-05-04
tags:
  - open-source
  - sdk
  - php
featured: true
draft: false
canonicalUrl:
```

### Project Frontmatter

Support this shape:

```yaml
title: "Community SDKs"
description: "Open-source SDKs and integrations for external APIs and services."
status: "active"
tags:
  - sdk
  - open-source
  - api
github: "https://github.com/community-sdks"
website: "https://community-sdks.github.io"
featured: true
```

### Package Frontmatter

Support this shape:

```yaml
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
```

## Initial Content

Add example content for:

### Blog

Create at least 3 example posts:

```txt
building-community-sdks.md
why-i-build-open-source-tools.md
how-i-organize-my-developer-ecosystem.md
```

### Projects

Create project entries for:

```txt
community-sdks.md
zpm-packages.md
i18n-audit.md
api-docs-kit.md
play-room.md
smart-zpm.md
legacy-refactoring.md
zpm-experiments.md
```

### Packages

Create package entries for:

```txt
unlayer-ts.md
unlayer-alpinejs.md
unlayer-livewire.md
filament-unlayer.md
filament-popup.md
domain-providers.md
api-docs-kit-laravel.md
```

Use placeholder links where exact URLs are not known, but keep the structure ready.

## Giscus Comments

Implement a reusable component:

```txt
src/components/GiscusComments.astro
```

Use Giscus for comments and reactions.

Important:

- The component should be disabled if required env/config values are missing.
- Use environment variables or a config file for:
  - repository
  - repository ID
  - category
  - category ID
  - mapping mode
  - theme
- Default theme should match dark mode.
- Use pathname mapping for blog posts.

Example config names:

```txt
PUBLIC_GISCUS_REPO
PUBLIC_GISCUS_REPO_ID
PUBLIC_GISCUS_CATEGORY
PUBLIC_GISCUS_CATEGORY_ID
PUBLIC_GISCUS_MAPPING
PUBLIC_GISCUS_THEME
```

Create `.env.example` with placeholders.

The component should render a friendly message or nothing when Giscus is not configured.

## Pagefind Search

Add Pagefind support.

Expected behavior:

- The build should generate static HTML.
- After build, Pagefind should create the search index from the generated `dist` directory.
- The search page should load the Pagefind UI or a minimal custom Pagefind-powered search component.

Update `package.json` scripts:

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build && pagefind --site dist",
    "preview": "astro preview"
  }
}
```

If needed, add a note in README that search works after production build.

## GitHub Pages Deployment

Add GitHub Actions workflow:

```txt
.github/workflows/deploy.yml
```

Requirements:

- install dependencies
- build Astro site
- run Pagefind indexing
- upload GitHub Pages artifact
- deploy to GitHub Pages

Use the official GitHub Pages actions:

- `actions/checkout`
- `actions/setup-node`
- `actions/configure-pages`
- `actions/upload-pages-artifact`
- `actions/deploy-pages`

The workflow should run on push to `main`.

Use Node.js 20 or newer.

## Astro Config

Configure Astro for GitHub Pages.

The site should work for a repo named:

```txt
zpmlabber.github.io
```

If the repo is a user/org GitHub Pages repository, base should be `/`.

Keep this configurable in `astro.config.mjs`.

Use:

- `site`
- Tailwind integration
- MDX integration if used
- sitemap integration if practical

## SEO

Add reusable SEO support.

Every page must have:

- title
- description
- canonical URL if possible
- Open Graph title
- Open Graph description
- Open Graph type
- Twitter card metadata
- favicon references

Create:

```txt
src/components/SEO.astro
```

or implement SEO in the base layout.

Add:

```txt
public/favicon.svg
public/og-default.svg
```

The default OG image can be a simple SVG with the ZPMLabber brand.

## Layout and Components

Create reusable components:

```txt
src/layouts/BaseLayout.astro
src/layouts/PostLayout.astro

src/components/Header.astro
src/components/Footer.astro
src/components/Hero.astro
src/components/Card.astro
src/components/Badge.astro
src/components/PackageCard.astro
src/components/ProjectCard.astro
src/components/PostCard.astro
src/components/GiscusComments.astro
src/components/SearchBox.astro
src/components/TerminalCard.astro
src/components/SectionHeading.astro
```

The design must be polished and consistent.

## Styling Requirements

Use Tailwind CSS.

Design tokens:

- background: near black
- card background: transparent dark glass
- border: subtle white/gray opacity
- primary accent: purple
- secondary accent: cyan
- text: high contrast
- muted text: readable gray

The UI should include:

- sticky header
- responsive navigation
- mobile menu if simple
- beautiful cards
- hover states
- code blocks styled nicely
- prose styles for Markdown
- tags/badges
- subtle background grid

Accessibility:

- readable contrast
- semantic HTML
- keyboard-friendly links/buttons
- no tiny text
- no animation that hurts usability

## Markdown Rendering

Use `@tailwindcss/typography` or equivalent styling.

Markdown content must look good:

- headings
- links
- code blocks
- lists
- blockquotes
- tables
- inline code

## README

Create a complete `README.md` with:

1. What the project is
2. Tech stack
3. Local setup
4. Adding a blog post
5. Adding a project
6. Adding a package
7. Configuring Giscus
8. Configuring GitHub Pages
9. Build and preview commands
10. Deployment notes

## Commands

Use npm by default.

Initialize with:

```bash
npm create astro@latest .
```

Install needed packages:

```bash
npm install @astrojs/tailwind @astrojs/mdx @astrojs/sitemap tailwindcss @tailwindcss/typography pagefind
```

If Astro setup differs, use the current official setup commands, but keep the final project structure clean.

## Quality Bar

Do not create a generic ugly template.

The site must feel custom and premium.

Avoid:

- plain white blog theme
- generic starter layout
- excessive animations
- backend requirements
- CMS requirements
- database requirements
- paid services
- copied placeholder noise

Deliver a working static site that can be deployed immediately to GitHub Pages.

## Acceptance Checklist

The task is done when:

- `npm install` works
- `npm run dev` works
- `npm run build` works
- Pagefind index is generated during build
- GitHub Pages workflow exists
- Markdown blog posts render correctly
- package/project content collections render correctly
- Giscus component exists and fails gracefully when not configured
- site is responsive
- site has high-tech dark visual design
- README explains how to add content
- no backend is required
