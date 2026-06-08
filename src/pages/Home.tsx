import { useState, useCallback } from "react";
import type { FlowNode } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import { useCompanies } from "@/hooks/useCompanies";
import { useProjects } from "@/hooks/useProjects";
import { useFiles } from "@/hooks/useFiles";
import { CompanyList, ProjectList, StepFolderGrid, StepFileList } from "@/components/FileExplorer";
import Flowchart from "@/components/Flowchart";
import StepDetailPanel from "@/components/StepDetailPanel";
import Team from "./Team";
import Profile from "./Profile";
import Dashboard from "./Dashboard";
import { Map, FolderTree, LogOut, Shield, Users, User, LayoutDashboard, Route, Bell, Settings } from "lucide-react";

type ViewMode = "dashboard" | "flowchart" | "explorer" | "team" | "notifications" | "profile";
type ExplorerLevel = "companies" | "projects" | "steps" | "files";

interface CompanyItem { id: number; name: string; notes: string | null; color: string; }
interface ProjectItem { id: number; code: string; name: string; companyId: number; status: string; notes: string | null; }

const roleLabels: Record<string, { label: string; icon: typeof User; color: string; bg: string }> = {
  commercial: { label: "Commercial", icon: Users, color: "text-emerald-600 bg-emerald-50", bg: "#059669" },
  directeur: { label: "Directeur", icon: Shield, color: "text-red-600 bg-red-50", bg: "#DC2626" },
  admin: { label: "Admin", icon: Shield, color: "text-red-600 bg-red-50", bg: "#DC2626" },
};

