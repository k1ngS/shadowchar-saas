// app/characters/[id]/edit/page.tsx
import { auth } from "~/server/auth";
import { redirect, notFound } from "next/navigation";
import { api } from "~/trpc/server";
import CharacterEditForm from "~/app/_components/CharacterEditForm";

export default async function EditCharacterPage({
  params
}: {
  params: Promise<{ id: string }> // 👈 Mudança aqui
}) {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  const resolvedParams = await params; // 👈 Await params primeiro
  const characterId = parseInt(resolvedParams.id);

  if (isNaN(characterId)) {
    notFound();
  }

  const character = await api.characters.getById({ id: characterId });

  if (!character) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Editar {character.name}</h1>
        <p className="text-gray-400">Atualize as informações do seu personagem</p>
      </div>

      <CharacterEditForm character={character} />
    </div>
  );
}
