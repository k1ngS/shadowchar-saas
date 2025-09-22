/**
 * Renderiza ícone de dado (emoji ou SVG) com controle real de tamanho.
 * - Emoji: ajusta fontSize.
 * - SVG: clona o elemento injetando width/height e className.
 */
import React from "react";
import { DICE_ICONS, type DiceIconKey } from "./DiceIcons";

interface DiceIconProps {
  iconKey: DiceIconKey;
  size?: number;
  className?: string;
  ariaLabel?: string;
}

export function DiceIcon({ iconKey, size = 32, className, ariaLabel }: DiceIconProps) {
  const icon = DICE_ICONS[iconKey];
  if (!icon) return null;

  if (!React.isValidElement(icon)) {
    // Fallback (não esperado na sua tabela atual)
    return <span style={{ fontSize: size }} className={className} aria-label={ariaLabel}>{icon as any}</span>;
  }

  // Emoji (span)
  if (icon.type === "span") {
    return React.cloneElement(icon, {
      style: { ...(icon.props.style || {}), fontSize: size },
      className,
      "aria-label": ariaLabel ?? icon.props["aria-label"],
      role: icon.props.role ?? "img",
    });
  }

  // SVG
  return (
    <span className={className} aria-label={ariaLabel}>
      {React.cloneElement(icon, {
        width: size,
        height: size,
      })}
    </span>
  );
}