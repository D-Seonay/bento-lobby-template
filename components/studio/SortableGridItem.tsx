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
