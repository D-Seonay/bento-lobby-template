# Bento Studio Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a visual drag-and-drop editor at `/studio` to configure the Bento grid layout and save it to `lobby.json`.

**Architecture:** Use `@dnd-kit` for drag-and-drop logic and Next.js Server Actions for file system persistence.

**Tech Stack:** Next.js, TypeScript, @dnd-kit, Tailwind CSS.

---

### Task 1: Dependencies & Base Setup

**Files:**
- Modify: `package.json`
- Create: `app/studio/actions.ts`

- [ ] **Step 1: Install dnd-kit dependencies**

Run: `npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities`

- [ ] **Step 2: Create the Save Server Action**

```tsx
// app/studio/actions.ts
'use server'
import fs from 'fs/promises';
import path from 'path';
import { GridItem } from '@/types/lobby';

export async function saveStudioConfig(newGrid: GridItem[]) {
  const configPath = path.join(process.cwd(), 'content', 'lobby.json');
  const currentConfig = JSON.parse(await fs.readFile(configPath, 'utf-8'));
  currentConfig.grid = newGrid;
  await fs.writeFile(configPath, JSON.stringify(currentConfig, null, 2));
  return { success: true };
}
```

- [ ] **Step 3: Commit task**

```bash
git add package.json app/studio/actions.ts
git commit -m "feat: add dnd-kit dependencies and studio server action"
```

### Task 2: Studio UI & State Management

**Files:**
- Create: `app/studio/page.tsx`

- [ ] **Step 1: Create the basic Studio layout with state**

```tsx
// app/studio/page.tsx (Initial structure)
'use client';

import { useState } from 'react';
import lobbyConfig from '@/content/lobby.json';
import { LobbyConfig, GridItem } from '@/types/lobby';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { saveStudioConfig } from './actions';

export default function StudioPage() {
  const [grid, setGrid] = useState<GridItem[]>((lobbyConfig as LobbyConfig).grid);

  const handleSave = async () => {
    await saveStudioConfig(grid);
    alert('Configuration saved!');
  };

  return (
    <div className="flex h-screen bg-black text-white font-mono uppercase">
      {/* Sidebar Palette */}
      <div className="w-64 border-r border-zinc-800 p-6 space-y-4">
        <h2 className="text-xs font-black tracking-widest text-zinc-500 mb-8">Widget Palette</h2>
        {/* Widget list will go here */}
      </div>

      {/* Main Canvas */}
      <div className="flex-1 overflow-auto p-12">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-2xl font-black italic tracking-tighter">Bento Studio<span className="text-blue-500">_</span></h1>
          <button onClick={handleSave} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-xs font-black transition-colors">SAVE LOBBY</button>
        </div>
        
        <DndContext collisionDetection={closestCenter}>
           <div className="grid grid-cols-6 auto-rows-[120px] gap-4">
             {/* Sortable items will go here */}
           </div>
        </DndContext>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit task**

```bash
git add app/studio/page.tsx
git commit -m "feat: implement base studio page and state"
```

### Task 3: Sortable Grid Items

**Files:**
- Create: `components/studio/SortableGridItem.tsx`
- Modify: `app/studio/page.tsx`

- [ ] **Step 1: Create the Sortable Wrapper component**

```tsx
// components/studio/SortableGridItem.tsx
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GridItem } from '@/types/lobby';

export function SortableGridItem({ item, onResize }: { item: GridItem, onResize: (id: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const spanClasses = {
    small: 'col-span-1 row-span-1',
    wide: 'col-span-2 row-span-1',
    big: 'col-span-2 row-span-2',
    xl: 'col-span-4 row-span-2',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${spanClasses[item.size]} bg-zinc-900 border border-zinc-800 p-4 flex flex-col justify-between group relative`}
    >
      <div {...attributes} {...listeners} className="absolute inset-0 cursor-grab active:cursor-grabbing" />
      
      <div className="relative z-10 pointer-events-none">
        <span className="text-[10px] text-zinc-500">{item.type}</span>
        <h3 className="text-xs font-black truncate">{item.id}</h3>
      </div>

      <div className="relative z-10 flex gap-2">
        <button 
          onClick={() => onResize(item.id)}
          className="pointer-events-auto text-[8px] px-2 py-1 bg-zinc-800 hover:bg-blue-600 transition-colors"
        >
          {item.size.toUpperCase()}
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Update Studio page with SortableContext and drag handler**

```tsx
// app/studio/page.tsx (Update)
import { arrayMove } from '@dnd-kit/sortable';
import { SortableGridItem } from '@/components/studio/SortableGridItem';

// Inside StudioPage
const handleDragEnd = (event: any) => {
  const { active, over } = event;
  if (active.id !== over.id) {
    setGrid((items) => {
      const oldIndex = items.findIndex(i => i.id === active.id);
      const newIndex = items.findIndex(i => i.id === over.id);
      return arrayMove(items, oldIndex, newIndex);
    });
  }
};

const handleResize = (id: string) => {
  const sizes: GridItem['size'][] = ['small', 'wide', 'big', 'xl'];
  setGrid(items => items.map(item => {
    if (item.id === id) {
      const currentIndex = sizes.indexOf(item.size);
      const nextIndex = (currentIndex + 1) % sizes.length;
      return { ...item, size: sizes[nextIndex] };
    }
    return item;
  }));
};

// Update JSX
<DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
  <SortableContext items={grid.map(i => i.id)}>
     <div className="grid grid-cols-6 auto-rows-[120px] gap-4">
       {grid.map(item => (
         <SortableGridItem key={item.id} item={item} onResize={handleResize} />
       ))}
     </div>
  </SortableContext>
</DndContext>
```

- [ ] **Step 3: Commit task**

```bash
git add components/studio/SortableGridItem.tsx app/studio/page.tsx
git commit -m "feat: implement sortable grid and resizing in studio"
```

### Task 4: UI Polish & Navigation

**Files:**
- Modify: `app/page.tsx`
- Modify: `components/CommandPalette.tsx`

- [ ] **Step 1: Add Link to Studio in the Command Palette (or a hidden footer link)**

```tsx
// components/CommandPalette.tsx (Add Studio link)
```

- [ ] **Step 2: Commit task**

```bash
git add components/CommandPalette.tsx
git commit -m "feat: add access point to the Studio"
```
