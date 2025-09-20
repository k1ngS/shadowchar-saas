"use client";

import { useCharacterUIStore } from '~/stores/character-store';
import { PlusIcon, PencilIcon, TrashIcon } from 'lucide-react';
import Modal from './ui/Modal';
import SpellForm from './SpellForm';

export default function SpellsSection() {
  const {
    formData,
    editingSpell,
    isSpellModalOpen,
    removeSpell,
    setEditingSpell,
    setSpellModalOpen,
  } = useCharacterUIStore();

  if (!formData) return null;

  const handleAddSpell = () => {
    setEditingSpell(null);
    setSpellModalOpen(true);
  };

  const handleEditSpell = (spell: any) => {
    setEditingSpell(spell);
    setSpellModalOpen(true);
  };

  const handleDeleteSpell = (spellId: string, spellName: string) => {
    if (window.confirm(`Remover magia "${spellName}"?`)) {
      removeSpell(spellId);
    }
  };

  // Agrupar magias por tradição
  const spellsByTradition = formData.spells.reduce((acc: any, spell) => {
    const tradition = spell.tradition || 'Sem Tradição';
    if (!acc[tradition]) {
      acc[tradition] = [];
    }
    acc[tradition].push(spell);
    return acc;
  }, {});

  // Ordenar por rank dentro de cada tradição
  Object.keys(spellsByTradition).forEach(tradition => {
    spellsByTradition[tradition].sort((a: any, b: any) => a.rank - b.rank);
  });

  const traditionColors: { [key: string]: string } = {
    'Air': 'bg-cyan-600',
    'Earth': 'bg-amber-600',
    'Fire': 'bg-red-600',
    'Water': 'bg-blue-600',
    'Life': 'bg-green-600',
    'Death': 'bg-gray-600',
    'Illusion': 'bg-purple-600',
    'Enchantment': 'bg-pink-600',
    'Divination': 'bg-yellow-600',
    'Transmutation': 'bg-orange-600',
    'Sem Tradição': 'bg-gray-500',
  };

  return (
    <>
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Magias</h2>
          <button
            onClick={handleAddSpell}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-semibold text-white transition"
          >
            <PlusIcon className="w-4 h-4" />
            Adicionar Magia
          </button>
        </div>

        {formData.spells.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p>Nenhuma magia adicionada.</p>
            <button
              onClick={handleAddSpell}
              className="mt-4 text-blue-400 hover:text-blue-300 transition"
            >
              Adicionar sua primeira magia
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(spellsByTradition).map(([tradition, spells]: [string, any]) => (
              <div key={tradition}>
                {/* Header da Tradição */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-4 h-4 rounded ${traditionColors[tradition] || 'bg-gray-500'}`}></div>
                  <h3 className="text-xl font-semibold text-white">{tradition}</h3>
                  <span className="text-sm text-gray-400">({spells.length} magia{spells.length !== 1 ? 's' : ''})</span>
                </div>

                {/* Magias da Tradição */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-7">
                  {spells.map((spell: any) => (
                    <div key={`${spell.id}-${spell.name}`} className="bg-gray-700 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="text-lg font-semibold text-white">{spell.name}</h4>
                            <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs">
                              Rank {spell.rank}
                            </span>
                          </div>

                          <p className="text-gray-300 text-sm mb-2">{spell.description}</p>

                          {/* Detalhes da Magia */}
                          <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                            {spell.castingTime && (
                              <div>
                                <span className="font-semibold">Tempo:</span> {spell.castingTime}
                              </div>
                            )}
                            {spell.range && (
                              <div>
                                <span className="font-semibold">Alcance:</span> {spell.range}
                              </div>
                            )}
                            {spell.duration && (
                              <div className="col-span-2">
                                <span className="font-semibold">Duração:</span> {spell.duration}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => handleEditSpell(spell)}
                            className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-600/20 rounded transition"
                            title="Editar magia"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteSpell(spell.id, spell.name)}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-600/20 rounded transition"
                            title="Remover magia"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal de Magia */}
      <Modal
        isOpen={isSpellModalOpen}
        onClose={() => setSpellModalOpen(false)}
        title={editingSpell ? 'Editar Magia' : 'Adicionar Magia'}
        size="lg"
      >
        <SpellForm
          spell={editingSpell}
          onClose={() => setSpellModalOpen(false)}
        />
      </Modal>
    </>
  );
}
