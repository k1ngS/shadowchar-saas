import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import { api } from "~/trpc/server";
import Link from "next/link";
import CharactersList from "~/app/_components/CharacterList";

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

      <CharactersList initialCharacters={characters} />
    </div>
  );
}