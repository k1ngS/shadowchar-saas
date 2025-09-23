"use client";

import React from "react";
import { rollD20WithBoons } from "./sotdl";
import { useUIStore } from "~/stores/ui-store";

type Props = {
  label?: string;
  boons?: number;
  banes?: number;
  modifier?: number;
  className?: string;
  onResult?: (result: number, breakdown: string) => void;
};

export default function SotdlRoller({
  label = "Teste",
  boons = 0,
  banes = 0,
  modifier = 0,
  className,
  onResult,
}: Props) {
  const { addNotification } = useUIStore();

  const handleClick = () => {
    const res = rollD20WithBoons({ boons, banes, modifier });
    addNotification({ type: "info", message: `${label}: ${res.breakdown}` });
    onResult?.(res.total, res.breakdown);
  };

  return (
    <button
      onClick={handleClick}
      className={className ?? "bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded"}
      title="Rolagem SotDL (boons/banes)"
    >
      🎲 {label} {boons ? `(+${boons}B)` : ""} {banes ? `(-${banes}b)` : ""}
    </button>
  );
}