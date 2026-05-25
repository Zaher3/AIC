import { useState, useEffect, useCallback } from 'react';
import type { Company, Project, ProjectFile } from '@/types';
import { companyColors } from '@/data/flowData';
import { generateId } from '@/lib/firebase';

// ====== FIREBASE OPERATIONS ======

/* eslint-disable @typescript-eslint/no-explicit-any */
function getFb() {
  if (typeof window !== 'undefined' && window.firebase) {
    return window.firebase;
  }
  return null;
}

function getDb() {
  const fb = getFb();
  if (!fb) return null;
  if (!fb.apps.length) return null;
  return fb.firestore();
}

async function fbGetCollection(collectionName: string): Promise<any[]> {
  const db = getDb();
  if (!db) return [];
  try {
    const snapshot = await db.collection(collectionName).get();
    const results: any[] = [];
    snapshot.forEach((doc: any) => results.push({ id: doc.id, ...doc.data() }));
    return results;
  } catch {
    return [];
  }
}

async function fbAddDoc(collectionName: string, data: any): Promise<any> {
  const db = getDb();
  if (!db) return { id: generateId(), ...data };
  try {
    const docRef = await db.collection(collectionName).add(data);
    return { id: docRef.id, ...data };
  } catch {
    return { id: generateId(), ...data };
  }
}

async function fbUpdateDoc(collectionName: string, id: string, data: any): Promise<void> {
  const db = getDb();
  if (!db) return;
  try {
    await db.collection(collectionName).doc(id).update(data);
  } catch { /* silent */ }
}

async function fbDeleteDoc(collectionName: string, id: string): Promise<void> {
  const db = getDb();
  if (!db) return;
  try {
    await db.collection(collectionName).doc(id).delete();
  } catch { /* silent */ }
}

// ====== LOCALSTORAGE FALLBACK ======

const LS_COMPANIES = 'carto-companies';
const LS_PROJECTS = 'carto-projects';
const LS_FILES = 'carto-files';

function loadFromLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveToLocal(key: string, data: any): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch { /* silent */ }
}

// ====== DEMO DATA ======

