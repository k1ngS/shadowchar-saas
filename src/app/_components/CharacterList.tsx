"use client";

import { useState } from "react";
import Link from "next/link";
import { api } from "~/trpc/react";
import { useUIStore } from "~/stores/ui-store";
import { Trash, Search } from "lucide-react"

interface CharactersListProps {
  initialCharacters: any[];
}

export default function CharactersList({ initialCharacters }: CharactersListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAncestry, setSelectedAncestry] = useState("");

  const { addNotification } = useUIStore();
  const utils = api.useUtils();

  // Use client-side data com dados iniciais do servidor
  const { data: characters = initialCharacters } = api.characters.getMyCharacters.useQuery(
    undefined,
    {
      initialData: initialCharacters,
      refetchOnMount: false,
    }
  );

  // Mutation para delete
  const deleteCharacter = api.characters.delete.useMutation({
    onSuccess: () => {
      addNotification({
        type: 'success',
        message: 'Personagem removido com sucesso!',
      });
      utils.characters.getMyCharacters.invalidate();
    },
    onError: (error) => {
      addNotification({
        type: 'error',
        message: 'Erro ao remover personagem: ' + error.message,
      });
    },
  });

  // Filtrar personagens
  const filteredCharacters = characters.filter((character) => {
    const matchesSearch = character.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAncestry = selectedAncestry === "" || character.ancestry === selectedAncestry;
    return matchesSearch && matchesAncestry;
  });

  // Ancestralidades únicas para o filtro
  const ancestries = [...new Set(characters.map(c => c.ancestry))];

  const handleDelete = (character: any) => {
    if (window.confirm(`Tem certeza que deseja excluir ${character.name}?`)) {
      deleteCharacter.mutate({ id: character.id });
    }
  };

  return (
    <>
      {/* Filtros */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Busca */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar personagens..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {/* Filtro por Ancestralidade */}
          <div>
            <select
              value={selectedAncestry}
              onChange={(e) => setSelectedAncestry(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none"
            >
              <option value="">Todas as ancestralidades</option>
              {ancestries.map((ancestry) => (
                <option key={ancestry} value={ancestry}>
                  {ancestry}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Resultado da busca */}
        <div className="mt-4 text-sm text-gray-400">
          {filteredCharacters.length} de {characters.length} personagem(s)
        </div>
      </div>

      {/* Lista */}
      {filteredCharacters.length === 0 ? (
        <div className="bg-gray-800 rounded-lg p-12 text-center">
          <h2 className="text-2xl font-semibold text-white mb-4">
            {characters.length === 0
              ? "Nenhum personagem encontrado"
              : "Nenhum resultado para sua busca"
            }
          </h2>
          <p className="text-gray-400 mb-6">
            {characters.length === 0
              ? "Crie seu primeiro personagem para começar sua jornada em Shadow of the Demon Lord."
              : "Tente ajustar os filtros ou criar um novo personagem."
            }
          </p>
          <Link
            href="/characters/new"
            className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-lg font-semibold text-white transition inline-block"
          >
            {characters.length === 0 ? "Criar Primeiro Personagem" : "Criar Novo Personagem"}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCharacters.map((character) => (
            <div key={character.id} className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition group">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-1">
                    {character.name}
                  </h3>
                  <p className="text-gray-400">{character.ancestry}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-purple-600 text-white px-2 py-1 rounded text-sm">
                    Nv. {character.level}
                  </span>
                  {/* Botão de delete */}
                  <button
                    onClick={() => handleDelete(character)}
                    disabled={deleteCharacter.isPending}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-red-400 hover:text-red-300 hover:bg-red-600/20 rounded"
                    title="Excluir personagem"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Atributos */}
              <div className="grid grid-cols-2 gap-2 text-sm mb-4 text-gray-300">
                <div className="flex justify-between">
                  <span>FOR:</span>
                  <span className="font-semibold">{character.strength}</span>
                </div>
                <div className="flex justify-between">
                  <span>AGI:</span>
                  <span className="font-semibold">{character.agility}</span>
                </div>
                <div className="flex justify-between">
                  <span>INT:</span>
                  <span className="font-semibold">{character.intellect}</span>
                </div>
                <div className="flex justify-between">
                  <span>VON:</span>
                  <span className="font-semibold">{character.will}</span>
                </div>
              </div>

              {/* Status */}
              <div className="grid grid-cols-3 gap-2 text-xs mb-4 text-gray-400">
                <div className="text-center">
                  <div className="text-red-400 font-semibold">{character.health}</div>
                  <div>Vida</div>
                </div>
                <div className="text-center">
                  <div className="text-blue-400 font-semibold">{character.insanity}</div>
                  <div>Insanidade</div>
                </div>
                <div className="text-center">
                  <div className="text-purple-400 font-semibold">{character.corruption}</div>
                  <div>Corrupção</div>
                </div>
              </div>

              {/* Ação */}
              <div>
                <Link
                  href={`/characters/${character.id}`}
                  className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-center transition text-white block"
                >
                  Ver Detalhes
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
