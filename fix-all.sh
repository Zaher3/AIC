#!/bin/bash
cd /workspaces/AIC

# === 1. Team.tsx ===
cat > src/pages/Team.tsx << 'EOF1'
import { useAuth } from "@/hooks/useAuth";
import { getDemoData } from "@/lib/demo-data";
import { Shield, Eye, Edit, Share, Trash2, UserPlus, Lock, Users, ChevronRight, User } from "lucide-react";

const TEAM_USERS = [
  { id: 1, name: "Karim Benali", email: "k.benali@entreprise.ma", role: "directeur", team: null, avatar: "KB", color: "#DC2626" },
  { id: 2, name: "Sara El Amrani", email: "s.elamrani@entreprise.ma", role: "responsable", team: 1, avatar: "SE", color: "#7C3AED" },
  { id: 3, name: "Youssef Idrissi", email: "y.idrissi@entreprise.ma", role: "responsable", team: 2, avatar: "YI", color: "#7C3AED" },
  { id: 4, name: "Fatima Zahra", email: "f.zahra@entreprise.ma", role: "commercial", team: 1, avatar: "FZ", color: "#059669" },
  { id: 5, name: "Omar Farouk", email: "o.farouk@entreprise.ma", role: "commercial", team: 1, avatar: "OF", color: "#059669" },
  { id: 6, name: "Laila Bennani", email: "l.bennani@entreprise.ma", role: "commercial", team: 2, avatar: "LB", color: "#059669" },
  { id: 7, name: "Hassan Moussaoui", email: "h.moussaoui@entreprise.ma", role: "commercial", team: 2, avatar: "HM", color: "#059669" },
];

const roleLabels: Record<string, string> = { directeur: "Directeur", responsable: "Responsable", commercial: "Commercial" };

