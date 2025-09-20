// app/characters/[id]/page.tsx
import { auth } from "~/server/auth";
import { redirect, notFound } from "next/navigation";
import { api } from "~/trpc/server";
import Link from "next/link";

export default async function CharacterPage({
  params
}: {
  params: { id: string }
}) {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  const characterId = parseInt(params.id);
  if (isNaN(characterId)) {
    notFound();
  }

  const character = await api.characters.getById({ id: characterId });

  if (!character) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">{character.name}</h1>
          <p className="text-gray-400">{character.ancestry} • Nível {character.level}</p>
        </div>

        <div className="flex gap-4">
          <Link
            href={`/characters/${character.id}/edit`}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold text-white transition"
          >
            Editar
          </Link>
          <Link
            href="/characters"
            className="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-lg font-semibold text-white transition"
          >
            Voltar
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

          {/* Talentos */}
          {character.talents && character.talents.length > 0 && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Talentos</h2>
              <div className="space-y-4">
                {(character.talents as any[]).map((talent, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4">
                    <h3 className="text-lg font-semibold text-white">{talent.name}</h3>
                    <p className="text-gray-300">{talent.description}</p>
                    {talent.type && (
                      <span className="text-sm text-blue-400">Tipo: {talent.type}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Magias */}
          {character.spells && character.spells.length > 0 && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-white mb-4">Magias</h2>
              <div className="space-y-4">
                {(character.spells as any[]).map((spell, index) => (
                  <div key={index} className="border-l-4 border-purple-500 pl-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold text-white">{spell.name}</h3>
                      <span className="text-sm text-purple-400">Rank {spell.rank}</span>
                    </div>
                    <p className="text-sm text-gray-400 mb-2">{spell.tradition}</p>
                    <p className="text-gray-300">{spell.description}</p>
                    {(spell.castingTime || spell.range) && (
                      <div className="text-sm text-gray-400 mt-2">
                        {spell.castingTime && <span>Tempo: {spell.castingTime}</span>}
                        {spell.castingTime && spell.range && <span> • </span>}
                        {spell.range && <span>Alcance: {spell.range}</span>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
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

          {/* Equipamentos */}
          {character.equipment && Array.isArray(character.equipment) && character.equipment.length > 0 && (
            <div className="bg-gray-800 rounded-lg p-6">
              <h2 className="text-xl font-bold text-white mb-4">Equipamentos</h2>
              <div className="space-y-3">
                {(character.equipment as any[]).map((item, index) => (
                  <div key={index} className="border-b border-gray-700 pb-2 last:border-b-0">
                    <div className="flex justify-between items-start">
                      <span className="text-white font-medium">{item.name}</span>
                      {item.quantity && item.quantity > 1 && (
                        <span className="text-gray-400 text-sm">x{item.quantity}</span>
                      )}
                    </div>
                    <p className="text-gray-400 text-sm">{item.type}</p>
                    {item.description && (
                      <p className="text-gray-300 text-sm mt-1">{item.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
