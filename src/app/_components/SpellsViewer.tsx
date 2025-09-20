"use client";

interface Spell {
  id: string;
  name: string;
  tradition: string;
  rank: number;
  description: string;
  castingTime?: string;
  range?: string;
  duration?: string;
  effect?: string;
}

interface SpellsViewerProps {
  spells: Spell[];
}

export default function SpellsViewer({ spells }: SpellsViewerProps) {
  if (!spells || !Array.isArray(spells) || spells.length === 0) {
    return null;
  }

  // Agrupar por tradição e ordenar por rank
  const spellsByTradition = spells.reduce((acc: any, spell) => {
    const tradition = spell.tradition || 'Sem Tradição';
    if (!acc[tradition]) {
      acc[tradition] = [];
    }
    acc[tradition].push(spell);
    return acc;
  }, {});

  // Ordenar por rank dentro de cada tradição
  Object.keys(spellsByTradition).forEach(tradition => {
    spellsByTradition[tradition].sort((a: any, b: any) => a.rank - b.rank);
  });

  const traditionColors: { [key: string]: string } = {
    'Air': 'bg-cyan-500',
    'Earth': 'bg-amber-600',
    'Fire': 'bg-red-500',
    'Water': 'bg-blue-500',
    'Life': 'bg-green-500',
    'Death': 'bg-gray-600',
    'Illusion': 'bg-purple-500',
    'Enchantment': 'bg-pink-500',
    'Divination': 'bg-yellow-500',
    'Transmutation': 'bg-orange-500',
    'Sem Tradição': 'bg-gray-500',
  };

  // Calcular total de magias
  const totalSpells = spells.length;

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-white mb-6">
        Magias ({totalSpells})
      </h2>

      <div className="space-y-6">
        {Object.entries(spellsByTradition).map(([tradition, spellList]: [string, any]) => (
          <div key={tradition}>
            {/* Header da Tradição */}
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-4 h-4 rounded ${traditionColors[tradition] || 'bg-gray-500'}`}></div>
              <h3 className="text-lg font-semibold text-white">{tradition}</h3>
              <span className="text-sm text-gray-400">({spellList.length})</span>
            </div>

            {/* Magias da Tradição */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-7">
              {spellList.map((spell: any, index: number) => (
                <div key={spell.id || index} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-lg font-semibold text-white">{spell.name}</h4>
                    <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold">
                      Rank {spell.rank}
                    </span>
                  </div>

                  <p className="text-gray-300 text-sm mb-3">{spell.description}</p>

                  {/* Detalhes da Magia */}
                  <div className="space-y-1 text-xs text-gray-400">
                    {spell.castingTime && (
                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-300">Tempo:</span>
                        <span>{spell.castingTime}</span>
                      </div>
                    )}
                    {spell.range && (
                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-300">Alcance:</span>
                        <span>{spell.range}</span>
                      </div>
                    )}
                    {spell.duration && (
                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-300">Duração:</span>
                        <span>{spell.duration}</span>
                      </div>
                    )}
                  </div>

                  {spell.effect && (
                    <div className="mt-3 pt-3 border-t border-gray-600">
                      <p className="text-sm text-blue-300">{spell.effect}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
