import { useState } from "react";
import { Building2, Plus, Trash2, ChevronRight } from "lucide-react";

interface CompanyItem {
  id: number;
  name: string;
  notes: string | null;
  color: string;
}

interface CompanyListProps {
  companies: CompanyItem[];
  onSelectCompany: (company: CompanyItem) => void;
  onAddCompany: (name: string, notes: string) => void;
  onDeleteCompany: (id: number) => void;
  userRole: string;
}

export default function CompanyList({
  companies,
  onSelectCompany,
  onAddCompany,
  onDeleteCompany,
}: CompanyListProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newNotes, setNewNotes] = useState("");

  const handleAdd = () => {
    if (newName.trim()) {
      onAddCompany(newName.trim(), newNotes.trim());
      setNewName("");
      setNewNotes("");
      setShowAddForm(false);
    }
  };

  return (
    <div className="space-y-4">
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

      {showAddForm && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
          <input
            type="text"
            placeholder="Nom de l'entreprise..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F]"
            autoFocus
          />
          <textarea
            placeholder="Notes (optionnel)..."
            value={newNotes}
            onChange={(e) => setNewNotes(e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] resize-none"
          />
          <div className="flex gap-2 justify-end">
            <button onClick={() => { setShowAddForm(false); setNewName(""); setNewNotes(""); }} className="px-3 py-1.5 text-sm text-gray-600">
              Annuler
            </button>
            <button onClick={handleAdd} className="px-4 py-1.5 text-sm font-medium text-white bg-[#1E3A5F] rounded-lg hover:bg-[#152D4A]">
              Creer
            </button>
          </div>
        </div>
      )}

      {companies.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <Building2 size={48} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm">Aucune entreprise</p>
          <p className="text-xs mt-1">Ajoutez votre premiere entreprise</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {companies.map((company) => (
            <div
              key={company.id}
              className="group relative bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-gray-300 transition-all duration-200"
            >
              <div className="absolute top-0 left-0 right-0 h-1 rounded-t-xl" style={{ backgroundColor: company.color }} />
              <div onClick={() => onSelectCompany(company)} className="cursor-pointer pt-2">
                <div className="flex items-start justify-between">
                  <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 flex-1">{company.name}</h4>
                  <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-500 transition-colors flex-shrink-0 mt-0.5" />
                </div>
                {company.notes && (
                  <p className="text-xs text-gray-500 mt-1.5 line-clamp-2">{company.notes}</p>
                )}
              </div>
              <button
                onClick={(e) => { e.stopPropagation(); onDeleteCompany(company.id); }}
                className="absolute top-2 right-2 p-1.5 rounded-md hover:bg-red-50 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                title="Supprimer"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
