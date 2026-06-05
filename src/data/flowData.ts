import type { FlowNode } from '@/types';

export const flowNodes: FlowNode[] = [
  {
    id: 'reception',
    step: 1,
    title: 'Réception d\'offre',
    type: 'start',
    folderName: '01 - DOSSIER CONSULTATIONS',
    description: 'Point de départ du processus commercial. Réception formelle de la demande d\'offre du client potentiel (consultation ou appel d\'offres). Cette étape déclenche l\'ensemble de la procédure de chiffrage et de réponse commerciale.',
    details: [
      'Enregistrer la date de réception',
      'Identifier le client et le contact',
      'Noter la date limite de réponse',
      'Vérifier la complétude du dossier reçu'
    ],
    documentTypes: ['Consultation', 'Appel d\'offres', 'Dossier technique', 'Cahier des charges'],
    icon: 'inbox'
  },
  {
    id: 'preetude',
    step: 2,
    title: 'Pré-étude',
    type: 'decision',
    folderName: '02 - DOSSIER ETUDE',
    description: 'Analyse préliminaire de la faisabilité et de la pertinence de l\'offre. Évaluation des capacités techniques, financières et temporelles. Décision d\'aller de l\'avant ou de décliner l\'opportunité.',
    details: [
      'Analyse rapide du périmètre',
      'Vérification des compétences disponibles',
      'Estimation préliminaire des délais',
      'Évaluation de la rentabilité potentielle'
    ],
    documentTypes: ['Note de faisabilité', 'Grille d\'évaluation'],
    branches: [
      { label: 'Faisable', color: '#4ADE80' },
      { label: 'Décliner', color: '#EF4444' }
    ],
    icon: 'search'
  },
  {
    id: 'scop',
    step: 3,
    title: 'Définition du SCOP',
    type: 'step',
    folderName: '02 - DOSSIER ETUDE',
    description: 'Définition du périmètre du projet (Scope). Établissement clair des livrables, des limites du projet, des exclusions et des critères d\'acceptation. Le SCOP formalise ce qui est inclus et exclu du contrat.',
    details: [
      'Définir les livrables attendus',
      'Lister les inclusions et exclusions',
      'Fixer les critères d\'acceptation',
      'Valider le périmètre avec le client si nécessaire'
    ],
    documentTypes: ['Document de périmètre (SCOP)', 'Matrice d\'exclusions'],
    icon: 'file-text'
  },
  {
    id: 'takeoff',
    step: 4,
    title: 'Métro TakeOff',
    type: 'step',
    folderName: '02 - DOSSIER ETUDE',
    description: 'Phase de quantification et de mesure des travaux. Le \'TakeOff\' consiste à extraire les quantités de matériaux, de main-d\'œuvre et d\'équipements nécessaires à partir des plans et documents techniques. C\'est la base du chiffrage.',
    details: [
      'Extraire les quantités des plans',
      'Mesurer les surfaces et volumes',
      'Identifier les équipements nécessaires',
      'Quantifier la main-d\'œuvre requise'
    ],
    documentTypes: ['Métré quantitatif', 'Plans et extraits', 'Devis descriptif'],
    icon: 'ruler'
  },
  {
    id: 'exigences',
    step: 5,
    title: 'Étude des exigences',
    type: 'step',
    folderName: '02 - DOSSIER ETUDE',
    description: 'Analyse approfondie des spécifications techniques, normes, réglementations et exigences particulières du client. Identification des contraintes et des risques associés au projet.',
    details: [
      'Analyser les spécifications techniques',
      'Identifier les normes applicables',
      'Relever les contraintes réglementaires',
      'Évaluer les risques projet'
    ],
    documentTypes: ['Spécifications techniques', 'Analyse des risques', 'Registre des exigences'],
    icon: 'clipboard-list'
  },
  {
    id: 'montage',
    step: 6,
    title: 'Montage / Fabrication',
    type: 'parallel',
    folderName: '05 - DOSSIER CORRESPONDANT',
    description: 'Préparation technique parallèle : Montage et assemblage des éléments sur site, et fabrication des composants sur mesure en atelier. Coordination avec les équipes de production.',
    details: [
      'Planifier les opérations de montage',
      'Préparer les kits de fabrication',
      'Coordonner avec la production',
      'Valider les procédures de contrôle qualité'
    ],
    documentTypes: ['Plan de montage', 'Fiches de fabrication', 'Procédures qualité'],
    icon: 'settings'
  },
  {
    id: 'fournisseur',
    step: 6,
    title: 'Fournisseur / Sous-traitants',
    type: 'parallel',
    folderName: '05 - DOSSIER CORRESPONDANT',
    description: 'Processus de sourcing et contractualisation en parallèle : sélection et négociation avec les fournisseurs de matériaux, identification et contractualisation des sous-traitants spécialisés.',
    details: [
      'Sélectionner les fournisseurs potentiels',
      'Demander des devis comparatifs',
      'Négocier les prix et délais',
      'Établir les bons de commande'
    ],
    documentTypes: ['Devis fournisseurs', 'Contrats sous-traitance', 'Bons de commande'],
    icon: 'truck'
  },
  {
    id: 'chiffrage',
    step: 7,
    title: 'Chiffrage',
    type: 'step',
    folderName: '02 - DOSSIER ETUDE',
    description: 'Élaboration du coût total du projet. Intégration des coûts de matériaux, main-d\'œuvre, équipements, sous-traitance, frais généraux et marge bénéficiaire. Le chiffrage doit être précis et compétitif tout en garantissant la rentabilité.',
    details: [
      'Consolider les coûts matériaux',
      'Calculer la main-d\'œuvre',
      'Intégrer les coûts sous-traitance',
      'Ajouter les frais généraux et la marge'
    ],
    documentTypes: ['Fichier de chiffrage', 'Grille de prix', 'Analyse de rentabilité'],
    icon: 'calculator'
  },
  {
    id: 'preparation-offre',
    step: 8,
    title: 'Préparation d\'offre',
    type: 'step',
    folderName: '05 - DOSSIER CORRESPONDANT',
    description: 'Rédaction du document d\'offre complet comprenant la partie technique (description de la solution, planning, méthodologie, équipe) et la partie commerciale (prix détaillé, conditions de paiement, garanties).',
    details: [
      'Rédiger la partie technique',
      'Préparer le détail des prix',
      'Définir les conditions commerciales',
      'Assembler le document final'
    ],
    documentTypes: ['Offre technique', 'Offre commerciale', 'Planning de réalisation'],
    icon: 'file-edit'
  },
  {
    id: 'negociation',
    step: 9,
    title: 'Suivi et Négociation',
    type: 'decision',
    folderName: '05 - DOSSIER CORRESPONDANT',
    description: 'Phase de suivi de l\'offre auprès du client. Relances régulières pour obtenir un retour. Négociation sur les prix, délais et conditions si nécessaire. C\'est un moment clé pour convertir l\'opportunité en contrat.',
    details: [
      'Relancer le client régulièrement',
      'Répondre aux questions techniques',
      'Négocier si demandé',
      'Obtenir une décision formelle'
    ],
    documentTypes: ['Comptes-rendus de relance', 'Protocole de négociation'],
    branches: [
      { label: 'Acceptée', color: '#4ADE80' },
      { label: 'Refusée', color: '#EF4444' }
    ],
    icon: 'handshake'
  },
  {
    id: 'analyse-raisons',
    step: 9,
    title: 'Analyse des Raisons',
    type: 'branch',
    folderName: '05 - DOSSIER CORRESPONDANT',
    description: 'Analyse des motifs du refus ou de la non-conversion. Identification des axes d\'amélioration : prix trop élevé, délais incompatibles, solution technique non adaptée, concurrence plus agressive.',
    details: [
      'Identifier les motifs du refus',
      'Analyser les écarts avec la concurrence',
      'Capitaliser les apprentissages',
      'Mettre à jour la base de données'
    ],
    documentTypes: ['Rapport d\'analyse', 'Fiche de retour d\'expérience'],
    icon: 'search-x'
  },
  {
    id: 'classement',
    step: 9,
    title: 'Classement',
    type: 'branch',
    folderName: '05 - DOSSIER CORRESPONDANT',
    description: 'Classement et archivage de l\'affaire dans la base de données commerciale. Mise à jour du CRM avec les informations recueillies. L\'affaire peut être réactivée ultérieurement si les circonstances changent.',
    details: [
      'Archiver tous les documents',
      'Mettre à jour le CRM',
      'Notifier l\'équipe commerciale',
      'Programmer une relance éventuelle'
    ],
    documentTypes: ['Fiche de classement', 'Synthèse CRM'],
    icon: 'archive'
  },
  {
    id: 'verification',
    step: 10,
    title: 'Vérification commande/contrat',
    type: 'step',
    folderName: '01 - DOSSIER CONSULTATIONS',
    description: 'Vérification rigoureuse de la commande ou du contrat signé par rapport à l\'offre soumise. Contrôle de la conformité des termes, des prix, des délais et des spécifications. Identification des écarts éventuels à traiter avant démarrage.',
    details: [
      'Comparer commande vs offre',
      'Vérifier les prix et quantités',
      'Contrôler les délais',
      'Signaler les écarts éventuels'
    ],
    documentTypes: ['Contrat signé', 'Grille de conformité', 'Note d\'écarts'],
    icon: 'check-circle'
  },
  {
    id: 'harmonisation',
    step: 11,
    title: 'Réunion d\'harmonisation',
    type: 'step',
    folderName: '05 - DOSSIER CORRESPONDANT',
    description: 'Réunion de coordination avec le client pour aligner les aspects techniques. Validation des plans finaux, confirmation des choix techniques, clarification des points d\'interface. Cette étape assure que toutes les parties partagent la même vision du projet.',
    details: [
      'Préparer l\'ordre du jour',
      'Valider les plans définitifs',
      'Confirmer les choix techniques',
      'Rédiger le compte-rendu'
    ],
    documentTypes: ['Ordre du jour', 'Compte-rendu de réunion', 'Plans validés'],
    icon: 'users'
  },
  {
    id: 'passation',
    step: 12,
    title: 'Réunion de passation',
    type: 'step',
    folderName: '05 - DOSSIER CORRESPONDANT',
    description: 'Réunion officielle de transfert du projet de l\'équipe commerciale vers l\'équipe de réalisation (passation de consignes). Transmission de toute la documentation, des engagements pris et des points de vigilance.',
    details: [
      'Préparer le dossier de passation',
      'Présenter les engagements clients',
      'Signaler les points de vigilance',
      'Valider la prise en charge par la réalisation'
    ],
    documentTypes: ['Dossier de passation', 'PV de passation', 'Checklist de transfert'],
    icon: 'arrow-right-circle'
  },
  {
    id: 'gestion-affaires',
    step: 13,
    title: 'Gestion des affaires',
    type: 'step',
    folderName: '06 - DOSSIER CLIENT',
    description: 'Mise en œuvre des processus de gestion de projet : planification détaillée, allocation des ressources, suivi budgétaire, gestion des risques, reporting. Cette étape structure l\'exécution du contrat dans le respect des engagements.',
    details: [
      'Établir le planning détaillé',
      'Allouer les ressources',
      'Mettre en place le suivi budgétaire',
      'Définir les indicateurs de suivi'
    ],
    documentTypes: ['Plan de management', 'Rapports de suivi', 'Tableaux de bord'],
    icon: 'bar-chart-3'
  },
  {
    id: 'bilan',
    step: 14,
    title: 'Bilan d\'affaire',
    type: 'end',
    folderName: '06 - DOSSIER CLIENT',
    description: 'Étape finale : bilan complet de l\'affaire. Analyse de la rentabilité réelle, satisfaction client, respect des délais et du budget. Capitalisation des apprentissages pour les futures offres. Clôture administrative et financière du projet.',
    details: [
      'Analyser la rentabilité réelle',
      'Mesurer la satisfaction client',
      'Capitaliser les apprentissages',
      'Clôturer administrativement et financièrement'
    ],
    documentTypes: ['Bilan de rentabilité', 'Enquête satisfaction', 'Fiche de capitalisation'],
    icon: 'trending-up'
  }
];

// Get unique folder names (for project folder structure)
export const getUniqueFolders = (): string[] => {
  const folders = flowNodes.map(n => n.folderName);
  return [...new Set(folders)];
};

export const getNodesByFolder = (folderName: string): FlowNode[] => {
  return flowNodes.filter(n => n.folderName === folderName);
};

export const getNodeById = (id: string): FlowNode | undefined => {
  return flowNodes.find(n => n.id === id);
};

// Color palette for companies
export const companyColors = [
  '#1E3A5F', '#2874F0', '#0D9488', '#7C3AED',
  '#DB2777', '#DC2626', '#EA580C', '#65A30D',
  '#0891B2', '#4338CA', '#2563EB', '#059669'
];
