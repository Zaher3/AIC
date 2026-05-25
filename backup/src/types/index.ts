// Flowchart types
export type NodeType = 'start' | 'step' | 'decision' | 'parallel' | 'end' | 'branch';

export interface FlowNode {
  id: string;
  step: number;
  title: string;
  type: NodeType;
  description: string;
  details?: string[];
  documentTypes?: string[];
  branches?: Branch[];
  icon?: string;
  folderName: string; // The folder name used in project structure
}

export interface Branch {
  label: string;
  nodes?: FlowNode[];
  color?: string;
}

// File types
export interface NodeFile {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'xls' | 'image' | 'other';
  size: string;
  date: string;
}

// Hierarchy types
export interface Company {
  id: string;
  name: string;
  notes: string;
  createdAt: string;
  color: string;
}

export interface Project {
  id: string;
  code: string; // AIM-XXXX
  name: string;
  companyId: string;
  status: 'active' | 'won' | 'lost' | 'archived';
  notes: string;
  createdAt: string;
}

export interface ProjectFile {
  id: string;
  projectId: string;
  stepId: string;
  name: string;
  type: 'pdf' | 'doc' | 'xls' | 'image' | 'other';
  size: string;
  date: string;
}

export interface BreadcrumbItem {
  label: string;
  type: 'root' | 'company' | 'project' | 'step';
  id: string;
}
