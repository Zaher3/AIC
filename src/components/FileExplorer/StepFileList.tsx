import { useState, useRef, useCallback } from "react";
import type { FlowNode } from "@/types";
import {
  ArrowLeft, ChevronRight, Upload, FileText, FileSpreadsheet,
  FileImage, File, Trash2, FolderOpen, Lock,
} from "lucide-react";

interface CompanyItem {
  id: number;
  name: string;
  notes: string | null;
  color: string;
}

interface ProjectItem {
  id: number;
  code: string;
  name: string;
  companyId: number;
  status: string;
  notes: string | null;
}

interface FileItem {
  id: number;
  projectId: number;
  stepId: string;
  name: string;
  fileType: string;
  size: string | null;
  date: string | null;
}

interface StepFileListProps {
  company: CompanyItem;
  project: ProjectItem;
  step: FlowNode;
  files: FileItem[];
  onBack: () => void;
  onAddFile: (projectId: number, stepId: string, name: string, type: string, size: string) => void;
  onDeleteFile: (id: number) => void;
  userRole: string;
}

const fileTypeIcon = (type: string) => {
  switch (type) {
    case "pdf": return <FileText size={20} className="text-red-500" />;
    case "doc": return <FileText size={20} className="text-blue-500" />;
    case "xls": return <FileSpreadsheet size={20} className="text-green-600" />;
    case "image": return <FileImage size={20} className="text-purple-500" />;
    default: return <File size={20} className="text-gray-500" />;
  }
};

const fileTypeFromName = (name: string): string => {
  const ext = name.split(".").pop()?.toLowerCase();
  if (ext === "pdf") return "pdf";
  if (["doc", "docx"].includes(ext ?? "")) return "doc";
  if (["xls", "xlsx", "csv"].includes(ext ?? "")) return "xls";
  if (["jpg", "jpeg", "png", "gif"].includes(ext ?? "")) return "image";
  return "other";
};

export default function StepFileList({ company, project, step, files, onBack, onAddFile, onDeleteFile, userRole }: StepFileListProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  // Determine edit access based on role
  const canEdit = userRole === "admin" || userRole === "commercial" || userRole === "directeur";

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    if (!fileList) return;
    Array.from(fileList).forEach((file) => {
      const size = file.size > 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : `${(file.size / 1024).toFixed(0)} KB`;
      onAddFile(project.id, step.id, file.name, fileTypeFromName(file.name), size);
    });
    e.target.value = "";
  }, [project.id, step.id, onAddFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => { e.preventDefault(); setDragOver(true); }, []);
  const handleDragLeave = useCallback((e: React.DragEvent) => { e.preventDefault(); setDragOver(false); }, []);
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const fileList = e.dataTransfer.files;
    Array.from(fileList).forEach((file) => {
      const size = file.size > 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : `${(file.size / 1024).toFixed(0)} KB`;
      onAddFile(project.id, step.id, file.name, fileTypeFromName(file.name), size);
    });
  }, [project.id, step.id, onAddFile]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <button onClick={onBack} className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors w-fit">
          <ArrowLeft size={16} />
          Retour
        </button>
        <div className="h-5 w-px bg-gray-200 hidden sm:block" />
        <div className="flex items-center gap-1.5 text-sm text-gray-500 flex-wrap">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: company.color }} />
          <span className="truncate max-w-[100px]">{company.name}</span>
          <ChevronRight size={14} />
          <span className="font-mono font-bold text-[#1E3A5F] text-xs">{project.code}</span>
          <ChevronRight size={14} />
          <span className="text-gray-900 font-medium">{step.title}</span>
        </div>
      </div>

      {/* Step info */}
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#1E3A5F] flex items-center justify-center flex-shrink-0">
            <FolderOpen size={24} className="text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-gray-500 bg-white border border-gray-200 px-2 py-0.5 rounded-full">Etape {step.step}</span>
              <span className="text-xs font-semibold text-gray-500 bg-white border border-gray-200 px-2 py-0.5 rounded-full">{step.type === "start" ? "Debut" : step.type === "step" ? "Etape" : step.type === "decision" ? "Decision" : step.type === "parallel" ? "Parallele" : "Fin"}</span>
              <span className="text-xs font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">{step.folderName}</span>
            </div>
            <h2 className="text-base font-semibold text-gray-900 mt-2">{step.title}</h2>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">{step.description}</p>
          </div>
        </div>
        {step.documentTypes && step.documentTypes.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-2">Documents attendus pour cette etape :</p>
            <div className="flex flex-wrap gap-1.5">
              {step.documentTypes.map((doc, idx) => (
                <span key={idx} className="text-xs px-2 py-0.5 bg-blue-50 text-blue-600 border border-blue-200 rounded-md">{doc}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Actions list */}
      {step.details && step.details.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2"><ChevronRight size={16} className="text-gray-400" />Actions a realiser</h4>
          <ul className="space-y-1.5 pl-6">
            {step.details.map((detail, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-gray-600"><span className="w-5 h-5 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-xs font-bold flex-shrink-0">{idx + 1}</span>{detail}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Upload zone - only if can edit */}
      {canEdit ? (
        <div>
          <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2"><Upload size={16} className="text-gray-400" />Documents <span className="text-xs font-normal text-gray-400">({files.length})</span></h4>
          <div onClick={() => fileInputRef.current?.click()} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop} className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${dragOver ? "border-green-400 bg-green-50" : "border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100"}`}>
            <Upload size={24} className={`mx-auto mb-2 ${dragOver ? "text-green-500" : "text-gray-400"}`} />
            <p className="text-sm text-gray-600 font-medium">{dragOver ? "Deposez les fichiers ici" : "Cliquez ou deposez des fichiers"}</p>
            <p className="text-xs text-gray-400 mt-1">PDF, Word, Excel, Images</p>
            <input ref={fileInputRef} type="file" multiple className="hidden" onChange={handleFileSelect} accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.jpg,.jpeg,.png,.gif" />
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center gap-3">
          <Lock size={20} className="text-gray-400" />
          <div>
            <p className="text-sm text-gray-600 font-medium">Acces en lecture seule</p>
            <p className="text-xs text-gray-400">Vous ne pouvez pas ajouter ou modifier les fichiers sur ce projet.</p>
          </div>
        </div>
      )}

      {/* Files list */}
      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file) => (
            <div key={file.id} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors group">
              {fileTypeIcon(file.fileType)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
                <p className="text-xs text-gray-400">{file.size ?? ""} {file.date ? `· ${file.date}` : ""}</p>
              </div>
              {canEdit && (
                <button onClick={() => onDeleteFile(file.id)} className="p-1.5 rounded-md hover:bg-red-100 text-gray-400 hover:text-red-600 transition-colors opacity-0 group-hover:opacity-100" title="Supprimer">
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
