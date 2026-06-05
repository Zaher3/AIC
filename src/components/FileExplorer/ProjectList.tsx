import { useState } from "react";
import { FolderKanban, FileText, Plus, Trash2, ArrowLeft, CheckCircle, XCircle, Clock } from "lucide-react";

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

const statusConfig: Record<string, { label: string; icon: typeof Clock; color: string }> = {
  active: { label: "En cours", icon: Clock, color: "text-blue-600 bg-blue-50 border-blue-200" },
  won: { label: "Gagne", icon: CheckCircle, color: "text-green-600 bg-green-50 border-green-200" },
  lost: { label: "Perdu", icon: XCircle, color: "text-red-600 bg-red-50 border-red-200" },
  archived: { label: "Archive", icon: Clock, color: "text-gray-600 bg-gray-100 border-gray-300" },
};

interface ProjectListProps {
  company: CompanyItem;
  projects: ProjectItem[];
  onSelectProject: (project: ProjectItem) => void;
  onBack: () => void;
  onAddProject: (companyId: number, code: string, name: string, notes: string) => void;
  onDeleteProject: (id: number) => void;
  userRole: string;
}

export default function ProjectList({
  company,
  projects,
  onSelectProject,
  onBack,
  onAddProject,
  onDeleteProject,
}: ProjectListProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCode, setNewCode] = useState("");
  const [newName, setNewName] = useState("");
  const [newNotes, setNewNotes] = useState("");

  const handleAdd = () => {
    if (newCode.trim() && newName.trim()) {
      onAddProject(company.id, newCode.trim(), newName.trim(), newNotes.trim());
      setNewCode("");
      setNewName("");
      setNewNotes("");
      setShowAddForm(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors w-fit">
          <ArrowLeft size={16} />
          Retour
        </button>
        <div className="h-5 w-px bg-gray-200" />
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: company.color }} />
          <span className="text-sm font-medium text-gray-900">{company.name}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <FolderKanban size={20} className="text-gray-500" />
          Projets
          <span className="text-sm font-normal text-gray-400 ml-1">({projects.length})</span>
        </h3>
        <button onClick={() => setShowAddForm(!showAddForm)} className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-[#1E3A5F] rounded-lg hover:bg-[#152D4A] transition-colors">
          <Plus size={16} />
          Nouveau projet
        </button>
      </div>

      {showAddForm && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
          <div className="flex gap-3">
            <input type="text" placeholder="Code AIM (ex: AIM-2024-XXX)..." value={newCode} onChange={(e) => setNewCode(e.target.value)} className="w-1/3 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]" />
            <input type="text" placeholder="Nom du projet..." value={newName} onChange={(e) => setNewName(e.target.value)} className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]" />
          </div>
          <textarea placeholder="Notes (optionnel)..." value={newNotes} onChange={(e) => setNewNotes(e.target.value)} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] resize-none" />
          <div className="flex gap-2 justify-end">
            <button onClick={() => { setShowAddForm(false); setNewCode(""); setNewName(""); setNewNotes(""); }} className="px-3 py-1.5 text-sm text-gray-600">Annuler</button>
            <button onClick={handleAdd} className="px-4 py-1.5 text-sm font-medium text-white bg-[#1E3A5F] rounded-lg hover:bg-[#152D4A]">Creer</button>
          </div>
        </div>
      )}

      {projects.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <FolderKanban size={48} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm">Aucun projet pour cette entreprise</p>
          <p className="text-xs mt-1">Creez votre premier projet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((project) => {
            const status = statusConfig[project.status] ?? statusConfig.active;
            const StatusIcon = status.icon;

            return (
              <div key={project.id} className="group relative bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-gray-300 transition-all duration-200">
                <div onClick={() => onSelectProject(project)} className="cursor-pointer">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono font-bold text-[#1E3A5F] bg-[#1E3A5F]/10 px-2 py-0.5 rounded">{project.code}</span>
                        <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border ${status.color}`}>
                          <StatusIcon size={10} />
                          {status.label}
                        </span>
                      </div>
                      <h4 className="font-semibold text-gray-900 mt-1.5">{project.name}</h4>
                      {project.notes && <p className="text-xs text-gray-500 mt-1 line-clamp-1">{project.notes}</p>}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-gray-400 flex items-center gap-1"><FileText size={12} /> Fichiers</span>
                  </div>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); onDeleteProject(project.id); }}
                  className="absolute top-3 right-3 p-1.5 rounded-md hover:bg-red-50 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                  title="Supprimer"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
