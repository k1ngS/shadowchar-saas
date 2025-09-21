export const DICE_ICON_VARIANTS = [
  {
    key: "emoji-dice",
    label: "Emoji Dice",
    icon: <span role="img" aria-label="dice" style={{ fontSize: 28 }}>🎲</span>,
  },
  {
    key: "emoji-d20",
    label: "Emoji D20",
    icon: <span role="img" aria-label="d20" style={{ fontSize: 28 }}>🔮</span>,
  },
  {
    key: "emoji-d6",
    label: "Emoji D6",
    icon: <span role="img" aria-label="d6" style={{ fontSize: 28 }}>⚀</span>,
  },
  {
    key: "emoji-d6-2",
    label: "Emoji D6 (2)",
    icon: <span role="img" aria-label="d6-2" style={{ fontSize: 28 }}>⚁</span>,
  },
  {
    key: "emoji-d6-3",
    label: "Emoji D6 (3)",
    icon: <span role="img" aria-label="d6-3" style={{ fontSize: 28 }}>⚂</span>,
  },
  {
    key: "emoji-d6-4",
    label: "Emoji D6 (4)",
    icon: <span role="img" aria-label="d6-4" style={{ fontSize: 28 }}>⚃</span>,
  },
  {
    key: "emoji-d6-5",
    label: "Emoji D6 (5)",
    icon: <span role="img" aria-label="d6-5" style={{ fontSize: 28 }}>⚄</span>,
  },
  {
    key: "emoji-d6-6",
    label: "Emoji D6 (6)",
    icon: <span role="img" aria-label="d6-6" style={{ fontSize: 28 }}>⚅</span>,
  },
  {
    key: "emoji-star",
    label: "Estrela",
    icon: <span role="img" aria-label="star" style={{ fontSize: 28 }}>⭐</span>,
  },
  {
    key: "emoji-crystal-ball",
    label: "Crystal Ball",
    icon: <span role="img" aria-label="crystal-ball" style={{ fontSize: 28 }}>🔮</span>,
  },
  {
    key: "emoji-magic",
    label: "Magic Sparkles",
    icon: <span role="img" aria-label="sparkles" style={{ fontSize: 28 }}>✨</span>,
  },
  // SVGs estilizados também podem ser usados, exemplo:
  {
    key: "svg-d4",
    label: "SVG d4",
    icon: (
      <svg width="28" height="28" viewBox="0 0 54 54" fill="none">
        <polygon points="27,7 50,47 4,47" fill="#f59e42" stroke="#23272e" strokeWidth="3" />
      </svg>
    )
  },
  {
    key: "svg-d20",
    label: "SVG d20",
    icon: (
      <svg width="28" height="28" viewBox="0 0 54 54" fill="none">
        <polygon points="27,6 48,18 48,39 27,51 6,39 6,18" fill="#a78bfa" stroke="#23272e" strokeWidth="3" />
      </svg>
    )
  },
  {
    key: "svg-d6",
    label: "SVG d6",
    icon: (
      <svg width="28" height="28" viewBox="0 0 54 54" fill="none">
        <rect x="4" y="4" width="46" height="46" rx="13" fill="#2563eb" stroke="#23272e" strokeWidth="3" />
      </svg>
    )
  },
];

export type DiceIconKey = typeof DICE_ICON_VARIANTS[number]["key"];