const STORAGE_KEY = "carto_demo_data";

export interface DemoCompany {
  id: number;
  name: string;
  notes: string;
  color: string;
}

export interface DemoProject {
  id: number;
  code: string;
  name: string;
  companyId: number;
  status: "active" | "won" | "lost" | "archived";
  notes: string;
  ownerId: number;
  team: number;
}

export interface DemoFile {
  id: number;
  projectId: number;
  stepId: string;
  name: string;
  type: "pdf" | "doc" | "xls" | "image";
  fileType: string;
  size: string;
  date: string;
  uploadedBy: number;
}

export interface DemoDataStore {
  companies: DemoCompany[];
  projects: DemoProject[];
  files: DemoFile[];
}

const DEFAULT_DATA: DemoDataStore = {
  companies: [
    { 
      id: 1, 
      name: "JESA (OCP/Managem)", 
      notes: "Joint Engineering Services Africa - Client historique, projets industriels", 
      color: "#1E3A5F" 
    },
    { 
      id: 2, 
      name: "SONASID", 
      notes: "Societe Nationale de Siderurgie - Projet tuyauterie et installation piping", 
      color: "#059669" 
    },
  ],
  projects: [
    { 
      id: 1, 
      code: "AIM-35E-26", 
      name: "Static Mixer", 
      companyId: 1, 
      status: "active", 
      notes: "Etude et installation de melangeurs statiques - JESA", 
      ownerId: 4, 
      team: 1 
    },
    { 
      id: 2, 
      code: "AIM-37E-26", 
      name: "Tuyauterie d'air comprimé et eau de lavage HP", 
      companyId: 1, 
      status: "active", 
      notes: "Reseau tuyauterie air comprime et eau haute pression - JESA", 
      ownerId: 4, 
      team: 1 
    },
    { 
      id: 3, 
      code: "AIM-54E-26", 
      name: "CDC Installation Piping 2050033927", 
      companyId: 2, 
      status: "active", 
      notes: "Cahier des charges installation tuyauterie - SONASID", 
      ownerId: 6, 
      team: 2 
    },
  ],
  files: [
    // AIM-35E-26 Static Mixer - JESA
    { id: 1, projectId: 1, stepId: "reception", name: "Consultation_AIM-35E-26.pdf", type: "pdf", fileType: "pdf", size: "2.4 MB", date: "2026-04-23", uploadedBy: 4 },
    { id: 2, projectId: 1, stepId: "exigences", name: "Cahier_des_Charges_Statique_Mixer.docx", type: "doc", fileType: "doc", size: "345 KB", date: "2026-04-24", uploadedBy: 4 },
    { id: 3, projectId: 1, stepId: "scop", name: "SCOP_Static_Mixer_JESA.xlsx", type: "xls", fileType: "xls", size: "89 KB", date: "2026-04-25", uploadedBy: 4 },
    { id: 4, projectId: 1, stepId: "chiffrage", name: "Chiffrage_Detaille_AIM-35E-26.xlsx", type: "xls", fileType: "xls", size: "512 KB", date: "2026-04-28", uploadedBy: 4 },
    { id: 5, projectId: 1, stepId: "fournisseur", name: "Devis_Fournisseurs_Mixer.pdf", type: "pdf", fileType: "pdf", size: "1.8 MB", date: "2026-05-02", uploadedBy: 2 },
    { id: 6, projectId: 1, stepId: "preparation-offre", name: "Offre_Technique_AIM-35E-26.pdf", type: "pdf", fileType: "pdf", size: "4.2 MB", date: "2026-05-05", uploadedBy: 4 },

    // AIM-37E-26 Tuyauterie - JESA
    { id: 7, projectId: 2, stepId: "reception", name: "Consultation_AIM-37E-26.pdf", type: "pdf", fileType: "pdf", size: "3.1 MB", date: "2026-04-28", uploadedBy: 4 },
    { id: 8, projectId: 2, stepId: "exigences", name: "CDC_Tuyauterie_Air_Eau_HP.docx", type: "doc", fileType: "doc", size: "456 KB", date: "2026-04-29", uploadedBy: 4 },
    { id: 9, projectId: 2, stepId: "preetude", name: "Note_Faisabilite_Tuyauterie.pdf", type: "pdf", fileType: "pdf", size: "2.8 MB", date: "2026-05-01", uploadedBy: 4 },
    { id: 10, projectId: 2, stepId: "chiffrage", name: "Chiffrage_AIM-37E-26.xlsx", type: "xls", fileType: "xls", size: "678 KB", date: "2026-05-03", uploadedBy: 6 },
    { id: 11, projectId: 2, stepId: "fournisseur", name: "Devis_Tuyauterie_Industrielle.pdf", type: "pdf", fileType: "pdf", size: "2.4 MB", date: "2026-05-06", uploadedBy: 4 },

    // AIM-54E-26 SONASID
    { id: 12, projectId: 3, stepId: "reception", name: "Consultation_AIM-54E-26.pdf", type: "pdf", fileType: "pdf", size: "5.2 MB", date: "2026-05-07", uploadedBy: 5 },
    { id: 13, projectId: 3, stepId: "exigences", name: "CDC_Installation_Piping_2050033927.pdf", type: "pdf", fileType: "pdf", size: "8.6 MB", date: "2026-05-07", uploadedBy: 5 },
    { id: 14, projectId: 3, stepId: "scop", name: "SCOP_Piping_SONASID.xlsx", type: "xls", fileType: "xls", size: "245 KB", date: "2026-05-08", uploadedBy: 6 },
    { id: 15, projectId: 3, stepId: "preetude", name: "Etude_Prefaisabilite_Piping.pdf", type: "pdf", fileType: "pdf", size: "4.1 MB", date: "2026-05-10", uploadedBy: 5 },
  ],
};

export function getDemoData(): DemoDataStore {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return { ...DEFAULT_DATA };
}

export function initDemoData(): DemoDataStore {
  const data = { ...DEFAULT_DATA };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  return data;
}

export function saveDemoData(data: DemoDataStore): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function resetDemoData(): DemoDataStore {
  localStorage.removeItem(STORAGE_KEY);
  return initDemoData();
}

export function getDemoCompanies(): DemoCompany[] { return getDemoData().companies; }
export function getDemoProjects(): DemoProject[] { return getDemoData().projects; }
export function getDemoFiles(): DemoFile[] { return getDemoData().files; }

export function isDemoDataInitialized(): boolean {
  return localStorage.getItem(STORAGE_KEY) !== null;
}
