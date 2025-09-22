"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DiceIcon } from "./DiceIcon";
import { DiceD6 } from "./DiceD6";
import { DiceD20 } from "./DiceD20";
import { DiceD4 } from "./DiceD4";
import { DICE_ICON_VARIANTS, DICE_ICONS, type DiceIconKey } from "./DiceIcons";
import { COLOR_CLASS_MAP, TEXT_COLOR_CLASS_MAP, type DiceColorClass, type DiceColorText, type DiceVariant, type NumberStyle } from "./types";

/**
 * DiceRoller.tsx
 *
 * Componente principal para rolagem de dados.
 *
 * - Permite selecionar variante visual, tipo de número, cor, modo só ícone (iconOnly) etc.
 * - Faz animações de rolagem e exibe resultado.
 * - Modular: delega renderização do dado para DiceD6, DiceD20, DiceD4 ou DiceIcon conforme props.
 *
 * Props principais:
 * - sides, modifier: define rolagem
 * - variant: define visual (ex: "minimal-d6", "emoji-dice", etc)
 * - numberStyle: modo de exibição do número
 * - iconOnly: mostra apenas o ícone
 * - iconOnlyIconKey: força ícone específico
 * - label, colorClass, labelColorClass: customização de UI/UX
 *
 * Utilizado por: Qualquer parte do app que precise de rolagem visual.
 */

export interface DiceRollerProps {
  sides?: number;
  modifier?: number;
  label?: string;
  labelColorClass?: DiceColorText;
  colorClass?: DiceColorClass;
  variant?: DiceVariant;
  numberStyle?: NumberStyle;
  iconOnly?: boolean;
  iconOnlyIconKey?: DiceIconKey;
  onResult?: (result: number, breakdown: string) => void;
}


export default function DiceRoller({
  sides = 20,
  modifier = 0,
  label,
  labelColorClass = "blue",
  colorClass = "blue",
  variant = "polygon-d20",
  numberStyle = "center",
  iconOnly = false,
  iconOnlyIconKey,
  onResult,
}: DiceRollerProps) {
  const [rolling, setRolling] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [rollDetail, setRollDetail] = useState<string>("");
  const [rollId, setRollId] = useState(0);

  const color = COLOR_CLASS_MAP[colorClass] || COLOR_CLASS_MAP.blue;
  const labelColorClassFinal = TEXT_COLOR_CLASS_MAP[labelColorClass] || TEXT_COLOR_CLASS_MAP.blue;

  const iconKey: DiceIconKey | undefined = iconOnlyIconKey || (variant as DiceIconKey);
  const icon = iconKey && DICE_ICONS[iconKey];

  const rollDice = () => {
    setRolling(true);
    setResult(null);

    setTimeout(() => {
      const base = Math.ceil(Math.random() * sides);
      const total = base + modifier;
      setResult(total);
      setRollDetail(`${base}${modifier ? (modifier > 0 ? ` + ${modifier}` : ` - ${-modifier}`) : ""}`);
      setRolling(false);
      setRollId((id) => id + 1);
      if (onResult) onResult(total, `${base}${modifier ? (modifier > 0 ? ` + ${modifier}` : ` - ${-modifier}`) : ""}`);
    }, 900);
  };

  // Preview para animação
  const showValue = result !== null && !rolling ? result : Math.ceil(Math.random() * sides);

  // Renderização principal
  let face: React.ReactNode = null;
  if (iconOnly && iconKey && icon) {
    face = <DiceIcon iconKey={iconKey} size={32} />;
  } else if (/emoji|svg/.test(variant)) {
    face = iconKey && icon ? <DiceIcon iconKey={iconKey} size={32} /> : null;
  } else if (variant.includes("d6")) {
    face = <DiceD6 value={Math.min(showValue, 6)} color={color} numberStyle={numberStyle} />;
  } else if (variant.includes("d20")) {
    face = <DiceD20 value={Math.min(showValue, 20)} color={color} numberStyle={numberStyle} />;
  } else if (variant.includes("d4")) {
    face = <DiceD4 value={Math.min(showValue, 4)} color={color} numberStyle={numberStyle} />;
  } else {
    face = iconKey && icon ? <DiceIcon iconKey={iconKey} size={32} /> : null;
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <motion.button
        whileTap={{ scale: 0.95 }}
        disabled={rolling}
        onClick={rollDice}
        className={`w-12 h-12 flex items-center justify-center rounded-full border-2 border-blue-600 bg-gray-900 hover:bg-gray-800 focus:outline-none
          transition ${rolling ? "opacity-60" : ""} shadow-lg shadow-blue-950/60`}
        aria-label={label || `Rolar d${sides}`}
      >
        <AnimatePresence mode="wait">
          {rolling ? (
            <motion.span
              key="rolling"
              initial={{ rotate: 0, scale: 0.95, opacity: 0.6 }}
              animate={{ rotate: 360, scale: 1.15, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ repeat: Infinity, duration: 0.8, ease: "easeInOut" }}
              style={{ display: "inline-block" }}
            >
              {face}
            </motion.span>
          ) : (
            <motion.span
              key="static"
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", stiffness: 180 }}
              style={{ display: "inline-block" }}
            >
              {face}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
      {/* Feedback visual do resultado */}
      <AnimatePresence mode="wait">
        {result !== null && !rolling && (
          <motion.div
            key={rollId}
            initial={{ scale: 0.5, y: -10, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.7, y: 10, opacity: 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 16 }}
            className={`mt-1 text-lg font-extrabold ${labelColorClassFinal} drop-shadow`}
          >
            {result}
            <span className="ml-1 text-xs text-gray-400">{rollDetail && `(${rollDetail})`}</span>
          </motion.div>
        )}
      </AnimatePresence>
      {label && (
        <span className="text-xs text-gray-400">{label}</span>
      )}
    </div>
  );
}