"use client";

import Link from "next/link";
import { useCharacter } from '~/hooks/use-character';

interface CharacterViewerProps {
  characterId: number;
}

export default function CharacterViewer({ characterId }: CharacterViewerProps) {
  const { character, enterEditMode } = useCharacter(characterId); // ✅ Agora funciona

  if (!character) return null;

  return (
   <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">{character.name}</h1>
          <p className="text-gray-400">{character.ancestry} • Nível {character.level}</p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={enterEditMode}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold text-white transition"
          >
            ✏️ Editar
          </button>
          <Link
            href="/characters"
            className="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-lg font-semibold text-white transition"
          >
            ← Voltar
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coluna Principal */}
        <div className="lg:col-span-2 space-y-8">
          {/* Informações Básicas */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Informações Básicas</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold text-white">Paths</h3>
                <p className="text-gray-300">Novato: {character.novicePath || "Nenhum"}</p>
                <p className="text-gray-300">Especialista: {character.expertPath || "Nenhum"}</p>
                <p className="text-gray-300">Mestre: {character.masterPath || "Nenhum"}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Status</h3>
                <p className="text-gray-300">Saúde: {character.health}</p>
                <p className="text-gray-300">Insanidade: {character.insanity}</p>
                <p className="text-gray-300">Corrupção: {character.corruption}</p>
              </div>
            </div>
          </div>

          {/* Background */}
          {character.background && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Background</h2>
              <p className="text-gray-300 whitespace-pre-wrap">{character.background}</p>
            </div>
          )}

          {/* Notas */}
          {character.notes && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Notas</h2>
              <p className="text-gray-300 whitespace-pre-wrap">{character.notes}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Atributos */}
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4">Atributos</h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-300">Força</span>
                <span className="text-white font-semibold">{character.strength}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Agilidade</span>
                <span className="text-white font-semibold">{character.agility}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Intelecto</span>
                <span className="text-white font-semibold">{character.intellect}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Vontade</span>
                <span className="text-white font-semibold">{character.will}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
