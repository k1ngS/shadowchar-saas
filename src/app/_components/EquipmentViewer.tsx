"use client";

import DiceRoller from "./dice/DiceRoller";

interface Equipment {
  id: string;
  name: string;
  type: string;
  description?: string;
  quantity: number;
  weight?: number;
  value?: number;
}

interface EquipmentViewerProps {
  equipment: Equipment[];
}

export default function EquipmentViewer({ equipment }: EquipmentViewerProps) {
  if (!equipment || !Array.isArray(equipment) || equipment.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <h2 className="text-xl font-bold text-white mb-4">Equipamentos</h2>
        <p className="text-gray-400 text-sm">Nenhum equipamento</p>
      </div>
    );
  }

  // Calcular totais
  const totalWeight = equipment.reduce((acc, item) => acc + (item.weight || 0) * item.quantity, 0);
  const totalValue = equipment.reduce((acc, item) => acc + (item.value || 0) * item.quantity, 0);

  // Agrupar por tipo para o resumo
  const equipmentSummary = equipment.reduce((acc: any, item) => {
    const type = item.type || 'Outros';
    if (!acc[type]) {
      acc[type] = 0;
    }
    acc[type] += item.quantity;
    return acc;
  }, {});

  // Ícones para tipos
  const typeIcons: { [key: string]: string } = {
    'Arma': '⚔️',
    'Armadura': '🛡️',
    'Escudo': '🛡️',
    'Ferramenta': '🔧',
    'Poção': '🧪',
    'Joia': '💎',
    'Livro': '📚',
    'Comida': '🍖',
    'Outros': '📦',
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-xl font-bold text-white mb-4">
        Equipamentos ({equipment.length})
      </h2>

      {/* Resumo */}
      <div className="bg-gray-700 rounded-lg p-4 mb-4">
        <div className="text-sm space-y-2">
          <div className="flex justify-between text-gray-300">
            <span>Peso Total:</span>
            <span className="font-semibold">{totalWeight.toFixed(1)} kg</span>
          </div>
          <div className="flex justify-between text-gray-300">
            <span>Valor Total:</span>
            <span className="font-semibold">{totalValue} mo</span>
          </div>
        </div>
      </div>

      {/* Resumo por Tipo */}
      <div className="space-y-2 mb-4">
        {Object.entries(equipmentSummary).map(([type, count]: [string, any]) => (
          <div key={type} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span>{typeIcons[type] || typeIcons['Outros']}</span>
              <span className="text-gray-300">{type}</span>
            </div>
            <span className="text-white font-semibold">{count}</span>
          </div>
        ))}
      </div>

      {/* Lista Detalhada (Colapsável) */}
      <details className="group">
        <summary className="cursor-pointer text-blue-400 hover:text-blue-300 text-sm font-semibold transition">
          Ver lista completa
        </summary>

        <div className="mt-4 space-y-3 max-h-96 overflow-y-auto">
          {equipment.map((item: any, index: number) => (
            <div key={item.id || index} className="bg-gray-700 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-white font-semibold text-sm">{item.name}</h4>
                {item.quantity > 1 && (
                  <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs">
                    x{item.quantity}
                  </span>
                )}
                <DiceRoller
                  sides={8} // d8 para uma espada longa, por exemplo
                  modifier={item.bonus || 0}
                  label={`Ataque: ${item.name}`}
                />
              </div>

              <div className="text-xs text-gray-400">
                <div>{typeIcons[item.type] || typeIcons['Outros']} {item.type}</div>
                {item.weight > 0 && <div>Peso: {item.weight}kg</div>}
                {item.value > 0 && <div>Valor: {item.value} mo</div>}
              </div>

              {item.description && (
                <p className="text-xs text-gray-300 mt-2">{item.description}</p>
              )}
            </div>
          ))}
        </div>
      </details>
    </div>
  );
}
