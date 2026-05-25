# Presentation Outline

## Page 1 [cover]
- **Title**: Cartographie Interactive
- **Content**: Systeme de Gestion Collaborative des Consultations et Appels d'Offres — Prototype & Architecture Technique

## Page 2 [table_of_contents]
- **Title**: Sommaire
- **Content**: 1. Contexte & Vision; 2. Architecture Technique; 3. Systeme de Permissions (RBAC); 4. Deploiement & Perspectives

## Page 3 [chapter]
- **Title**: 01 — Contexte & Vision
- **Content**: Problematique, solution proposee et fonctionnalites cles

## Page 4 [content]
- **Title**: Problematique : Le Chaos Documentaire dans le Processus Commercial
- **Content**: 
  - Les consultations et appels d'offres generent des centaines de documents
  - Aucun systeme centralise pour organiser les fichiers par entreprise / projet / etape
  - Les membres de l'equipe commerciale travaillent en silos sans visibilite
  - Les directeurs n'ont pas d'acces structure aux donnees pour le pilotage
  - Risque de perte de documents, doublons, et manque de traçabilite

## Page 5 [content]
- **Title**: Solution : Une Cartographie Interactive avec Gestion Collaborative
- **Content**: 
  - Interface visuelle du processus commercial (14 etapes)
  - Organisateur hierarchique : Entreprise > Projet AIM-XXXX > Dossier > Fichier
  - Systeme de roles et permissions (Commercial / Directeur / Admin)
  - Partage de projets avec autorisation granulaire
  - Synchronisation cloud via Firebase

## Page 6 [chapter]
- **Title**: 02 — Architecture Technique
- **Content**: Stack technologique, schema de base de donnees et API

## Page 7 [content]
- **Title**: Stack Technologique Full-Stack Moderne
- **Content**: 
  - Frontend: React 19 + TypeScript + Tailwind CSS + shadcn/ui
  - Backend: Hono (HTTP) + tRPC 11 (API type-safe) + Drizzle ORM (MySQL)
  - Auth: Kimi OAuth 2.0 avec JWT sessions
  - Cloud: Firebase Firestore (synchronisation temps reel)
  - Build: Vite (bundling ultra-rapide)

## Page 8 [content]
- **Title**: Schema de Base de Donnees — 5 Tables Cles
- **Content**: 
  - users: id, unionId, name, email, avatar, role (commercial|directeur|admin)
  - companies: id, name, notes, color, createdBy
  - projects: id, code, name, companyId, ownerId, status, notes
  - projectFiles: id, projectId, stepId, name, fileType, size, date, createdBy
  - projectMembers: id, projectId, userId, permission (owner|editor|viewer|pending), grantedBy

## Page 9 [chapter]
- **Title**: 03 — Systeme de Permissions (RBAC)
- **Content**: Role-Based Access Control avec 3 niveaux hierarchiques

## Page 10 [content]
- **Title**: Matrice de Permissions — Qui peut faire quoi ?
- **Content**: 
  - Tableau 3 roles x 5 actions
  - Commercial: Voir ses projets + partages, Editer ses projets, Partager (owner), Supprimer (owner), Ne peut pas voir tout
  - Directeur: Voir TOUS les projets, Editer sur autorisation, Ne peut pas partager, Ne peut pas supprimer, Vision globale
  - Admin: Voir tout, Editer tout, Partager tout, Supprimer tout, Controle total

## Page 11 [content]
- **Title**: API tRPC — Endpoints Securises par Role
- **Content**: 
  - companies.list (authedQuery) — Liste toutes les entreprises
  - companies.create (authedQuery) — Cree une entreprise
  - companies.update/delete (directeurQuery) — Modification restreinte
  - projects.list (authedQuery + filtre par permissions)
  - projects.create (authedQuery) — Le createur devient owner
  - projects.update (authedQuery + canEditProject middleware)
  - projects.share (authedQuery + ownership check)
  - files.create/delete (authedQuery + edit permission check)

## Page 12 [chapter]
- **Title**: 04 — Deploiement & Perspectives
- **Content**: Guide de mise en production et fonctionnalites futures

## Page 13 [content]
- **Title**: Guide de Deploiement sur Serveur
- **Content**: 
  - Pre-requis: Node.js 20+, MySQL 8+, compte Kimi OAuth
  - Etape 1: Cloner le projet, installer avec npm install
  - Etape 2: Configurer .env (DATABASE_URL, OAuth credentials)
  - Etape 3: Pousser le schema DB avec npm run db:push
  - Etape 4: Builder avec npm run build
  - Etape 5: Demarrer avec npm start (production)
  - Front accessible sur localhost:3000, API sur /api/trpc

## Page 14 [content]
- **Title**: Perspectives d'Evolution
- **Content**: 
  - Notifications temps reel (demandes d'acces, modifications)
  - Historique des modifications (audit trail)
  - Recherche full-text dans les documents
  - Export de rapports PDF par projet
  - Integration avec systemes de signature electronique
  - Mobile app (React Native avec code partage)

## Page 15 [final]
- **Title**: Merci
- **Content**: Cartographie Interactive — Prototype operationnel avec architecture scalable et securisee. Pret pour le deploiement en production.
