// src/app/(dashboard)/characters/[id]/page.tsx
import { auth } from "~/server/auth";
import { redirect, notFound } from "next/navigation";
import CharacterViewEdit from "~/app/_components/CharacterViewEdit";

export default async function CharacterPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  const resolvedParams = await params;
  const characterId = parseInt(resolvedParams.id);

  if (isNaN(characterId)) {
    notFound();
  }

  return <CharacterViewEdit characterId={characterId} />;
}
