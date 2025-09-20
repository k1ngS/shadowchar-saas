"use client";

import { useCharacterUIStore } from '~/stores/character-store';
import TalentForm from './TalentForm';
import { PencilIcon, PlusIcon, TrashIcon } from 'lucide-react';
import Modal from './ui/Modal';

export default function TalentsSection() {
  const {
    formData,
    editingTalent,
    isTalentModalOpen,
    removeTalent,
    setEditingTalent,
    setTalentModalOpen,
  } = useCharacterUIStore();

  if (!formData) return null;

  const handleAddTalent = () => {
    setEditingTalent(null);
    setTalentModalOpen(true);
  };

  const handleEditTalent = (talent: any) => {
    setEditingTalent(talent);
    setTalentModalOpen(true);
  };

  const handleDeleteTalent = (talentId: string, talentName: string) => {
    if (window.confirm(`Remover talento "${talentName}"?`)) {
      removeTalent(talentId);
    }
  };

  return (
    <>
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Talentos</h2>
          <button
            onClick={handleAddTalent}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-semibold text-white transition"
          >
            <PlusIcon className="w-4 h-4" />
            Adicionar Talento
          </button>
        </div>

        {formData.talents.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p>Nenhum talento adicionado.</p>
            <button
              onClick={handleAddTalent}
              className="mt-4 text-blue-400 hover:text-blue-300 transition"
            >
              Adicionar seu primeiro talento
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {formData.talents.map((talent) => (
              <div key={`${talent.id}-${talent.name}`} className="bg-gray-700 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-white">{talent.name}</h3>
                      {talent.type && (
                        <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs">
                          {talent.type}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-300 mb-2">{talent.description}</p>
                    {talent.requirements && (
                      <p className="text-sm text-yellow-400">
                        <strong>Requisitos:</strong> {talent.requirements}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEditTalent(talent)}
                      className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-600/20 rounded transition"
                      title="Editar talento"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteTalent(talent.id, talent.name)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-600/20 rounded transition"
                      title="Remover talento"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Talento */}
      <Modal
        isOpen={isTalentModalOpen}
        onClose={() => setTalentModalOpen(false)}
        title={editingTalent ? 'Editar Talento' : 'Adicionar Talento'}
        size="lg"
      >
        <TalentForm
          talent={editingTalent}
          onClose={() => setTalentModalOpen(false)}
        />
      </Modal>
    </>
  );
}
