// components/studio/SortableGridItem.tsx
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GridItem } from '@/types/lobby';
import { WIDGET_REGISTRY } from '@/components/registry';

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
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });
  const Widget = WIDGET_REGISTRY[item.type];

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
      className={`${spanClasses[item.size]} relative group`}
    >
      {/* Real Widget Rendering */}
      <div className={`w-full h-full overflow-hidden pointer-events-none rounded-3xl border-2 transition-all ${isSelected ? 'border-blue-500 ring-4 ring-blue-500/20' : 'border-transparent'}`}>
        {Widget ? (
          <Widget 
            size={item.size} 
            projectId={item.projectId} 
            platform={item.platform} 
          />
        ) : (
          <div className="w-full h-full bg-zinc-900 border border-zinc-800 flex items-center justify-center">
            <span className="text-[10px] text-zinc-500 uppercase font-black">{item.type}</span>
          </div>
        )}
      </div>

      {/* Interaction Overlay (Selection) */}
      <div 
        onClick={(e) => {
          e.stopPropagation();
          onSelect(item.id);
        }}
        className="absolute inset-0 z-10 cursor-pointer"
      />

      {/* Drag Handle */}
      <div 
        {...attributes} 
        {...listeners} 
        className="absolute top-4 right-4 w-8 h-8 bg-black/50 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing z-20 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <div className="grid grid-cols-2 gap-0.5">
          {[1,2,3,4].map(i => <div key={i} className="w-1 h-1 bg-white/50 rounded-full" />)}
        </div>
      </div>

      {/* Size Badge */}
      <div className="absolute bottom-4 left-4 z-20">
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onResize(item.id);
          }}
          className="px-3 py-1 bg-black/50 backdrop-blur-md border border-white/10 text-[10px] font-black rounded-full hover:bg-blue-600 transition-colors"
        >
          {item.size.toUpperCase()}
        </button>
      </div>
    </div>
  );
}
