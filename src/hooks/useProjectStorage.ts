import { useState, useEffect, useCallback } from 'react';
import type { Company, Project, ProjectFile } from '@/types';
import { companyColors } from '@/data/flowData';

const COMPANIES_KEY = 'carto-companies';
const PROJECTS_KEY = 'carto-projects';
const FILES_KEY = 'carto-files';
const LAST_IDS_KEY = 'carto-last-ids';

// Demo data
const generateDemoData = () => {
  const companies: Company[] = [
    {
      id: 'comp-1',
      name: 'Société Générale de Construction',
      notes: 'Client majeur depuis 2018. Spécialisé dans le BTP.',
      createdAt: '2024-01-10',
      color: '#1E3A5F',
    },
    {
      id: 'comp-2',
      name: 'Promogim Immobilier',
      notes: 'Promoteur immobilier régional.',
      createdAt: '2024-02-15',
      color: '#0D9488',
    },
    {
      id: 'comp-3',
      name: 'Municipalité de Casablanca',
      notes: 'Marchés publics.',
      createdAt: '2024-03-01',
      color: '#7C3AED',
    },
  ];

  const projects: Project[] = [
    {
      id: 'proj-1',
      code: 'AIM-2024-001',
      name: 'Construction Bâtiment Administratif SGC',
      companyId: 'comp-1',
      status: 'active',
      notes: 'Bâtiment R+4 avec sous-sol. Budget estimé 45M DH.',
      createdAt: '2024-01-15',
    },
    {
      id: 'proj-2',
      code: 'AIM-2024-002',
      name: 'Rénovation Siège Social',
      companyId: 'comp-1',
      status: 'won',
      notes: 'Rénovation complète des locaux existants.',
      createdAt: '2024-02-20',
    },
    {
      id: 'proj-3',
      code: 'AIM-2024-005',
      name: 'Résidence Les Jardins',
      companyId: 'comp-2',
      status: 'active',
      notes: 'Ensemble résidentiel de 120 logements.',
      createdAt: '2024-03-10',
    },
    {
      id: 'proj-4',
      code: 'AIM-2024-008',
      name: 'Centre Culturel Municipal',
      companyId: 'comp-3',
      status: 'lost',
      notes: 'Appel d\'offres public. Non retenu.',
      createdAt: '2024-04-05',
    },
  ];

  const files: ProjectFile[] = [
    // Project 1 - SGC
    { id: 'f-1', projectId: 'proj-1', stepId: 'reception', name: 'Consultation_SGC_001.pdf', type: 'pdf', size: '2.4 MB', date: '2024-01-15' },
    { id: 'f-2', projectId: 'proj-1', stepId: 'reception', name: 'Cahier_des_Charges_SGC.docx', type: 'doc', size: '1.8 MB', date: '2024-01-16' },
    { id: 'f-3', projectId: 'proj-1', stepId: 'preetude', name: 'Note_faisabilite_SGC.xlsx', type: 'xls', size: '856 KB', date: '2024-01-18' },
    { id: 'f-4', projectId: 'proj-1', stepId: 'scop', name: 'Document_SCOP_projet1.docx', type: 'doc', size: '1.2 MB', date: '2024-01-20' },
    { id: 'f-5', projectId: 'proj-1', stepId: 'takeoff', name: 'Metre_quantitatif_SGC.xlsx', type: 'xls', size: '3.1 MB', date: '2024-01-22' },
    { id: 'f-6', projectId: 'proj-1', stepId: 'takeoff', name: 'Plans_niveau_SGC.pdf', type: 'pdf', size: '5.4 MB', date: '2024-01-22' },
    { id: 'f-7', projectId: 'proj-1', stepId: 'chiffrage', name: 'Chiffrage_complet_SGC.xlsx', type: 'xls', size: '2.7 MB', date: '2024-01-28' },
    { id: 'f-8', projectId: 'proj-1', stepId: 'preparation-offre', name: 'Offre_Technique_SGC.docx', type: 'doc', size: '4.2 MB', date: '2024-02-01' },
    { id: 'f-9', projectId: 'proj-1', stepId: 'preparation-offre', name: 'Offre_Commerciale_SGC.xlsx', type: 'xls', size: '1.9 MB', date: '2024-02-01' },
    // Project 2 - SGC
    { id: 'f-10', projectId: 'proj-2', stepId: 'reception', name: 'AO_Renovation_SGC.pdf', type: 'pdf', size: '3.1 MB', date: '2024-02-20' },
    { id: 'f-11', projectId: 'proj-2', stepId: 'verification', name: 'Contrat_Signe_Renovation.pdf', type: 'pdf', size: '4.5 MB', date: '2024-03-15' },
    // Project 3 - Promogim
    { id: 'f-12', projectId: 'proj-3', stepId: 'reception', name: 'Consultation_Promogim_005.pdf', type: 'pdf', size: '5.2 MB', date: '2024-03-10' },
    { id: 'f-13', projectId: 'proj-3', stepId: 'preetude', name: 'Faisabilite_LesJardins.xlsx', type: 'xls', size: '1.2 MB', date: '2024-03-12' },
    // Project 4 - Municipalité
    { id: 'f-14', projectId: 'proj-4', stepId: 'reception', name: 'AO_Centre_Culturel.pdf', type: 'pdf', size: '8.1 MB', date: '2024-04-05' },
    { id: 'f-15', projectId: 'proj-4', stepId: 'analyse-raisons', name: 'Analyse_Refus_CentreCulturel.docx', type: 'doc', size: '650 KB', date: '2024-05-01' },
  ];

  return { companies, projects, files };
};

