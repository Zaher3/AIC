import { useAuth } from "@/hooks/useAuth";
import { getDemoData } from "@/lib/demo-data";
import { Building2, FolderOpen, FileText, CheckCircle2, TrendingUp, Map, FolderTree, Plus, Users, Bell } from "lucide-react";

function getGreeting(name: string): string {
  const hour = new Date().getHours();
  if (hour < 12) return `Bonjour, ${name} !`;
  if (hour < 18) return `Bon apres-midi, ${name} !`;
  return `Bonsoir, ${name} !`;
}

const ACTIVITIES = [
  { id: 1, text: "Consultation AIM-35E-26 ajoutee", detail: "JESA - Static Mixer", time: "il y a 15 min", type: "file" },
  { id: 2, text: "Projet AIM-54E-26 cree", detail: "SONASID - CDC Installation Piping", time: "il y a 1h", type: "project" },
  { id: 3, text: "Devis fournisseurs ajoute", detail: "AIM-35E-26 - Fournisseur", time: "il y a 2h", type: "file" },
  { id: 4, text: "Note de faisabilite completee", detail: "AIM-37E-26 - Pre-etude", time: "il y a 3h", type: "step" },
  { id: 5, text: "SCOP defini pour AIM-54E-26", detail: "SONASID - Definition du SCOP", time: "hier", type: "step" },
];

const iconColors: Record<string, string> = {
  file: "bg-blue-50 text-blue-600",
  project: "bg-emerald-50 text-emerald-600",
  step: "bg-amber-50 text-amber-600",
};

export default function Dashboard({ onNavigate }: { onNavigate: (v: string) => void }) {
  const { user } = useAuth();
  const demoData = getDemoData();
  const activeProjects = demoData.projects.filter((p) => p.status === "active").length;
  const wonProjects = demoData.projects.filter((p) => p.status === "won").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{getGreeting(user?.name ?? "Utilisateur")}</h1>
        <p className="text-sm text-gray-500 mt-1">Voici un apercu de votre activite commerciale.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mb-3"><Building2 size={20} className="text-blue-600" /></div>
          <div className="text-3xl font-bold text-gray-900">{demoData.companies.length}</div>
          <div className="text-xs text-gray-500 mt-1">Entreprises</div>
          <div className="flex items-center gap-1 mt-2 text-xs text-emerald-600 font-medium"><TrendingUp size={12} />+1 ce mois</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center mb-3"><FolderOpen size={20} className="text-amber-600" /></div>
          <div className="text-3xl font-bold text-gray-900">{activeProjects}</div>
          <div className="text-xs text-gray-500 mt-1">Projets actifs</div>
          <div className="flex items-center gap-1 mt-2 text-xs text-emerald-600 font-medium"><TrendingUp size={12} />+2 ce mois</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center mb-3"><FileText size={20} className="text-emerald-600" /></div>
          <div className="text-3xl font-bold text-gray-900">{demoData.files.length}</div>
          <div className="text-xs text-gray-500 mt-1">Documents</div>
          <div className="flex items-center gap-1 mt-2 text-xs text-emerald-600 font-medium"><TrendingUp size={12} />+4 ce mois</div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center mb-3"><CheckCircle2 size={20} className="text-red-600" /></div>
          <div className="text-3xl font-bold text-gray-900">{wonProjects}</div>
          <div className="text-xs text-gray-500 mt-1">Affaires gagnees</div>
          <div className="flex items-center gap-1 mt-2 text-xs text-emerald-600 font-medium"><TrendingUp size={12} />{demoData.projects.length > 0 ? Math.round((wonProjects/demoData.projects.length)*100) : 0}% de conversion</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-semibold text-gray-900">Activite recente</h2>
            <span className="text-xs text-gray-500">Aujourd&apos;hui</span>
          </div>
          <div className="space-y-4">
            {ACTIVITIES.map((a) => (
              <div key={a.id} className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${iconColors[a.type]}`}>
                  {a.type === "file" && <FileText size={14} />}{a.type === "project" && <FolderOpen size={14} />}{a.type === "step" && <CheckCircle2 size={14} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-gray-900 font-medium">{a.text}</div>
                  <div className="text-xs text-gray-500">{a.detail}</div>
                </div>
                <span className="text-xs text-gray-400 flex-shrink-0">{a.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Acces rapide</h2>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => onNavigate("flowchart")} className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all text-center"><Map size={20} className="text-gray-600" /><span className="text-xs text-gray-700 font-medium">Voir le processus</span></button>
              <button onClick={() => onNavigate("explorer")} className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all text-center"><FolderTree size={20} className="text-gray-600" /><span className="text-xs text-gray-700 font-medium">Explorer les dossiers</span></button>
              <button onClick={() => onNavigate("explorer")} className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all text-center"><Plus size={20} className="text-gray-600" /><span className="text-xs text-gray-700 font-medium">Nouvelle entreprise</span></button>
              <button onClick={() => onNavigate("team")} className="flex flex-col items-center gap-2 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all text-center"><Users size={20} className="text-gray-600" /><span className="text-xs text-gray-700 font-medium">Gerer l&apos;equipe</span></button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-gray-900">Firebase Sync</h2>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Actif</span>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed mb-4">Vos donnees sont synchronisees en temps reel avec Firebase Cloud (projet: <strong>sc-aic</strong>). Les modifications sont visibles par toute l&apos;equipe instantanement.</p>
            <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-lg">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-xs text-emerald-700 font-medium">Connecte - Derniere sync: il y a 2 min</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4"><Bell size={16} className="text-gray-500" /><h2 className="text-sm font-semibold text-gray-900">Notifications</h2><span className="ml-auto text-xs text-gray-500">2 non lues</span></div>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-100"><div className="text-xs font-medium text-blue-900">Demande d&apos;acces</div><div className="text-xs text-blue-700 mt-1">Karim Benali demande l&apos;acces au projet AIM-54E-26</div></div>
              <div className="p-3 bg-gray-50 rounded-lg border border-gray-100"><div className="text-xs font-medium text-gray-900">Modification autorisee</div><div className="text-xs text-gray-600 mt-1">Sara El Amrani a autorise la modification du projet AIM-37E-26</div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
