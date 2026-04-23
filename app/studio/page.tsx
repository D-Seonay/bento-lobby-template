'use client';

import { useState } from 'react';
import lobbyConfig from '@/content/lobby.json';
import projectsData from '@/content/projects.json';
import { LobbyConfig, GridItem, Theme, Profile } from '@/types/lobby';
import { Project } from '@/types/project';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { saveStudioConfig, addNewProject } from './actions';
import { SortableGridItem } from '@/components/studio/SortableGridItem';
import { StudioSidebar } from './StudioSidebar';
import { ThemeConfiguration } from '@/components/ThemeConfiguration';

export default function StudioPage() {
  const [grid, setGrid] = useState<GridItem[]>((lobbyConfig as LobbyConfig).grid);
  const [theme, setTheme] = useState<Theme>((lobbyConfig as LobbyConfig).theme);
  const [profile, setProfile] = useState<Profile>((lobbyConfig as LobbyConfig).profile);
  const [projects, setProjects] = useState<Project[]>(projectsData as Project[]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleSave = async () => {
    await saveStudioConfig({ grid, theme, profile });
    alert('Configuration saved!');
  };

  const handleAddProject = async (project: Project) => {
    await addNewProject(project);
    setProjects([...projects, project]);
  };

  const addWidget = (type: string, size: GridItem['size'] = 'small') => {
    const newId = `${type}-${Date.now()}`;
    const newItem: GridItem = { id: newId, type, size };
    setGrid([...grid, newItem]);
    setSelectedId(newId);
  };

  const updateWidget = (id: string, data: Partial<GridItem>) => {
    setGrid(grid.map(item => item.id === id ? { ...item, ...data } : item));
  };

  const updateTheme = (data: Partial<Theme>) => {
    setTheme({ ...theme, ...data });
  };

  const updateProfile = (data: Partial<Profile>) => {
    setProfile({ ...profile, ...data });
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
      <ThemeConfiguration theme={theme} />
      <StudioSidebar 
        selectedItem={grid.find(i => i.id === selectedId) || null}
        theme={theme}
        profile={profile}
        projects={projects}
        onAdd={addWidget}
        onUpdate={updateWidget}
        onUpdateTheme={updateTheme}
        onUpdateProfile={updateProfile}
        onAddProject={handleAddProject}
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
             <div className="grid grid-cols-6 auto-rows-[120px] gap-4 min-h-[400px] border-2 border-dashed border-zinc-800 rounded-3xl p-4 transition-colors hover:border-zinc-700">
               {grid.length > 0 ? (
                 grid.map(item => (
                   <SortableGridItem 
                     key={item.id} 
                     item={item} 
                     onResize={handleResize}
                     isSelected={selectedId === item.id}
                     onSelect={setSelectedId}
                   />
                 ))
               ) : (
                 <div className="col-span-full flex flex-col items-center justify-center text-zinc-500 space-y-4">
                   <div className="w-12 h-12 rounded-full border-2 border-dashed border-zinc-800 flex items-center justify-center">
                     <span className="text-xl">+</span>
                   </div>
                   <div className="text-center">
                     <p className="text-xs font-black tracking-widest uppercase">Your grid is empty</p>
                     <p className="text-[10px] mt-1 opacity-60">Use the palette on the left to add your first widget</p>
                   </div>
                 </div>
               )}
             </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