export default function Home() {
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>("dashboard");
  const [explorerLevel, setExplorerLevel] = useState<ExplorerLevel>("companies");
  const [selectedCompany, setSelectedCompany] = useState<CompanyItem | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [selectedStep, setSelectedStep] = useState<FlowNode | null>(null);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [selectedFlowNode, setSelectedFlowNode] = useState<FlowNode | null>(null);

  const { companies, isLoading: companiesLoading, create: createCompany, delete: deleteCompany } = useCompanies();
  const { projects, create: createProject, delete: deleteProject } = useProjects(selectedCompany?.id);
  const { files: projectFiles, addFile, removeFile } = useFiles(selectedProject?.id ?? 0);

  const userRole = user?.role ?? "commercial";
  const RoleConfig = roleLabels[userRole] ?? roleLabels.commercial;
  const RoleIcon = RoleConfig.icon;

  const handleSelectCompany = useCallback((company: CompanyItem) => { setSelectedCompany(company); setExplorerLevel("projects"); }, []);
  const handleSelectProject = useCallback((project: ProjectItem) => { setSelectedProject(project); setExplorerLevel("steps"); }, []);
  const handleSelectStep = useCallback((step: FlowNode) => { setSelectedStep(step); setExplorerLevel("files"); }, []);
  const handleBack = useCallback((level: ExplorerLevel) => {
    if (level === "companies") { setSelectedCompany(null); setExplorerLevel("companies"); }
    else if (level === "projects") { setSelectedProject(null); setExplorerLevel("projects"); }
    else if (level === "steps") { setSelectedStep(null); setExplorerLevel("steps"); }
  }, []);
  const handleFlowNodeClick = useCallback((node: FlowNode) => { setActiveNodeId(node.id); setSelectedFlowNode(node); }, []);
  const handleCloseFlowPanel = useCallback(() => { setSelectedFlowNode(null); }, []);
  const handleNavigate = useCallback((view: string) => { setViewMode(view as ViewMode); }, []);
  const initials = (user?.name ?? "U").split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center"><Map size={40} className="mx-auto text-[#1E3A5F] animate-pulse mb-3" /><p className="text-sm text-gray-500">Chargement...</p></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center max-w-md px-6">
          <div className="w-16 h-16 rounded-2xl bg-[#1E3A5F] flex items-center justify-center mx-auto mb-6"><Map size={32} className="text-white" /></div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Cartographie Interactive</h1>
          <p className="text-sm text-gray-500 mb-8">Gestion collaborative des consultations et appels d&apos;offres. Connectez-vous pour acceder a vos projets.</p>
          <a href="/login" className="inline-flex items-center gap-2 px-6 py-3 bg-[#1E3A5F] text-white rounded-xl font-medium hover:bg-[#152D4A] transition-colors">Se connecter</a>
        </div>
      </div>
    );
  }

  const navItems = [
    { id: "dashboard" as ViewMode, label: "Tableau de bord", icon: LayoutDashboard },
    { id: "flowchart" as ViewMode, label: "Processus (14 etapes)", icon: Route },
    { id: "explorer" as ViewMode, label: "Explorateur", icon: FolderTree },
    { id: "team" as ViewMode, label: "Equipe & Permissions", icon: Users },
    { id: "notifications" as ViewMode, label: "Notifications", icon: Bell },
    { id: "profile" as ViewMode, label: "Mon Profil", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex">
      <aside className="w-[260px] bg-[#1E3A5F] text-white flex flex-col flex-shrink-0 fixed h-full">
        <div className="p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center"><Map size={18} className="text-white" /></div>
            <div>
              <div className="text-sm font-bold">Cartographie Interactive</div>
              <div className="text-[11px] text-white/60">Consultation et Appel d&apos;Offres</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = viewMode === item.id;
            return (
              <button key={item.id} onClick={() => setViewMode(item.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all text-left ${isActive ? "bg-white/15 text-white" : "text-white/70 hover:bg-white/10 hover:text-white"}`}>
                <Icon size={18} />{item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 p-3 bg-white/10 rounded-xl">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0" style={{ background: RoleConfig.bg }}>{initials}</div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold truncate">{user.name}</div>
              <div className="text-[11px] text-white/60">{RoleConfig.label}</div>
            </div>
            <button onClick={logout} className="p-1.5 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors" title="Deconnexion"><LogOut size={14} /></button>
          </div>
        </div>
      </aside>

      <main className="flex-1 ml-[260px] min-h-screen">
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-40">
          <h2 className="text-sm font-semibold text-gray-900">
            {viewMode === "dashboard" && "Tableau de bord"}
            {viewMode === "flowchart" && "Processus Commercial"}
            {viewMode === "explorer" && "Explorateur de Dossiers"}
            {viewMode === "team" && "Equipe & Permissions"}
            {viewMode === "notifications" && "Notifications"}
            {viewMode === "profile" && "Mon Profil"}
          </h2>
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${RoleConfig.color}`}><RoleIcon size={12} />{user.name ?? userRole}</div>
          </div>
        </header>

        <div className="p-6">
          {viewMode === "dashboard" && <Dashboard onNavigate={handleNavigate} />}
          {viewMode === "team" && <Team />}
          {viewMode === "profile" && <Profile />}
          {viewMode === "notifications" && (
            <div className="max-w-2xl">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Notifications</h1>
              <div className="space-y-3">
                <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-start gap-3"><div className="w-2 h-2 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" /><div className="flex-1"><div className="text-sm font-medium text-gray-900">Demande d&apos;acces</div><div className="text-xs text-gray-500 mt-1">Karim Benali demande l&apos;acces au projet AIM-35E-26.</div><div className="text-xs text-gray-400 mt-1">il y a 15 min</div></div></div>
                <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-start gap-3"><div className="w-2 h-2 rounded-full bg-gray-300 mt-1.5 flex-shrink-0" /><div className="flex-1"><div className="text-sm font-medium text-gray-900">Modification autorisee</div><div className="text-xs text-gray-500 mt-1">Sara El Amrani a autorise la modification du projet AIM-37E-26.</div><div className="text-xs text-gray-400 mt-1">il y a 1h</div></div></div>
              </div>
            </div>
          )}
          {viewMode === "explorer" && (
            <div className="space-y-5">
              {explorerLevel !== "companies" && (
                <div className="flex items-center gap-1 text-sm">
                  <button onClick={() => handleBack("companies")} className="flex items-center gap-1.5 px-2 py-1 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors">Accueil</button>
                  {selectedCompany && (<><span className="text-gray-300">/</span><button onClick={() => handleBack("projects")} className={`px-2 py-1 rounded-md transition-colors ${explorerLevel === "projects" ? "bg-gray-100 text-gray-900 font-semibold" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}>{selectedCompany.name}</button></>)}
                  {selectedProject && (<><span className="text-gray-300">/</span><button onClick={() => handleBack("steps")} className={`px-2 py-1 rounded-md transition-colors ${explorerLevel === "steps" ? "bg-gray-100 text-gray-900 font-semibold" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}>{selectedProject.code} {selectedProject.name}</button></>)}
                  {selectedStep && (<><span className="text-gray-300">/</span><span className="px-2 py-1 bg-gray-100 text-gray-900 font-semibold rounded-md">{selectedStep.title}</span></>)}
                </div>
              )}
              {explorerLevel === "companies" && (
                <><div className="text-center max-w-2xl mx-auto mb-8"><h2 className="text-2xl font-bold text-gray-900 mb-2">Explorateur de Dossiers</h2><p className="text-sm text-gray-500">Gerez vos entreprises, projets et documents organises par etape du processus commercial.</p><div className="flex items-center justify-center gap-3 mt-3"><span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full ${RoleConfig.color}`}><RoleIcon size={10} />Votre role: {RoleConfig.label}</span>{userRole === "directeur" && <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">Vous voyez tous les projets. Edition sur autorisation uniquement.</span>}</div></div>
                {companiesLoading ? <div className="text-center py-12 text-gray-400">Chargement des entreprises...</div> : <CompanyList companies={companies} onSelectCompany={handleSelectCompany} onAddCompany={(name: string, notes: string) => createCompany({ name, notes })} onDeleteCompany={(id: number) => deleteCompany({ id })} userRole={userRole} />}</>
              )}
              {explorerLevel === "projects" && selectedCompany && <ProjectList company={selectedCompany} projects={projects as ProjectItem[]} onSelectProject={handleSelectProject} onBack={() => handleBack("companies")} onAddProject={(companyId: number, code: string, name: string, notes: string) => createProject({ companyId, code, name, notes })} onDeleteProject={(id: number) => deleteProject({ id })} userRole={userRole} />}
              {explorerLevel === "steps" && selectedCompany && selectedProject && <StepFolderGrid company={selectedCompany} project={selectedProject} files={projectFiles} onSelectStep={handleSelectStep} onBack={() => handleBack("projects")} userRole={userRole} />}
              {explorerLevel === "files" && selectedCompany && selectedProject && selectedStep && <StepFileList company={selectedCompany} project={selectedProject} step={selectedStep} files={projectFiles} onBack={() => handleBack("steps")} onAddFile={(projectId: number, stepId: string, name: string, type: string, size: string) => addFile({ projectId, stepId, name, fileType: type as "pdf" | "doc" | "xls" | "image" | "other", size })} onDeleteFile={(id: number) => removeFile({ id })} userRole={userRole} />}
            </div>
          )}
          {viewMode === "flowchart" && (
            <div className="space-y-6"><div className="text-center max-w-2xl mx-auto"><h2 className="text-2xl font-bold text-gray-900 mb-2">Processus Commercial et de Chiffrage</h2><p className="text-sm text-gray-500">Vue d&apos;ensemble du processus. Cliquez sur une etape pour les details.</p></div>
              <div className="flex flex-wrap items-center justify-center gap-3"><div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded bg-[#1E3A5F]" /><span className="text-xs text-gray-600">Debut</span></div><div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded border border-gray-300 bg-white" /><span className="text-xs text-gray-600">Etape</span></div><div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded border border-red-200 bg-red-50" /><span className="text-xs text-gray-600">Decision</span></div><div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded border border-blue-200 bg-blue-50" /><span className="text-xs text-gray-600">Parallele</span></div><div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded border border-green-200 bg-green-50" /><span className="text-xs text-gray-600">Fin</span></div></div>
              <Flowchart onNodeClick={handleFlowNodeClick} activeNodeId={activeNodeId} />{selectedFlowNode && <StepDetailPanel step={selectedFlowNode} onClose={handleCloseFlowPanel} />}</div>
          )}
        </div>
      </main>
    </div>
  );
}
