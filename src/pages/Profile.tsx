import { useAuth } from "@/hooks/useAuth";
import { getDemoData } from "@/lib/demo-data";
import { useNavigate } from "react-router";
import {
  Cloud, RotateCcw, LogOut, Map, FolderTree,
  FileText, ChevronRight, User,
} from "lucide-react";

const roleConfig: Record<string, { label: string; color: string }> = {
  directeur: { label: "Directeur", color: "#DC2626" },
  responsable: { label: "Responsable", color: "#7C3AED" },
  commercial: { label: "Commercial", color: "#059669" },
};

function getInitials(name: string): string {
  return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

export default function Profile() {
  const { user, logout, isDemo } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return <div className="text-center py-12 text-gray-500">Veuillez vous connecter pour voir votre profil.</div>;
  }

  const config = roleConfig[user.role] ?? roleConfig.commercial;
  const initials = getInitials(user.name ?? "Utilisateur");

  const demoData = getDemoData();
  const userProjects = demoData.projects.filter((p) => {
    if (user.role === "directeur") return true;
    if (user.role === "responsable") return p.team === (user.teamId ?? 0);
    return p.ownerId === user.id;
  });
  const userFiles = demoData.files.filter((f) => {
    const p = demoData.projects.find((pr) => pr.id === f.projectId);
    return p && userProjects.includes(p);
  });

  const handleResetDemo = () => {
    localStorage.removeItem("carto_demo_data");
    localStorage.removeItem("auth_token");
    window.location.href = "/";
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mon Profil</h1>
        <p className="text-sm text-gray-500 mt-1">Vos informations et parametres de compte</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold text-white shadow-sm" style={{ background: config.color }}>
            {initials}
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">{user.name}</h2>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-500 mb-1">Role</div>
            <div className="text-sm font-semibold text-gray-900">{config.label}{user.teamId ? ` - Eq.${user.teamId}` : ""}</div>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-500 mb-1">Equipe</div>
            <div className="text-sm font-semibold text-gray-900">{user.teamId ? `Equipe ${user.teamId}` : "Direction"}</div>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-500 mb-1">Projets</div>
            <div className="text-sm font-semibold text-gray-900">{userProjects.length}</div>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-xs text-gray-500 mb-1">Fichiers</div>
            <div className="text-sm font-semibold text-gray-900">{userFiles.length}</div>
          </div>
        </div>
      </div>

      {/* Demo Mode Card */}
      {isDemo && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Cloud size={16} className="text-blue-500" /> Mode Demo
          </h3>
          <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg mb-4">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm text-emerald-700 font-medium">Mode demo active — Donnees locales</span>
          </div>
          <div className="text-xs text-gray-600 space-y-1.5 leading-relaxed">
            <p><strong>Type:</strong> Simulation sans serveur</p>
            <p><strong>Donnees:</strong> Entreprises, Projets, Fichiers, Membres</p>
            <p><strong>Stockage:</strong> localStorage (navigateur)</p>
          </div>
        </div>
      )}

      {/* Quick Links */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <ChevronRight size={16} className="text-[#1E3A5F]" /> Acces rapide
        </h3>
        <div className="space-y-2">
          <button onClick={() => navigate("/", { state: { view: "explorer" } })} className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center"><FolderTree size={18} className="text-blue-600" /></div>
            <div className="flex-1"><div className="text-sm font-medium text-gray-900">Explorateur de Dossiers</div><div className="text-xs text-gray-500">{demoData.companies.length} entreprises, {demoData.projects.length} projets</div></div>
            <ChevronRight size={16} className="text-gray-400" />
          </button>
          <button onClick={() => navigate("/", { state: { view: "flowchart" } })} className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center"><Map size={18} className="text-amber-600" /></div>
            <div className="flex-1"><div className="text-sm font-medium text-gray-900">Processus Commercial</div><div className="text-xs text-gray-500">14 etapes du workflow</div></div>
            <ChevronRight size={16} className="text-gray-400" />
          </button>
          <button onClick={() => navigate("/team")} className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center"><User size={18} className="text-purple-600" /></div>
            <div className="flex-1"><div className="text-sm font-medium text-gray-900">Equipe & Permissions</div><div className="text-xs text-gray-500">7 membres, 2 equipes</div></div>
            <ChevronRight size={16} className="text-gray-400" />
          </button>
        </div>
      </div>

      {/* Settings */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FileText size={16} className="text-gray-500" /> Parametres
        </h3>
        <div className="space-y-2">
          {isDemo && (
            <button onClick={handleResetDemo} className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 transition-colors text-left group">
              <RotateCcw size={18} className="text-gray-500 group-hover:text-red-500 transition-colors" />
              <span className="text-sm text-gray-700 group-hover:text-red-600 transition-colors">Reinitialiser les donnees de demo</span>
            </button>
          )}
          <button onClick={() => logout()} className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-red-50 transition-colors text-left group">
            <LogOut size={18} className="text-gray-500 group-hover:text-red-500 transition-colors" />
            <span className="text-sm text-gray-700 group-hover:text-red-600 transition-colors">Se deconnecter</span>
          </button>
        </div>
      </div>
    </div>
  );
}
