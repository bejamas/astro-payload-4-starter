# Astro website with the official Payload admin

Payload 4's starter serves its website and admin through TanStack Start. This repo moves the website to Astro and Bejamas UI, while keeping the admin on Payload's supported TanStack adapter.

## Why two apps

The beta ships Next.js and TanStack admin adapters. The TanStack adapter integrates routing, server functions, and React Server Components. Astro's React integration alone cannot replace those responsibilities.

We considered a custom Astro admin adapter and a separate supported admin. The supported admin keeps the beta upgrade path close to upstream. A custom adapter would make the starter responsible for Payload's admin rendering and navigation as well as the website. A separate Next.js admin would also work, but adds a framework that the TanStack reference does not need.

This repo is an Astro website starter using Payload 4. It does not claim native Astro support for the Payload admin.

## Requests and ownership

The CMS owns the database, authentication, authorization, upload processing, and document versions. Astro owns HTML, public URLs, metadata, and UI behavior. Only generated types cross the workspace package boundary; Astro does not import the Payload config or access its database.

For a public page, Astro calls the typed SDK without credentials and selects published content. Payload enforces the collection's public read rule too. A missing document returns a page with status `404`. A failed CMS request returns `503`, so an outage does not appear to be deleted content.

For preview, Astro reads the editor's Payload cookie and sends that token to the configured CMS as an authorization header. It verifies the user before querying a saved draft. Preview pages carry `Cache-Control: no-store` and `X-Robots-Tag: noindex, nofollow`. The response contains no token. The cookie must reach the Astro hostname, which is why production subdomains need an explicit shared cookie domain.

The SDK derives collection and block types from `packages/content/payload-types.ts`. Run `bun run generate` after changing a schema. The SDK is the transport boundary; it reports non-success HTTP responses as errors.

## Rendering and media

The Astro Node adapter renders every public request on the server. Publishing needs no rebuild or webhook, and the build needs no CMS connection. This costs a CMS round trip per request. A static site with rebuild hooks is an alternative for projects that value offline availability over immediate publishing.

Page blocks map to Astro components. Bejamas UI components are copied into the web app, with their registry configuration committed. The FAQ controller waits for the DOM before initializing, which also supports pages whose content arrives after the script during streaming.

Payload's Sharp transformer creates stored WebP variants at upload time. Astro renders the card variant with explicit image dimensions. Uploads are public library assets. Draft access rules protect document fields, not the attached file bytes.

## Beta maintenance

The admin route files come from Payload `v4.0.0-beta.3/templates/blank-tanstack`. Keep Payload package versions aligned, compare those route files when upgrading, regenerate types and the import map, then run `bun run check`, `bun run build`, and `bun run smoke`.

The HTTP suite exercises login, a private draft, authenticated preview, published snapshots during draft edits, publication, draft posts, media upload and resizing, metadata, the sitemap, and missing routes. Browser review additionally covers the responsive layout and FAQ keyboard interaction.
