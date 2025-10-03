"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";
import { useUIStore } from "~/stores/ui-store";
import AncestrySelector from "~/app/_components/AncestrySelector";
import PathSelector from "~/app/_components/PathSelector";
import { motion } from "framer-motion";
import { Button } from "~/components/ui/button";
import { ArrowLeft, Save, Wand2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { BasicInfoForm } from "~/app/_components/character/BasicInfoForm";

export default function NewCharacterPage() {
  const router = useRouter();
  const { addNotification } = useUIStore();
  const [isLoading, setIsLoading] = useState(false);

  const [characterData, setCharacterData] = useState({
    name: "",
    level: 0,
    ancestry: "Humano",
    strength: 10,
    agility: 10,
    intellect: 10,
    will: 10,
    perception: 10,
    defense: 10,
    health_max: 10,
    health_current: 10,
    healing_rate: 5,
    speed: 10,
    power: 0,
    insanity: 0,
    corruption: 0,
    size: "1",
    languages: ["Comum"],
    professions: [],
    talents: [],
    spells: [],
    equipment: [],
    weapons: [],
    armor: {},
    background: "",
    personality: "",
    appearance: "",
    notes: ""
  });

  const [step, setStep] = useState(1); // 1: Ancestralidade, 2: Atributos, 3: Detalhes

  const createCharacter = api.characters.create.useMutation({
    onSuccess: (character) => {
      addNotification({
        type: 'success',
        message: 'Personagem criado com sucesso!',
      });
      if (character?.id) {
        router.push(`/characters/${character.id}`);
      }
    },
    onError: (error) => {
      addNotification({
        type: 'error',
        message: 'Erro ao criar personagem: ' + error.message,
      });
    },
  });

  const handleAncestryChange = (ancestry: any) => {
    setCharacterData(prev => ({
      ...prev,
      ancestry: ancestry.slug,
    }));

    // Aplicar modificadores de atributos automaticamente
    if (ancestry.ability_modifiers && Array.isArray(ancestry.ability_modifiers)) {
      const newAttributes = { ...characterData };
      ancestry.ability_modifiers.forEach((mod: any) => {
        const ability = mod.ability?.toLowerCase();
        if (ability && (ability === 'strength' || ability === 'agility' || ability === 'intellect' || ability === 'will')) {
          newAttributes[ability as keyof typeof newAttributes] =
            (newAttributes[ability as keyof typeof newAttributes] as number) + (mod.modifier || 0);
        }
      });
      setCharacterData(newAttributes);
    }
  };

  const handlePathChange = (path: any) => {
    setCharacterData(prev => ({
      ...prev,
      novicePath: path.slug,
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    createCharacter.mutate(characterData);
  };

  const updateField = (field, value) => {
    setCharacterData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.back()}
              className="bg-gray-800/50 border-gray-700 hover:bg-gray-700 text-gray-300"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-amber-400">
                Forjar Nova Alma
              </h1>
              <p className="text-gray-400 mt-1">
                Crie um novo personagem para sua jornada
              </p>
            </div>
          </div>
          <Button
            onClick={handleSave}
            disabled={createCharacter.isPending || !characterData.name}
            className="bg-gradient-to-r from-amber-700 to-amber-900 hover:from-amber-600 hover:to-amber-800 text-white shadow-lg shadow-amber-900/50"
          >
            <Save className="w-5 h-5 mr-2" />
            {createCharacter.isPending ? "Criando..." : "Criar Personagem"}
          </Button>
        </motion.div>

        <Card className="bg-gradient-to-br from-gray-900 to-black border-red-900/30 shadow-2xl shadow-red-900/20">
          <div className="h-2 bg-gradient-to-r from-red-900 via-amber-700 to-red-900"></div>
          <CardHeader className="border-b border-red-900/20">
            <CardTitle className="text-amber-400 flex items-center gap-2">
              <Wand2 className="w-6 h-6" />
              Ficha de Personagem
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs defaultValue="basic" className="w-full text-gray-600">
              <TabsList className="grid grid-cols-4 lg:grid-cols-7 gap-2 bg-gray-800/50 p-2 rounded-lg mb-6">
                <TabsTrigger value="basic" className="data-[state=active]:bg-red-900 data-[state=active]:text-amber-300">
                  Básico
                </TabsTrigger>
                <TabsTrigger value="attributes" className="data-[state=active]:bg-red-900 data-[state=active]:text-amber-300">
                  Atributos
                </TabsTrigger>
                <TabsTrigger value="paths" className="data-[state=active]:bg-red-900 data-[state=active]:text-amber-300">
                  Caminhos
                </TabsTrigger>
                <TabsTrigger value="combat" className="data-[state=active]:bg-red-900 data-[state=active]:text-amber-300">
                  Combate
                </TabsTrigger>
                <TabsTrigger value="talents" className="data-[state=active]:bg-red-900 data-[state=active]:text-amber-300">
                  Talentos
                </TabsTrigger>
                <TabsTrigger value="equipment" className="data-[state=active]:bg-red-900 data-[state=active]:text-amber-300">
                  Equipamento
                </TabsTrigger>
                <TabsTrigger value="background" className="data-[state=active]:bg-red-900 data-[state=active]:text-amber-300">
                  História
                </TabsTrigger>
              </TabsList>

              <TabsContent value="basic">
                <BasicInfoForm data={characterData} updateField={updateField} />
              </TabsContent>

              <TabsContent value="attributes">
                {/*<AttributesForm data={characterData} updateField={updateField} />*/}
                AttributesForm
              </TabsContent>

              <TabsContent value="paths">
                {/*<PathsForm data={characterData} updateField={updateField} />*/}
                PathsForm
              </TabsContent>

              <TabsContent value="combat">
                {/*<CombatForm data={characterData} updateField={updateField} />*/}
                CombatForm
              </TabsContent>

              <TabsContent value="talents">
                {/*<TalentsSpells data={characterData} updateField={updateField} />*/}
                TalentsSpells
              </TabsContent>

              <TabsContent value="equipment">
                {/*<EquipmentForm data={characterData} updateField={updateField} />*/}
                EquipmentForm
              </TabsContent>

              <TabsContent value="background">
                {/*<BackgroundForm data={characterData} updateField={updateField} />*/}
                BackgroundForm
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>


      {/*<h1 className="text-4xl font-bold mb-8 text-white">Criar Novo Personagem</h1>*/}

      {/*/!* Indicador de passos *!/*/}
      {/*<div className="flex items-center justify-center mb-8">*/}
      {/*  <div className="flex items-center">*/}
      {/*    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${*/}
      {/*      step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400'*/}
      {/*    }`}>1</div>*/}
      {/*    <div className={`w-16 h-1 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-700'}`}></div>*/}
      {/*    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${*/}
      {/*      step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400'*/}
      {/*    }`}>2</div>*/}
      {/*    <div className={`w-16 h-1 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-700'}`}></div>*/}
      {/*    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${*/}
      {/*      step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400'*/}
      {/*     }`}>3</div>*/}
      {/*    <div className={`w-16 h-1 ${step >= 4 ? 'bg-blue-600' : 'bg-gray-700'}`}></div>*/}
      {/*    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${*/}
      {/*      step >= 4 ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-400'*/}
      {/*    }`}>4</div>*/}
      {/*  </div>*/}
      {/*</div>*/}

      {/*<div className="max-w-4xl mx-auto bg-gray-800 rounded-lg p-8">*/}
      {/*  {step === 1 && (*/}
      {/*    <div>*/}
      {/*      <AncestrySelector*/}
      {/*        selectedAncestry={characterData.ancestry}*/}
      {/*        onAncestryChange={handleAncestryChange}*/}
      {/*      />*/}

      {/*      <div className="flex justify-between mt-8">*/}
      {/*        <button*/}
      {/*          type="button"*/}
      {/*          onClick={() => router.back()}*/}
      {/*          className="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-lg font-semibold text-white transition"*/}
      {/*        >*/}
      {/*          Cancelar*/}
      {/*        </button>*/}
      {/*        <button*/}
      {/*          type="button"*/}
      {/*          onClick={() => setStep(2)}*/}
      {/*          disabled={!characterData.ancestry}*/}
      {/*          className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold text-white transition disabled:opacity-50"*/}
      {/*        >*/}
      {/*          Próximo*/}
      {/*        </button>*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*  )}*/}

      {/*  {step === 2 && (*/}
      {/*    <div>*/}
      {/*      <h2 className="text-2xl font-bold text-white mb-6">Escolha seu Caminho</h2>*/}
      {/*      <PathSelector*/}
      {/*        tier="novice"*/}
      {/*        selectedPathSlug={characterData.novicePath}*/}
      {/*        onSelect={(path) => setCharacterData({ ...characterData, novicePath: path.slug })}*/}
      {/*      />*/}
      {/*      <div className="flex justify-between mt-8">*/}
      {/*        <button*/}
      {/*          type="button"*/}
      {/*          onClick={() => router.back()}*/}
      {/*          className="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-lg font-semibold text-white transition"*/}
      {/*        >*/}
      {/*          Cancelar*/}
      {/*        </button>*/}
      {/*        <button*/}
      {/*          type="button"*/}
      {/*          onClick={() => setStep(3)}*/}
      {/*          disabled={!characterData.novicePath}*/}
      {/*          className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold text-white transition disabled:opacity-50"*/}
      {/*        >*/}
      {/*          Próximo*/}
      {/*        </button>*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*  )}*/}

      {/*  {step === 2 && (*/}
      {/*    <div>*/}
      {/*      <h2 className="text-2xl font-bold text-white mb-6">Atributos</h2>*/}

      {/*      <div className="grid grid-cols-2 gap-6 mb-8">*/}
      {/*        <div>*/}
      {/*          <label className="block text-sm font-medium mb-2 text-white">Força</label>*/}
      {/*          <input*/}
      {/*            type="number"*/}
      {/*            min="3"*/}
      {/*            max="18"*/}
      {/*            value={characterData.strength}*/}
      {/*            onChange={(e) => setCharacterData({ ...characterData, strength: Number(e.target.value) })}*/}
      {/*            className="w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none text-white"*/}
      {/*          />*/}
      {/*        </div>*/}
      {/*        <div>*/}
      {/*          <label className="block text-sm font-medium mb-2 text-white">Agilidade</label>*/}
      {/*          <input*/}
      {/*            type="number"*/}
      {/*            min="3"*/}
      {/*            max="18"*/}
      {/*            value={characterData.agility}*/}
      {/*            onChange={(e) => setCharacterData({ ...characterData, agility: Number(e.target.value) })}*/}
      {/*            className="w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none text-white"*/}
      {/*          />*/}
      {/*        </div>*/}
      {/*        <div>*/}
      {/*          <label className="block text-sm font-medium mb-2 text-white">Intelecto</label>*/}
      {/*          <input*/}
      {/*            type="number"*/}
      {/*            min="3"*/}
      {/*            max="18"*/}
      {/*            value={characterData.intellect}*/}
      {/*            onChange={(e) => setCharacterData({ ...characterData, intellect: Number(e.target.value) })}*/}
      {/*            className="w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none text-white"*/}
      {/*          />*/}
      {/*        </div>*/}
      {/*        <div>*/}
      {/*          <label className="block text-sm font-medium mb-2 text-white">Vontade</label>*/}
      {/*          <input*/}
      {/*            type="number"*/}
      {/*            min="3"*/}
      {/*            max="18"*/}
      {/*            value={characterData.will}*/}
      {/*            onChange={(e) => setCharacterData({ ...characterData, will: Number(e.target.value) })}*/}
      {/*            className="w-full px-4 py-2 bg-gray-700 rounded-lg border border-gray-600 focus:border-blue-500 focus:outline-none text-white"*/}
      {/*          />*/}
      {/*        </div>*/}
      {/*      </div>*/}

      {/*      <div className="flex justify-between">*/}
      {/*        <button*/}
      {/*          type="button"*/}
      {/*          onClick={() => setStep(1)}*/}
      {/*          className="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-lg font-semibold text-white transition"*/}
      {/*        >*/}
      {/*          Voltar*/}
      {/*        </button>*/}
      {/*        <button*/}
      {/*          type="button"*/}
      {/*          onClick={() => setStep(3)}*/}
      {/*          className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold text-white transition"*/}
      {/*        >*/}
      {/*          Próximo*/}
      {/*        </button>*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*</div>*/}
    </div>
  );
}