function getPermissions(userRole: string, team: number | null) {
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
  const visibleProjects = userRole === "directeur" ? demoData.projects : userRole === "responsable" ? demoData.projects.filter((p) => p.team === userTeam) : demoData.projects.filter((p) => p.ownerId === user?.id);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Equipe &amp; Permissions</h1>
        <p className="text-sm text-gray-500 mt-1">Organisation du service commercial et gestion des acces</p>
      </div>

      {/* Org Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Users size={16} className="text-[#1E3A5F]" /> Organisation du Service Commercial
        </h2>
        <div className="flex flex-col items-center gap-4">
          {(() => {
            const dir = TEAM_USERS.find((u) => u.role === "directeur");
            if (!dir) return null;
            return (
              <div className="flex flex-col items-center">
                <div className="px-6 py-3 rounded-xl text-white font-semibold text-sm text-center shadow-sm" style={{ background: "#DC2626" }}>
                  Directeur Commercial<br /><span className="text-xs font-normal opacity-80">{dir.name}</span>
                </div>
                <div className="w-px h-6 bg-gray-300" />
                <div className="w-32 h-px bg-gray-300" />
              </div>
            );
          })()}
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
                        Responsable Eq.{teamNum}<br /><span className="text-xs font-normal opacity-80">{resp.name}</span>
                      </div>
                      <div className="w-px h-4 bg-gray-300" />
                    </>
                  )}
                  <div className="flex flex-col gap-2">
                    {members.map((m) => (
                      <div key={m.id} className="px-4 py-2 rounded-lg text-xs font-medium text-center border border-gray-200 bg-gray-50 text-gray-700 min-w-[140px]">{m.name}</div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-3"><Users size={20} className="text-blue-600" /></div>
          <div className="text-2xl font-bold text-gray-900">{TEAM_USERS.length}</div><div className="text-xs text-gray-500 mt-1">Membres</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center mb-3"><Shield size={20} className="text-purple-600" /></div>
          <div className="text-2xl font-bold text-gray-900">{TEAM_USERS.filter((u) => u.role === "responsable").length}</div><div className="text-xs text-gray-500 mt-1">Responsables</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center mb-3"><User size={20} className="text-emerald-600" /></div>
          <div className="text-2xl font-bold text-gray-900">{TEAM_USERS.filter((u) => u.role === "commercial").length}</div><div className="text-xs text-gray-500 mt-1">Commerciaux</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center mb-3"><Eye size={20} className="text-amber-600" /></div>
          <div className="text-2xl font-bold text-gray-900">{visibleProjects.length}</div><div className="text-xs text-gray-500 mt-1">Projets visibles</div>
        </div>
      </div>

      {/* Permissions */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2"><Shield size={16} className="text-[#1E3A5F]" /> Vos permissions ({roleLabels[userRole]})</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {permissions.map((p, i) => {
            const Icon = p.icon;
            return (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: p.color + "15", color: p.color }}><Icon size={14} /></div>
                <span className="text-xs text-gray-700 leading-relaxed">{p.text}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Members */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2"><Users size={16} className="text-[#1E3A5F]" /> Membres de l&apos;equipe</h2>
        <div className="space-y-2">
          {TEAM_USERS.map((u) => {
            const isMe = u.id === user?.id;
            const roleLabel = roleLabels[u.role];
            const canShare = (userRole === "responsable" && u.team === userTeam && u.role === "commercial") || userRole === "directeur";
            return (
              <div key={u.id} className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${isMe ? "border border-emerald-300 bg-emerald-50" : "border border-gray-100 hover:bg-gray-50"}`}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ background: u.color }}>{u.avatar}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-900">{u.name}{isMe && <span className="ml-2 text-xs font-normal text-emerald-600">(Vous)</span>}</div>
                  <div className="text-xs text-gray-500">{roleLabel}{u.team ? ` - Equipe ${u.team}` : ""}</div>
                </div>
                {canShare && !isMe && (
                  <button className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1E3A5F] text-white text-xs font-medium rounded-lg hover:bg-[#152D4A] transition-colors"><Share size={12} /> Partager</button>
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
EOF1
echo "Team.tsx OK"

# === 2. Profile.tsx ===
cat > src/pages/Profile.tsx << 'EOF2'
import { useAuth } from "@/hooks/useAuth";
import { getDemoData } from "@/lib/demo-data";
import { Cloud, RotateCcw, LogOut, Map, FolderTree, ChevronRight, User, FileText } from "lucide-react";

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
  if (!user) return <div className="text-center py-12 text-gray-500">Veuillez vous connecter pour voir votre profil.</div>;

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

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold text-white shadow-sm" style={{ background: config.color }}>{initials}</div>
          <div>
            <h2 className="text-lg font-bold text-gray-900">{user.name}</h2>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="p-3 bg-gray-50 rounded-lg"><div className="text-xs text-gray-500 mb-1">Role</div><div className="text-sm font-semibold text-gray-900">{config.label}{user.teamId ? ` - Eq.${user.teamId}` : ""}</div></div>
          <div className="p-3 bg-gray-50 rounded-lg"><div className="text-xs text-gray-500 mb-1">Equipe</div><div className="text-sm font-semibold text-gray-900">{user.teamId ? `Equipe ${user.teamId}` : "Direction"}</div></div>
          <div className="p-3 bg-gray-50 rounded-lg"><div className="text-xs text-gray-500 mb-1">Projets</div><div className="text-sm font-semibold text-gray-900">{userProjects.length}</div></div>
          <div className="p-3 bg-gray-50 rounded-lg"><div className="text-xs text-gray-500 mb-1">Fichiers</div><div className="text-sm font-semibold text-gray-900">{userFiles.length}</div></div>
        </div>
      </div>

      {isDemo && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2"><Cloud size={16} className="text-blue-500" /> Mode Demo</h3>
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

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2"><ChevronRight size={16} className="text-[#1E3A5F]" /> Acces rapide</h3>
        <div className="space-y-2">
          <button onClick={() => window.location.href="/"} className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center"><FolderTree size={18} className="text-blue-600" /></div>
            <div className="flex-1"><div className="text-sm font-medium text-gray-900">Explorateur de Dossiers</div><div className="text-xs text-gray-500">{demoData.companies.length} entreprises, {demoData.projects.length} projets</div></div>
            <ChevronRight size={16} className="text-gray-400" />
          </button>
          <button onClick={() => window.location.href="/"} className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left">
            <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center"><Map size={18} className="text-amber-600" /></div>
            <div className="flex-1"><div className="text-sm font-medium text-gray-900">Processus Commercial</div><div className="text-xs text-gray-500">14 etapes du workflow</div></div>
            <ChevronRight size={16} className="text-gray-400" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2"><FileText size={16} className="text-gray-500" /> Parametres</h3>
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
EOF2
echo "Profile.tsx OK"

# === 3. Modifier Home.tsx ===
python3 << 'PYEOF'
with open("src/pages/Home.tsx", "r") as f:
    content = f.read()

content = content.replace(
    'import { useAuth } from "@/hooks/useAuth";',
    'import { useAuth } from "@/hooks/useAuth";\nimport Team from "./Team";\nimport Profile from "./Profile";'
)
content = content.replace(
    'Map, FolderTree, LogOut, Shield, Users, User,',
    'Map, FolderTree, LogOut, Shield, Users, User, Settings,'
)
content = content.replace(
    'type ViewMode = "flowchart" | "explorer";',
    'type ViewMode = "flowchart" | "explorer" | "team" | "profile";'
)

old_nav = '''              <button
                onClick={() => setViewMode("flowchart")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${viewMode === "flowchart" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
              >
                <Map size={14} />
                <span className="hidden sm:inline">Processus</span>
              </button>'''

new_nav = '''              <button
                onClick={() => setViewMode("flowchart")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${viewMode === "flowchart" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
              >
                <Map size={14} />
                <span className="hidden sm:inline">Processus</span>
              </button>
              <button
                onClick={() => setViewMode("team")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${viewMode === "team" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
              >
                <Users size={14} />
                <span className="hidden sm:inline">Equipe</span>
              </button>
              <button
                onClick={() => setViewMode("profile")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${viewMode === "profile" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
              >
                <Settings size={14} />
                <span className="hidden sm:inline">Profil</span>
              </button>'''

content = content.replace(old_nav, new_nav)

content = content.replace(
    '        {viewMode === "explorer" ? (',
    '        {viewMode === "team" ? (\n          <Team />\n        ) : viewMode === "profile" ? (\n          <Profile />\n        ) : viewMode === "explorer" ? ('
)

with open("src/pages/Home.tsx", "w") as f:
    f.write(content)
print("Home.tsx OK")
PYEOF

# === 4. Build + Push ===
npm run build && git add -A && git commit -m "Add Team and Profile pages" && git push origin main
