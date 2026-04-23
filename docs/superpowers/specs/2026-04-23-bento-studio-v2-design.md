# Spec: Bento Studio V2 Enhancements

**Date:** 2026-04-23
**Status:** Draft
**Topic:** Adding "Add", "Delete", and "Edit" capabilities to the visual Bento Studio.

## 1. Goal
Upgrade the existing `/studio` route to a fully-featured layout editor. Users will be able to create new widgets from a palette, edit existing widget properties through a contextual sidebar, and remove widgets from the grid.

## 2. Interactive Components

### 2.1 Contextual Sidebar (`app/studio/Sidebar.tsx`)
The sidebar will manage its internal state based on whether a widget is selected in the grid.
- **Palette View:**
  - List of available widget types (from `WIDGET_REGISTRY`).
  - "Add" button for each type.
- **Property Editor View:**
  - Triggered when `selectedId` is set.
  - Fields for: `id` (string), `type` (dropdown), `projectId` (if applicable), `platform` (if applicable).
  - "Delete" button (danger action).
  - "Close" button to return to Palette View.

### 2.2 Grid Item Enhancements (`components/studio/SortableGridItem.tsx`)
- **Selection State:** High-contrast border (accent color) when the item matches `selectedId`.
- **Click Event:** Clicking the card (non-drag handle area) sets the `selectedId` in the parent state.

## 3. Core Logic

### 3.1 State Operations
- **addWidget(type):**
  - Generates a unique ID using `crypto.randomUUID()` or timestamp.
  - Adds a new `GridItem` with the selected type and default size (`small`).
  - Sets `selectedId` to the new item.
- **updateWidget(id, data):**
  - Maps through the grid array and merges the new data for the matching ID.
- **deleteWidget(id):**
  - Filters the grid array to remove the matching ID.
  - Sets `selectedId` to null.

### 3.2 Component Registry Integration
The Sidebar will dynamically pull the list of "Addable" types from the keys of `WIDGET_REGISTRY`.

## 4. User Experience (UX)
1. **Adding:** User clicks "Add GitHub Graph" in the sidebar -> A new graph appears at the end of the grid -> Sidebar switches to Edit mode for that graph.
2. **Editing:** User clicks an existing Project card -> Sidebar shows that project's ID and allows changing it to a different project from `projects.json`.
3. **Deleting:** User clicks "Delete" in the sidebar -> The widget vanishes from the grid -> Sidebar returns to Palette mode.

## 5. Verification Plan
- **CRUD Validation:** Verify all 4 operations (Create, Read, Update, Delete) work without page refresh and persist correctly to `lobby.json` upon clicking "Save".
- **Selection Persistence:** Ensure that dragging a selected item doesn't clear the selection or cause state inconsistencies.
- **Type Safety:** Ensure that changing a widget's type in the editor correctly updates the rendered "abstract" card in the Studio.
