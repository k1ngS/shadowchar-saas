"use client";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DiceIcon } from "./DiceIcon";
import { DiceD6 } from "./DiceD6";
import { DiceD20 } from "./DiceD20";
import { DiceD4 } from "./DiceD4";
import { DICE_ICONS, type DiceIconKey } from "./DiceIcons";
import { COLOR_CLASS_MAP, TEXT_COLOR_CLASS_MAP, type DiceColorClass, type DiceColorText, type DiceVisualVariant, type NumberStyle, type DiceMode } from "./types";

/**
 * DiceRoller com:
 * - boons/banes (SoDL): aplica d6 de vantagem/desvantagem pegando o MAIOR d6.
 * - size / className para reutilização em diferentes layouts.
 * - roteamento explícito por mode: "dice" | "icon" (sem casts inseguros).
 */

export interface DiceRollerProps {
  sides?: number;
  modifier?: number;
  boons?: number; // SoDL
  banes?: number; // SoDL
  label?: string;
  labelColorClass?: DiceColorText;
  colorClass?: DiceColorClass;

  // Visual
  mode?: DiceMode;                 // "dice" (padrão) ou "icon"
  variant?: DiceVisualVariant;     // quando mode="dice"
  numberStyle?: NumberStyle;
  iconKey?: DiceIconKey;           // quando mode="icon"
  size?: number;                   // tamanho do botão/ícone
  className?: string;              // classes extras no botão

  onResult?: (result: number, breakdown: string, meta?: { base: number; boonBaneNet: number; d6s?: number[]; d6Max?: number }) => void;
}

export default function DiceRoller({
  sides = 20,
  modifier = 0,
  boons = 0,
  banes = 0,
  label,
  labelColorClass = "blue",
  colorClass = "blue",
  mode = "dice",
  variant = "polygon-d20",
  numberStyle = "center",
  iconKey,
  size = 48,
  className,
  onResult,
}: DiceRollerProps) {
  const [rolling, setRolling] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [rollDetail, setRollDetail] = useState<string>("");
  const [rollId, setRollId] = useState(0);

  const color = COLOR_CLASS_MAP[colorClass] || COLOR_CLASS_MAP.blue;
  const labelColorClassFinal = TEXT_COLOR_CLASS_MAP[labelColorClass] || TEXT_COLOR_CLASS_MAP.blue;

  const boonBaneNet = Math.max(0, boons - banes) - Math.max(0, banes - boons); // simplifica para (boons - banes)

  const buttonClasses = `flex items-center justify-center rounded-full border-2 border-blue-600 bg-gray-900 hover:bg-gray-800 focus:outline-none transition shadow-lg shadow-blue-950/60 ${rolling ? "opacity-60" : ""} ${className || ""}`;
  const buttonStyle = useMemo(() => ({
    width: size,
    height: size,
  }), [size]);

  const rollDice = () => {
    setRolling(true);
    setResult(null);

    setTimeout(() => {
      const base = Math.ceil(Math.random() * sides);

      // SoDL boon/bane net: rola |net| d6, pega o MAIOR, soma (boon) ou subtrai (bane)
      let d6s: number[] | undefined;
      let d6Max = 0;
      let boonBaneAdj = 0;
      if (boonBaneNet !== 0) {
        const qty = Math.abs(boonBaneNet);
        d6s = Array.from({ length: qty }, () => Math.ceil(Math.random() * 6));
        d6Max = Math.max(...d6s);
        boonBaneAdj = boonBaneNet > 0 ? d6Max : -d6Max;
      }

      const total = base + modifier + boonBaneAdj;

      const bbText = boonBaneNet === 0
        ? ""
        : boonBaneNet > 0
          ? ` + boon(${d6s?.join(",")} ⇒ +${d6Max})`
          : ` - bane(${d6s?.join(",")} ⇒ -${d6Max})`;

      const breakdown = `${base}${modifier ? (modifier > 0 ? ` + ${modifier}` : ` - ${-modifier}`) : ""}${bbText}`;

      setResult(total);
      setRollDetail(breakdown);
      setRolling(false);
      setRollId((id) => id + 1);
      onResult?.(total, breakdown, { base, boonBaneNet, d6s, d6Max });
    }, 900);
  };

  // Preview para animação (não afeta resultado)
  const showValue = result !== null && !rolling ? result : Math.ceil(Math.random() * sides);

  // Render da face
  let face: React.ReactNode = null;
  if (mode === "icon") {
    const key = iconKey;
    face = key ? <DiceIcon iconKey={key} size={Math.max(28, Math.round(size * 0.75))} /> : null;
  } else {
    if (variant.includes("d6")) {
      face = <DiceD6 value={Math.min(showValue, 6)} color={color} numberStyle={numberStyle} size={Math.max(28, Math.round(size * 0.66))} />;
    } else if (variant.includes("d20")) {
      face = <DiceD20 value={Math.min(showValue, 20)} color={color} numberStyle={numberStyle} size={Math.max(28, Math.round(size * 0.66))} />;
    } else if (variant.includes("d4")) {
      face = <DiceD4 value={Math.min(showValue, 4)} color={color} numberStyle={numberStyle} size={Math.max(28, Math.round(size * 0.66))} />;
    } else {
      face = <DiceD20 value={Math.min(showValue, 20)} color={color} numberStyle={numberStyle} size={Math.max(28, Math.round(size * 0.66))} />;
    }
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <motion.button
        whileTap={{ scale: 0.95 }}
        disabled={rolling}
        onClick={rollDice}
        className={buttonClasses}
        style={buttonStyle}
        aria-label={label || `Rolar d${sides}`}
      >
        <AnimatePresence mode="wait">
          {rolling ? (
            <motion.span
              key="rolling"
              initial={{ rotate: 0, scale: 0.95, opacity: 0.6 }}
              animate={{ rotate: 360, scale: 1.10, opacity: 1 }}
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
            aria-live="polite"
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