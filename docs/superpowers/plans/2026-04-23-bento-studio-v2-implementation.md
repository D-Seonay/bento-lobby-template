# Bento Studio V2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement Add, Delete, and Edit functionality in the Bento Studio using a contextual sidebar.

**Architecture:** Centralized state in the Studio page with a dual-mode Sidebar component.

**Tech Stack:** Next.js, React, Tailwind CSS.

---

### Task 1: Enhance Grid Item Selection

**Files:**
- Modify: `components/studio/SortableGridItem.tsx`
- Modify: `app/studio/page.tsx`

- [ ] **Step 1: Update SortableGridItem to support selection**

```tsx
// components/studio/SortableGridItem.tsx (Partial)
export function SortableGridItem({ 
  item, 
  onResize, 
  isSelected, 
  onSelect 
}: { 
  item: GridItem, 
  onResize: (id: string) => void,
  isSelected: boolean,
  onSelect: (id: string) => void
}) {
  // ... existing dnd-kit logic

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => onSelect(item.id)}
      className={`${spanClasses[item.size]} bg-zinc-900 border ${isSelected ? 'border-blue-500 ring-1 ring-blue-500' : 'border-zinc-800'} p-4 flex flex-col justify-between group relative cursor-pointer`}
    >
      {/* ... handle/attributes only on the background overlay or a specific handle icon */}
      <div {...attributes} {...listeners} className="absolute top-2 right-2 w-4 h-4 bg-zinc-800 rounded cursor-grab active:cursor-grabbing z-20" />
      
      {/* ... rest of item content */}
    </div>
  );
}
```

- [ ] **Step 2: Update Studio page to manage selectedId**

```tsx
// app/studio/page.tsx (Partial)
export default function StudioPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  // ...
  return (
    // ...
    {grid.map(item => (
      <SortableGridItem 
        key={item.id} 
        item={item} 
        onResize={handleResize}
        isSelected={selectedId === item.id}
        onSelect={setSelectedId}
      />
    ))}
  )
}
```

- [ ] **Step 3: Commit task**

```bash
git add components/studio/SortableGridItem.tsx app/studio/page.tsx
git commit -m "feat: add widget selection logic to studio"
```

### Task 2: Implement Contextual Sidebar

**Files:**
- Create: `app/studio/StudioSidebar.tsx`
- Modify: `app/studio/page.tsx`

- [ ] **Step 1: Create the StudioSidebar component with Palette/Edit modes**

```tsx
// app/studio/StudioSidebar.tsx
import { GridItem } from '@/types/lobby';
import { WIDGET_REGISTRY } from '@/components/registry';

interface SidebarProps {
  selectedItem: GridItem | null;
  onAdd: (type: string) => void;
  onUpdate: (id: string, data: Partial<GridItem>) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export function StudioSidebar({ selectedItem, onAdd, onUpdate, onDelete, onClose }: SidebarProps) {
  const widgetTypes = Object.keys(WIDGET_REGISTRY);

  if (!selectedItem) {
    return (
      <div className="w-80 border-r border-zinc-800 p-6 flex flex-col">
        <h2 className="text-xs font-black tracking-widest text-zinc-500 mb-8 uppercase">Widget Palette</h2>
        <div className="space-y-2">
          {widgetTypes.map(type => (
            <button
              key={type}
              onClick={() => onAdd(type)}
              className="w-full text-left px-4 py-3 bg-zinc-900 border border-zinc-800 hover:border-blue-500 text-[10px] font-black transition-all"
            >
              + ADD {type.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 border-r border-zinc-800 p-6 flex flex-col bg-zinc-950">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xs font-black tracking-widest text-blue-500 uppercase">Edit Widget</h2>
        <button onClick={onClose} className="text-zinc-500 hover:text-white">✕</button>
      </div>

      <div className="space-y-6 flex-1">
        <div className="space-y-2">
          <label className="text-[10px] text-zinc-500 font-black">Widget ID</label>
          <input 
            className="w-full bg-zinc-900 border border-zinc-800 p-3 text-xs outline-none focus:border-blue-500"
            value={selectedItem.id}
            onChange={(e) => onUpdate(selectedItem.id, { id: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] text-zinc-500 font-black">Widget Type</label>
          <select 
            className="w-full bg-zinc-900 border border-zinc-800 p-3 text-xs outline-none focus:border-blue-500 appearance-none"
            value={selectedItem.type}
            onChange={(e) => onUpdate(selectedItem.id, { type: e.target.value })}
          >
            {widgetTypes.map(type => <option key={type} value={type}>{type}</option>)}
          </select>
        </div>

        {/* Conditional fields for projects/socials */}
        {selectedItem.type === 'bento' && (
           <div className="space-y-2">
            <label className="text-[10px] text-zinc-500 font-black">Project ID</label>
            <input 
              className="w-full bg-zinc-900 border border-zinc-800 p-3 text-xs outline-none focus:border-blue-500"
              value={selectedItem.projectId || ''}
              onChange={(e) => onUpdate(selectedItem.id, { projectId: e.target.value })}
            />
          </div>
        )}
      </div>

      <button 
        onClick={() => onDelete(selectedItem.id)}
        className="w-full py-3 bg-red-900/20 text-red-500 border border-red-900/50 hover:bg-red-900/40 text-[10px] font-black transition-all"
      >
        DELETE WIDGET
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Integrate StudioSidebar into the Studio page**

```tsx
// app/studio/page.tsx (Update)
import { StudioSidebar } from './StudioSidebar';

// Inside StudioPage
const addWidget = (type: string) => {
  const newId = `${type}-${Date.now()}`;
  const newItem: GridItem = { id: newId, type, size: 'small' };
  setGrid([...grid, newItem]);
  setSelectedId(newId);
};

const updateWidget = (id: string, data: Partial<GridItem>) => {
  setGrid(grid.map(item => item.id === id ? { ...item, ...data } : item));
};

const deleteWidget = (id: string) => {
  setGrid(grid.filter(item => item.id !== id));
  setSelectedId(null);
};

// Update JSX to use StudioSidebar
<StudioSidebar 
  selectedItem={grid.find(i => i.id === selectedId) || null}
  onAdd={addWidget}
  onUpdate={updateWidget}
  onDelete={deleteWidget}
  onClose={() => setSelectedId(null)}
/>
```

- [ ] **Step 3: Commit task**

```bash
git add app/studio/StudioSidebar.tsx app/studio/page.tsx
git commit -m "feat: implement contextual studio sidebar for CRUD operations"
```
