"use client";

import { useState } from 'react';
import { useCharacterUIStore } from '~/stores/character-store';

interface SpellFormProps {
  spell?: any | null;
  onClose: () => void;
}

const TRADITIONS = [
  'Air', 'Earth', 'Fire', 'Water',
  'Life', 'Death', 'Illusion', 'Enchantment',
  'Divination', 'Transmutation'
];

export default function SpellForm({ spell, onClose }: SpellFormProps) {
  const { addSpell, updateSpell } = useCharacterUIStore();

  const [formData, setFormData] = useState({
    name: spell?.name || '',
    tradition: spell?.tradition || '',
    rank: spell?.rank || 0,
    description: spell?.description || '',
    castingTime: spell?.castingTime || '',
    range: spell?.range || '',
    duration: spell?.duration || '',
    effect: spell?.effect || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (spell) {
      updateSpell(spell.id, formData);
    } else {
      addSpell(formData);
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
          <label className="block text-white mb-2">Nome da Magia *</label>
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
          <label className="block text-white mb-2">Tradição *</label>
          <select
            value={formData.tradition}
            onChange={(e) => handleInputChange('tradition', e.target.value)}
            className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            required
          >
            <option value="">Selecione uma tradição</option>
            {TRADITIONS.map(tradition => (
              <option key={tradition} value={tradition}>{tradition}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-white mb-2">Rank *</label>
          <select
            value={formData.rank}
            onChange={(e) => handleInputChange('rank', parseInt(e.target.value))}
            className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            required
          >
            {[...Array(11)].map((_, i) => (
              <option key={i} value={i}>Rank {i}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-white mb-2">Tempo de Conjuração</label>
          <input
            type="text"
            value={formData.castingTime}
            onChange={(e) => handleInputChange('castingTime', e.target.value)}
            className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            placeholder="Ex: 1 ação, 1 minuto"
          />
        </div>

        <div>
          <label className="block text-white mb-2">Alcance</label>
          <input
            type="text"
            value={formData.range}
            onChange={(e) => handleInputChange('range', e.target.value)}
            className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            placeholder="Ex: Toque, 30 metros"
          />
        </div>

        <div>
          <label className="block text-white mb-2">Duração</label>
          <input
            type="text"
            value={formData.duration}
            onChange={(e) => handleInputChange('duration', e.target.value)}
            className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            placeholder="Ex: Instantâneo, 1 hora"
          />
        </div>
      </div>

      <div>
        <label className="block text-white mb-2">Descrição *</label>
        <textarea
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          rows={4}
          className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          placeholder="Descreva o efeito da magia..."
          required
        />
      </div>

      <div>
        <label className="block text-white mb-2">Efeito Adicional</label>
        <textarea
          value={formData.effect}
          onChange={(e) => handleInputChange('effect', e.target.value)}
          rows={3}
          className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          placeholder="Efeitos adicionais, modificadores de rank, etc..."
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
          {spell ? 'Salvar' : 'Adicionar'}
        </button>
      </div>
    </form>
  );
}
