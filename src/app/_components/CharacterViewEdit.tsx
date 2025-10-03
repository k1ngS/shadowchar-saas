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
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p>Carregando fichas...</p>
        </div>
      </div>
    )
  }

  if (error || !character) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <p className="text-gray-400">Personagem não encontrado</p>
      </div>
    );
  }

  return isEditMode ? <CharacterEditor characterId={characterId} /> : <CharacterViewer characterId={characterId} />;
}
