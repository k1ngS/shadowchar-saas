// app/characters/[id]/edit/_components/CharacterEditForm.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";

interface CharacterEditFormProps {
  character: any; // Tipo do personagem do seu schema
}

export default function CharacterEditForm({ character }: CharacterEditFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: character.name || "",
    ancestry: character.ancestry || "",
    novicePath: character.novicePath || "",
    expertPath: character.expertPath || "",
    masterPath: character.masterPath || "",
    level: character.level || 0,
    strength: character.strength || 10,
    agility: character.agility || 10,
    intellect: character.intellect || 10,
    will: character.will || 10,
    health: character.health || 0,
    insanity: character.insanity || 0,
    corruption: character.corruption || 0,
    background: character.background || "",
    notes: character.notes || "",
    isPublic: character.isPublic || false,
  });

  const updateCharacter = api.characters.update.useMutation({
    onSuccess: () => {
      router.push(`/characters/${character.id}`);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateCharacter.mutate({
      id: character.id,
      ...formData,
    });
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Informações Básicas */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Informações Básicas</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-white mb-2">Nome *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-white mb-2">Ancestralidade *</label>
            <input
              type="text"
              value={formData.ancestry}
              onChange={(e) => handleInputChange("ancestry", e.target.value)}
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
              onChange={(e) => handleInputChange("level", parseInt(e.target.value) || 0)}
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Paths */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Paths</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-white mb-2">Novice Path</label>
            <input
              type="text"
              value={formData.novicePath}
              onChange={(e) => handleInputChange("novicePath", e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-white mb-2">Expert Path</label>
            <input
              type="text"
              value={formData.expertPath}
              onChange={(e) => handleInputChange("expertPath", e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-white mb-2">Master Path</label>
            <input
              type="text"
              value={formData.masterPath}
              onChange={(e) => handleInputChange("masterPath", e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Atributos */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Atributos</h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {["strength", "agility", "intellect", "will"].map((attr) => (
            <div key={attr}>
              <label className="block text-white mb-2 capitalize">
                {attr === "strength" && "Força"}
                {attr === "agility" && "Agilidade"}
                {attr === "intellect" && "Intelecto"}
                {attr === "will" && "Vontade"}
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={formData[attr as keyof typeof formData]}
                onChange={(e) => handleInputChange(attr, parseInt(e.target.value) || 10)}
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
          <div>
            <label className="block text-white mb-2">Saúde</label>
            <input
              type="number"
              min="0"
              value={formData.health}
              onChange={(e) => handleInputChange("health", parseInt(e.target.value) || 0)}
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-white mb-2">Insanidade</label>
            <input
              type="number"
              min="0"
              value={formData.insanity}
              onChange={(e) => handleInputChange("insanity", parseInt(e.target.value) || 0)}
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-white mb-2">Corrupção</label>
            <input
              type="number"
              min="0"
              value={formData.corruption}
              onChange={(e) => handleInputChange("corruption", parseInt(e.target.value) || 0)}
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Background e Notas */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-6">Detalhes</h2>

        <div className="space-y-6">
          <div>
            <label className="block text-white mb-2">Background</label>
            <textarea
              value={formData.background}
              onChange={(e) => handleInputChange("background", e.target.value)}
              rows={6}
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
              placeholder="Descreva o background do seu personagem..."
            />
          </div>

          <div>
            <label className="block text-white mb-2">Notas</label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
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
              onChange={(e) => handleInputChange("isPublic", e.target.checked)}
              className="mr-2"
            />
            <label htmlFor="isPublic" className="text-white">
              Tornar personagem público
            </label>
          </div>
        </div>
      </div>

      {/* Botões */}
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition"
        >
          Cancelar
        </button>

        <button
          type="submit"
          disabled={updateCharacter.isPending}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition disabled:opacity-50"
        >
          {updateCharacter.isPending ? "Salvando..." : "Salvar Alterações"}
        </button>
      </div>
    </form>
  );
}
