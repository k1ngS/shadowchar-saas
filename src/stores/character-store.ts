import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// Tipos para os campos JSON
interface Talent {
  id: string;
  name: string;
  description: string;
  type?: string;
  requirements?: string;
}

interface Spell {
  id: string;
  name: string;
  tradition: string;
  rank: number;
  description: string;
  castingTime?: string;
  range?: string;
  duration?: string;
  effect?: string;
}

interface Equipment {
  id: string;
  name: string;
  type: string;
  description?: string;
  quantity: number;
  weight?: number;
  value?: number;
}

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

  // ✅ Campos JSON expandidos
  talents: Talent[];
  spells: Spell[];
  equipment: Equipment[];
}

interface CharacterUIStore {
  // UI State
  isEditMode: boolean;
  isDirty: boolean;

  // Form data temporário (usado apenas durante edição)
  formData: CharacterFormData | null;
  originalFormData: CharacterFormData | null;

  // ✅ Estados para modais de edição
  editingTalent: Talent | null;
  editingSpell: Spell | null;
  editingEquipment: Equipment | null;

  // ✅ Modais abertos
  isTalentModalOpen: boolean;
  isSpellModalOpen: boolean;
  isEquipmentModalOpen: boolean;

  // Actions existentes
  setEditMode: (editMode: boolean) => void;
  initializeForm: (character: any) => void;
  updateFormField: (field: keyof CharacterFormData, value: any) => void;
  resetForm: () => void;
  checkDirty: () => void;
  clearForm: () => void;

  // ✅ Actions para JSON fields
  // Talentos
  addTalent: (talent: Omit<Talent, 'id'>) => void;
  updateTalent: (id: string, talent: Partial<Talent>) => void;
  removeTalent: (id: string) => void;
  setEditingTalent: (talent: Talent | null) => void;
  setTalentModalOpen: (open: boolean) => void;

  // Magias
  addSpell: (spell: Omit<Spell, 'id'>) => void;
  updateSpell: (id: string, spell: Partial<Spell>) => void;
  removeSpell: (id: string) => void;
  setEditingSpell: (spell: Spell | null) => void;
  setSpellModalOpen: (open: boolean) => void;

  // Equipamentos
  addEquipment: (equipment: Omit<Equipment, 'id'>) => void;
  updateEquipment: (id: string, equipment: Partial<Equipment>) => void;
  removeEquipment: (id: string) => void;
  setEditingEquipment: (equipment: Equipment | null) => void;
  setEquipmentModalOpen: (open: boolean) => void;
}

export const useCharacterUIStore = create<CharacterUIStore>()(
  devtools(
    (set, get) => ({
      // Estados existentes
      isEditMode: false,
      isDirty: false,
      formData: null,
      originalFormData: null,

      // ✅ Novos estados
      editingTalent: null,
      editingSpell: null,
      editingEquipment: null,
      isTalentModalOpen: false,
      isSpellModalOpen: false,
      isEquipmentModalOpen: false,

      // Actions existentes
      setEditMode: (isEditMode) => {
        if (!isEditMode) {
          set({
            isEditMode,
            formData: null,
            originalFormData: null,
            isDirty: false,
            // Fechar modais
            isTalentModalOpen: false,
            isSpellModalOpen: false,
            isEquipmentModalOpen: false,
            editingTalent: null,
            editingSpell: null,
            editingEquipment: null,
          });
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

          // ✅ Garantir arrays vazios se null/undefined/objeto
          talents: Array.isArray(character.talents) ? character.talents : [],
          spells: Array.isArray(character.spells) ? character.spells : [],
          equipment: Array.isArray(character.equipment) ? character.equipment : [],
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

      // ✅ Actions para Talentos
      addTalent: (talent) => {
        const { formData } = get();
        if (!formData) return;

        const newTalent: Talent = {
          ...talent,
          id: Math.random().toString(36).substr(2, 9),
        };

        const updatedFormData = {
          ...formData,
          talents: [...formData.talents, newTalent],
        };

        set({ formData: updatedFormData });
        setTimeout(() => get().checkDirty(), 0);
      },

      updateTalent: (id, talentUpdate) => {
        const { formData } = get();
        if (!formData) return;

        const updatedFormData = {
          ...formData,
          talents: formData.talents.map(talent =>
            talent.id === id ? { ...talent, ...talentUpdate } : talent
          ),
        };

        set({ formData: updatedFormData });
        setTimeout(() => get().checkDirty(), 0);
      },

      removeTalent: (id) => {
        const { formData } = get();
        if (!formData) return;

        const updatedFormData = {
          ...formData,
          talents: formData.talents.filter(talent => talent.id !== id),
        };

        set({ formData: updatedFormData });
        setTimeout(() => get().checkDirty(), 0);
      },

      setEditingTalent: (editingTalent) => set({ editingTalent }),
      setTalentModalOpen: (isTalentModalOpen) => set({ isTalentModalOpen }),

      // ✅ Actions para Magias
      addSpell: (spell) => {
        const { formData } = get();
        if (!formData) return;

        const newSpell: Spell = {
          ...spell,
          id: Math.random().toString(36).substr(2, 9),
        };

        const updatedFormData = {
          ...formData,
          spells: [...formData.spells, newSpell],
        };

        set({ formData: updatedFormData });
        setTimeout(() => get().checkDirty(), 0);
      },

      updateSpell: (id, spellUpdate) => {
        const { formData } = get();
        if (!formData) return;

        const updatedFormData = {
          ...formData,
          spells: formData.spells.map(spell =>
            spell.id === id ? { ...spell, ...spellUpdate } : spell
          ),
        };

        set({ formData: updatedFormData });
        setTimeout(() => get().checkDirty(), 0);
      },

      removeSpell: (id) => {
        const { formData } = get();
        if (!formData) return;

        const updatedFormData = {
          ...formData,
          spells: formData.spells.filter(spell => spell.id !== id),
        };

        set({ formData: updatedFormData });
        setTimeout(() => get().checkDirty(), 0);
      },

      setEditingSpell: (editingSpell) => set({ editingSpell }),
      setSpellModalOpen: (isSpellModalOpen) => set({ isSpellModalOpen }),

      // ✅ Actions para Equipamentos
      addEquipment: (equipment) => {
        const { formData } = get();
        if (!formData) return;

        const newEquipment: Equipment = {
          ...equipment,
          id: Math.random().toString(36).substr(2, 9),
        };

        const updatedFormData = {
          ...formData,
          equipment: [...formData.equipment, newEquipment],
        };

        set({ formData: updatedFormData });
        setTimeout(() => get().checkDirty(), 0);
      },

      updateEquipment: (id, equipmentUpdate) => {
        const { formData } = get();
        if (!formData) return;

        const updatedFormData = {
          ...formData,
          equipment: formData.equipment.map(item =>
            item.id === id ? { ...item, ...equipmentUpdate } : item
          ),
        };

        set({ formData: updatedFormData });
        setTimeout(() => get().checkDirty(), 0);
      },

      removeEquipment: (id) => {
        const { formData } = get();
        if (!formData) return;

        const updatedFormData = {
          ...formData,
          equipment: formData.equipment.filter(item => item.id !== id),
        };

        set({ formData: updatedFormData });
        setTimeout(() => get().checkDirty(), 0);
      },

      setEditingEquipment: (editingEquipment) => set({ editingEquipment }),
      setEquipmentModalOpen: (isEquipmentModalOpen) => set({ isEquipmentModalOpen }),
    }),
    { name: 'character-ui-store' }
  )
);
