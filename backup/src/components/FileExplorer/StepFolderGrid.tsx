import type { FlowNode, Project, ProjectFile, Company } from '@/types';
import { flowNodes, getUniqueFolders } from '@/data/flowData';
import {
  FolderOpen, FileText, ArrowLeft, ChevronRight,
  Inbox, Search, FileEdit, Ruler, ClipboardList,
  Settings, Truck, Calculator,
  Handshake, SearchX, Archive, CheckCircle,
  Users, ArrowRightCircle, BarChart3, TrendingUp,
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  inbox: Inbox, search: Search, 'file-text': FileText, ruler: Ruler,
  'clipboard-list': ClipboardList, settings: Settings, truck: Truck,
  calculator: Calculator, 'file-edit': FileEdit, handshake: Handshake,
  'search-x': SearchX, archive: Archive, 'check-circle': CheckCircle,
  users: Users, 'arrow-right-circle': ArrowRightCircle,
  'bar-chart-3': BarChart3, 'trending-up': TrendingUp,
};

interface StepFolderGridProps {
  company: Company;
  project: Project;
  files: ProjectFile[];
  stepFilesCount: (projectId: string, stepId: string) => number;
  onSelectStep: (step: FlowNode) => void;
  onBack: () => void;
}

export default function StepFolderGrid({
  company,
  project,
  files,
  stepFilesCount,
  onSelectStep,
  onBack,
}: StepFolderGridProps) {
  const uniqueFolders = getUniqueFolders();

  // Get steps for each folder
  const getStepsForFolder = (folderName: string): FlowNode[] => {
    return flowNodes.filter(n => n.folderName === folderName && n.type !== 'branch');
  };

  // Count files per folder
  const getFolderFileCount = (folderName: string): number => {
    const stepIds = flowNodes
      .filter(n => n.folderName === folderName)
      .map(n => n.id);
    return files.filter(f => stepIds.includes(f.stepId)).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors w-fit"
        >
          <ArrowLeft size={16} />
          Retour
        </button>
        <div className="h-5 w-px bg-gray-200 hidden sm:block" />
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: company.color }} />
          <span className="truncate max-w-[120px]">{company.name}</span>
          <ChevronRight size={14} />
          <span className="font-mono font-bold text-[#1E3A5F] text-xs">{project.code}</span>
          <ChevronRight size={14} />
          <span className="text-gray-900 font-medium truncate max-w-[200px]">{project.name}</span>
        </div>
      </div>

      {/* Project info */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#1E3A5F]/10 flex items-center justify-center">
            <FolderOpen size={24} className="text-[#1E3A5F]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-[#1E3A5F]">{project.code}</span>
              <h2 className="text-base font-semibold text-gray-900">{project.name}</h2>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              {files.length} fichier{files.length > 1 ? 's' : ''} réparti{files.length > 1 ? 's' : ''} sur {uniqueFolders.length} dossiers
            </p>
          </div>
        </div>
      </div>

      {/* Folder groups */}
      <div className="space-y-6">
        {uniqueFolders.map((folderName) => {
          const steps = getStepsForFolder(folderName);
          const folderCount = getFolderFileCount(folderName);

          return (
            <div key={folderName} className="space-y-3">
              {/* Folder header */}
              <div className="flex items-center gap-2">
                <FolderOpen size={18} className="text-amber-500" />
                <h4 className="font-semibold text-sm text-gray-800">{folderName}</h4>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                  {folderCount} fichier{folderCount > 1 ? 's' : ''}
                </span>
              </div>

              {/* Step cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pl-6">
                {steps.map((step) => {
                  const Icon = step.icon ? iconMap[step.icon] : FileText;
                  const count = stepFilesCount(project.id, step.id);

                  return (
                    <button
                      key={step.id}
                      onClick={() => onSelectStep(step)}
                      className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-[#1E3A5F] hover:shadow-sm transition-all duration-200 text-left group"
                    >
                      <div className={`
                        w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0
                        ${step.type === 'start' ? 'bg-[#1E3A5F] text-white' : ''}
                        ${step.type === 'step' ? 'bg-gray-100 text-gray-600 group-hover:bg-[#1E3A5F]/10 group-hover:text-[#1E3A5F]' : ''}
                        ${step.type === 'decision' ? 'bg-red-50 text-red-500' : ''}
                        ${step.type === 'parallel' ? 'bg-blue-50 text-blue-600' : ''}
                        ${step.type === 'end' ? 'bg-green-50 text-green-600' : ''}
                      `}>
                        <Icon size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">
                          {step.step}. {step.title}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {count} fichier{count > 1 ? 's' : ''}
                        </p>
                      </div>
                      <ChevronRight size={14} className="text-gray-300 group-hover:text-gray-500 flex-shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
