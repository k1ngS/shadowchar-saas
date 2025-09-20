// src/hooks/use-character.ts
import { useCharacterUIStore } from '~/stores/character-store';
import { useUIStore } from '~/stores/ui-store';
import { api } from '~/trpc/react';

export function useCharacter(characterId: number) {
  const {
    isEditMode,
    isDirty,
    formData,
    setEditMode,
    initializeForm,
    updateFormField,
    resetForm,
    clearForm,
  } = useCharacterUIStore();

  const { addNotification } = useUIStore();
  const utils = api.useUtils();

  // tRPC Query (fonte da verdade)
  const {
    data: character,
    isLoading,
    error,
    refetch
  } = api.characters.getById.useQuery({ id: characterId });

  // tRPC Mutation
  const saveMutation = api.characters.update.useMutation({
    onSuccess: async (updatedCharacter) => {
      addNotification({
        type: 'success',
        message: 'Personagem salvo com sucesso!',
      });

      // Invalidar e refetch para pegar dados atualizados
      await utils.characters.getById.invalidate({ id: characterId });
      await refetch();

      // Sair do edit mode
      setEditMode(false);
    },
    onError: (error) => {
      addNotification({
        type: 'error',
        message: 'Erro ao salvar: ' + error.message,
      });
    },
  });

  // Função para entrar no edit mode
  const enterEditMode = () => {
    if (character) {
      initializeForm(character);
      setEditMode(true);
    }
  };

  // Função para sair do edit mode
  const exitEditMode = () => {
    if (isDirty) {
      const confirmExit = window.confirm(
        'Você tem alterações não salvas. Deseja sair sem salvar?'
      );

      if (confirmExit) {
        setEditMode(false);
      }
    } else {
      setEditMode(false);
    }
  };

  // Função para salvar
  const saveCharacter = () => {
    if (!formData) return;

    saveMutation.mutate({
      id: characterId,
      ...formData,
    });
  };

  // Função para resetar form
  const handleResetForm = () => {
    resetForm();
  };

  return {
    // Dados do tRPC (fonte da verdade)
    character,
    isLoading,
    error,

    // Estado da UI
    isEditMode,
    isDirty,
    formData,
    isSaving: saveMutation.isPending,

    // Ações
    enterEditMode,
    exitEditMode,
    updateFormField,
    saveCharacter,
    resetForm: handleResetForm,
  };
}
