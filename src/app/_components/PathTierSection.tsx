"use client";

import { useMemo, useState } from "react";
import { useCharacterUIStore } from "~/stores/character-store";
import Modal from "./ui/Modal";
import PathSelector from "./PathSelector";
import { canChooseTier, getTierStatus, type PathTier } from "~/lib/sotdl/progression";

type TierCardProps = {
  tier: PathTier;
  selectedSlug?: string;
  level: number;
  onPick: (tier: PathTier, slug: string) => void;
  onClear: (tier: PathTier) => void;
};

function TierCard({ tier, selectedSlug, level, onPick, onClear }: TierCardProps) {
  const [open, setOpen] = useState(false);

  const status = getTierStatus(level, selectedSlug, tier);
  const tierLabel = tier === "novice" ? "Novato" : tier === "expert" ? "Especialista" : "Mestre";

  const badge = {
    locked: "bg-gray-600 text-white",
    eligible: "bg-green-600 text-white",
    selected: "bg-blue-600 text-white",
  }[status];

  return (
    <div className="bg-gray-700 rounded-lg p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase tracking-wide px-2 py-0.5 rounded bg-purple-600 text-white">{tier}</span>
            <h3 className="text-lg font-semibold text-white">{tierLabel}</h3>
            <span className={`text-xs px-2 py-0.5 rounded ${badge}`}>
              {status === "locked" ? "Bloqueado" : status === "eligible" ? "Elegível" : "Selecionado"}
            </span>
          </div>
          <p className="text-sm text-gray-300">
            {selectedSlug ? `Selecionado: ${selectedSlug}` : status === "locked" ? `Desbloqueia no nível ${tier === "novice" ? 1 : tier === "expert" ? 3 : 7}` : "Nenhum selecionado"}
          </p>
        </div>

        <div className="flex gap-2">
          {status !== "locked" && (
            <button
              onClick={() => setOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
            >
              {selectedSlug ? "Trocar" : "Selecionar"}
            </button>
          )}
          {selectedSlug && (
            <button
              onClick={() => onClear(tier)}
              className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm"
            >
              Limpar
            </button>
          )}
        </div>
      </div>

      <Modal isOpen={open} onClose={() => setOpen(false)} title={`Escolher Caminho (${tierLabel})`} size="xl">
        <PathSelector
          tier={tier}
          selectedPathSlug={selectedSlug}
          onSelect={(p: any) => {
            onPick(tier, p.slug);
            setOpen(false);
          }}
        />
      </Modal>
    </div>
  );
}

export default function PathTierSection() {
  const { formData, updateFormField } = useCharacterUIStore();

  const level = formData?.level ?? 0;
  const noviceSlug = formData?.novicePath || "";
  const expertSlug = formData?.expertPath || "";
  const masterSlug = formData?.masterPath || "";

  const handlePick = (tier: PathTier, slug: string) => {
    if (!formData) return;
    if (!canChooseTier(level, tier)) return;
    if (tier === "novice") updateFormField("novicePath", slug);
    if (tier === "expert") updateFormField("expertPath", slug);
    if (tier === "master") updateFormField("masterPath", slug);
  };

  const handleClear = (tier: PathTier) => {
    if (!formData) return;
    if (tier === "novice") updateFormField("novicePath", "");
    if (tier === "expert") updateFormField("expertPath", "");
    if (tier === "master") updateFormField("masterPath", "");
  };

  const nextUnlockText = useMemo(() => {
    if (!formData) return "";
    if (!noviceSlug && canChooseTier(level, "novice")) return "Selecione um Caminho de Novato";
    if (!expertSlug && canChooseTier(level, "expert")) return "Selecione um Caminho de Especialista";
    if (!masterSlug && canChooseTier(level, "master")) return "Selecione um Caminho de Mestre";
    return "";
  }, [level, noviceSlug, expertSlug, masterSlug, formData]);

  if (!formData) return null;

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-white">Caminhos (Paths)</h2>
        {nextUnlockText && <span className="text-sm text-yellow-300">{nextUnlockText}</span>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <TierCard tier="novice" level={level} selectedSlug={noviceSlug} onPick={handlePick} onClear={handleClear} />
        <TierCard tier="expert" level={level} selectedSlug={expertSlug} onPick={handlePick} onClear={handleClear} />
        <TierCard tier="master" level={level} selectedSlug={masterSlug} onPick={handlePick} onClear={handleClear} />
      </div>
    </div>
  );
}