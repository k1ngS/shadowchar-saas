import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import { api } from "~/trpc/server";
import Link from "next/link";
import DiceRoller from "~/app/_components/dice/DiceRoller";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  const characters = await api.characters.getMyCharacters();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          Bem-vindo, {session.user.name}
        </h1>
        <p className="text-gray-400">
          Gerencie seus personagens e campanhas de Shadow of the Demon Lord
        </p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-2 text-white">Personagens</h3>
          <p className="text-3xl font-bold text-blue-400">
            {characters.length}
          </p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-2 text-white">Campanhas Ativas</h3>
          <p className="text-3xl font-bold text-green-400">0</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-2 text-white">Nível Médio</h3>
          <p className="text-3xl font-bold text-purple-400">
            {characters.length > 0
              ? Math.round(characters.reduce((acc, char) => acc + char.level, 0) / characters.length)
              : 0}
          </p>
        </div>
      </div>

      {/* Ações Rápidas */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-white">Ações Rápidas</h2>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/characters/new"
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition text-white"
          >
            + Novo Personagem
          </Link>
          <Link
            href="/campaigns/new"
            className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg font-semibold transition text-white"
          >
            + Nova Campanha
          </Link>
        </div>
      </div>

      {/* Lista de Personagens */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">Seus Personagens</h2>
          <Link
            href="/characters"
            className="text-blue-400 hover:text-blue-300 transition"
          >
            Ver todos →
          </Link>
        </div>

        {characters.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <p className="text-gray-400 mb-4">
              Você ainda não tem personagens criados.
            </p>
            <Link
              href="/characters/new"
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition inline-block text-white"
            >
              Criar Primeiro Personagem
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {characters.slice(0, 6).map((character) => (
              <div key={character.id} className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-2 text-white">{character.name}</h3>
                <p className="text-gray-400 mb-2">{character.ancestry}</p>
                <p className="text-sm text-gray-500 mb-4">Nível {character.level}</p>

                <div className="grid grid-cols-2 gap-2 text-sm mb-4 text-gray-300">
                  <div>FOR: {character.strength}</div>
                  <div>AGI: {character.agility}</div>
                  <div>INT: {character.intellect}</div>
                  <div>VON: {character.will}</div>
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/characters/${character.id}`}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-center transition text-white"
                  >
                    Ver
                  </Link>
                  <Link
                    href={`/characters/${character.id}/edit`}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded text-center transition text-white"
                  >
                    Editar
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}