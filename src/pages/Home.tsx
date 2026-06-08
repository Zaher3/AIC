import { useState, useCallback } from "react";
import type { FlowNode } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import { useCompanies } from "@/hooks/useCompanies";
import { useProjects } from "@/hooks/useProjects";
import { useFiles } from "@/hooks/useFiles";
import {
  CompanyList, ProjectList,
  StepFolderGrid, StepFileList,
} from "@/components/FileExplorer";
import Flowchart from "@/components/Flowchart";
import StepDetailPanel from "@/components/StepDetailPanel";
import {
  Map, FolderTree, LogOut, Shield, Users, User,
} from "lucide-react";

type ViewMode = "flowchart" | "explorer" | "team" | "profile";
import Team from "./Team";
import Profile from "./Profile";
type ExplorerLevel = "companies" | "projects" | "steps" | "files";

// Types matching DB schema
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

const roleLabels: Record<string, { label: string; icon: typeof User; color: string }> = {
  commercial: { label: "Commercial", icon: Users, color: "text-blue-600 bg-blue-50" },
  directeur: { label: "Directeur", icon: Shield, color: "text-purple-600 bg-purple-50" },
  admin: { label: "Admin", icon: Shield, color: "text-red-600 bg-red-50" },
};

export default function Home() {
  const { user, isAuthenticated, isLoading: authLoading, logout } = useAuth();

  // View state
  const [viewMode, setViewMode] = useState<ViewMode>("explorer");
  const [explorerLevel, setExplorerLevel] = useState<ExplorerLevel>("companies");
  const [selectedCompany, setSelectedCompany] = useState<CompanyItem | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [selectedStep, setSelectedStep] = useState<FlowNode | null>(null);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [selectedFlowNode, setSelectedFlowNode] = useState<FlowNode | null>(null);

  // tRPC data
  const { companies, isLoading: companiesLoading, create: createCompany, delete: deleteCompany } = useCompanies();
  const { projects, create: createProject, delete: deleteProject } = useProjects(selectedCompany?.id);
  const { files: projectFiles, addFile, removeFile } = useFiles(selectedProject?.id ?? 0);

  const userRole = user?.role ?? "commercial";
  const RoleConfig = roleLabels[userRole] ?? roleLabels.commercial;
  const RoleIcon = RoleConfig.icon;

  // Navigation
  const handleSelectCompany = useCallback((company: CompanyItem) => {
    setSelectedCompany(company);
    setExplorerLevel("projects");
  }, []);

  const handleSelectProject = useCallback((project: ProjectItem) => {
    setSelectedProject(project);
    setExplorerLevel("steps");
  }, []);

  const handleSelectStep = useCallback((step: FlowNode) => {
    setSelectedStep(step);
    setExplorerLevel("files");
  }, []);

  const handleBack = useCallback((level: ExplorerLevel) => {
    if (level === "companies") {
      setSelectedCompany(null);
      setExplorerLevel("companies");
    } else if (level === "projects") {
      setSelectedProject(null);
      setExplorerLevel("projects");
    } else if (level === "steps") {
      setSelectedStep(null);
      setExplorerLevel("steps");
    }
  }, []);

  const handleFlowNodeClick = useCallback((node: FlowNode) => {
    setActiveNodeId(node.id);
    setSelectedFlowNode(node);
  }, []);

  const handleCloseFlowPanel = useCallback(() => {
    setSelectedFlowNode(null);
  }, []);

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <Map size={40} className="mx-auto text-[#1E3A5F] animate-pulse mb-3" />
          <p className="text-sm text-gray-500">Chargement...</p>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center max-w-md px-6">
          <div className="w-16 h-16 rounded-2xl bg-[#1E3A5F] flex items-center justify-center mx-auto mb-6">
            <Map size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Cartographie Interactive</h1>
          <p className="text-sm text-gray-500 mb-8">
            Gestion collaborative des consultations et appels d&apos;offres.
            Connectez-vous pour acceder a vos projets.
          </p>
          <a
            href="/login"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1E3A5F] text-white rounded-xl font-medium hover:bg-[#152D4A] transition-colors"
          >
            Se connecter
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#1E3A5F] flex items-center justify-center">
              <Map size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-gray-900 tracking-tight leading-tight">
                Cartographie Interactive
              </h1>
              <p className="text-[11px] text-gray-500 leading-tight">
                Consultation et Appel d&apos;Offres
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View mode toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
              <button
                onClick={() => setViewMode("explorer")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${viewMode === "explorer" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
              >
                <FolderTree size={14} />
                <span className="hidden sm:inline">Explorateur</span>
              </button>
              <button
                onClick={() => setViewMode("flowchart")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${viewMode === "flowchart" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
              >
                <Map size={14} />
                <span className="hidden sm:inline">Processus</span>
              </button>
              sed -i '/<span className="hidden sm:inline">Processus<\/span>/,/<\/button>/{
  /<\/button>/a\
              <button\
                onClick={() => setViewMode("team")}\
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${viewMode === "team" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}\
              >\
                <Users size={14} />\
                <span className="hidden sm:inline">Equipe</span>\
              </button>\
              <button\
                onClick={() => setViewMode("profile")}\
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${viewMode === "profile" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}\
              >\
                <Settings size={14} />\
                <span className="hidden sm:inline">Profil</span>\n
              
              </button>
}
            </div>

            {/* User info */}
            <div className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium ${RoleConfig.color}`}>
              <RoleIcon size={12} />
              {user.name ?? userRole}
            </div>

            {/* Logout */}
            <button
              onClick={logout}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Deconnexion"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 md:px-6 py-6">
        {viewMode === "explorer" ? (
          <div className="space-y-5">
            {/* Breadcrumb */}
            {explorerLevel !== "companies" && (
              <div className="flex items-center gap-1 text-sm">
                <button onClick={() => handleBack("companies")} className="flex items-center gap-1.5 px-2 py-1 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
                  Accueil
                </button>
                {selectedCompany && (
                  <>
                    <span className="text-gray-300">/</span>
                    <button onClick={() => handleBack("projects")} className={`px-2 py-1 rounded-md transition-colors ${explorerLevel === "projects" ? "bg-gray-100 text-gray-900 font-semibold" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}>
                      {selectedCompany.name}
                    </button>
                  </>
                )}
                {selectedProject && (
                  <>
                    <span className="text-gray-300">/</span>
                    <button onClick={() => handleBack("steps")} className={`px-2 py-1 rounded-md transition-colors ${explorerLevel === "steps" ? "bg-gray-100 text-gray-900 font-semibold" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}>
                      {selectedProject.code} {selectedProject.name}
                    </button>
                  </>
                )}
                {selectedStep && (
                  <>
                    <span className="text-gray-300">/</span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-900 font-semibold rounded-md">
                      {selectedStep.title}
                    </span>
                  </>
                )}
              </div>
            )}

            {/* Explorer levels */}
            {explorerLevel === "companies" && (
              <>
                <div className="text-center max-w-2xl mx-auto mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Explorateur de Dossiers</h2>
                  <p className="text-sm text-gray-500">
                    Gerez vos entreprises, projets et documents organises par etape du processus commercial.
                  </p>
                  <div className="flex items-center justify-center gap-3 mt-3">
                    <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full ${RoleConfig.color}`}>
                      <RoleIcon size={10} />
                      Votre role: {RoleConfig.label}
                    </span>
                    {userRole === "commercial" && (
                      <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
                        Vous voyez uniquement vos projets et ceux partages avec vous
                      </span>
                    )}
                    {userRole === "directeur" && (
                      <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
                        Vous voyez tous les projets. Edition sur autorisation uniquement.
                      </span>
                    )}
                  </div>
                </div>
                {companiesLoading ? (
                  <div className="text-center py-12 text-gray-400">Chargement des entreprises...</div>
                ) : (
                  <CompanyList
                    companies={companies}
                    onSelectCompany={handleSelectCompany}
                    onAddCompany={(name: string, notes: string) => createCompany({ name, notes })}
                    onDeleteCompany={(id: number) => deleteCompany({ id })}
                    userRole={userRole}
                  />
                )}
              </>
            )}

            {explorerLevel === "projects" && selectedCompany && (
              <ProjectList
                company={selectedCompany}
                projects={projects as ProjectItem[]}
                onSelectProject={handleSelectProject}
                onBack={() => handleBack("companies")}
                onAddProject={(companyId: number, code: string, name: string, notes: string) =>
                  createProject({ companyId, code, name, notes })
                }
                onDeleteProject={(id: number) => deleteProject({ id })}
                userRole={userRole}
              />
            )}

            {explorerLevel === "steps" && selectedCompany && selectedProject && (
              <StepFolderGrid
                company={selectedCompany}
                project={selectedProject}
                files={projectFiles}
                onSelectStep={handleSelectStep}
                onBack={() => handleBack("projects")}
                userRole={userRole}
              />
            )}

            {explorerLevel === "files" && selectedCompany && selectedProject && selectedStep && (
              <StepFileList
                company={selectedCompany}
                project={selectedProject}
                step={selectedStep}
                files={projectFiles}
                onBack={() => handleBack("steps")}
                onAddFile={(projectId: number, stepId: string, name: string, type: string, size: string) =>
                  addFile({ projectId, stepId, name, fileType: type as "pdf" | "doc" | "xls" | "image" | "other", size })
                }
                onDeleteFile={(id: number) => removeFile({ id })}
                userRole={userRole}
              />
            )}
          </div>
        ) : (
          /* Flowchart View */
          <div className="space-y-6">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Processus Commercial et de Chiffrage</h2>
              <p className="text-sm text-gray-500">Vue d&apos;ensemble du processus. Cliquez sur une etape pour les details.</p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded bg-[#1E3A5F]" /><span className="text-xs text-gray-600">Debut</span></div>
              <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded border border-gray-300 bg-white" /><span className="text-xs text-gray-600">Etape</span></div>
              <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded border border-red-200 bg-red-50" /><span className="text-xs text-gray-600">Decision</span></div>
              <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded border border-blue-200 bg-blue-50" /><span className="text-xs text-gray-600">Parallele</span></div>
              <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded border border-green-200 bg-green-50" /><span className="text-xs text-gray-600">Fin</span></div>
            </div>
            <Flowchart onNodeClick={handleFlowNodeClick} activeNodeId={activeNodeId} />
            {selectedFlowNode && (
              <StepDetailPanel step={selectedFlowNode} onClose={handleCloseFlowPanel} />
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-gray-50 mt-auto">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500">Cartographie Interactive — Service Commercial & Estimation des Couts</p>
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span>{companies.length} entreprises</span>
            <span>{projects.length} projets</span>
            <span>{projectFiles.length} fichiers</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