function createDemoData() {
  const companies: Company[] = [
    { id: 'c1', name: 'Societe Generale de Construction', notes: 'Client majeur depuis 2018', createdAt: '2024-01-10', color: '#1E3A5F' },
    { id: 'c2', name: 'Promogim Immobilier', notes: 'Promoteur regional', createdAt: '2024-02-15', color: '#0D9488' },
    { id: 'c3', name: 'Municipalite de Casablanca', notes: 'Marches publics', createdAt: '2024-03-01', color: '#7C3AED' },
  ];

  const projects: Project[] = [
    { id: 'p1', code: 'AIM-2024-001', name: 'Construction Batiment Administratif SGC', companyId: 'c1', status: 'active', notes: 'Batiment R+4. Budget 45M DH', createdAt: '2024-01-15' },
    { id: 'p2', code: 'AIM-2024-002', name: 'Renovation Siege Social', companyId: 'c1', status: 'won', notes: 'Renovation complete', createdAt: '2024-02-20' },
    { id: 'p3', code: 'AIM-2024-005', name: 'Residence Les Jardins', companyId: 'c2', status: 'active', notes: '120 logements', createdAt: '2024-03-10' },
    { id: 'p4', code: 'AIM-2024-008', name: 'Centre Culturel Municipal', companyId: 'c3', status: 'lost', notes: 'AO public non retenu', createdAt: '2024-04-05' },
  ];

  const files: ProjectFile[] = [
    { id: 'f1', projectId: 'p1', stepId: 'reception', name: 'Consultation_SGC_001.pdf', type: 'pdf', size: '2.4 MB', date: '2024-01-15' },
    { id: 'f2', projectId: 'p1', stepId: 'reception', name: 'Cahier_des_Charges_SGC.docx', type: 'doc', size: '1.8 MB', date: '2024-01-16' },
    { id: 'f3', projectId: 'p1', stepId: 'preetude', name: 'Note_faisabilite_SGC.xlsx', type: 'xls', size: '856 KB', date: '2024-01-18' },
    { id: 'f4', projectId: 'p1', stepId: 'scop', name: 'Document_SCOP_projet1.docx', type: 'doc', size: '1.2 MB', date: '2024-01-20' },
    { id: 'f5', projectId: 'p1', stepId: 'takeoff', name: 'Metre_quantitatif_SGC.xlsx', type: 'xls', size: '3.1 MB', date: '2024-01-22' },
    { id: 'f6', projectId: 'p1', stepId: 'takeoff', name: 'Plans_niveau_SGC.pdf', type: 'pdf', size: '5.4 MB', date: '2024-01-22' },
    { id: 'f7', projectId: 'p1', stepId: 'chiffrage', name: 'Chiffrage_complet_SGC.xlsx', type: 'xls', size: '2.7 MB', date: '2024-01-28' },
    { id: 'f8', projectId: 'p1', stepId: 'preparation-offre', name: 'Offre_Technique_SGC.docx', type: 'doc', size: '4.2 MB', date: '2024-02-01' },
    { id: 'f9', projectId: 'p1', stepId: 'preparation-offre', name: 'Offre_Commerciale_SGC.xlsx', type: 'xls', size: '1.9 MB', date: '2024-02-01' },
    { id: 'f10', projectId: 'p2', stepId: 'reception', name: 'AO_Renovation_SGC.pdf', type: 'pdf', size: '3.1 MB', date: '2024-02-20' },
    { id: 'f11', projectId: 'p2', stepId: 'verification', name: 'Contrat_Signe_Renovation.pdf', type: 'pdf', size: '4.5 MB', date: '2024-03-15' },
    { id: 'f12', projectId: 'p3', stepId: 'reception', name: 'Consultation_Promogim_005.pdf', type: 'pdf', size: '5.2 MB', date: '2024-03-10' },
    { id: 'f13', projectId: 'p3', stepId: 'preetude', name: 'Faisabilite_LesJardins.xlsx', type: 'xls', size: '1.2 MB', date: '2024-03-12' },
    { id: 'f14', projectId: 'p4', stepId: 'reception', name: 'AO_Centre_Culturel.pdf', type: 'pdf', size: '8.1 MB', date: '2024-04-05' },
    { id: 'f15', projectId: 'p4', stepId: 'analyse-raisons', name: 'Analyse_Refus_CentreCulturel.docx', type: 'doc', size: '650 KB', date: '2024-05-01' },
  ];

  return { companies, projects, files };
}

// ====== MAIN HOOK ======

