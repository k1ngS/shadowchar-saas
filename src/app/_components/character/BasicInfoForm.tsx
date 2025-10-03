import React, { useState, useEffect } from "react";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select";
import { Upload, User, Info } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Card } from "~/components/ui/card";
import { ancestries } from "~/server/db/schema";

export function BasicInfoForm({ data, updateField }: { data: any; updateField: (field: string, value: any) => void }) { {
  const [ancestries, setAncestries] = useState([]);
  const [selectedAncestry, setSelectedAncestry] = useState(null);

  useEffect(() => {
    loadAncestries();
  }, []);

  useEffect(() => {
    if (data.ancestry && ancestries.length > 0) {
      const ancestry = ancestries.find(a => a.name === data.ancestry);
      setSelectedAncestry(ancestry);
    }
  }, [data.ancestry, ancestries]);

  const loadAncestries = async () => {
    const data = await Ancestry.list();
    setAncestries(data);
  };

  const handleAncestryChange = (ancestryName) => {
    const ancestry = ancestries.find(a => a.name === ancestryName);
    updateField("ancestry", ancestryName);
    setSelectedAncestry(ancestry);

    // Aplicar ajustes de ancestralidade
    if (ancestry) {
      if (ancestry.speed) updateField("speed", ancestry.speed);
      if (ancestry.size) updateField("size", ancestry.size);
      if (ancestry.languages) updateField("languages", ancestry.languages);

      // Aplicar ajustes de atributos
      if (ancestry.attribute_adjustments) {
        const adj = ancestry.attribute_adjustments;
        if (adj.strength) updateField("strength", data.strength + adj.strength);
        if (adj.agility) updateField("agility", data.agility + adj.agility);
        if (adj.intellect) updateField("intellect", data.intellect + adj.intellect);
        if (adj.will) updateField("will", data.will + adj.will);
      }
    }
  };

  // const handleImageUpload = async (e) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     const { file_url } = await UploadFile({ file });
  //     updateField("avatar_url", file_url);
  //   }
  // };

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-amber-400 text-sm font-semibold">
              Nome do Personagem *
            </Label>
            <Input
              id="name"
              value={data.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="Digite o nome"
              className="bg-gray-800/50 border-gray-700 text-white mt-2"
            />
          </div>

          <div>
            <Label htmlFor="level" className="text-amber-400 text-sm font-semibold">
              Nível
            </Label>
            <Input
              id="level"
              type="number"
              min="0"
              max="10"
              value={data.level}
              onChange={(e) => updateField("level", parseInt(e.target.value))}
              className="bg-gray-800/50 border-gray-700 text-white mt-2"
            />
          </div>

          <div>
            <Label htmlFor="ancestry" className="text-amber-400 text-sm font-semibold">
              Ancestralidade *
            </Label>
            <Select value={data.ancestry} onValueChange={handleAncestryChange}>
              <SelectTrigger className="bg-gray-800/50 border-gray-700 text-white mt-2">
                <SelectValue placeholder="Escolha uma ancestralidade" />
              </SelectTrigger>
              <SelectContent className="bg-gray-900 border-gray-700">
                {ancestries.map(ancestry => (
                  <SelectItem key={ancestry.id} value={ancestry.name}>
                    {ancestry.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {selectedAncestry && (
              <Card className="bg-blue-900/20 border-blue-700/50 p-3 mt-3">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                  <div className="text-xs text-blue-200">
                    <p className="mb-2">{selectedAncestry.description}</p>
                    {selectedAncestry.traits && selectedAncestry.traits.length > 0 && (
                      <div className="space-y-1">
                        <p className="font-semibold text-blue-300">Características:</p>
                        {selectedAncestry.traits.map((trait, i) => (
                          <div key={i}>
                            <span className="font-semibold">{trait.name}:</span> {trait.description}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            )}
          </div>

          <div>
            <Label htmlFor="size" className="text-amber-400 text-sm font-semibold">
              Tamanho
            </Label>
            <Input
              id="size"
              value={data.size}
              onChange={(e) => updateField("size", e.target.value)}
              placeholder="1"
              className="bg-gray-800/50 border-gray-700 text-white mt-2"
            />
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-amber-400 text-sm font-semibold">
            Avatar do Personagem
          </Label>
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-700 rounded-lg p-6 bg-gray-800/30 hover:bg-gray-800/50 transition-colors">
            {data.avatar_url ? (
              <div className="relative">
                <img
                  src={data.avatar_url}
                  alt="Avatar"
                  className="w-40 h-40 object-cover rounded-lg border-2 border-amber-700/50"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 bg-gray-800 border-gray-700 text-gray-300"
                  onClick={() => document.getElementById("avatar-upload").click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Trocar Imagem
                </Button>
              </div>
            ) : (
              <div className="text-center">
                <User className="w-16 h-16 mx-auto text-gray-600 mb-3" />
                <Button
                  variant="outline"
                  className="bg-gray-800 border-gray-700 text-gray-300"
                  onClick={() => document.getElementById("avatar-upload").click()}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Avatar
                </Button>
              </div>
            )}
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
            />
          </div>
        </div>
      </div>
    </div>
  );}
}
