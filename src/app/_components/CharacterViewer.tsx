"use client";

import Link from "next/link";
import { useCharacter } from '~/hooks/use-character';
import EquipmentViewer from "./EquipmentViewer";
import TalentsViewer from "./TalentsViewer";
import SpellsViewer from "./SpellsViewer";
import DiceRoller from "./dice/DiceRoller";
import { useUIStore } from "~/stores/ui-store";


interface CharacterViewerProps {
  characterId: number;
}

export default function CharacterViewer({ characterId }: CharacterViewerProps) {
  const { character, enterEditMode } = useCharacter(characterId);
  const { addNotification } = useUIStore();

  if (!character) return null;

  const talents = Array.isArray(character.talents) ? character.talents : [];
  const spells = Array.isArray(character.spells) ? character.spells : [];
  const equipment = Array.isArray(character.equipment) ? character.equipment : [];

  return (
   <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">{character.name}</h1>
          <p className="text-gray-400">{character.ancestry} • Nível {character.level}</p>
          <DiceRoller variant="emoji-dice" label="Teste de Força" iconOnlyIconKey="emoji-dice" iconOnly numberStyle="big" sides={6}  colorClass="red" labelColorClass="red"/>
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

          {/* ✅ Talentos */}
          <TalentsViewer talents={talents} />

          {/* ✅ Magias */}
          <SpellsViewer spells={spells} />

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
                 <DiceRoller
                  sides={20}
                  modifier={character.strength}
                  label={`Teste de Força`}
                  onResult={(result, breakdown) => {
                    // Ex: salvar no log, mostrar toast, etc.
                    addNotification({ type: "info", message: `Rolou: ${breakdown} = ${result}` });
                  }}
                />
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Agilidade</span>
                <span className="text-white font-semibold">{character.agility}</span>
                <DiceRoller
                  sides={20}
                  modifier={character.agility}
                  label={`Teste de Agilidade`}
                  onResult={(result, breakdown) => {
                    // Ex: salvar no log, mostrar toast, etc.
                    addNotification({ type: "info", message: `Rolou: ${breakdown} = ${result}` });
                  }}
                />
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Intelecto</span>
                <span className="text-white font-semibold">{character.intellect}</span>
                <DiceRoller
                  sides={20}
                  modifier={character.intellect}
                  label={`Teste de Intelecto`}
                  onResult={(result, breakdown) => {
                    // Ex: salvar no log, mostrar toast, etc.
                    addNotification({ type: "info", message: `Rolou: ${breakdown} = ${result}` });
                  }}
                />
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Vontade</span>
                <span className="text-white font-semibold">{character.will}</span>
                <DiceRoller
                  sides={20}
                  modifier={character.will}
                  label={`Teste de Vontade`}
                  onResult={(result, breakdown) => {
                    // Ex: salvar no log, mostrar toast, etc.
                    addNotification({ type: "info", message: `Rolou: ${breakdown} = ${result}` });
                  }}
                />
              </div>
            </div>
          </div>

          {/* ✅ Equipamentos */}
          <EquipmentViewer equipment={equipment} />
        </div>
      </div>
    </div>
  );
}
