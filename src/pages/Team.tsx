import { useAuth } from "@/hooks/useAuth";
import { getDemoData } from "@/lib/demo-data";
import {
  Shield, Eye, Edit, Share, Trash2, UserPlus, Lock,
  Users, ChevronRight, User,
} from "lucide-react";

const TEAM_USERS = [
  { id: 1, name: "Karim Benali", email: "k.benali@entreprise.ma", role: "directeur", team: null, avatar: "KB", color: "#DC2626", bg: "#fef2f2" },
  { id: 2, name: "Sara El Amrani", email: "s.elamrani@entreprise.ma", role: "responsable", team: 1, avatar: "SE", color: "#7C3AED", bg: "#ede9fe" },
  { id: 3, name: "Youssef Idrissi", email: "y.idrissi@entreprise.ma", role: "responsable", team: 2, avatar: "YI", color: "#7C3AED", bg: "#ede9fe" },
  { id: 4, name: "Fatima Zahra", email: "f.zahra@entreprise.ma", role: "commercial", team: 1, avatar: "FZ", color: "#059669", bg: "#d1fae5" },
  { id: 5, name: "Omar Farouk", email: "o.farouk@entreprise.ma", role: "commercial", team: 1, avatar: "OF", color: "#059669", bg: "#d1fae5" },
  { id: 6, name: "Laila Bennani", email: "l.bennani@entreprise.ma", role: "commercial", team: 2, avatar: "LB", color: "#059669", bg: "#d1fae5" },
  { id: 7, name: "Hassan Moussaoui", email: "h.moussaoui@entreprise.ma", role: "commercial", team: 2, avatar: "HM", color: "#059669", bg: "#d1fae5" },
];

const roleLabels: Record<string, string> = {
  directeur: "Directeur",
  responsable: "Responsable",
  commercial: "Commercial",
};

interface Permission {
  icon: typeof Eye;
  text: string;
  color: string;
}

function getPermissions(userRole: string, team: number | null): Permission[] {
  if (userRole === "directeur") {
    return [
      { icon: Eye, text: "Visualiser TOUS les projets des 2 equipes", color: "#16a34a" },
      { icon: Edit, text: "Modifier sur autorisation du proprietaire", color: "#d97706" },
      { icon: Share, text: "Partager des projets avec les membres", color: "#2563eb" },
      { icon: Trash2, text: "Supprimer tout projet", color: "#dc2626" },
    ];
  } else if (userRole === "responsable") {
    return [
      { icon: Eye, text: `Visualiser les projets de l'Equipe ${team}`, color: "#16a34a" },
      { icon: Edit, text: "Modifier les projets de votre equipe", color: "#16a34a" },
      { icon: UserPlus, text: "Gerer les membres de votre equipe", color: "#2563eb" },
      { icon: Share, text: "Partager des projets avec votre equipe", color: "#2563eb" },
    ];
  } else {
    return [
      { icon: Eye, text: "Visualiser vos projets uniquement", color: "#16a34a" },
      { icon: Edit, text: "Modifier vos propres projets", color: "#16a34a" },
      { icon: Share, text: "Partager vos projets (si owner)", color: "#2563eb" },
      { icon: Lock, text: "Ne PAS visualiser les projets des autres", color: "#9ca3af" },
    ];
  }
}

