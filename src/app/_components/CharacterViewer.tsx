"use client";

import Link from "next/link";
import { useCharacter } from '~/hooks/use-character';
import EquipmentViewer from "./EquipmentViewer";
import TalentsViewer from "./TalentsViewer";
import SpellsViewer from "./SpellsViewer";
import DiceRoller from "./dice/DiceRoller";
import { useUIStore } from "~/stores/ui-store";
import SotdlRoller from "./dice/SotdlRoller";
import { motion } from "framer-motion";
import { Button } from "~/components/ui/button";
import {
  ArrowLeft,
  Badge,
  Dices,
  Edit,
  Flame,
  Heart,
  Package,
  Shield,
  Sparkles,
  Swords,
  Zap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Progress } from "@radix-ui/react-progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";


interface CharacterViewerProps {
  characterId: number;
}

export default function CharacterViewer({ characterId }: CharacterViewerProps) {
  const { character, enterEditMode } = useCharacter(characterId);
  const { addNotification } = useUIStore();

  if (!character) return null

  const talents = Array.isArray(character.talents) ? character.talents : [];
  const spells = Array.isArray(character.spells) ? character.spells : [];
  const equipment = Array.isArray(character.equipment) ? character.equipment : [];
  const healthPercent = (character.health / character.health) * 100;

  return (
   <div className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className="bg-gray-800/50 border-gray-700 hover:bg-gray-700 text-gray-300">
              <Link href="/dashboard">
                <ArrowLeft className="w-4 h-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-amber-400">{character.name}</h1>
              <p className="text-gray-400">Nivel {character.level} * {character.ancestry}</p>
            </div>
          </div>
          <Button
            onClick={enterEditMode}
            className="bg-gradient-to-r from-blue-700 to-blue-900 hover:from-blue-600 hover:to-blue-800 text-white"
          >
            <Edit className="w-5 h-5 mr-2" />
            Editar Ficha
          </Button>
        </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Coluna Principal */}
        <div className="lg:col-span-1 space-y-6">
          {/* Informações Básicas */}
          <Card className="bg-gradient-to-br from-gray-900 to-black border-red-900/30">
            <div className="h-2 bg-gradient-to-r from-red-900 via-amber-700 to-red-900"></div>
            {character.avatar_url && (
              <div className="p-6 pb-0">
                <img
                  src={character.avatar_url}
                  alt={character.name}
                  className="w-full aspect-square object-cover rounded-lg border-2 border-amber-700/50"
                />
              </div>
            )}
            <CardContent className="p-6">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-400 flex items-center gap-2">
                        <Heart className="w-4 h-4 text-red-400" />
                        Vida
                      </span>
                    <span className="font-bold text-lg text-green-400">
                        {character.health}/{character.health}
                      </span>
                  </div>
                  <Progress value={healthPercent} className="h-3 bg-gray-800" />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-400 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        Poder
                      </span>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 w-6 p-0 bg-gray-800 border-purple-700"
                      >
                        +
                      </Button>
                      <span className="font-bold text-lg text-purple-400">{character.power}</span>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={character.power === 0}
                        className="h-6 w-6 p-0 bg-gray-800 border-purple-700"
                      >
                        -
                      </Button>
                    </div>
                  </div>
                  <Progress value={(character.power / 10) * 100} className="h-3 bg-gray-800" />
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-800">
                  <div>
                    <p className="text-xs text-gray-500">Defesa</p>
                    <p className="text-xl font-bold text-blue-400">{character.defense}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Velocidade</p>
                    <p className="text-xl font-bold text-amber-400">{character.speed}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Percepção</p>
                    <p className="text-xl font-bold text-purple-400">{character.perception}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Poder</p>
                    <p className="text-xl font-bold text-pink-400">{character.power}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-800">
                  <div>
                    <p className="text-xs text-gray-500">Insanidade</p>
                    <p className="text-lg font-bold text-purple-400">{character.insanity}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Corrupção</p>
                    <p className="text-lg font-bold text-orange-400">{character.corruption}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>


          <Card className="bg-gradient-to-br from-gray-900 to-black border-red-900/30">
            <CardHeader>
              <CardTitle className="text-amber-400 text-lg flex items-center gap-2">
                <Dices className="w-5 h-5" />
                Atributos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-white">
              Força , Agilidade, Intelecto, Vontade
            </CardContent>
          </Card>

        {/* RollHistory */}
        </div>


        <div className="lg:col-span-2">
          <Card className="bg-gradient-to-br from-gray-900 to-black border-red-900/30">
            <div className="h-2 bg-gradient-to-r from-red-900 via-amber-700 to-red-900"></div>
            <CardContent className="p-6">
              <Tabs defaultValue="paths" className="w-full">
                <TabsList className="grid grid-cols-5 gap-2 bg-gray-800/50 p-2 mb-6">
                  <TabsTrigger value="paths" className="data-[state=active]:bg-red-900 data-[state=active]:text-amber-300">
                    Caminhos
                  </TabsTrigger>
                  <TabsTrigger value="combat" className="data-[state=active]:bg-red-900 data-[state=active]:text-amber-300">
                    Combate
                  </TabsTrigger>
                  <TabsTrigger value="spells" className="data-[state=active]:bg-red-900 data-[state=active]:text-amber-300">
                    Magias
                  </TabsTrigger>
                  <TabsTrigger value="abilities" className="data-[state=active]:bg-red-900 data-[state=active]:text-amber-300">
                    Talentos
                  </TabsTrigger>
                  <TabsTrigger value="background" className="data-[state=active]:bg-red-900 data-[state=active]:text-amber-300">
                    História
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="paths" className="space-y-4">
                  {character.novice_path && (
                    <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-4">
                      <Badge className="bg-blue-900/50 text-blue-300 mb-2">Novato</Badge>
                      <p className="text-lg font-semibold text-amber-300">{character.novice_path}</p>
                    </div>
                  )}
                  {character.expert_path && (
                    <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-4">
                      <Badge className="bg-purple-900/50 text-purple-300 mb-2">Especialista</Badge>
                      <p className="text-lg font-semibold text-amber-300">{character.expert_path}</p>
                    </div>
                  )}
                  {character.master_path && (
                    <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-4">
                      <Badge className="bg-red-900/50 text-red-300 mb-2">Mestre</Badge>
                      <p className="text-lg font-semibold text-amber-300">{character.master_path}</p>
                    </div>
                  )}
                  <div className="grid md:grid-cols-2 gap-4 mt-6">
                    {character.languages?.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-400 mb-2">Idiomas</h4>
                        <div className="flex flex-wrap gap-2">
                          {character.languages.map((lang, i) => (
                            <Badge key={i} variant="outline" className="bg-gray-800/50 text-gray-300">
                              {lang}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {character.professions?.length > 0 && (
                      <div>
                        <h4 className="text-sm font-semibold text-gray-400 mb-2">Profissões</h4>
                        <div className="flex flex-wrap gap-2">
                          {character.professions.map((prof, i) => (
                            <Badge key={i} variant="outline" className="bg-gray-800/50 text-gray-300">
                              {prof}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="combat" className="space-y-6">
                  {character.armor?.name && (
                    <div>
                      <h3 className="text-amber-400 font-semibold mb-3 flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        Armadura
                      </h3>
                      <div className="bg-gray-800/30 border border-gray-700 rounded-lg p-4">
                        <p className="font-semibold text-white">{character.armor.name}</p>
                        <p className="text-sm text-gray-400 mt-1">
                          Defesa: +{character.armor.defense_bonus} • {character.armor.properties}
                        </p>
                      </div>
                    </div>
                  )}

                  {character.weapons?.length > 0 && (
                    <div>
                      <h3 className="text-red-400 font-semibold mb-3 flex items-center gap-2">
                        <Swords className="w-5 h-5" />
                        Armas
                      </h3>
                      <div className="space-y-3">
                        WeaponRoller
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="spells" className="space-y-4">
                  {character.spells?.length > 0 ? (
                    <>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-purple-400 font-semibold flex items-center gap-2">
                          <Sparkles className="w-5 h-5" />
                          Grimório ({character.spells.length} magias)
                        </h3>
                        <div className="flex items-center gap-2">
                          <Flame className="w-4 h-4 text-purple-400" />
                          <span className="text-sm text-gray-400">Poder:</span>
                          <span className="text-lg font-bold text-purple-400">{character.power}</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        SpellCaster
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <Sparkles className="w-16 h-16 mx-auto text-gray-600 mb-4" />
                      <p className="text-gray-500">Nenhuma magia aprendida</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="abilities" className="space-y-6">
                  {character.talents?.length > 0 && (
                    <div>
                      <h3 className="text-amber-400 font-semibold mb-3 flex items-center gap-2">
                        <Zap className="w-5 h-5" />
                        Talentos
                      </h3>
                      <div className="space-y-3">
                        {character.talents.map((talent, i) => (
                          <div key={i} className="bg-gray-800/30 border border-gray-700 rounded-lg p-4">
                            <p className="font-semibold text-amber-300">{talent.name}</p>
                            <p className="text-sm text-gray-400 mt-2">{talent.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {character.equipment?.length > 0 && (
                    <div>
                      <h3 className="text-amber-400 font-semibold mb-3 flex items-center gap-2">
                        <Package className="w-5 h-5" />
                        Equipamento
                      </h3>
                      <div className="space-y-2">
                        {character.equipment.map((item, i) => (
                          <div key={i} className="bg-gray-800/30 border border-gray-700 rounded-lg p-3 flex justify-between items-start">
                            <div>
                              <p className="font-medium text-white">{item.name}</p>
                              {item.description && (
                                <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                              )}
                            </div>
                            <Badge variant="outline" className="ml-2">x{item.quantity}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="background" className="space-y-4">
                  {character.background && (
                    <div>
                      <h3 className="text-amber-400 font-semibold mb-2">História</h3>
                      <p className="text-gray-300 leading-relaxed">{character.background}</p>
                    </div>
                  )}
                  {character.personality && (
                    <div>
                      <h3 className="text-amber-400 font-semibold mb-2">Personalidade</h3>
                      <p className="text-gray-300 leading-relaxed">{character.personality}</p>
                    </div>
                  )}
                  {character.appearance && (
                    <div>
                      <h3 className="text-amber-400 font-semibold mb-2">Aparência</h3>
                      <p className="text-gray-300 leading-relaxed">{character.appearance}</p>
                    </div>
                  )}
                  {character.notes && (
                    <div>
                      <h3 className="text-amber-400 font-semibold mb-2">Notas</h3>
                      <p className="text-gray-300 leading-relaxed">{character.notes}</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
   </div>
  );
}
