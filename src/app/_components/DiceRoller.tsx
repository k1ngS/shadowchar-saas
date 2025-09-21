"use client";
import { useState, type JSX } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DICE_ICON_VARIANTS, type DiceIconKey } from "./ui/DiceIcons";

/**
 * DiceRoller:
 * - variant: visual do dado (d6, d20, d4, crystal, etc)
 * - numberStyle: variações de número (sombra, outline, dots, etc)
 * - iconOnly: mostra só o ícone (sem número na face)
 */

type DiceVariant =
  | "minimal-d6"
  | "classic-d6"
  | "dot-d6"
  | "polygon-d20"
  | "crystal-d20"
  | "rune-d20"
  | "triangle-d4"
  | "icon-d6"
  | "icon-d20"
  | "icon-d4"
  | "icon-crystal"
  | "icon-round";

type NumberStyle =
  | "center"
  | "bottom"
  | "top"
  | "shadow"
  | "outline"
  | "invert"
  | "rune"
  | "dots"
  | "big"
  | "tiny"
  | "none";

interface DiceRollerProps {
  sides?: number;
  modifier?: number;
  label?: string;
  colorClass?: string;
  variant?: DiceVariant;
  numberStyle?: NumberStyle;
  iconOnly?: boolean;
  onResult?: (result: number, breakdown: string) => void;
}

const diceColors: Record<DiceVariant, string> = {
  "minimal-d6": "#2563eb",
  "classic-d6": "#e11d48",
  "dot-d6": "#fde047",
  "polygon-d20": "#a78bfa",
  "crystal-d20": "#10b981",
  "rune-d20": "#6366f1",
  "triangle-d4": "#f59e42",
  "icon-d6": "#2563eb",
  "icon-d20": "#a78bfa",
  "icon-d4": "#f59e42",
  "icon-crystal": "#10b981",
  "icon-round": "#e11d48",
};

// Ícones simples para variação "iconOnly"
const DiceIconSVG: Record<DiceVariant, JSX.Element> = {
  "minimal-d6": (
    <svg width="32" height="32" viewBox="0 0 54 54" fill="none">
      <rect x="4" y="4" width="46" height="46" rx="13" fill="#2563eb" stroke="#23272e" strokeWidth="3" />
    </svg>
  ),
  "classic-d6": (
    <svg width="32" height="32" viewBox="0 0 54 54" fill="none">
      <rect x="6" y="6" width="42" height="42" rx="11" fill="#e11d48" stroke="#000" strokeWidth="2.5" />
    </svg>
  ),
  "dot-d6": (
    <svg width="32" height="32" viewBox="0 0 54 54" fill="none">
      <rect x="4" y="4" width="46" height="46" rx="14" fill="#fde047" stroke="#23272e" strokeWidth="3" />
    </svg>
  ),
  "polygon-d20": (
    <svg width="32" height="32" viewBox="0 0 54 54" fill="none">
      <polygon
        points="27,6 48,18 48,39 27,51 6,39 6,18"
        fill="#a78bfa"
        stroke="#23272e"
        strokeWidth="3"
      />
    </svg>
  ),
  "crystal-d20": (
    <svg width="32" height="32" viewBox="0 0 54 54" fill="none">
      <polygon
        points="27,6 48,18 48,39 27,51 6,39 6,18"
        fill="url(#crystal)"
        stroke="#fff7"
        strokeWidth="2.5"
      />
      <defs>
        <linearGradient id="crystal" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fff7" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>
      </defs>
    </svg>
  ),
  "rune-d20": (
    <svg width="32" height="32" viewBox="0 0 54 54" fill="none">
      <polygon points="27,6 48,18 48,39 27,51 6,39 6,18" fill="#6366f1" stroke="#23272e" strokeWidth="3" />
      <text
        x="27"
        y="20"
        textAnchor="middle"
        fontSize="13"
        fontWeight="bold"
        fill="#fff8"
        style={{ fontFamily: "serif" }}
      >ᚱ</text>
    </svg>
  ),
  "triangle-d4": (
    <svg width="32" height="32" viewBox="0 0 54 54" fill="none">
      <polygon points="27,7 50,47 4,47" fill="#f59e42" stroke="#23272e" strokeWidth="3" />
    </svg>
  ),
  "icon-d6": (
    <svg width="32" height="32" viewBox="0 0 54 54" fill="none">
      <rect x="4" y="4" width="46" height="46" rx="13" fill="#2563eb" stroke="#23272e" strokeWidth="3" />
      <circle cx="27" cy="27" r="5" fill="#fff" />
    </svg>
  ),
  "icon-d20": (
    <svg width="32" height="32" viewBox="0 0 54 54" fill="none">
      <polygon points="27,6 48,18 48,39 27,51 6,39 6,18" fill="#a78bfa" stroke="#23272e" strokeWidth="3" />
      <circle cx="27" cy="27" r="6.5" fill="#fff" />
    </svg>
  ),
  "icon-d4": (
    <svg width="32" height="32" viewBox="0 0 54 54" fill="none">
      <polygon points="27,7 50,47 4,47" fill="#f59e42" stroke="#23272e" strokeWidth="3" />
      <circle cx="27" cy="33" r="5.5" fill="#fff" />
    </svg>
  ),
  "icon-crystal": (
    <svg width="32" height="32" viewBox="0 0 54 54" fill="none">
      <polygon points="27,6 48,18 48,39 27,51 6,39 6,18" fill="#10b981" stroke="#fff7" strokeWidth="2.5" />
      <circle cx="27" cy="27" r="6.5" fill="#fff" />
    </svg>
  ),
  "icon-round": (
    <svg width="32" height="32" viewBox="0 0 54 54" fill="none">
      <circle cx="27" cy="27" r="22" fill="#e11d48" stroke="#23272e" strokeWidth="3"/>
      <circle cx="27" cy="27" r="6.5" fill="#fff" />
    </svg>
  ),
};