export default function Team() {
  const { user } = useAuth();
  const userRole = user?.role ?? "commercial";
  const userTeam = user?.teamId ?? null;

  const permissions = getPermissions(userRole, userTeam);

  const demoData = getDemoData();
  const allProjects = demoData.projects;
  const visibleProjects = userRole === "directeur"
    ? allProjects
    : userRole === "responsable"
      ? allProjects.filter((p) => p.team === userTeam)
      : allProjects.filter((p) => p.ownerId === user?.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Equipe & Permissions</h1>
        <p className="text-sm text-gray-500 mt-1">
          Organisation du service commercial et gestion des acces
        </p>
      </div>

      {/* Org Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Users size={16} className="text-[#1E3A5F]" />
          Organisation du Service Commercial
        </h2>

        <div className="flex flex-col items-center gap-4">
          {/* Directeur */}
          {(() => {
            const dir = TEAM_USERS.find((u) => u.role === "directeur");
            if (!dir) return null;
            return (
              <div className="flex flex-col items-center">
                <div className="px-6 py-3 rounded-xl text-white font-semibold text-sm text-center shadow-sm" style={{ background: "#DC2626" }}>
                  Directeur Commercial<br />
                  <span className="text-xs font-normal opacity-80">{dir.name}</span>
                </div>
                <div className="w-px h-6 bg-gray-300" />
                <div className="w-32 h-px bg-gray-300" />
              </div>
            );
          })()}

          {/* Two Teams */}
          <div className="flex gap-16">
            {[1, 2].map((teamNum) => {
              const resp = TEAM_USERS.find((u) => u.role === "responsable" && u.team === teamNum);
              const members = TEAM_USERS.filter((u) => u.role === "commercial" && u.team === teamNum);
              return (
                <div key={teamNum} className="flex flex-col items-center gap-3">
                  <div className="w-px h-4 bg-gray-300" />
                  {resp && (
                    <>
                      <div className="px-5 py-2.5 rounded-xl text-white font-semibold text-sm text-center shadow-sm" style={{ background: "#7C3AED" }}>
                        Responsable Eq.{teamNum}<br />
                        <span className="text-xs font-normal opacity-80">{resp.name}</span>
                      </div>
                      <div className="w-px h-4 bg-gray-300" />
                    </>
                  )}
                  <div className="flex flex-col gap-2">
                    {members.map((m) => (
                      <div key={m.id} className="px-4 py-2 rounded-lg text-xs font-medium text-center border border-gray-200 bg-gray-50 text-gray-700 min-w-[140px]">
                        {m.name}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-3">
            <Users size={20} className="text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{TEAM_USERS.length}</div>
          <div className="text-xs text-gray-500 mt-1">Membres</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center mb-3">
            <Shield size={20} className="text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{TEAM_USERS.filter((u) => u.role === "responsable").length}</div>
          <div className="text-xs text-gray-500 mt-1">Responsables</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center mb-3">
            <User size={20} className="text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{TEAM_USERS.filter((u) => u.role === "commercial").length}</div>
          <div className="text-xs text-gray-500 mt-1">Commerciaux</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center mb-3">
            <Eye size={20} className="text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{visibleProjects.length}</div>
          <div className="text-xs text-gray-500 mt-1">Projets visibles</div>
        </div>
      </div>

      {/* Permissions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Shield size={16} className="text-[#1E3A5F]" />
          Vos permissions ({roleLabels[userRole]})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {permissions.map((p, i) => {
            const Icon = p.icon;
            return (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: p.color + "15", color: p.color }}>
                  <Icon size={14} />
                </div>
                <span className="text-xs text-gray-700 leading-relaxed">{p.text}</span>
              </div>
            );
n          })}
        </div>
      </div>

      {/* Members List */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Users size={16} className="text-[#1E3A5F]" />
          Membres de l&apos;equipe
        </h2>
        <div className="space-y-2">
          {TEAM_USERS.map((u) => {
            const isMe = u.id === user?.id;
            const roleLabel = roleLabels[u.role];
            const canShare = (userRole === "responsable" && u.team === userTeam && u.role === "commercial") || userRole === "directeur";
            return (
              <div key={u.id} className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${isMe ? "border border-emerald-300 bg-emerald-50" : "border border-gray-100 hover:bg-gray-50"}`}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ background: u.color }}>
                  {u.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-900">
                    {u.name}{isMe && <span className="ml-2 text-xs font-normal text-emerald-600">(Vous)</span>}
                  </div>
                  <div className="text-xs text-gray-500">{roleLabel}{u.team ? ` - Equipe ${u.team}` : ""}</div>
                </div>
                {canShare && !isMe && (
                  <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1E3A5F] text-white text-xs font-medium rounded-lg hover:bg-[#152D4A] transition-colors">
                    <Share size={12} /> Partager
                  </button>
                )}
                {isMe && <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium"><ChevronRight size={12} /> Connecte</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
