/**
 * Tipos centrais (refinados) para separar ícones de dados visuais.
 * - DiceVisualVariant: variantes de “dados” (SVG com número/dots).
 * - DiceIconKey: já vem do DiceIcons.
 * - DiceMode: “dice” ou “icon” para roteamento explícito e seguro.
 */
export type DiceVisualVariant =
  | "minimal-d6"
  | "classic-d6"
  | "dot-d6"
  | "polygon-d20"
  | "crystal-d20"
  | "rune-d20"
  | "triangle-d4";

export type NumberStyle =
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

export type ColorClass =
  | "blue"
  | "red"
  | "yellow"
  | "purple"
  | "green"
  | "indigo"
  | "orange";

export const COLOR_CLASS_MAP = {
  blue: "#2563eb",
  red: "#e11d48",
  yellow: "#fde047",
  purple: "#a78bfa",
  green: "#10b981",
  indigo: "#6366f1",
  orange: "#f59e42",
} as const;

export type DiceColorClass = keyof typeof COLOR_CLASS_MAP;

export const TEXT_COLOR_CLASS_MAP = {
  blue: "text-blue-400",
  red: "text-red-400",
  yellow: "text-yellow-400",
  purple: "text-purple-400",
  green: "text-green-400",
  indigo: "text-indigo-400",
  orange: "text-orange-400",
} as const;

export type DiceColorText = keyof typeof TEXT_COLOR_CLASS_MAP;

// Modo de operação explícito para evitar casts perigosos:
export type DiceMode = "dice" | "icon";