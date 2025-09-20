"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { useUIStore } from "~/stores/ui-store"; // ✅ Adicionar

export default function NewCharacterPage() {
  const router = useRouter();
  const { addNotification } = useUIStore(); // ✅ Usar store para notificações

  const [formData, setFormData] = useState({
    name: "",
    ancestry: "",
    strength: 10,
    agility: 10,
    intellect: 10,
    will: 10,
    background: "",
  });

  const createCharacter = api.characters.create.useMutation({
    onSuccess: (character) => {
      addNotification({
        type: 'success',
        message: 'Personagem criado com sucesso!',
      });
      router.push(`/characters/${character.id}`); // ✅ Ir direto para o personagem
    },
    onError: (error) => {
      addNotification({
        type: 'error',
        message: 'Erro ao criar personagem: ' + error.message,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCharacter.mutate(formData);
  };

  // ✅ Resto do JSX permanece igual
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-white">Criar Novo Personagem</h1>

      <form onSubmit={handleSubmit} className="max-w-2xl bg-gray-800 rounded-lg p-8">
        {/* Seus campos existentes... */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-white">Nome do Personagem</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none text-white"
            required
          />
        </div>

        {/* ... resto dos campos iguais ... */}

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={createCharacter.isPending}
            className="flex-1 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition disabled:opacity-50 text-white"
          >
            {createCharacter.isPending ? "Criando..." : "Criar Personagem"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-lg font-semibold transition text-white"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