export function useProjectStorage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [initialized, setInitialized] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const storedCompanies = localStorage.getItem(COMPANIES_KEY);
      const storedProjects = localStorage.getItem(PROJECTS_KEY);
      const storedFiles = localStorage.getItem(FILES_KEY);

      if (storedCompanies && storedProjects) {
        setCompanies(JSON.parse(storedCompanies));
        setProjects(JSON.parse(storedProjects));
        setFiles(storedFiles ? JSON.parse(storedFiles) : []);
      } else {
        // Initialize with demo data
        const demo = generateDemoData();
        setCompanies(demo.companies);
        setProjects(demo.projects);
        setFiles(demo.files);
        localStorage.setItem(COMPANIES_KEY, JSON.stringify(demo.companies));
        localStorage.setItem(PROJECTS_KEY, JSON.stringify(demo.projects));
        localStorage.setItem(FILES_KEY, JSON.stringify(demo.files));
        localStorage.setItem(LAST_IDS_KEY, JSON.stringify({ company: 3, project: 4, file: 15 }));
      }
      setInitialized(true);
    } catch (e) {
      console.error('Error loading from localStorage:', e);
      setInitialized(true);
    }
  }, []);

  // Persist to localStorage whenever data changes
  useEffect(() => {
    if (initialized) {
      localStorage.setItem(COMPANIES_KEY, JSON.stringify(companies));
    }
  }, [companies, initialized]);

  useEffect(() => {
    if (initialized) {
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
    }
  }, [projects, initialized]);

  useEffect(() => {
    if (initialized) {
      localStorage.setItem(FILES_KEY, JSON.stringify(files));
    }
  }, [files, initialized]);

  // Get next ID helper
  const getNextId = useCallback((type: 'company' | 'project' | 'file'): string => {
    const lastIds = JSON.parse(localStorage.getItem(LAST_IDS_KEY) || '{}');
    const nextNum = (lastIds[type] || 0) + 1;
    lastIds[type] = nextNum;
    localStorage.setItem(LAST_IDS_KEY, JSON.stringify(lastIds));

    switch (type) {
      case 'company': return `comp-${nextNum}`;
      case 'project': return `proj-${nextNum}`;
      case 'file': return `f-${nextNum}`;
    }
  }, []);

  // Company CRUD
  const addCompany = useCallback((name: string, notes: string = ''): Company => {
    const color = companyColors[companies.length % companyColors.length];
    const newCompany: Company = {
      id: getNextId('company'),
      name,
      notes,
      createdAt: new Date().toISOString().split('T')[0],
      color,
    };
    setCompanies(prev => [...prev, newCompany]);
    return newCompany;
  }, [companies.length, getNextId]);

  const updateCompany = useCallback((id: string, updates: Partial<Company>) => {
    setCompanies(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  }, []);

  const deleteCompany = useCallback((id: string) => {
    setCompanies(prev => prev.filter(c => c.id !== id));
    // Also delete related projects and files
    const projectsToDelete = projects.filter(p => p.companyId === id).map(p => p.id);
    setProjects(prev => prev.filter(p => p.companyId !== id));
    setFiles(prev => prev.filter(f => !projectsToDelete.includes(f.projectId)));
  }, [projects]);

  // Project CRUD
  const addProject = useCallback((companyId: string, code: string, name: string, notes: string = ''): Project => {
    const newProject: Project = {
      id: getNextId('project'),
      code,
      name,
      companyId,
      status: 'active',
      notes,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setProjects(prev => [...prev, newProject]);
    return newProject;
  }, [getNextId]);

  const updateProject = useCallback((id: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  }, []);

  const deleteProject = useCallback((id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    setFiles(prev => prev.filter(f => f.projectId !== id));
  }, []);

  // File CRUD
  const addFile = useCallback((projectId: string, stepId: string, name: string, fileType: string, size: string): ProjectFile => {
    const newFile: ProjectFile = {
      id: getNextId('file'),
      projectId,
      stepId,
      name,
      type: fileType as 'pdf' | 'doc' | 'xls' | 'image' | 'other',
      size,
      date: new Date().toISOString().split('T')[0],
    };
    setFiles(prev => [...prev, newFile]);
    return newFile;
  }, [getNextId]);

  const deleteFile = useCallback((fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  }, []);

  // Query helpers
  const getProjectsByCompany = useCallback((companyId: string): Project[] => {
    return projects.filter(p => p.companyId === companyId);
  }, [projects]);

  const getFilesByProject = useCallback((projectId: string): ProjectFile[] => {
    return files.filter(f => f.projectId === projectId);
  }, [files]);

  const getFilesByProjectAndStep = useCallback((projectId: string, stepId: string): ProjectFile[] => {
    return files.filter(f => f.projectId === projectId && f.stepId === stepId);
  }, [files]);

  const getCompanyById = useCallback((id: string): Company | undefined => {
    return companies.find(c => c.id === id);
  }, [companies]);

  const getProjectById = useCallback((id: string): Project | undefined => {
    return projects.find(p => p.id === id);
  }, [projects]);

  const getCompanyProjectsCount = useCallback((companyId: string): number => {
    return projects.filter(p => p.companyId === companyId).length;
  }, [projects]);

  const getProjectFilesCount = useCallback((projectId: string): number => {
    return files.filter(f => f.projectId === projectId).length;
  }, [files]);

  const getStepFilesCount = useCallback((projectId: string, stepId: string): number => {
    return files.filter(f => f.projectId === projectId && f.stepId === stepId).length;
  }, [files]);

  return {
    companies,
    projects,
    files,
    initialized,
    addCompany,
    updateCompany,
    deleteCompany,
    addProject,
    updateProject,
    deleteProject,
    addFile,
    deleteFile,
    getProjectsByCompany,
    getFilesByProject,
    getFilesByProjectAndStep,
    getCompanyById,
    getProjectById,
    getCompanyProjectsCount,
    getProjectFilesCount,
    getStepFilesCount,
  };
}
