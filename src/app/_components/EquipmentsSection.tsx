"use client";

import { useCharacterUIStore } from '~/stores/character-store';
import { PlusIcon, PencilIcon, TrashIcon } from 'lucide-react';
import Modal from './ui/Modal';
import EquipmentForm from './EquipmentForm';


export default function EquipmentSection() {
  const {
    formData,
    editingEquipment,
    isEquipmentModalOpen,
    removeEquipment,
    setEditingEquipment,
    setEquipmentModalOpen,
  } = useCharacterUIStore();

  if (!formData) return null;

  const handleAddEquipment = () => {
    setEditingEquipment(null);
    setEquipmentModalOpen(true);
  };

  const handleEditEquipment = (equipment: any) => {
    setEditingEquipment(equipment);
    setEquipmentModalOpen(true);
  };

  const handleDeleteEquipment = (equipmentId: string, equipmentName: string) => {
    if (window.confirm(`Remover item "${equipmentName}"?`)) {
      removeEquipment(equipmentId);
    }
  };

  // Agrupar equipamentos por tipo
  const equipmentByType = formData.equipment.reduce((acc: any, item) => {
    const type = item.type || 'Outros';
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(item);
    return acc;
  }, {});

  // Calcular totais
  const totalWeight = formData.equipment.reduce((acc, item) => acc + (item.weight || 0) * item.quantity, 0);
  const totalValue = formData.equipment.reduce((acc, item) => acc + (item.value || 0) * item.quantity, 0);

  const typeIcons: { [key: string]: string } = {
    'Arma': '⚔️',
    'Armadura': '🛡️',
    'Escudo': '🛡️',
    'Ferramenta': '🔧',
    'Poção': '🧪',
    'Joia': '💎',
    'Livro': '📚',
    'Comida': '🍖',
    'Outros': '📦',
  };

  return (
    <>
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-white">Equipamentos</h2>
            <div className="flex gap-6 text-sm text-gray-400 mt-1">
              <span>Peso Total: {totalWeight.toFixed(1)} kg</span>
              <span>Valor Total: {totalValue} moedas</span>
            </div>
          </div>
          <button
            onClick={handleAddEquipment}
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-semibold text-white transition"
          >
            <PlusIcon className="w-4 h-4" />
            Adicionar Item
          </button>
        </div>

        {formData.equipment.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p>Nenhum equipamento adicionado.</p>
            <button
              onClick={handleAddEquipment}
              className="mt-4 text-blue-400 hover:text-blue-300 transition"
            >
              Adicionar seu primeiro item
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(equipmentByType).map(([type, items]: [string, any]) => (
              <div key={type}>
                {/* Header do Tipo */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">{typeIcons[type] || typeIcons['Outros']}</span>
                  <h3 className="text-xl font-semibold text-white">{type}</h3>
                  <span className="text-sm text-gray-400">({items.length} item{items.length !== 1 ? 's' : ''})</span>
                </div>

                {/* Items do Tipo */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ml-11">
                  {items.map((item: any) => (
                    <div key={`${item.id}-${item.name}`} className="bg-gray-700 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="text-lg font-semibold text-white">{item.name}</h4>
                            {item.quantity > 1 && (
                              <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs">
                                x{item.quantity}
                              </span>
                            )}
                          </div>

                          {item.description && (
                            <p className="text-gray-300 text-sm mb-2">{item.description}</p>
                          )}

                          {/* Detalhes do Item */}
                          <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
                            {item.weight > 0 && (
                              <div>
                                <span className="font-semibold">Peso:</span> {item.weight}kg
                              </div>
                            )}
                            {item.value > 0 && (
                              <div>
                                <span className="font-semibold">Valor:</span> {item.value}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => handleEditEquipment(item)}
                            className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-600/20 rounded transition"
                            title="Editar item"
                          >
                            <PencilIcon className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteEquipment(item.id, item.name)}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-600/20 rounded transition"
                            title="Remover item"
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

      {/* Modal de Equipamento */}
      <Modal
        isOpen={isEquipmentModalOpen}
        onClose={() => setEquipmentModalOpen(false)}
        title={editingEquipment ? 'Editar Item' : 'Adicionar Item'}
        size="md"
      >
        <EquipmentForm
          equipment={editingEquipment}
          onClose={() => setEquipmentModalOpen(false)}
        />
      </Modal>
    </>
  );
}
