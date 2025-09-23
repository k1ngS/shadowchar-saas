"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import { useCharacterUIStore } from "~/stores/character-store";
import { useUIStore } from "~/stores/ui-store";

export default function CompendiumPage() {
  const [tab, setTab] = useState<"spells"|"items"|"ancestries"|"paths">("spells");

  // Spells search
  const [spellQ, setSpellQ] = useState("");
  const [tradition, setTradition] = useState<string>("");
  const [minRank, setMinRank] = useState<number | undefined>(undefined);
  const [maxRank, setMaxRank] = useState<number | undefined>(undefined);

  const { data: spells = [], refetch: refetchSpells, isFetching: loadingSpells } =
    api.gameData.searchSpells.useQuery(
      { q: spellQ || "a", tradition: tradition || undefined, minRank, maxRank },
      { enabled: tab === "spells" && !!(spellQ || "a") }
    );

  // Items
  const [itemQ, setItemQ] = useState("");
  const [itemType, setItemType] = useState("");
  const { data: items = [], isFetching: loadingItems } =
    api.gameData.getAllItems.useQuery(undefined, { enabled: tab === "items" });

  // Ancestries
  const { data: ancestries = [], isFetching: loadingAncestries } = api.gameData.getAllAncestries.useQuery(undefined, { enabled: tab === "ancestries" });

  // Paths
  const [pathTier, setPathTier] = useState<"novice"|"expert"|"master"|undefined>(undefined);
  const [pathQ, setPathQ] = useState("");
  const { data: paths = [], isFetching: loadingPaths } = api.gameData.getAllPaths.useQuery(undefined, { enabled: tab === "paths" });

  const { formData, isEditMode, updateFormField } = useCharacterUIStore();
  const { addNotification } = useUIStore();

  const addSpellToForm = (spell: any) => {
    if (!isEditMode || !formData) {
      addNotification({ type: "warning", message: "Entre no modo de edição de um personagem para adicionar conteúdos." });
      return;
    }
    updateFormField("spells", [...formData.spells, { ...spell, id: Math.random().toString(36).slice(2) }]);
    addNotification({ type: "success", message: `Magia '${spell.name}' adicionada à ficha.` });
  };

  const addItemToForm = (item: any) => {
    if (!isEditMode || !formData) {
      addNotification({ type: "warning", message: "Entre no modo de edição de um personagem para adicionar conteúdos." });
      return;
    }
    updateFormField("equipment", [...formData.equipment, {
      id: Math.random().toString(36).slice(2),
      name: item.name,
      type: item.type ?? "Outros",
      description: item.notes ?? "",
      quantity: 1,
      weight: parseFloat(item.weight) || 0,
      value: parseInt(item.price as string) || 0,
    }]);
    addNotification({ type: "success", message: `Item '${item.name}' adicionado à ficha.` });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-white mb-6">Compêndio</h1>

      <div className="flex gap-2 mb-6">
        {["spells","items","ancestries","paths"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t as any)}
            className={`px-4 py-2 rounded ${tab === t ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-200"}`}
          >
            {t === "spells" ? "Magias" : t === "items" ? "Itens" : t === "ancestries" ? "Ancestralidades" : "Paths"}
          </button>
        ))}
      </div>

      {tab === "spells" && (
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <input
              value={spellQ}
              onChange={(e) => setSpellQ(e.target.value)}
              placeholder="Buscar magias..."
              className="px-3 py-2 bg-gray-700 text-white rounded"
            />
            <input
              value={tradition}
              onChange={(e) => setTradition(e.target.value)}
              placeholder="Tradição (opcional)"
              className="px-3 py-2 bg-gray-700 text-white rounded"
            />
            <input
              type="number"
              min={0}
              value={minRank ?? ""}
              onChange={(e) => setMinRank(e.target.value ? parseInt(e.target.value) : undefined)}
              placeholder="Rank mín."
              className="px-3 py-2 bg-gray-700 text-white rounded"
            />
            <input
              type="number"
              min={0}
              value={maxRank ?? ""}
              onChange={(e) => setMaxRank(e.target.value ? parseInt(e.target.value) : undefined)}
              placeholder="Rank máx."
              className="px-3 py-2 bg-gray-700 text-white rounded"
            />
          </div>

          <button
            onClick={() => refetchSpells()}
            className="mb-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            disabled={loadingSpells}
          >
            {loadingSpells ? "Buscando..." : "Buscar"}
          </button>

          {loadingSpells ? (
            <div className="col-span-full text-center text-gray-400">Carregando magias...</div>
          ) : spells.length === 0 ? (
            <div className="col-span-full text-center text-gray-400">Nenhuma magia encontrada.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {spells.map((s: any) => (
                <div key={s.id} className="bg-gray-700 rounded p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-white font-semibold">{s.name}</h3>
                        <span className="bg-blue-600 text-white px-2 py-0.5 rounded text-xs">Rank {s.rank}</span>
                      </div>
                      <div className="text-gray-300 text-sm">{s.tradition}</div>
                    </div>
                    <button
                      onClick={() => addSpellToForm(s)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                    >
                      Adicionar à ficha
                    </button>
                  </div>
                  {s.description && <p className="text-gray-300 text-sm mt-2">{s.description}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "items" && (
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <input
              value={itemQ}
              onChange={(e) => setItemQ(e.target.value)}
              placeholder="Buscar itens..."
              className="px-3 py-2 bg-gray-700 text-white rounded"
            />
            <input
              value={itemType}
              onChange={(e) => setItemType(e.target.value)}
              placeholder="Tipo (opcional)"
              className="px-3 py-2 bg-gray-700 text-white rounded"
            />
          </div>
          {loadingItems ? (
            <div className="col-span-full text-center text-gray-400">Carregando itens...</div>
          ) : items.length === 0 ? (
            <div className="col-span-full text-center text-gray-400">Nenhum item encontrado.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {items.map((it: any) => (
                <div key={it.id} className="bg-gray-700 rounded p-4 flex items-start justify-between">
                  <div>
                    <h3 className="text-white font-semibold">{it.name}</h3>
                    {it.type && <div className="text-gray-400 text-sm">{it.type}</div>}
                    {it.notes && <p className="text-gray-300 text-sm mt-1">{it.notes}</p>}
                  </div>
                  <button
                    onClick={() => addItemToForm(it)}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                  >
                    Adicionar à ficha
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "ancestries" && (
        <div className="bg-gray-800 rounded-lg p-6">
          {loadingAncestries ? (
            <div className="col-span-full text-center text-gray-400">Carregando ancestralidades...</div>
          ) : ancestries.length === 0 ? (
            <div className="col-span-full text-center text-gray-400">Nenhuma ancestralidade encontrada.</div>
          ) : (
            <div className="bg-gray-800 rounded-lg p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {ancestries.map((a: any) => (
                <div key={a.id} className="bg-gray-700 rounded p-4">
                  <h3 className="text-white font-semibold">{a.pt_br || a.name}</h3>
                  {a.short_description && <p className="text-gray-300 text-sm mt-1">{a.short_description}</p>}
                  {a.source && <p className="text-gray-500 text-xs mt-2">Fonte: {a.source}{a.source_page ? ` (p. ${a.source_page})` : ""}</p>}
                </div>
              ))}
            </div>
          )
          }
        </div>
      )}

      {tab === "paths" && (
        <div className="bg-gray-800 rounded-lg p-6">
          <div className="flex gap-2 mb-4">
            <select
              value={pathTier || ""}
              onChange={(e) => setPathTier((e.target.value || undefined) as any)}
              className="px-3 py-2 bg-gray-700 text-white rounded"
            >
              <option value="">Todos os tiers</option>
              <option value="novice">novice</option>
              <option value="expert">expert</option>
              <option value="master">master</option>
            </select>
            <input
              value={pathQ}
              onChange={(e) => setPathQ(e.target.value)}
              placeholder="Buscar paths..."
              className="px-3 py-2 bg-gray-700 text-white rounded"
            />
          </div>
          {loadingPaths ? (
            <div className="col-span-full text-center text-gray-400">Carregando paths...</div>
          ) : paths.length === 0 ? (
          <div className="col-span-full text-center text-gray-400">Nenhum path encontrado.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paths.map((p: any) => (
                <div key={p.id} className="bg-gray-700 rounded p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-purple-600 text-white px-2 py-0.5 rounded">{p.tier}</span>
                    <h3 className="text-white font-semibold">{p.pt_br || p.name}</h3>
                  </div>
                  {Array.isArray(p.description) && p.description[0]?.text && (
                    <p className="text-gray-300 text-sm mt-2">{p.description[0].text}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}