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
    { id: 1, name: "Societe ABC Construct", notes: "Client majeur - BTP", color: "#1E3A5F" },
    { id: 2, name: "Industries XYZ", notes: "Secteur industriel", color: "#7C3AED" },
    { id: 3, name: "Municipalite de Villefranche", notes: "Marche public", color: "#059669" },
  ],
  projects: [
    { id: 1, code: "AIM-2025-001", name: "Extension batiment A", companyId: 1, status: "active", notes: "Chiffrage en cours", ownerId: 4, team: 1 },
    { id: 2, code: "AIM-2025-002", name: "Renovation facade", companyId: 1, status: "won", notes: "Contrat signe", ownerId: 4, team: 1 },
    { id: 3, code: "AIM-2025-003", name: "Installation equipements", companyId: 2, status: "active", notes: "Negociation en cours", ownerId: 6, team: 2 },
    { id: 4, code: "AIM-2025-004", name: "Amenagement salle des fetes", companyId: 3, status: "active", notes: "Etude des exigences", ownerId: 5, team: 1 },
    { id: 5, code: "AIM-2025-005", name: "Parking souterrain", companyId: 3, status: "lost", notes: "Refuse - budget", ownerId: 6, team: 2 },
  ],
  files: [
    { id: 1, projectId: 1, stepId: "reception", name: "Consultation_ABC_2025.pdf", type: "pdf", fileType: "pdf", size: "2.4 MB", date: "2025-01-15", uploadedBy: 4 },
    { id: 2, projectId: 1, stepId: "preetude", name: "Note_faisabilite.docx", type: "doc", fileType: "doc", size: "156 KB", date: "2025-01-18", uploadedBy: 4 },
    { id: 3, projectId: 1, stepId: "scop", name: "SCOP_Extension.xlsx", type: "xls", fileType: "xls", size: "89 KB", date: "2025-01-22", uploadedBy: 4 },
    { id: 4, projectId: 2, stepId: "reception", name: "AO_Renovation.pdf", type: "pdf", fileType: "pdf", size: "4.1 MB", date: "2024-12-10", uploadedBy: 4 },
    { id: 5, projectId: 2, stepId: "bilan", name: "Bilan_affaire_2025.pdf", type: "pdf", fileType: "pdf", size: "1.8 MB", date: "2025-03-01", uploadedBy: 2 },
    { id: 6, projectId: 3, stepId: "chiffrage", name: "Chiffrage_equipements.xlsx", type: "xls", fileType: "xls", size: "245 KB", date: "2025-02-05", uploadedBy: 6 },
    { id: 7, projectId: 4, stepId: "exigences", name: "Cahier_des_charges.pdf", type: "pdf", fileType: "pdf", size: "5.2 MB", date: "2025-02-20", uploadedBy: 5 },
    { id: 8, projectId: 1, stepId: "takeoff", name: "Metre_quantitatif.xlsx", type: "xls", fileType: "xls", size: "178 KB", date: "2025-01-25", uploadedBy: 4 },
    { id: 9, projectId: 1, stepId: "preparation-offre", name: "Offre_technique.pdf", type: "pdf", fileType: "pdf", size: "3.6 MB", date: "2025-02-10", uploadedBy: 4 },
    { id: 10, projectId: 3, stepId: "negociation", name: "CR_Negociation.docx", type: "doc", fileType: "doc", size: "45 KB", date: "2025-02-28", uploadedBy: 6 },
    { id: 11, projectId: 4, stepId: "harmonisation", name: "Plans_valides.pdf", type: "pdf", fileType: "pdf", size: "8.1 MB", date: "2025-03-05", uploadedBy: 5 },
    { id: 12, projectId: 1, stepId: "fournisseur", name: "Devis_fournisseurs.xlsx", type: "xls", fileType: "xls", size: "312 KB", date: "2025-02-01", uploadedBy: 4 },
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
