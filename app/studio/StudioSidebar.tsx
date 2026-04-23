'use client';

import { useState } from 'react';
import { GridItem, Theme, Profile } from '@/types/lobby';
import { Project } from '@/types/project';
import { WIDGET_REGISTRY } from '@/components/registry';
import * as Icons from 'lucide-react';

interface SidebarProps {
  selectedItem: GridItem | null;
  theme: Theme;
  profile: Profile;
  projects: Project[];
  onAdd: (type: string, size: GridItem['size']) => void;
  onUpdate: (id: string, data: Partial<GridItem>) => void;
  onUpdateTheme: (data: Partial<Theme>) => void;
  onUpdateProfile: (data: Partial<Profile>) => void;
  onAddProject: (project: Project) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export function StudioSidebar({ 
  selectedItem, 
  theme, 
  profile,
  projects, 
  onAdd, 
  onUpdate, 
  onUpdateTheme, 
  onUpdateProfile,
  onAddProject, 
  onDelete, 
  onClose 
}: SidebarProps) {
  const [activeTab, setActiveTab] = useState<'palette' | 'theme' | 'profile'>('palette');
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [showSizeModal, setShowSizeModal] = useState<{ type: string } | null>(null);
  
  const [newProject, setNewProject] = useState<Partial<Project>>({
    id: '', title: '', description: '', link: '', size: 'small', tags: [], icon: 'Globe', isLive: true
  });

  const widgetGroups = {
    'Core': ['bento', 'control-center', 'quick-access'],
    'Social': ['social', 'socials-wide', 'socials-big'],
    'Stats': ['github-graph', 'build-stats', 'tech-radar'],
    'Misc': ['moon-phase', 'wall-of-love']
  };

  const handleCreateProject = () => {
    if (!newProject.id || !newProject.title) return;
    onAddProject(newProject as Project);
    setShowAddProjectModal(false);
    setNewProject({ id: '', title: '', description: '', link: '', size: 'small', tags: [], icon: 'Globe', isLive: true });
  };

  const handleAddWidget = (size: GridItem['size']) => {
    if (showSizeModal) {
      onAdd(showSizeModal.type, size);
      setShowSizeModal(null);
    }
  };

  if (selectedItem) {
    return (
      <div className="w-80 border-r border-zinc-800 p-6 flex flex-col bg-zinc-950 relative">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xs font-black tracking-widest text-blue-500 uppercase">Edit Widget</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white">✕</button>
        </div>

        <div className="space-y-6 flex-1 overflow-y-auto pr-2">
          <div className="space-y-2">
            <label className="text-[10px] text-zinc-500 font-black">Widget ID</label>
            <input 
              className="w-full bg-zinc-900 border border-zinc-800 p-3 text-xs outline-none focus:border-blue-500 text-white font-mono"
              value={selectedItem.id}
              onChange={(e) => onUpdate(selectedItem.id, { id: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] text-zinc-500 font-black">Widget Type</label>
            <select 
              className="w-full bg-zinc-900 border border-zinc-800 p-3 text-xs outline-none focus:border-blue-500 appearance-none text-white"
              value={selectedItem.type}
              onChange={(e) => onUpdate(selectedItem.id, { type: e.target.value })}
            >
              {Object.keys(WIDGET_REGISTRY).map(type => <option key={type} value={type}>{type}</option>)}
            </select>
          </div>

          {selectedItem.type === 'bento' && (
             <div className="space-y-4 pt-4 border-t border-zinc-800">
              <div className="flex justify-between items-center">
                <label className="text-[10px] text-zinc-500 font-black">Linked Project</label>
                <button onClick={() => setShowAddProjectModal(true)} className="text-[8px] text-blue-500 hover:text-blue-400 font-black">+ NEW PROJECT</button>
              </div>
              <select 
                className="w-full bg-zinc-900 border border-zinc-800 p-3 text-xs outline-none focus:border-blue-500 appearance-none text-white"
                value={selectedItem.projectId || ''}
                onChange={(e) => onUpdate(selectedItem.id, { projectId: e.target.value })}
              >
                <option value="">Select a project...</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
              </select>
            </div>
          )}

          {(selectedItem.type === 'social' || selectedItem.type === 'socials-wide' || selectedItem.type === 'socials-big') && (
            <div className="space-y-2">
              <label className="text-[10px] text-zinc-500 font-black">Platform Reference</label>
              <select 
                className="w-full bg-zinc-900 border border-zinc-800 p-3 text-xs outline-none focus:border-blue-500 appearance-none text-white"
                value={selectedItem.platform || ''}
                onChange={(e) => onUpdate(selectedItem.id, { platform: e.target.value })}
              >
                <option value="github">GitHub</option>
                <option value="linkedin">LinkedIn</option>
                <option value="twitter">Twitter</option>
                <option value="mail">Mail</option>
              </select>
            </div>
          )}
        </div>

        <div className="mt-8 space-y-3">
          <button onClick={() => onDelete(selectedItem.id)} className="w-full py-3 bg-red-900/20 text-red-500 border border-red-900/50 hover:bg-red-900/40 text-[10px] font-black transition-all rounded-lg uppercase">Delete Widget</button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 border-r border-zinc-800 flex flex-col bg-zinc-950">
      {/* Tab Navigation */}
      <div className="flex border-b border-zinc-800">
        {(['palette', 'theme', 'profile'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-4 text-[9px] font-black tracking-widest uppercase transition-colors ${activeTab === tab ? 'text-blue-500 bg-zinc-900/50 border-b-2 border-blue-500' : 'text-zinc-500 hover:text-white'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-10">
        {activeTab === 'palette' && (
          <div className="space-y-8">
            {Object.entries(widgetGroups).map(([groupName, types]) => (
              <section key={groupName} className="space-y-4">
                <h3 className="text-[10px] font-black tracking-[0.2em] text-zinc-600 uppercase border-b border-zinc-800 pb-2">{groupName}</h3>
                <div className="grid grid-cols-1 gap-4">
                  {types.map(type => {
                    const Widget = WIDGET_REGISTRY[type];
                    return (
                      <div key={type} className="group space-y-2">
                        <div className="relative aspect-video w-full bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 group-hover:border-blue-500 transition-all duration-500">
                          <div className="absolute inset-0 scale-[0.4] origin-top-left w-[250%] h-[250%] pointer-events-none">
                            {Widget && <Widget size="small" />}
                          </div>
                        </div>
                        <button
                          onClick={() => setShowSizeModal({ type })}
                          className="w-full text-center py-2 bg-zinc-900/50 border border-zinc-800 hover:bg-blue-600 hover:border-blue-500 text-[9px] font-black transition-all rounded-lg uppercase"
                        >
                          + {type}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        )}

        {activeTab === 'theme' && (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] text-zinc-500 font-black">Accent Color</label>
              <div className="flex gap-2">
                <input type="color" className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded cursor-pointer" value={theme.primary} onChange={(e) => onUpdateTheme({ primary: e.target.value })} />
                <input className="flex-1 bg-zinc-900 border border-zinc-800 p-2 text-xs outline-none focus:border-blue-500 font-mono text-white" value={theme.primary} onChange={(e) => onUpdateTheme({ primary: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] text-zinc-500 font-black">Border Radius</label>
              <select className="w-full bg-zinc-900 border border-zinc-800 p-3 text-xs outline-none focus:border-blue-500 text-white" value={theme.radius} onChange={(e) => onUpdateTheme({ radius: e.target.value })}>
                <option value="0px">None</option>
                <option value="0.5rem">Small (8px)</option>
                <option value="1rem">Medium (16px)</option>
                <option value="1.5rem">Large (24px)</option>
                <option value="2rem">Full (32px)</option>
              </select>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-6">
            {(['name', 'jobTitle', 'url', 'company', 'bio'] as const).map(field => (
              <div key={field} className="space-y-2">
                <label className="text-[10px] text-zinc-500 font-black uppercase">{field.replace(/([A-Z])/g, ' $1')}</label>
                {field === 'bio' ? (
                  <textarea className="w-full bg-zinc-900 border border-zinc-800 p-3 text-xs outline-none focus:border-blue-500 text-white min-h-[80px]" value={profile[field] || ''} onChange={(e) => onUpdateProfile({ [field]: e.target.value })} />
                ) : (
                  <input className="w-full bg-zinc-900 border border-zinc-800 p-3 text-xs outline-none focus:border-blue-500 text-white" value={profile[field] || ''} onChange={(e) => onUpdateProfile({ [field]: e.target.value })} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Size Selection Modal */}
      {showSizeModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 p-4">
          <div className="bg-zinc-950 border border-zinc-800 w-full max-w-sm rounded-2xl p-8 space-y-6 shadow-2xl">
            <h3 className="text-sm font-black tracking-widest text-white uppercase text-center">Select Initial Size</h3>
            <div className="grid grid-cols-2 gap-3">
              {(['small', 'wide', 'big', 'xl'] as const).map(size => (
                <button key={size} onClick={() => handleAddWidget(size)} className="py-4 bg-zinc-900 border border-zinc-800 hover:border-blue-500 hover:text-blue-500 text-[10px] font-black uppercase transition-all rounded-xl">{size}</button>
              ))}
            </div>
            <button onClick={() => setShowSizeModal(null)} className="w-full py-3 text-zinc-500 text-[9px] font-black uppercase hover:text-white transition-colors">Cancel</button>
          </div>
        </div>
      )}

      {/* Add Project Modal (Reused) */}
      {showAddProjectModal && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-zinc-950 border border-zinc-800 w-full max-w-md rounded-2xl p-8 space-y-6 shadow-2xl">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-black tracking-widest text-white uppercase">Create New Project</h3>
              <button onClick={() => setShowAddProjectModal(false)} className="text-zinc-500 hover:text-white">✕</button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1 col-span-2">
                <label className="text-[9px] text-zinc-500 font-black uppercase">Project ID</label>
                <input className="w-full bg-zinc-900 border border-zinc-800 p-2.5 text-xs outline-none focus:border-blue-500 text-white font-mono" value={newProject.id} onChange={(e) => setNewProject({ ...newProject, id: e.target.value })} />
              </div>
              <div className="space-y-1 col-span-2">
                <label className="text-[9px] text-zinc-500 font-black uppercase">Title</label>
                <input className="w-full bg-zinc-900 border border-zinc-800 p-2.5 text-xs outline-none focus:border-blue-500 text-white" value={newProject.title} onChange={(e) => setNewProject({ ...newProject, title: e.target.value })} />
              </div>
              <div className="space-y-1 col-span-2">
                <label className="text-[9px] text-zinc-500 font-black uppercase">Description</label>
                <textarea className="w-full bg-zinc-900 border border-zinc-800 p-2.5 text-xs outline-none focus:border-blue-500 text-white min-h-[60px]" value={newProject.description} onChange={(e) => setNewProject({ ...newProject, description: e.target.value })} />
              </div>
              <div className="space-y-1 col-span-2">
                <label className="text-[9px] text-zinc-500 font-black uppercase">Link</label>
                <input className="w-full bg-zinc-900 border border-zinc-800 p-2.5 text-xs outline-none focus:border-blue-500 text-white" value={newProject.link} onChange={(e) => setNewProject({ ...newProject, link: e.target.value })} />
              </div>
            </div>
            <button onClick={handleCreateProject} className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all">REGISTER PROJECT</button>
          </div>
        </div>
      )}
    </div>
  );
}
