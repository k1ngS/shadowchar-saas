import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface CharacterFormData {
  name: string;
  ancestry: string;
  novicePath?: string;
  expertPath?: string;
  masterPath?: string;
  level: number;
  strength: number;
  agility: number;
  intellect: number;
  will: number;
  health: number;
  insanity: number;
  corruption: number;
  background?: string;
  notes?: string;
  isPublic: boolean;
}

interface CharacterUIStore {
  // UI State
  isEditMode: boolean;
  isDirty: boolean;

  // Form data temporário (usado apenas durante edição)
  formData: CharacterFormData | null;
  originalFormData: CharacterFormData | null;

  // Actions
  setEditMode: (editMode: boolean) => void;
  initializeForm: (character: any) => void;
  updateFormField: (field: keyof CharacterFormData, value: any) => void;
  resetForm: () => void;
  checkDirty: () => void;
  clearForm: () => void;
}

export const useCharacterUIStore = create<CharacterUIStore>()(
  devtools(
    (set, get) => ({
      // Estado inicial
      isEditMode: false,
      isDirty: false,
      formData: null,
      originalFormData: null,

      // Ações
      setEditMode: (isEditMode) => {
        if (!isEditMode) {
          // Ao sair do edit mode, limpar form
          set({ isEditMode, formData: null, originalFormData: null, isDirty: false });
        } else {
          set({ isEditMode });
        }
      },

      initializeForm: (character) => {
        const formData: CharacterFormData = {
          name: character.name || '',
          ancestry: character.ancestry || '',
          novicePath: character.novicePath || '',
          expertPath: character.expertPath || '',
          masterPath: character.masterPath || '',
          level: character.level || 0,
          strength: character.strength || 10,
          agility: character.agility || 10,
          intellect: character.intellect || 10,
          will: character.will || 10,
          health: character.health || 0,
          insanity: character.insanity || 0,
          corruption: character.corruption || 0,
          background: character.background || '',
          notes: character.notes || '',
          isPublic: character.isPublic || false,
        };

        set({
          formData,
          originalFormData: { ...formData },
          isDirty: false,
        });
      },

      updateFormField: (field, value) => {
        const { formData } = get();
        if (!formData) return;

        const updatedFormData = { ...formData, [field]: value };
        set({ formData: updatedFormData });

        // Check dirty state
        setTimeout(() => get().checkDirty(), 0);
      },

      resetForm: () => {
        const { originalFormData } = get();
        if (originalFormData) {
          set({
            formData: { ...originalFormData },
            isDirty: false,
          });
        }
      },

      checkDirty: () => {
        const { formData, originalFormData } = get();
        if (!formData || !originalFormData) return;

        const isDirty = JSON.stringify(formData) !== JSON.stringify(originalFormData);
        set({ isDirty });
      },

      clearForm: () => {
        set({
          formData: null,
          originalFormData: null,
          isDirty: false,
        });
      },
    }),
    { name: 'character-ui-store' }
  )
);
