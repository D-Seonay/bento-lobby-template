'use client';

import { useState } from 'react';
import lobbyConfig from '@/content/lobby.json';
import { LobbyConfig, GridItem } from '@/types/lobby';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { saveStudioConfig } from './actions';
import { SortableGridItem } from '@/components/studio/SortableGridItem';
import { StudioSidebar } from './StudioSidebar';

export default function StudioPage() {
  const [grid, setGrid] = useState<GridItem[]>((lobbyConfig as LobbyConfig).grid);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSave = async () => {
    await saveStudioConfig(grid);
    alert('Configuration saved!');
  };

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

  return (
    <div className="flex h-screen bg-black text-white font-mono uppercase">
      <StudioSidebar 
        selectedItem={grid.find(i => i.id === selectedId) || null}
        onAdd={addWidget}
        onUpdate={updateWidget}
        onDelete={deleteWidget}
        onClose={() => setSelectedId(null)}
      />

      {/* Main Canvas */}
      <div className="flex-1 overflow-auto p-12">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-2xl font-black italic tracking-tighter">Bento Studio<span className="text-blue-500">_</span></h1>
          <button onClick={handleSave} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-xs font-black transition-colors">SAVE LOBBY</button>
        </div>
        
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={grid.map(i => i.id)}>
             <div className="grid grid-cols-6 auto-rows-[120px] gap-4">
               {grid.map(item => (
                 <SortableGridItem 
                   key={item.id} 
                   item={item} 
                   onResize={handleResize}
                   isSelected={selectedId === item.id}
                   onSelect={setSelectedId}
                 />
               ))}
             </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
