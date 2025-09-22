import { getD6Dots } from "./dice-svg-utils";
import type { NumberStyle } from "./types";

/**
 * DiceD6.tsx
 *
 * Componente especializado para renderizar um dado d6 em SVG.
 *
 * Props:
 * - value (number): valor a ser exibido (1 a 6)
 * - color (string): cor do dado
 * - numberStyle (NumberStyle): visualização do número ("center" ou "dots")
 * - size (number): tamanho do SVG (padrão: 32)
 *
 * Utilizado por: DiceRoller
 */

export function DiceD6({
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
    <svg width={size} height={size} viewBox="0 0 54 54" fill="none">
      <rect x="4" y="4" width="46" height="46" rx="13" fill={color || "#2563eb"} stroke="#23272e" strokeWidth="3" />
      {numberStyle === "center" && (
        <text
          x="27"
          y="34"
          textAnchor="middle"
          fontSize={Math.round(size * 0.65)}
          fontWeight="bold"
          fill="#fff"
          style={{ filter: "drop-shadow(0 1px 2px #0008)" }}
        >
          {value}
        </text>
      )}
      {numberStyle === "dots" &&
        getD6Dots(value).map(([cx, cy], i) => (
          <circle cx={cx} cy={cy} r="4.7" fill="#fff" key={i} />
        ))}
    </svg>
  );
}