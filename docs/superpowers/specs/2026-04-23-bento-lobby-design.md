# Spec: Project Lobby Template

**Date:** 2026-04-23
**Status:** Draft
**Topic:** Converting a personal portfolio into a highly customizable and reusable template for individual developers.

## 1. Goal
Transform the current "Project Lobby" codebase into a professional template that allows developers to launch a high-performance, aesthetically "radical" bento-style portfolio by simply editing JSON files.

## 2. Architecture & Core Systems

### 2.1 JSON-Driven Configuration
The entire application state (metadata, visual style, and layout) will be centralized in `content/lobby.json`.

**Schema Overview:**
- `profile`: Personal data (name, title, bio, company).
- `theme`: Visual tokens (accent color, border radius, primary font).
- `grid`: An ordered array of widget definitions (type, size, specific IDs).

### 2.2 Explicit Widget Registry
To maintain type safety and extensibility, a central registry (`components/registry.tsx`) will map string keys from the JSON to React components.

**Workflow for Users:**
1. Create a new component in `components/widgets/`.
2. Register it in `WIDGET_REGISTRY`.
3. Reference it in `lobby.json`.

### 2.3 Dynamic Theme Injection
A `ThemeConfiguration` component in `app/layout.tsx` will read the `theme` object from `lobby.json` and generate a style tag to override Tailwind/CSS variables:
- `--accent`
- `--radius-3xl` (Bento card corners)
- `--font-sans`

### 2.4 SEO & Metadata Automation
- **Metadata:** `app/layout.tsx` will dynamically generate `title`, `description`, and `openGraph` tags based on `profile` data.
- **JSON-LD:** `app/page.tsx` will inject a structured data script (Schema.org Person/Organization) derived from the config.

## 3. Component Updates

### 3.1 `BentoGrid` & `BentoCard`
- `BentoGrid` will no longer have a hardcoded layout. It will map over the `grid` array from `lobby.json`.
- `BentoCard` will be updated to fetch specific project data from `content/projects.json` using the `projectId` provided in the grid config.

### 3.2 Widget Components
All widgets (GitHubGraph, MoonPhase, etc.) will be standardized to accept a `size` prop and adhere to the template's spacing/border standards.

## 4. Developer Experience (DX)

### 4.1 CLI Setup Wizard
A `scripts/setup.mjs` utility will be added. When run (`npm run setup`), it will:
- Prompt for name, title, and social handles.
- Prompt for a primary accent color.
- Generate the initial `lobby.json`.
- (Optional) Clear the example `projects.json`.

### 4.2 Documentation
Update `README.md` with:
- "Quick Start" guide.
- Detailed "Custom Widget" tutorial.
- Deployment instructions (Vercel/Netlify).

## 5. Testing & Verification
- **Schema Validation:** Use a lightweight script to verify `lobby.json` matches the required structure.
- **Responsive Audit:** Ensure the dynamic grid maintains integrity across mobile, tablet, and desktop viewports.
- **Build Test:** Ensure `npm run build` passes after a fresh setup with no personal data.

## 6. Implementation Phases
1. **Phase 1:** Core Refactor (Centralize JSON and create the Registry).
2. **Phase 2:** Dynamic Systems (Theme injection and SEO automation).
3. **Phase 3:** Layout Generalization (Make `page.tsx` strictly data-driven).
4. **Phase 4:** DX Tools (Setup script and refined README).
