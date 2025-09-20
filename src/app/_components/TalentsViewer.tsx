"use client";

interface Talent {
  id: string;
  name: string;
  description: string;
  type?: string;
  requirements?: string;
}

interface TalentsViewerProps {
  talents: Talent[];
}

export default function TalentsViewer({ talents }: TalentsViewerProps) {
  if (!talents || !Array.isArray(talents) || talents.length === 0) {
    return null;
  }

  // Agrupar por tipo
  const talentsByType = talents.reduce((acc: any, talent) => {
    const type = talent.type || 'Geral';
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(talent);
    return acc;
  }, {});

  const typeColors: { [key: string]: string } = {
    'Ancestry': 'bg-green-600',
    'Novice Path': 'bg-blue-600',
    'Expert Path': 'bg-purple-600',
    'Master Path': 'bg-red-600',
    'General': 'bg-gray-600',
    'Geral': 'bg-gray-600',
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h2 className="text-2xl font-bold text-white mb-6">
        Talentos ({talents.length})
      </h2>

      <div className="space-y-6">
        {Object.entries(talentsByType).map(([type, talentList]: [string, any]) => (
          <div key={type}>
            {/* Header do Tipo */}
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-3 h-3 rounded-full ${typeColors[type] || 'bg-gray-600'}`}></div>
              <h3 className="text-lg font-semibold text-white">{type}</h3>
              <span className="text-sm text-gray-400">({talentList.length})</span>
            </div>

            {/* Talentos do Tipo */}
            <div className="space-y-3 ml-6">
              {talentList.map((talent: any, index: number) => (
                <div key={talent.id || index} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-lg font-semibold text-white">{talent.name}</h4>
                    {talent.type && (
                      <span className={`px-2 py-1 rounded text-xs text-white ${typeColors[talent.type] || 'bg-gray-600'}`}>
                        {talent.type}
                      </span>
                    )}
                  </div>

                  <p className="text-gray-300 mb-2">{talent.description}</p>

                  {talent.requirements && (
                    <div className="text-sm">
                      <span className="text-yellow-400 font-semibold">Requisitos: </span>
                      <span className="text-yellow-300">{talent.requirements}</span>
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
