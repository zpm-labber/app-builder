---
title: "Filament UnDraw Illustrations Select"
description: "A small Filament field for searching and selecting unDraw illustrations directly inside forms."
date: 2026-05-04
updated: 2026-05-04
tags:
  - filament
  - laravel
  - package
  - undraw
  - forms
featured: false
draft: false
canonicalUrl:
---

## Picking Illustrations Should Be Simple

Most admin panels eventually need some kind of visual selection.

A landing page needs a hero illustration.
An onboarding screen needs an empty state.
A card needs a small graphic that makes the interface feel less dead.

The usual flow is not great: open an illustration website, search manually, copy the SVG URL, paste it into a field, then repeat the same thing every time the content changes.

**Filament UnDraw Illustrations Select** turns that into a normal Filament form field.

## What It Does

This package adds a Filament select component that lets you search and pick unDraw illustrations directly from a form.

Instead of showing only text options, the dropdown displays image thumbnails. The selected value also keeps the visual preview, so the field feels more like an illustration picker than a plain select input.

```php
use ZPMLabs\FilamentUndraw\Forms\Components\UndrawSelect;

UndrawSelect::make('svg_url');
```

Because the component extends Filament's `Select`, it still fits into the normal Filament form workflow. You can keep using the usual fluent methods while getting a custom thumbnail-based interface.

## Why I Built It

This is one of those packages that solves a small but annoying piece of friction.

When building landing pages, page builders, onboarding flows, empty states, or CMS-like admin panels, illustrations are often treated as a raw string field. Technically it works, but the editing experience is poor.

A user should not need to know or paste the illustration URL manually.

They should search, preview, pick, and move on.

That is the whole point of this package.

## Built for Filament Forms

The field works inside Filament Forms and supports PHP 8.2+ with Filament 5.x.

Installation is simple:

```bash
composer require zpmlabs/filament-undraw
```

Then use the field like any other Filament form component:

```php
use ZPMLabs\FilamentUndraw\Forms\Components\UndrawSelect;

UndrawSelect::make('hero_illustration')
    ->label('Hero illustration')
    ->live();
```

For tighter layouts, the package also supports smaller preview sizes and result limits:

```php
UndrawSelect::make('compact_illustration')
    ->label('Compact illustration')
    ->searchResultSize('w-24 h-24')
    ->selectedOptionSize('w-24 h-24')
    ->limit(12);
```

This makes it usable in larger hero sections, compact cards, empty states, alerts, and smaller admin layouts.

## Demo Page Included

The package ships with a ready-to-use Filament demo page, so you can mount it inside your panel and test the field before wiring it into a real resource.

That matters because form fields are visual components. A README example is useful, but actually seeing the search results, selected preview, and layout behavior inside a real Filament panel is much better.

## Theme Setup

If your Filament panel uses a custom Tailwind theme, the package paths should be added to your theme source list.

```css
@source '../../../../vendor/zpmlabs/filament-undraw/src/**/*';
@source '../../../../vendor/zpmlabs/filament-undraw/resources/views/**/*';
```

Then rebuild your assets:

```bash
npm run build
```

Both paths are needed because some utility classes live inside PHP configuration strings, while the demo page uses Tailwind classes directly in Blade.

## Custom Views

If you want to customize the rendered field view, you can publish the Blade file:

```bash
php artisan vendor:publish --tag=filament-undraw-views
```

This gives you full control over the field markup while keeping the package logic reusable.

## Small Package, Useful Pattern

This package is intentionally small.

It does not try to become a page builder, a media manager, or a full illustration library. It focuses on one thing: making unDraw illustration selection feel native inside Filament.

That kind of package is useful because it can be dropped into bigger systems without bringing unnecessary architecture with it.

For me, this fits naturally into tools like website builders, onboarding builders, CMS panels, and admin dashboards where non-technical users need to pick visual assets without touching URLs.

## Package

```bash
composer require zpmlabs/filament-undraw
```

Repository:

```txt
https://github.com/zpm-packages/filament-undraw-illustrations-select
```

The package also builds on top of a base PHP package for unDraw, which can be reused if the same illustration search logic is needed outside Filament.
