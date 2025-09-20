// src/app/(dashboard)/characters/[id]/_components/CharacterViewEdit.tsx
"use client";

import { useCharacter } from '~/hooks/use-character';
import CharacterViewer from './CharacterViewer';
import CharacterEditor from './CharacterEditor';

interface CharacterViewEditProps {
  characterId: number;
}

export default function CharacterViewEdit({ characterId }: CharacterViewEditProps) {
  const { character, isLoading, error, isEditMode } = useCharacter(characterId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !character) {
    return (
      <div className="bg-red-600 text-white p-4 rounded-lg">
        Erro ao carregar personagem: {error?.message}
      </div>
    );
  }

  return isEditMode ? <CharacterEditor characterId={characterId} /> : <CharacterViewer characterId={characterId} />;
}
