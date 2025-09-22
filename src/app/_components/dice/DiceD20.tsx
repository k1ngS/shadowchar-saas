import { getD20PolygonPoints } from "./dice-svg-utils";
import type { NumberStyle } from "./types";

/**
 * DiceD20.tsx
 *
 * Componente especializado para renderizar um dado d20 em SVG.
 *
 * Props:
 * - value (number): valor a ser exibido (1 a 20)
 * - color (string): cor do dado
 * - numberStyle (NumberStyle): visualização do número ("center" suportado)
 * - size (number): tamanho do SVG (padrão: 32)
 *
 * Utilizado por: DiceRoller
 */

export function DiceD20({
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
      <polygon points={getD20PolygonPoints(54)} fill={color || "#a78bfa"} stroke="#23272e" strokeWidth="2" />
      {numberStyle === "center" && (
        <text
          x="27"
          y="33"
          textAnchor="middle"
          fontSize={Math.round(size * 0.56)}
          fontWeight="bold"
          fill="#fff"
          style={{ fontFamily: "monospace" }}
        >
          {value}
        </text>
      )}
    </svg>
  );
}