"use client";

import { useState } from 'react';
import { useCharacterUIStore } from '~/stores/character-store';

interface TalentFormProps {
  talent?: any | null;
  onClose: () => void;
}

export default function TalentForm({ talent, onClose }: TalentFormProps) {
  const { addTalent, updateTalent } = useCharacterUIStore();

  const [formData, setFormData] = useState({
    name: talent?.name || '',
    description: talent?.description || '',
    type: talent?.type || '',
    requirements: talent?.requirements || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (talent) {
      // Editando
      updateTalent(talent.id, formData);
    } else {
      // Criando
      addTalent(formData);
    }

    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-white mb-2">Nome do Talento *</label>
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
        <label className="block text-white mb-2">Tipo</label>
        <select
          value={formData.type}
          onChange={(e) => handleInputChange('type', e.target.value)}
          className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
        >
          <option value="">Selecione um tipo</option>
          <option value="Ancestry">Ancestralidade</option>
          <option value="Novice Path">Caminho Novato</option>
          <option value="Expert Path">Caminho Especialista</option>
          <option value="Master Path">Caminho Mestre</option>
          <option value="General">Geral</option>
        </select>
      </div>

      <div>
        <label className="block text-white mb-2">Descrição *</label>
        <textarea
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          rows={6}
          className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          placeholder="Descreva o efeito do talento..."
          required
        />
      </div>

      <div>
        <label className="block text-white mb-2">Requisitos</label>
        <input
          type="text"
          value={formData.requirements}
          onChange={(e) => handleInputChange('requirements', e.target.value)}
          className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
          placeholder="Ex: Força 12, Nível 3"
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
          {talent ? 'Salvar' : 'Adicionar'}
        </button>
      </div>
    </form>
  );
}
