import type { ReactNode } from "react";
import { DICE_ICONS, type DiceIconKey } from "./DiceIcons";

/**
 * DiceIcon.tsx
 *
 * Renderiza um ícone de dado a partir da chave (DiceIconKey) definida em DiceIcons.tsx.
 *
 * Props:
 * - iconKey (DiceIconKey): chave do ícone desejado
 * - size (number): tamanho do ícone (padrão: 32)
 *
 * Uso:
 * <DiceIcon iconKey="emoji-dice" size={40} />
 *
 * Utilizado por: DiceRoller e outros componentes que desejam exibir um ícone de dado isolado.
 */

export function DiceIcon({ iconKey, size = 32 }: { iconKey: DiceIconKey, size?: number }) {
  const icon = DICE_ICONS[iconKey];
  if (!icon) return null;
  if (typeof icon === "string" || (icon as ReactNode).type === "span") {
    return <span style={{ fontSize: size }}>{icon}</span>;
  }
  return (
    <span style={{ display: "inline-block", width: size, height: size, verticalAlign: "middle" }}>
      {icon}
    </span>
  )
}