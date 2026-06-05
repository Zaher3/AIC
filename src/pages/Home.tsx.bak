import { useState, useCallback } from 'react';
import type { FlowNode, Company, Project, BreadcrumbItem } from '@/types';
import { useCloudStorage } from '@/hooks/useCloudStorage';
import {
  Breadcrumb, CompanyList, ProjectList,
  StepFolderGrid, StepFileList,
} from '@/components/FileExplorer';
import Flowchart from '@/components/Flowchart';
import StepDetailPanel from '@/components/StepDetailPanel';
import { Map, RotateCcw, FolderTree, Cloud, CloudOff, RefreshCw } from 'lucide-react';

type ViewMode = 'flowchart' | 'explorer';
type ExplorerLevel = 'companies' | 'projects' | 'steps' | 'files';

export default function Home() {
  const storage = useCloudStorage();

  const [viewMode, setViewMode] = useState<ViewMode>('explorer');
  const [explorerLevel, setExplorerLevel] = useState<ExplorerLevel>('companies');
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedStep, setSelectedStep] = useState<FlowNode | null>(null);
  const [activeNodeId, setActiveNodeId] = useState<string | null>(null);
  const [selectedFlowNode, setSelectedFlowNode] = useState<FlowNode | null>(null);

  // Breadcrumb
  const getBreadcrumbItems = useCallback((): BreadcrumbItem[] => {
    const items: BreadcrumbItem[] = [{ label: 'Accueil', type: 'root', id: 'root' }];
    if (selectedCompany) items.push({ label: selectedCompany.name, type: 'company', id: selectedCompany.id });
    if (selectedProject) items.push({ label: `${selectedProject.code} ${selectedProject.name}`, type: 'project', id: selectedProject.id });
    if (selectedStep) items.push({ label: selectedStep.title, type: 'step', id: selectedStep.id });
    return items;
  }, [selectedCompany, selectedProject, selectedStep]);

  const handleBreadcrumbNavigate = useCallback((index: number) => {
    if (index === 0) {
      setSelectedCompany(null);
      setSelectedProject(null);
      setSelectedStep(null);
      setExplorerLevel('companies');
    } else if (index === 1 && selectedCompany) {
      setSelectedProject(null);
      setSelectedStep(null);
      setExplorerLevel('projects');
    } else if (index === 2 && selectedProject) {
      setSelectedStep(null);
      setExplorerLevel('steps');
    }
  }, [selectedCompany, selectedProject]);

  const handleSelectCompany = useCallback((company: Company) => {
    setSelectedCompany(company);
    setExplorerLevel('projects');
  }, []);

  const handleSelectProject = useCallback((project: Project) => {
    setSelectedProject(project);
    setExplorerLevel('steps');
  }, []);

  const handleSelectStep = useCallback((step: FlowNode) => {
    setSelectedStep(step);
    setExplorerLevel('files');
  }, []);

  const handleReset = useCallback(() => {
    setSelectedCompany(null);
    setSelectedProject(null);
    setSelectedStep(null);
    setActiveNodeId(null);
    setExplorerLevel('companies');
  }, []);

  const handleFlowNodeClick = useCallback((node: FlowNode) => {
    setActiveNodeId(node.id);
    setSelectedFlowNode(node);
  }, []);

  const handleCloseFlowPanel = useCallback(() => {
    setSelectedFlowNode(null);
  }, []);

  if (!storage.initialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <Map size={40} className="mx-auto text-[#1E3A5F] animate-pulse mb-3" />
          <p className="text-sm text-gray-500">Chargement...</p>
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
                Consultation et Appel d'Offres
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View mode toggle */}
            <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
              <button
                onClick={() => setViewMode('explorer')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${viewMode === 'explorer' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <FolderTree size={14} />
                <span className="hidden sm:inline">Explorateur</span>
              </button>
              <button
                onClick={() => setViewMode('flowchart')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${viewMode === 'flowchart' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Map size={14} />
                <span className="hidden sm:inline">Processus</span>
              </button>
            </div>

            {/* Cloud indicator */}
            <div className="flex items-center gap-1 px-2 py-1">
              {storage.hasFirebase ? (
                <Cloud size={14} className="text-green-500" />
              ) : (
                <CloudOff size={14} className="text-amber-500" />
              )}
              <span className={`hidden sm:inline text-xs ${storage.hasFirebase ? 'text-green-600' : 'text-amber-600'}`}>
                {storage.hasFirebase ? 'Cloud' : 'Local'}
              </span>
              {storage.syncing && <RefreshCw size={12} className="text-gray-400 animate-spin ml-1" />}
            </div>

            {(selectedCompany || activeNodeId) && (
              <button
                onClick={handleReset}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <RotateCcw size={14} />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 md:px-6 py-6">
        {viewMode === 'explorer' ? (
          <div className="space-y-5">
            {explorerLevel !== 'companies' && (
              <Breadcrumb items={getBreadcrumbItems()} onNavigate={handleBreadcrumbNavigate} />
            )}

            {explorerLevel === 'companies' && (
              <>
                <div className="text-center max-w-2xl mx-auto mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Explorateur de Dossiers</h2>
                  <p className="text-sm text-gray-500">
                    Gerez vos entreprises, projets et documents organises par etape du processus commercial.
                  </p>
                </div>
                <CompanyList
                  companies={storage.companies}
                  projectsCount={storage.getCompanyProjectsCount}
                  onSelectCompany={handleSelectCompany}
                  onAddCompany={storage.addCompany}
                  onDeleteCompany={storage.deleteCompany}
                  onUpdateCompany={storage.updateCompany}
                />
              </>
            )}

            {explorerLevel === 'projects' && selectedCompany && (
              <ProjectList
                company={selectedCompany}
                projects={storage.getProjectsByCompany(selectedCompany.id)}
                filesCount={storage.getProjectFilesCount}
                onSelectProject={handleSelectProject}
                onBack={() => { setSelectedCompany(null); setExplorerLevel('companies'); }}
                onAddProject={storage.addProject}
                onDeleteProject={storage.deleteProject}
                onUpdateProject={storage.updateProject}
              />
            )}

            {explorerLevel === 'steps' && selectedCompany && selectedProject && (
              <StepFolderGrid
                company={selectedCompany}
                project={selectedProject}
                files={storage.getFilesByProject(selectedProject.id)}
                stepFilesCount={storage.getStepFilesCount}
                onSelectStep={handleSelectStep}
                onBack={() => { setSelectedProject(null); setExplorerLevel('projects'); }}
              />
            )}

            {explorerLevel === 'files' && selectedCompany && selectedProject && selectedStep && (
              <StepFileList
                company={selectedCompany}
                project={selectedProject}
                step={selectedStep}
                files={storage.getFilesByProjectAndStep(selectedProject.id, selectedStep.id)}
                onBack={() => { setSelectedStep(null); setExplorerLevel('steps'); }}
                onAddFile={storage.addFile}
                onDeleteFile={storage.deleteFile}
              />
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Processus Commercial et de Chiffrage</h2>
              <p className="text-sm text-gray-500">Vue d'ensemble du processus. Cliquez sur une etape pour la surligner.</p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded bg-[#1E3A5F]" /><span className="text-xs text-gray-600">Debut</span></div>
              <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded border border-gray-300 bg-white" /><span className="text-xs text-gray-600">Etape</span></div>
              <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded border border-red-200 bg-red-50" /><span className="text-xs text-gray-600">Decision</span></div>
              <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded border border-blue-200 bg-blue-50" /><span className="text-xs text-gray-600">Parallele</span></div>
              <div className="flex items-center gap-1.5"><div className="w-3.5 h-3.5 rounded border border-green-200 bg-green-50" /><span className="text-xs text-gray-600">Fin</span></div>
            </div>
            <Flowchart onNodeClick={handleFlowNodeClick} activeNodeId={activeNodeId} />

            {/* Step detail panel for flowchart view */}
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
            <span>{storage.companies.length} entreprises</span>
            <span>{storage.projects.length} projets</span>
            <span>{storage.files.length} fichiers</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
