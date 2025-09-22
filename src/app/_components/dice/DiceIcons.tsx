import type { ReactNode } from "react";

/**
 * DiceIcons.tsx
 *
 * Centraliza todos os ícones de dados utilizados no sistema (SVGs e emojis).
 *
 * - Para adicionar um novo ícone, basta incluir no objeto DICE_ICONS.
 * - Os ícones podem ser SVGs ou elementos emoji.
 * - Fornece o tipo DiceIconKey para tipagem segura dos ícones.
 *
 * Utilizado por: DiceIcon, DiceRoller
 */

export const DICE_ICONS = {
  "emoji-dice": <span role="img" aria-label="dice" style={{ fontSize: 28 }}>🎲</span>,
  "emoji-d20": <span role="img" aria-label="d20" style={{ fontSize: 28 }}>🔮</span>,
  "emoji-d6": <span role="img" aria-label="d6" style={{ fontSize: 28 }}>⚀</span>,
  "emoji-d6-2": <span role="img" aria-label="d6-2" style={{ fontSize: 28 }}>⚁</span>,
  "emoji-d6-3": <span role="img" aria-label="d6-3" style={{ fontSize: 28 }}>⚂</span>,
  "emoji-d6-4": <span role="img" aria-label="d6-4" style={{ fontSize: 28 }}>⚃</span>,
  "emoji-d6-5": <span role="img" aria-label="d6-5" style={{ fontSize: 28 }}>⚄</span>,
  "emoji-d6-6": <span role="img" aria-label="d6-6" style={{ fontSize: 28 }}>⚅</span>,
  "emoji-star": <span role="img" aria-label="star" style={{ fontSize: 28 }}>⭐</span>,
  "emoji-crystal-ball": <span role="img" aria-label="crystal-ball" style={{ fontSize: 28 }}>🔮</span>,
  "emoji-magic": <span role="img" aria-label="sparkles" style={{ fontSize: 28 }}>✨</span>,
  "svg-d4": (
    <svg width="28" height="28" viewBox="0 0 54 54" fill="none">
      <polygon points="27,7 50,47 4,47" fill="#f59e42" stroke="#23272e" strokeWidth="3" />
    </svg>
  ),
  "svg-d20": (
    <svg width="28" height="28" viewBox="0 0 54 54" fill="none">
      <polygon points="27,6 48,18 48,39 27,51 6,39 6,18" fill="#a78bfa" stroke="#23272e" strokeWidth="3" />
    </svg>
  ),
  "svg-d6": (
    <svg width="28" height="28" viewBox="0 0 54 54" fill="none">
      <rect x="4" y="4" width="46" height="46" rx="13" fill="#2563eb" stroke="#23272e" strokeWidth="3" />
    </svg>
  ),
} as const;

export type DiceIconKey = keyof typeof DICE_ICONS;

export const DICE_ICON_VARIANTS: { key: DiceIconKey; label: string }[] = Object.entries(DICE_ICONS).map(([key, icon]) => ({
  key: key as DiceIconKey,
  label: key.replace(/-/g, " "),
}));