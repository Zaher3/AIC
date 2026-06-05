import { ChevronRight, Home, Building2, FolderKanban, FolderOpen } from 'lucide-react';
import type { BreadcrumbItem } from '@/types';

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  onNavigate: (index: number) => void;
}

const iconMap: Record<string, React.ElementType> = {
  root: Home,
  company: Building2,
  project: FolderKanban,
  step: FolderOpen,
};

export default function Breadcrumb({ items, onNavigate }: BreadcrumbProps) {
  return (
    <nav className="flex items-center gap-1 text-sm">
      {items.map((item, index) => {
        const Icon = iconMap[item.type];
        const isLast = index === items.length - 1;

        return (
          <div key={item.id} className="flex items-center gap-1">
            {index > 0 && <ChevronRight size={14} className="text-gray-400 mx-0.5" />}
            <button
              onClick={() => onNavigate(index)}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-md transition-all duration-200
                ${isLast
                  ? 'bg-gray-100 text-gray-900 font-semibold cursor-default'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }
              `}
              disabled={isLast}
            >
              {Icon && <Icon size={14} className={isLast ? 'text-gray-700' : 'text-gray-400'} />}
              <span className="truncate max-w-[200px]">{item.label}</span>
            </button>
          </div>
        );
      })}
    </nav>
  );
}