export default function DiceRoller({
  sides = 20,
  modifier = 0,
  label,
  colorClass = "text-blue-400",
  variant = "polygon-d20",
  numberStyle = "center",
  iconOnly = false,
  iconOnlyIconKey,
  onResult,
}: DiceRollerProps & { iconOnlyIconKey?: DiceIconKey }) {
  const [rolling, setRolling] = useState(false);
  const [result, setResult] = useState<number | null>(null);
  const [rollDetail, setRollDetail] = useState<string>("");
  const [rollId, setRollId] = useState(0);

  const color = diceColors[variant];

  const iconOnlyIcon =
    iconOnlyIconKey
      ? DICE_ICON_VARIANTS.find(i => i.key === iconOnlyIconKey)?.icon
      : variant.startsWith("icon-")
        ? DICE_ICON_VARIANTS.find(i => i.key === variant.replace("icon-", ""))?.icon
        : undefined;

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

  // Render só ícone simples
  const renderIcon = () => DiceIconSVG[variant];

  // Render dado completo (SVG com número/variante)
  const renderFullDice = () => {
    // Só ícone
    if (
      variant.startsWith("icon-") ||
      iconOnly ||
      numberStyle === "none"
    ) {
      return renderIcon();
    }

    // d6
    if (["minimal-d6", "classic-d6", "dot-d6"].includes(variant)) {
      // Reaproveita lógica do renderD6 da resposta anterior
      // ...mas aqui só faz "center", "big", "shadow", "dots", etc
      // Você pode adaptar para mostrar só número ou só dots
      // Para simplificar, só "center" e "dots" aqui:
      const dotPatterns = [
        [],
        [[27, 27]],
        [[15, 15], [39, 39]],
        [[15, 15], [27, 27], [39, 39]],
        [[15, 15], [39, 15], [15, 39], [39, 39]],
        [[15, 15], [39, 15], [27, 27], [15, 39], [39, 39]],
        [[15, 15], [39, 15], [15, 27], [39, 27], [15, 39], [39, 39]],
      ];
      return (
        <svg width={32} height={32} viewBox="0 0 54 54" fill="none">
          <rect x="4" y="4" width="46" height="46" rx="13" fill={color} stroke="#23272e" strokeWidth="3" />
          {numberStyle === "center" && (
            <text
              x="27"
              y="34"
              textAnchor="middle"
              fontSize="22"
              fontWeight="bold"
              fill="#fff"
              style={{ filter: "drop-shadow(0 1px 2px #0008)" }}
            >
              {Math.min(showValue, 6)}
            </text>
          )}
          {numberStyle === "dots" && dotPatterns[Math.min(showValue, 6)]?.map(([cx, cy], i) => (
            <circle cx={cx} cy={cy} r="4.7" fill="#fff" key={i} />
          ))}
        </svg>
      );
    }
    // d20
    if (["polygon-d20", "crystal-d20", "rune-d20"].includes(variant)) {
      const points = Array.from({ length: 20 }, (_, i) => {
        const angle = ((2 * Math.PI) / 20) * i - Math.PI / 2;
        return `${27 + 23 * Math.cos(angle)},${27 + 23 * Math.sin(angle)}`;
      });
      return (
        <svg width={32} height={32} viewBox="0 0 54 54">
          <polygon points={points.join(" ")} fill={color} stroke="#23272e" strokeWidth="2" />
          {numberStyle === "center" && (
            <text
              x="27"
              y="33"
              textAnchor="middle"
              fontSize="18"
              fontWeight="bold"
              fill="#fff"
              style={{ fontFamily: "monospace" }}
            >
              {Math.min(showValue, 20)}
            </text>
          )}
        </svg>
      );
    }
    // d4
    if (["triangle-d4"].includes(variant)) {
      return (
        <svg width={32} height={32} viewBox="0 0 54 54">
          <polygon points="27,7 50,47 4,47" fill={color} stroke="#23272e" strokeWidth="3" />
          {numberStyle === "center" && (
            <text
              x="27"
              y="36"
              textAnchor="middle"
              fontSize="17"
              fontWeight="bold"
              fill="#fff"
            >
              {Math.min(showValue, 4)}
            </text>
          )}
        </svg>
      );
    }
    // fallback
    return renderIcon();
  };

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
              {iconOnlyIcon || variant.startsWith("icon-")
                ? iconOnlyIcon
                : renderFullDice()}
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
              {iconOnlyIcon || variant.startsWith("icon-")
                ? iconOnlyIcon
                : renderFullDice()}
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
            className={`mt-1 text-lg font-extrabold ${colorClass} drop-shadow`}
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