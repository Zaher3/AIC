import { useState } from 'react';
import type { Company } from '@/types';
import { Building2, FolderKanban, Plus, Trash2, Edit3, ChevronRight } from 'lucide-react';

interface CompanyListProps {
  companies: Company[];
  projectsCount: (companyId: string) => number;
  onSelectCompany: (company: Company) => void;
  onAddCompany: (name: string, notes: string) => void;
  onDeleteCompany: (id: string) => void;
  onUpdateCompany: (id: string, updates: Partial<Company>) => void;
}

export default function CompanyList({
  companies,
  projectsCount,
  onSelectCompany,
  onAddCompany,
  onDeleteCompany,
  onUpdateCompany,
}: CompanyListProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editNotes, setEditNotes] = useState('');

  const handleAdd = () => {
    if (newName.trim()) {
      onAddCompany(newName.trim(), newNotes.trim());
      setNewName('');
      setNewNotes('');
      setShowAddForm(false);
    }
  };

  const startEdit = (company: Company) => {
    setEditingId(company.id);
    setEditName(company.name);
    setEditNotes(company.notes);
  };

  const saveEdit = (id: string) => {
    if (editName.trim()) {
      onUpdateCompany(id, { name: editName.trim(), notes: editNotes.trim() });
    }
    setEditingId(null);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <Building2 size={20} className="text-gray-500" />
          Entreprises
          <span className="text-sm font-normal text-gray-400 ml-1">({companies.length})</span>
        </h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-[#1E3A5F] rounded-lg hover:bg-[#152D4A] transition-colors"
        >
          <Plus size={16} />
          Ajouter
        </button>
      </div>

      {/* Add form */}
      {showAddForm && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
          <input
            type="text"
            placeholder="Nom de l'entreprise..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent"
            autoFocus
          />
          <textarea
            placeholder="Notes (optionnel)..."
            value={newNotes}
            onChange={(e) => setNewNotes(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent resize-none"
          />
          <div className="flex gap-2 justify-end">
            <button
              onClick={() => { setShowAddForm(false); setNewName(''); setNewNotes(''); }}
              className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleAdd}
              className="px-4 py-1.5 text-sm font-medium text-white bg-[#1E3A5F] rounded-lg hover:bg-[#152D4A] transition-colors"
            >
              Créer
            </button>
          </div>
        </div>
      )}

      {/* Company cards */}
      {companies.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <Building2 size={48} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm">Aucune entreprise</p>
          <p className="text-xs mt-1">Ajoutez votre première entreprise</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {companies.map((company) => {
            const count = projectsCount(company.id);
            const isEditing = editingId === company.id;

            return (
              <div
                key={company.id}
                className="group relative bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-gray-300 transition-all duration-200"
              >
                {isEditing ? (
                  <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm font-semibold"
                      autoFocus
                    />
                    <textarea
                      value={editNotes}
                      onChange={(e) => setEditNotes(e.target.value)}
                      rows={2}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-xs resize-none"
                    />
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => setEditingId(null)} className="text-xs text-gray-500 hover:text-gray-700">Annuler</button>
                      <button onClick={() => saveEdit(company.id)} className="text-xs font-medium text-[#1E3A5F] hover:underline">Enregistrer</button>
                    </div>
                  </div>
                ) : (
                  <div onClick={() => onSelectCompany(company)} className="cursor-pointer">
                    {/* Color bar */}
                    <div className="absolute top-0 left-0 right-0 h-1 rounded-t-xl" style={{ backgroundColor: company.color }} />

                    <div className="pt-2">
                      <div className="flex items-start justify-between">
                        <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 flex-1">{company.name}</h4>
                        <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0 mt-0.5" />
                      </div>

                      {company.notes && (
                        <p className="text-xs text-gray-500 mt-1.5 line-clamp-2">{company.notes}</p>
                      )}

                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <FolderKanban size={12} />
                          {count} projet{count > 1 ? 's' : ''}
                        </span>
                        <span className="text-xs text-gray-400">{company.createdAt}</span>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => { e.stopPropagation(); startEdit(company); }}
                        className="p-1 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                        title="Modifier"
                      >
                        <Edit3 size={12} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); onDeleteCompany(company.id); }}
                        className="p-1 rounded-md hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                        title="Supprimer"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