export function useCloudStorage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [files, setFiles] = useState<ProjectFile[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [syncing, setSyncing] = useState(false);

  // Determine if we have Firebase
  const hasFirebase = typeof window !== 'undefined' && !!getDb();

  // Initial load - always use localStorage immediately, then try Firebase
  useEffect(() => {
    // Load from localStorage immediately (never block)
    const demo = createDemoData();
    const lsCompanies = loadFromLocal<Company[]>(LS_COMPANIES, demo.companies);
    const lsProjects = loadFromLocal<Project[]>(LS_PROJECTS, demo.projects);
    const lsFiles = loadFromLocal<ProjectFile[]>(LS_FILES, demo.files);

    setCompanies(lsCompanies);
    setProjects(lsProjects);
    setFiles(lsFiles);
    setInitialized(true);

    // Optionally sync from Firebase if available (non-blocking)
    async function tryFirebase() {
      // Wait a bit for Firebase CDN to load
      await new Promise(r => setTimeout(r, 1000));
      if (getDb()) {
        try {
          const [fbCompanies, fbProjects, fbFiles] = await Promise.all([
            fbGetCollection('companies'),
            fbGetCollection('projects'),
            fbGetCollection('files'),
          ]);
          // Only use Firebase data if it has more entries than local
          if (fbCompanies.length >= lsCompanies.length && fbCompanies.length > 0) {
            setCompanies(fbCompanies);
            setProjects(fbProjects);
            setFiles(fbFiles);
          }
        } catch { /* silent */ }
      }
    }

    tryFirebase();
  }, []);

  // Persist to localStorage on changes
  useEffect(() => {
    if (!initialized) return;
    saveToLocal(LS_COMPANIES, companies);
    saveToLocal(LS_PROJECTS, projects);
    saveToLocal(LS_FILES, files);
  }, [companies, projects, files, initialized]);

  // Sync to Firebase when data changes
  const syncToCloud = useCallback(async () => {
    const firebaseDb = getDb();
    if (!firebaseDb || syncing) return;
    setSyncing(true);
    try {
      const companiesSnapshot = await firebaseDb.collection('companies').get();
      const deletePromises = companiesSnapshot.docs.map((doc: any) => doc.ref.delete());
      await Promise.all(deletePromises);

      const writePromises = [
        ...companies.map(c => firebaseDb.collection('companies').doc(c.id).set(c)),
        ...projects.map(p => firebaseDb.collection('projects').doc(p.id).set(p)),
        ...files.map(f => firebaseDb.collection('files').doc(f.id).set(f)),
      ];
      await Promise.all(writePromises);
    } catch (e) {
      console.warn('Cloud sync failed, data kept locally:', e);
    } finally {
      setSyncing(false);
    }
  }, [companies, projects, files, syncing]);

  // ====== CRUD OPERATIONS ======

  const addCompany = useCallback((name: string, notes: string = ''): Company => {
    const color = companyColors[companies.length % companyColors.length];
    const newCompany: Company = {
      id: 'c' + Date.now().toString(36),
      name,
      notes,
      createdAt: new Date().toISOString().split('T')[0],
      color,
    };
    setCompanies(prev => [...prev, newCompany]);
    return newCompany;
  }, [companies.length]);

  const updateCompany = useCallback((id: string, updates: Partial<Company>) => {
    setCompanies(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
    fbUpdateDoc('companies', id, updates);
  }, []);

  const deleteCompany = useCallback((id: string) => {
    setCompanies(prev => prev.filter(c => c.id !== id));
    setProjects(prev => {
      const toDelete = prev.filter(p => p.companyId === id).map(p => p.id);
      setFiles(f => f.filter(file => !toDelete.includes(file.projectId)));
      return prev.filter(p => p.companyId !== id);
    });
    fbDeleteDoc('companies', id);
  }, []);

  const addProject = useCallback((companyId: string, code: string, name: string, notes: string = ''): Project => {
    const newProject: Project = {
      id: 'p' + Date.now().toString(36),
      code,
      name,
      companyId,
      status: 'active',
      notes,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setProjects(prev => [...prev, newProject]);
    return newProject;
  }, []);

  const updateProject = useCallback((id: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
    fbUpdateDoc('projects', id, updates);
  }, []);

  const deleteProject = useCallback((id: string) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    setFiles(prev => prev.filter(f => f.projectId !== id));
    fbDeleteDoc('projects', id);
  }, []);

  const addFile = useCallback((projectId: string, stepId: string, name: string, fileType: string, size: string): ProjectFile => {
    const newFile: ProjectFile = {
      id: 'f' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
      projectId,
      stepId,
      name,
      type: fileType as 'pdf' | 'doc' | 'xls' | 'image' | 'other',
      size,
      date: new Date().toISOString().split('T')[0],
    };
    setFiles(prev => [...prev, newFile]);
    fbAddDoc('files', newFile);
    return newFile;
  }, []);

  const deleteFile = useCallback((fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
    fbDeleteDoc('files', fileId);
  }, []);

  // ====== QUERY HELPERS ======

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
    syncing,
    hasFirebase,
    addCompany,
    updateCompany,
    deleteCompany,
    addProject,
    updateProject,
    deleteProject,
    addFile,
    deleteFile,
    syncToCloud,
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
