"use client";

import { useState } from "react";

// Importando os componentes de dados existentes
import DiceRoller from "~/app/_components/dice/DiceRoller";
import { DiceD4 } from "~/app/_components/dice/DiceD4";
import { DiceD6 } from "~/app/_components/dice/DiceD6";
import { DiceD20 } from "~/app/_components/dice/DiceD20";
import { DiceIcon } from "~/app/_components/dice/DiceIcon";
import { DICE_ICONS, type DiceIconKey, DICE_ICON_VARIANTS } from "~/app/_components/dice/DiceIcons";
import type { DiceColorClass, DiceColorText, DiceMode, DiceVisualVariant, NumberStyle } from "~/app/_components/dice/types";
import { Dice5, History, Trash } from "lucide-react";

type RollResult = {
  id: string;
  formula: string;
  result: number;
  breakdown: string;
  meta?: {
    base: number;
    boonBaneNet: number;
    d6s?: number[];
    d6Max?: number;
  };
  timestamp: Date;
};

export default function DiceTesterPage() {
  // Estados para configuração de dados
  const [sides, setSides] = useState<number>(20);
  const [modifier, setModifier] = useState<number>(0);
  const [boons, setBoons] = useState<number>(0);
  const [banes, setBanes] = useState<number>(0);
  const [colorClass, setColorClass] = useState<DiceColorClass>("blue");
  const [labelColorClass, setLabelColorClass] = useState<DiceColorText>("blue");
  const [mode, setMode] = useState<DiceMode>("dice");
  const [variant, setVariant] = useState<DiceVisualVariant>("polygon-d20");
  const [numberStyle, setNumberStyle] = useState<NumberStyle>("center");
  const [iconKey, setIconKey] = useState<DiceIconKey>("emoji-dice");
  const [size, setSize] = useState<number>(48);
  const [rollHistory, setRollHistory] = useState<RollResult[]>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);

  // Opções disponíveis
  const sideOptions = [4, 6, 8, 10, 12, 20, 100];
  const colorOptions: { value: DiceColorClass; label: string }[] = [
    { value: "blue", label: "Azul" },
    { value: "purple", label: "Roxo" },
    { value: "green", label: "Verde" },
    { value: "red", label: "Vermelho" },
    { value: "yellow", label: "Amarelo" },
  ];
  const textColorOptions: { value: DiceColorText; label: string }[] = [
    { value: "blue", label: "Azul" },
    { value: "purple", label: "Roxo" },
    { value: "green", label: "Verde" },
    { value: "red", label: "Vermelho" },
    { value: "yellow", label: "Amarelo" },
  ];
  const modeOptions: { value: DiceMode; label: string }[] = [
    { value: "dice", label: "Dados" },
    { value: "icon", label: "Ícones" },
  ];
  const variantOptions: { value: DiceVisualVariant; label: string }[] = [
    { value: "polygon-d20", label: "D20 Polígono" },
    { value: "polygon-d6", label: "D6 Polígono" },
    { value: "polygon-d4", label: "D4 Polígono" },
  ];
  const numberStyleOptions: { value: NumberStyle; label: string }[] = [
    { value: "center", label: "Centralizado" },
    { value: "dots", label: "Pontos (D6)" },
  ];

  const handleRollResult = (result: number, breakdown: string, meta?: { base: number; boonBaneNet: number; d6s?: number[]; d6Max?: number }) => {
    const rollResult: RollResult = {
      id: crypto.randomUUID(),
      formula: `d${sides}${modifier !== 0 ? (modifier > 0 ? `+${modifier}` : modifier) : ""}${boons > 0 ? ` +${boons} boons` : ""}${banes > 0 ? ` -${banes} banes` : ""}`,
      result,
      breakdown,
      meta,
      timestamp: new Date()
    };
    setRollHistory(prev => [rollResult, ...prev]);
  };

  const clearHistory = () => {
    setRollHistory([]);
  };

  const updateSides = (newSides: number) => {
    setSides(newSides);
    // Atualizar a variante conforme o tipo de dado
    if (newSides === 4) {
      setVariant("polygon-d4");
    } else if (newSides === 6) {
      setVariant("polygon-d6");
    } else {
      setVariant("polygon-d20");
    }
  };

  const resetBoonsBanes = () => {
    setBoons(0);
    setBanes(0);
  };

  // Renderizar um dado de exemplo com base no tipo
  const renderDicePreview = (diceValue: number) => {
    if (diceValue === 4) {
      return <DiceD4 value={4} size={40} />;
    } else if (diceValue === 6) {
      return <DiceD6 value={6} size={40} />;
    } else {
      return <DiceD20 value={diceValue} size={40} />;
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <h1 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
        <Dice5 className="text-purple-500" />
        Testador de Dados
      </h1>

      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Configuração dos dados */}
          <div>
            <h2 className="text-xl font-semibold mb-4 text-white">Configuração</h2>

            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Tipo de Dado</label>
              <div className="flex flex-wrap gap-2">
                {sideOptions.map((sideOption) => (
                  <button
                    key={sideOption}
                    className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold transition
                      ${sides === sideOption
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                    onClick={() => updateSides(sideOption)}
                  >
                    d{sideOption}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Modificador</label>
              <div className="flex items-center gap-2">
                <button
                  className="w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center justify-center font-bold text-white"
                  onClick={() => setModifier(prev => prev - 1)}
                >
                  -
                </button>
                <input
                  type="number"
                  value={modifier}
                  onChange={(e) => setModifier(parseInt(e.target.value) || 0)}
                  className="bg-gray-700 text-white text-center w-16 h-10 rounded-lg"
                />
                <button
                  className="w-10 h-10 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center justify-center font-bold text-white"
                  onClick={() => setModifier(prev => prev + 1)}
                >
                  +
                </button>
              </div>
            </div>

            {/* Shadow of the Demon Lord: Boons/Banes */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-gray-300">Boons/Banes</label>
                <button
                  onClick={resetBoonsBanes}
                  className="text-xs bg-gray-700 hover:bg-gray-600 px-2 py-1 rounded text-gray-300"
                >
                  Reset
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Boons</label>
                  <div className="flex items-center gap-2">
                    <button
                      className="w-10 h-10 bg-green-700/40 hover:bg-green-700/60 rounded-lg flex items-center justify-center font-bold text-white"
                      onClick={() => setBoons(prev => Math.max(0, prev - 1))}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="0"
                      value={boons}
                      onChange={(e) => setBoons(Math.max(0, parseInt(e.target.value) || 0))}
                      className="bg-gray-700 text-white text-center w-12 h-10 rounded-lg"
                    />
                    <button
                      className="w-10 h-10 bg-green-700/40 hover:bg-green-700/60 rounded-lg flex items-center justify-center font-bold text-white"
                      onClick={() => setBoons(prev => prev + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Banes</label>
                  <div className="flex items-center gap-2">
                    <button
                      className="w-10 h-10 bg-red-700/40 hover:bg-red-700/60 rounded-lg flex items-center justify-center font-bold text-white"
                      onClick={() => setBanes(prev => Math.max(0, prev - 1))}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="0"
                      value={banes}
                      onChange={(e) => setBanes(Math.max(0, parseInt(e.target.value) || 0))}
                      className="bg-gray-700 text-white text-center w-12 h-10 rounded-lg"
                    />
                    <button
                      className="w-10 h-10 bg-red-700/40 hover:bg-red-700/60 rounded-lg flex items-center justify-center font-bold text-white"
                      onClick={() => setBanes(prev => prev + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-gray-300 mb-2">Modo de Visualização</label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <select
                    value={mode}
                    onChange={(e) => setMode(e.target.value as DiceMode)}
                    className="w-full bg-gray-700 text-white p-2 rounded-lg"
                  >
                    {modeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <select
                    value={colorClass}
                    onChange={(e) => setColorClass(e.target.value as DiceColorClass)}
                    className="w-full bg-gray-700 text-white p-2 rounded-lg"
                  >
                    {colorOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {mode === "dice" && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Variante</label>
                  <select
                    value={variant}
                    onChange={(e) => setVariant(e.target.value as DiceVisualVariant)}
                    className="w-full bg-gray-700 text-white p-2 rounded-lg"
                  >
                    {variantOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Estilo do Número</label>
                  <select
                    value={numberStyle}
                    onChange={(e) => setNumberStyle(e.target.value as NumberStyle)}
                    className="w-full bg-gray-700 text-white p-2 rounded-lg"
                  >
                    {numberStyleOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {mode === "icon" && (
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Ícone</label>
                <select
                  value={iconKey}
                  onChange={(e) => setIconKey(e.target.value as DiceIconKey)}
                  className="w-full bg-gray-700 text-white p-2 rounded-lg"
                >
                  {DICE_ICON_VARIANTS.map((icon) => (
                    <option key={icon.key} value={icon.key}>
                      {icon.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="mt-4">
              <label className="text-sm text-gray-400 mb-1 block">Tamanho</label>
              <input
                type="range"
                min="32"
                max="80"
                value={size}
                onChange={(e) => setSize(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>32px</span>
                <span>80px</span>
              </div>
            </div>
          </div>

          {/* Visualização dos dados */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">Resultado</h2>
              <button
                className="text-sm flex items-center gap-1 text-gray-400 hover:text-gray-300"
                onClick={() => setShowHistory(!showHistory)}
              >
                <History /> {showHistory ? "Ocultar histórico" : "Mostrar histórico"}
              </button>
            </div>

            <div className="bg-gray-900 rounded-lg p-6 mb-6 min-h-40 flex flex-col items-center justify-center">
              <div className="text-center">
                <div className="text-gray-400 mb-4">
                  d{sides}
                  {modifier !== 0 && (modifier > 0 ? `+${modifier}` : modifier)}
                  {boons > 0 && ` +${boons} boons`}
                  {banes > 0 && ` -${banes} banes`}
                </div>

                <DiceRoller
                  sides={sides}
                  modifier={modifier}
                  boons={boons}
                  banes={banes}
                  label="Rolar"
                  labelColorClass={labelColorClass}
                  colorClass={colorClass}
                  mode={mode}
                  variant={variant}
                  numberStyle={numberStyle}
                  iconKey={iconKey}
                  size={size}
                  onResult={handleRollResult}
                />
              </div>
            </div>

            {rollHistory.length > 0 && (
              <div className="bg-gray-800 rounded-lg p-4 mb-4">
                <h3 className="text-lg font-semibold text-white mb-2">Última Rolagem</h3>
                <div className="bg-gray-700 rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-white font-medium">
                        {rollHistory[0].formula} = {rollHistory[0].result}
                      </div>
                      <div className="text-sm text-gray-400">
                        {rollHistory[0].breakdown}
                      </div>
                      {rollHistory[0].meta?.d6s && (
                        <div className="text-sm text-gray-400">
                          Boons/Banes d6s: [{rollHistory[0].meta.d6s.join(', ')}]
                          {rollHistory[0].meta.d6Max !== undefined && (
                            <span> → {rollHistory[0].meta.boonBaneNet > 0 ? 'Maior' : 'Menor'}: {rollHistory[0].meta.d6Max}</span>
                          )}
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      {rollHistory[0].timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Demonstração dos diferentes tipos */}
            <div>
              <h3 className="text-md font-semibold text-gray-300 mb-2">Tipos de Dados</h3>
              <div className="grid grid-cols-3 sm:grid-cols-3 gap-4 mb-4">
                <div className="flex flex-col items-center bg-gray-900 p-3 rounded-lg">
                  <DiceD4 value={4} size={40} color="#f59e42" />
                  <span className="text-xs text-gray-400 mt-1">D4</span>
                </div>
                <div className="flex flex-col items-center bg-gray-900 p-3 rounded-lg">
                  <DiceD6 value={6} size={40} color="#2563eb" />
                  <span className="text-xs text-gray-400 mt-1">D6</span>
                </div>
                <div className="flex flex-col items-center bg-gray-900 p-3 rounded-lg">
                  <DiceD20 value={20} size={40} color="#a78bfa" />
                  <span className="text-xs text-gray-400 mt-1">D20</span>
                </div>
              </div>
            </div>

            {/* Demonstração dos diferentes ícones */}
            <div>
              <h3 className="text-md font-semibold text-gray-300 mb-2">Ícones</h3>
              <div className="bg-gray-900 p-3 rounded-lg">
                <div className="flex flex-wrap gap-4 justify-center">
                  {DICE_ICON_VARIANTS.slice(0, 6).map((icon) => (
                    <div key={icon.key} className="flex flex-col items-center">
                      <DiceIcon iconKey={icon.key} size={30} />
                      <span className="text-xs text-gray-400 mt-1">{icon.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Histórico de rolagens */}
      {showHistory && (
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Histórico de Rolagens</h2>
            <button
              className="text-sm flex items-center gap-1 text-red-400 hover:text-red-300"
              onClick={clearHistory}
              disabled={rollHistory.length === 0}
            >
              <Trash /> Limpar
            </button>
          </div>

          {rollHistory.length === 0 ? (
            <div className="text-gray-400 text-center py-4">
              Nenhuma rolagem realizada ainda.
            </div>
          ) : (
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {rollHistory.map((roll) => (
                <div key={roll.id} className="bg-gray-700 rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-white font-medium">
                        {roll.formula} = {roll.result}
                      </div>
                      <div className="text-sm text-gray-400">
                        {roll.breakdown}
                      </div>
                      {roll.meta?.d6s && (
                        <div className="text-sm text-gray-400">
                          Boons/Banes d6s: [{roll.meta.d6s.join(', ')}]
                          {roll.meta.d6Max !== undefined && (
                            <span> → {roll.meta.boonBaneNet > 0 ? 'Maior' : 'Menor'}: {roll.meta.d6Max}</span>
                          )}
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      {roll.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}