"use client";

import { useState } from 'react';
import { useCharacterUIStore } from '~/stores/character-store';

interface EquipmentFormProps {
  equipment?: any | null;
  onClose: () => void;
}

const EQUIPMENT_TYPES = [
  'Arma', 'Armadura', 'Escudo', 'Ferramenta',
  'Poção', 'Joia', 'Livro', 'Comida', 'Outros'
];

export default function EquipmentForm({ equipment, onClose }: EquipmentFormProps) {
  const { addEquipment, updateEquipment } = useCharacterUIStore();

  const [formData, setFormData] = useState({
    name: equipment?.name || '',
    type: equipment?.type || '',
    description: equipment?.description || '',
    quantity: equipment?.quantity || 1,
    weight: equipment?.weight || 0,
    value: equipment?.value || 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (equipment) {
      updateEquipment(equipment.id, formData);
    } else {
      addEquipment(formData);
    }

    onClose();
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-white mb-2">Nome do Item *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            required
            autoFocus
          />
        </div>

        <div>
          <label className="block text-white mb-2">Tipo *</label>
          <select
            value={formData.type}
            onChange={(e) => handleInputChange('type', e.target.value)}
            className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            required
          >
            <option value="">Selecione um tipo</option>
            {EQUIPMENT_TYPES.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-white mb-2">Quantidade *</label>
          <input
            type="number"
            min="1"
            value={formData.quantity}
            onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 1)}
            className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-white mb-2">Peso (kg)</label>
          <input
            type="number"
            min="0"
            step="0.1"
            value={formData.weight}
            onChange={(e) => handleInputChange('weight', parseFloat(e.target.value) || 0)}
            className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-white mb-2">Valor (moedas)</label>
          <input
            type="number"
            min="0"
            value={formData.value}
            onChange={(e) => handleInputChange('value', parseInt(e.target.value) || 0)}
            className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-white mb-2">Descrição</label>
        <textarea
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          rows={4}
          className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          placeholder="Descreva o item, suas propriedades especiais..."
        />
      </div>

      <div className="flex gap-4">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-lg font-semibold text-white transition"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="flex-1 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold text-white transition"
        >
          {equipment ? 'Salvar' : 'Adicionar'}
        </button>
      </div>
    </form>
  );
}
