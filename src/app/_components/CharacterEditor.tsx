// src/app/(dashboard)/characters/[id]/_components/CharacterEditor.tsx
"use client";

import { useCharacter } from '~/hooks/use-character';

interface CharacterEditorProps {
  characterId: number;
}

export default function CharacterEditor({ characterId }: CharacterEditorProps) {
  const {
    character,
    formData,
    isDirty,
    isSaving,
    updateFormField,
    exitEditMode,
    saveCharacter,
    resetForm,
  } = useCharacter(characterId); // ✅ Agora funciona

  if (!formData) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Editando: {formData.name}
          </h1>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Modo de Edição</span>
            {isDirty && (
              <span className="bg-yellow-600 text-white text-xs px-2 py-1 rounded">
                Alterações não salvas
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={resetForm}
            disabled={!isDirty || isSaving}
            className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded font-semibold text-white transition disabled:opacity-50"
          >
            Restaurar
          </button>
          <button
            onClick={exitEditMode}
            disabled={isSaving}
            className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded font-semibold text-white transition disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            onClick={saveCharacter}
            disabled={!isDirty || isSaving}
            className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold text-white transition disabled:opacity-50"
          >
            {isSaving ? 'Salvando...' : 'Salvar'}
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {/* Informações Básicas */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Informações Básicas</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-white mb-2">Nome *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => updateFormField('name', e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-white mb-2">Ancestralidade *</label>
              <input
                type="text"
                value={formData.ancestry}
                onChange={(e) => updateFormField('ancestry', e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-white mb-2">Nível</label>
              <input
                type="number"
                min="0"
                value={formData.level}
                onChange={(e) => updateFormField('level', parseInt(e.target.value) || 0)}
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Atributos */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Atributos</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { key: 'strength', label: 'Força' },
              { key: 'agility', label: 'Agilidade' },
              { key: 'intellect', label: 'Intelecto' },
              { key: 'will', label: 'Vontade' },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="block text-white mb-2">{label}</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={formData[key as keyof typeof formData] as number}
                  onChange={(e) => updateFormField(key as any, parseInt(e.target.value) || 10)}
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none text-center text-xl font-bold"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Status</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { key: 'health', label: 'Saúde' },
              { key: 'insanity', label: 'Insanidade' },
              { key: 'corruption', label: 'Corrupção' },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="block text-white mb-2">{label}</label>
                <input
                  type="number"
                  min="0"
                  value={formData[key as keyof typeof formData] as number}
                  onChange={(e) => updateFormField(key as any, parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Background e Notas */}
        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-6">Detalhes</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-white mb-2">Background</label>
              <textarea
                value={formData.background || ''}
                onChange={(e) => updateFormField('background', e.target.value)}
                rows={6}
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                placeholder="Descreva o background do seu personagem..."
              />
            </div>

            <div>
              <label className="block text-white mb-2">Notas</label>
              <textarea
                value={formData.notes || ''}
                onChange={(e) => updateFormField('notes', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
                placeholder="Notas gerais sobre o personagem..."
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPublic"
                checked={formData.isPublic}
                onChange={(e) => updateFormField('isPublic', e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="isPublic" className="text-white">
                Personagem público
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
