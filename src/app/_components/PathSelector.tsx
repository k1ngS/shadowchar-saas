"use client";

import { useMemo, useState } from "react";
import { api } from "~/trpc/react";

type Tier = "novice" | "expert" | "master";

interface PathSelectorProps {
  // Tier que será listado
  tier: Tier;
  // Slug atualmente selecionado para este tier
  selectedPathSlug?: string;
  // Callback quando o usuário escolher um path
  onSelect: (path: any) => void;
  // Mostrar busca (default: true)
  allowSearch?: boolean;
  className?: string;
}

export default function PathSelector({
  tier,
  selectedPathSlug,
  onSelect,
  allowSearch = true,
  className,
}: PathSelectorProps) {
  const [q, setQ] = useState("");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const { data: paths = [], isLoading } = api.gameData.getAllPaths.useQuery();

  const tierLabel = useMemo(() => {
    if (tier === "novice") return "Novato";
    if (tier === "expert") return "Especialista";
    return "Mestre";
  }, [tier]);

  return (
    <div className={className ?? "space-y-4"}>
      <div className="flex items-center justify-between">
        <label className="block text-lg font-semibold text-white">
          Escolha seu Caminho ({tierLabel})
        </label>
        {allowSearch && (
          <div className="w-full max-w-xs">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={`Buscar caminhos de ${tierLabel.toLowerCase()}...`}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="text-gray-300">Carregando caminhos...</div>
      ) : paths.length === 0 ? (
        <div className="text-gray-400">Nenhum caminho encontrado.</div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {paths.map((p: any) => {
            const isSelected = selectedPathSlug === p.slug;
            const shortText =
              Array.isArray(p.description) && p.description.length > 0
                ? (p.description[0]?.text || p.description[0])
                : "";

            return (
              <div
                key={p.id}
                className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                  isSelected
                    ? "border-blue-500 bg-blue-500/20"
                    : "border-gray-600 bg-gray-700 hover:border-gray-500"
                }`}
                onClick={() => onSelect(p)}
              >
                <div className="mb-2 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-xs uppercase tracking-wide px-2 py-0.5 rounded ${
                          tier === "novice"
                            ? "bg-blue-600 text-white"
                            : tier === "expert"
                            ? "bg-purple-600 text-white"
                            : "bg-red-600 text-white"
                        }`}
                      >
                        {p.tier}
                      </span>
                      <h3 className="text-lg font-semibold text-white truncate">
                        {p.pt_br || p.name}
                      </h3>
                    </div>
                    {p.prerequisites && (
                      <p className="mt-1 text-xs text-yellow-300 line-clamp-1">
                        Requisitos: {p.prerequisites}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedId(expandedId === p.id ? null : p.id);
                    }}
                    className="text-blue-400 hover:text-blue-300 shrink-0"
                  >
                    {expandedId === p.id ? "Ocultar" : "Detalhes"}
                  </button>
                </div>

                {shortText && (
                  <p className="text-sm text-gray-300 line-clamp-2">{shortText}</p>
                )}

                {expandedId === p.id && (
                  <div className="mt-4 rounded border-l-4 border-blue-500 bg-gray-800 p-3 space-y-3">
                    {/* Descrição completa (quando houver array de blocos) */}
                    {Array.isArray(p.description) && p.description.length > 0 && (
                      <div className="space-y-2">
                        {p.description.map((block: any, idx: number) => (
                          <p key={idx} className="text-sm text-gray-300">
                            {typeof block === "string" ? block : block?.text}
                          </p>
                        ))}
                      </div>
                    )}

                    {/* Talentos por nível */}
                    {Array.isArray(p.talents_by_level) && p.talents_by_level.length > 0 && (
                      <div>
                        <h4 className="mb-2 font-semibold text-white">Talentos por Nível</h4>
                        <ul className="space-y-2 text-sm">
                          {p.talents_by_level.map((entry: any, idx: number) => (
                            <li key={idx} className="text-gray-300">
                              <span className="font-semibold text-blue-400">Nível {entry.level}:</span>{" "}
                              {Array.isArray(entry.talents)
                                ? entry.talents
                                    .map((t: any) => (typeof t === "string" ? t : t?.name))
                                    .filter(Boolean)
                                    .join(", ")
                                : ""}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Fonte */}
                    {(p.source || p.source_page) && (
                      <p className="text-xs text-gray-500">
                        Fonte: {p.source} {p.source_page ? `(p. ${p.source_page})` : ""}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Ação secundária */}
      {selectedPathSlug && (
        <div className="text-xs text-gray-400">
          Selecionado: <span className="text-white font-semibold">{selectedPathSlug}</span>
        </div>
      )}
    </div>
  );
}