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
