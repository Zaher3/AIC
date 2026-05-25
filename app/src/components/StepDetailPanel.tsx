import type { FlowNode } from '@/types';
import {
  X, FolderOpen, ChevronRight, FileText,
} from 'lucide-react';

interface StepDetailPanelProps {
  step: FlowNode | null;
  onClose: () => void;
}

const getStepColor = (type: string) => {
  switch (type) {
    case 'start': return 'bg-[#1E3A5F] text-white';
    case 'decision': return 'bg-red-50 text-red-700 border border-red-200';
    case 'parallel': return 'bg-blue-50 text-blue-700 border border-blue-200';
    case 'end': return 'bg-green-50 text-green-700 border border-green-200';
    default: return 'bg-gray-100 text-gray-700 border border-gray-200';
  }
};

const getTypeLabel = (type: string) => {
  switch (type) {
    case 'start': return 'Debut';
    case 'decision': return 'Decision';
    case 'parallel': return 'Processus parallele';
    case 'step': return 'Etape';
    case 'branch': return 'Branche';
    case 'end': return 'Fin';
    default: return type;
  }
};

export default function StepDetailPanel({ step, onClose }: StepDetailPanelProps) {
  if (!step) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white border-l border-gray-200 z-50 overflow-y-auto shadow-xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="sticky top-0 bg-white z-10 border-b border-gray-100 px-6 py-4">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>

          <div className="flex items-center gap-2 mb-3">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${getStepColor(step.type)}`}>
              Etape {step.step}
            </span>
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">
              {getTypeLabel(step.type)}
            </span>
          </div>

          <h2 className="text-lg font-semibold text-gray-900 pr-8">{step.title}</h2>

          {/* Folder badge */}
          <div className="mt-2">
            <span className="text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
              📁 {step.folderName}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-5 space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-2 flex items-center gap-2">
              <FolderOpen size={16} className="text-gray-500" />
              Description
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
          </div>

          {/* Action items */}
          {step.details && step.details.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                <ChevronRight size={16} className="text-gray-500" />
                Actions a realiser
              </h3>
              <ul className="space-y-2">
                {step.details.map((detail, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-gray-700">
                    <span className="w-5 h-5 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{detail}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Document types expected */}
          {step.documentTypes && step.documentTypes.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3 flex items-center gap-2">
                <FileText size={16} className="text-gray-500" />
                Documents attendus
              </h3>
              <div className="flex flex-wrap gap-2">
                {step.documentTypes.map((doc, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 font-medium"
                  >
                    {doc}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Branches info for decision nodes */}
          {step.branches && step.branches.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">
                Branches possibles
              </h3>
              <div className="flex gap-3">
                {step.branches.map((branch, idx) => (
                  <div
                    key={idx}
                    className="flex-1 p-3 rounded-lg text-center text-sm font-medium"
                    style={{
                      backgroundColor: branch.color ? `${branch.color}15` : '#F9FAFB',
                      border: `1px solid ${branch.color ? `${branch.color}30` : '#E5E7EB'}`,
                      color: branch.color || '#6B7280',
                    }}
                  >
                    {branch.label}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
