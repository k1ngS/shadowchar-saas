import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import { api } from "~/trpc/server";
import Link from "next/link";

export default async function CharactersPage() {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  const characters = await api.characters.getMyCharacters();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-4xl font-bold text-white">Meus Personagens</h1>
        <Link
          href="/characters/new"
          className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold text-white transition"
        >
          + Novo Personagem
        </Link>
      </div>

      {characters.length === 0 ? (
        <div className="bg-gray-800 rounded-lg p-12 text-center">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Nenhum personagem encontrado
          </h2>
          <p className="text-gray-400 mb-6">
            Crie seu primeiro personagem para começar sua jornada em Shadow of the Demon Lord.
          </p>
          <Link
            href="/characters/new"
            className="bg-blue-600 hover:bg-blue-700 px-8 py-4 rounded-lg font-semibold text-white transition inline-block"
          >
            Criar Primeiro Personagem
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {characters.map((character) => (
            <div key={character.id} className="bg-gray-800 rounded-lg p-6 hover:bg-gray-750 transition">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-1">
                    {character.name}
                  </h3>
                  <p className="text-gray-400">{character.ancestry}</p>
                </div>
                <span className="bg-purple-600 text-white px-2 py-1 rounded text-sm">
                  Nv. {character.level}
                </span>
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

              {/* Ações */}
              <div className="flex gap-2">
                <Link
                  href={`/characters/${character.id}`}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-center transition text-white"
                >
                  Ver
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}