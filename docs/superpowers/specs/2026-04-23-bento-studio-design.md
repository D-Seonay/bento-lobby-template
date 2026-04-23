# Spec: Bento Studio Editor

**Date:** 2026-04-23
**Status:** Draft
**Topic:** Implementation of a visual drag-and-drop editor to configure the Bento grid layout.

## 1. Goal
Provide a user-friendly, browser-based interface (`/studio`) where users can visually arrange and resize their Bento cards. The editor will generate and save the configuration directly to `content/lobby.json`.

## 2. Interface Design

### 2.1 The Sidebar (Widget Palette)
A vertical list of available components defined in `WIDGET_REGISTRY`.
- Includes "Generic Bento Card" (for projects).
- Includes specialized widgets (GitHub, Socials, etc.).
- Items can be dragged onto the canvas.

### 2.2 The Canvas (Bento Grid)
A 2D grid area representing the homepage layout.
- **Drag-and-Drop:** Powered by `@dnd-kit/sortable`.
- **Abstract Representation:** Cards will show their type and ID (e.g., "Bento: seonay-portfolio") instead of live data to maintain focus on layout.
- **Resizing:** Each card will have a "Size Toggle" (S, W, B, XL) that updates its CSS `col-span` and `row-span` in real-time.
- **Empty States:** Visual cues showing where a new item can be dropped.

## 3. Technical Systems

### 3.1 Persistence (Server Actions)
A `saveStudioConfig` server action in `app/studio/actions.ts`:
- **Input:** An array of `GridItem` objects.
- **Action:** Reads the existing `lobby.json`, replaces the `grid` property, and writes back to disk.
- **Feedback:** Toast notification on success/error.

### 3.2 Library Dependencies
- `@dnd-kit/core`: Core drag and drop logic.
- `@dnd-kit/sortable`: Preset for grid/list reordering.
- `@dnd-kit/utilities`: Helpers for modifiers and sensors.

## 4. User Workflow
1. User navigates to `/studio`.
2. Existing layout is loaded from `lobby.json` into the React state.
3. User drags cards to reorder or clicks resize handles to change dimensions.
4. User clicks a "Save Changes" button.
5. Site reloads the homepage with the new configuration.

## 5. Verification Plan
- **Data Integrity:** Verify that saving in the Studio correctly updates `lobby.json` without corrupting other fields (profile, theme).
- **Layout Consistency:** Ensure that a layout built in the Studio translates perfectly to the `BentoGrid` rendering on the home page.
- **Edge Cases:** Handle scenarios where the grid is empty or has overlapping items (though sortable should prevent overlap).
