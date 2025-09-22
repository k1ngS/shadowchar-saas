import type { NumberStyle } from "./types";

/**
 * DiceD4.tsx
 *
 * Componente especializado para renderizar um dado d4 em SVG.
 *
 * Props:
 * - value (number): valor a ser exibido (1 a 4)
 * - color (string): cor do dado
 * - numberStyle (NumberStyle): visualização do número ("center" suportado)
 * - size (number): tamanho do SVG (padrão: 32)
 *
 * Utilizado por: DiceRoller
 */

export function DiceD4({
  value,
  color,
  numberStyle = "center",
  size = 32,
}: {
  value: number;
  color?: string;
  numberStyle?: NumberStyle;
  size?: number;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 54 54">
      <polygon points="27,7 50,47 4,47" fill={color || "#f59e42"} stroke="#23272e" strokeWidth="3" />
      {numberStyle === "center" && (
        <text
          x="27"
          y="36"
          textAnchor="middle"
          fontSize={Math.round(size * 0.53)}
          fontWeight="bold"
          fill="#fff"
        >
          {value}
        </text>
      )}
    </svg>
  );
}