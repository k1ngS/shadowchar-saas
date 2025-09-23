"use client";

import { api } from "~/trpc/react";
import { useState } from "react";

interface AncestrySelectorProps {
  selectedAncestry: string;
  onAncestryChange: (ancestry: any) => void;
}

export default function AncestrySelector({
  selectedAncestry,
  onAncestryChange,
}: AncestrySelectorProps) {
  const { data: ancestries = [], isLoading } =
    api.gameData.getAllAncestries.useQuery();
  const [showDetails, setShowDetails] = useState<number | null>(null);

  if (isLoading) return <div>Carregando ancestralidades...</div>;

  return (
    <div className="space-y-4">
      <label className="mb-4 block text-lg font-semibold text-white">
        Escolha sua Ancestralidade
      </label>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {ancestries.map((ancestry) => (
          <div
            key={ancestry.id}
            className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
              selectedAncestry === ancestry.slug
                ? "border-blue-500 bg-blue-500/20"
                : "border-gray-600 bg-gray-700 hover:border-gray-500"
            } `}
            onClick={() => onAncestryChange(ancestry)}
          >
            <div className="mb-2 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                {ancestry.pt_br || ancestry.name}
              </h3>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDetails(
                    showDetails === ancestry.id ? null : ancestry.id,
                  );
                }}
                className="text-blue-400 hover:text-blue-300"
              >
                {showDetails === ancestry.id ? "Ocultar" : "Detalhes"}
              </button>
            </div>

            {/* Modificadores */}
            {ancestry.ability_modifiers &&
              Array.isArray(ancestry.ability_modifiers) && (
                <div className="mb-3 grid grid-cols-2 gap-2 text-sm">
                  {ancestry.ability_modifiers.map((mod: any, index: number) => (
                    <div key={index} className="text-green-400">
                      {mod.ability}: +{mod.modifier}
                    </div>
                  ))}
                </div>
              )}

            <p className="text-sm text-gray-300">
              {ancestry.short_description}
            </p>

            {/* Detalhes expansíveis */}
            {showDetails === ancestry.id && (
              <div className="mt-4 rounded border-l-4 border-blue-500 bg-gray-800 p-3">
                {ancestry.talents_start &&
                  Array.isArray(ancestry.talents_start) &&
                  ancestry.talents_start.length > 0 && (
                    <>
                      <h4 className="mb-2 font-semibold text-white">
                        Talentos Iniciais:
                      </h4>
                      <ul className="space-y-2 text-sm">
                        {ancestry.talents_start.map(
                          (talent: any, index: number) => (
                            <li key={index} className="text-gray-300">
                              <span className="font-semibold text-blue-400">
                                {talent.name}:
                              </span>{" "}
                              {talent.description}
                            </li>
                          ),
                        )}
                      </ul>
                    </>
                  )}

                {ancestry.languages &&
                  Array.isArray(ancestry.languages) &&
                  ancestry.languages.length > 0 && (
                    <>
                      <h4 className="mt-3 mb-2 font-semibold text-white">
                        Idiomas:
                      </h4>
                      <p className="text-sm text-gray-300">
                        {ancestry.languages.join(", ")}
                      </p>
                    </>
                  )}

                {ancestry.source && (
                  <p className="mt-3 text-xs text-gray-500">
                    Fonte: {ancestry.source}{" "}
                    {ancestry.source_page && `(p. ${ancestry.source_page})`}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
