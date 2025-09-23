"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { useUIStore } from "~/stores/ui-store";
import AncestrySelector from "~/app/_components/AncestrySelector";
import PathSelector from "~/app/_components/PathSelector";

export default function NewCharacterPage() {
  const router = useRouter();
  const { addNotification } = useUIStore();

  const [formData, setFormData] = useState({
    name: "",
    ancestry: "",
    novicePath: "",
    strength: 10,
    agility: 10,
    intellect: 10,
    will: 10,
    background: "",
  });

  const [step, setStep] = useState(1); // 1: Ancestralidade, 2: Atributos, 3: Detalhes

  const createCharacter = api.characters.create.useMutation({
    onSuccess: (character) => {
      addNotification({
        type: 'success',
        message: 'Personagem criado com sucesso!',
      });
      if (character?.id) {
        router.push(`/characters/${character.id}`);
      }
    },
    onError: (error) => {
      addNotification({
        type: 'error',
        message: 'Erro ao criar personagem: ' + error.message,
      });
    },
  });

  const handleAncestryChange = (ancestry: any) => {
    setFormData(prev => ({
      ...prev,
      ancestry: ancestry.slug,
    }));

    // Aplicar modificadores de atributos automaticamente
    if (ancestry.ability_modifiers && Array.isArray(ancestry.ability_modifiers)) {
      const newAttributes = { ...formData };
      ancestry.ability_modifiers.forEach((mod: any) => {
        const ability = mod.ability?.toLowerCase();
        if (ability && (ability === 'strength' || ability === 'agility' || ability === 'intellect' || ability === 'will')) {
          newAttributes[ability as keyof typeof newAttributes] =
            (newAttributes[ability as keyof typeof newAttributes] as number) + (mod.modifier || 0);
        }
      });
      setFormData(newAttributes);
    }
  };

  const handlePathChange = (path: any) => {
    setFormData(prev => ({
      ...prev,
      novicePath: path.slug,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCharacter.mutate(formData);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-white">Criar Novo Personagem</h1>

      {/* Indicador de passos */}
      <div className="flex items-center justify-center mb-8">
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400'
          }`}>1</div>
          <div className={`w-16 h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-700'}`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400'
          }`}>2</div>
          <div className={`w-16 h-1 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-700'}`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400'
           }`}>3</div>
          <div className={`w-16 h-1 ${step >= 4 ? 'bg-blue-600' : 'bg-gray-700'}`}></div>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step >= 4 ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400'
          }`}>4</div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto bg-gray-800 rounded-lg p-8">
        {step === 1 && (
          <div>
            <AncestrySelector
              selectedAncestry={formData.ancestry}
              onAncestryChange={handleAncestryChange}
            />

            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={() => router.back()}
                className="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-lg font-semibold text-white transition"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => setStep(2)}
                disabled={!formData.ancestry}
                className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold text-white transition disabled:opacity-50"
              >
                Próximo
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Escolha seu Caminho</h2>
            <PathSelector
              tier="novice"
              selectedPathSlug={formData.novicePath}
              onSelect={(path) => setFormData({ ...formData, novicePath: path.slug })}
            />
            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={() => router.back()}
                className="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-lg font-semibold text-white transition"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                disabled={!formData.novicePath}
                className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold text-white transition disabled:opacity-50"
              >
                Próximo
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Atributos</h2>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-sm font-medium mb-2 text-white">Força</label>
                <input
                  type="number"
                  min="3"
                  max="18"
                  value={formData.strength}
                  onChange={(e) => setFormData({ ...formData, strength: Number(e.target.value) })}
                  className="w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-white">Agilidade</label>
                <input
                  type="number"
                  min="3"
                  max="18"
                  value={formData.agility}
                  onChange={(e) => setFormData({ ...formData, agility: Number(e.target.value) })}
                  className="w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-white">Intelecto</label>
                <input
                  type="number"
                  min="3"
                  max="18"
                  value={formData.intellect}
                  onChange={(e) => setFormData({ ...formData, intellect: Number(e.target.value) })}
                  className="w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-white">Vontade</label>
                <input
                  type="number"
                  min="3"
                  max="18"
                  value={formData.will}
                  onChange={(e) => setFormData({ ...formData, will: Number(e.target.value) })}
                  className="w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none text-white"
                />
              </div>
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-lg font-semibold text-white transition"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={() => setStep(4)}
                className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold text-white transition"
              >
                Próximo
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <form onSubmit={handleSubmit}>
            <h2 className="text-2xl font-bold text-white mb-6">Detalhes do Personagem</h2>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-white">Nome do Personagem</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none text-white"
                required
                autoFocus
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-white">História/Background</label>
              <textarea
                value={formData.background}
                onChange={(e) => setFormData({ ...formData, background: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none text-white"
                placeholder="Descreva a história do seu personagem..."
              />
            </div>

            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-lg font-semibold text-white transition"
              >
                Voltar
              </button>
              <button
                type="submit"
                disabled={createCharacter.isPending}
                className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold text-white transition disabled:opacity-50"
              >
                {createCharacter.isPending ? "Criando..." : "Criar Personagem"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}