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
