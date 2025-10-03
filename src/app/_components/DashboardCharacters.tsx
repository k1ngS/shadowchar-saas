"use client";
import { Edit, Eye, Skull, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { motion } from "framer-motion";
import { Badge } from "~/components/ui/badge";
import { type characters } from "~/server/db/schema";

const DashboardCharacters = ({
  characters,
  isLoading,
}: {
  characters: characters;
}) => {
  const getAncestryColor = (ancestry) => {
    const colors = {
      human: "bg-blue-900/30 text-blue-300 border-blue-700/50",
      Dwarf: "bg-amber-900/30 text-amber-300 border-amber-700/50",
      changeling: "bg-purple-900/30 text-purple-300 border-green-700/50",
      orc: "bg-red-900/30 text-red-300 border-red-700/50",
      clockwork: "bg-gray-700/30 text-gray-300 border-gray-600/50",
    };
    return colors[ancestry] || "bg-gray-700/30 text-gray-300";
  };
  return (
    <div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          Array(3)
            .fill(0)
            .map((_, i) => (
              <Card
                key={i}
                className="animate-pulse border-red-900/30 bg-gradient-to-br from-gray-900 to-black"
              >
                <CardContent className="p-6">
                  <div className="h-40 rounded-lg bg-gray-800"></div>
                </CardContent>
              </Card>
            ))
        ) : characters.length === 0 ? (
          <div className="col-span-full py-12 text-center">
            <Skull className="mg-4 mx-auto h-16 w-16 text-gray-700" />
            <h3 className="mb-2 text-xl font-semibold text-gray-500">
              Nenhum personagem criado
            </h3>
            <p className="mb-4 text-gray-600">
              Você ainda não tem personagens criados.
            </p>
            <Link href="/characters/new">
              <Button className="bg-gradient-to-r from-red-900 to-red-950 text-amber-200 hover:from-red-800 hover:to-red-900">
                Criar Primeiro Personagem
              </Button>
            </Link>
          </div>
        ) : (
          characters.map((character, index) => (
            <motion.div
              key={character.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="group overflow-hidden border-red-900/30 bg-gradient-to-br from-gray-900 to-black transition-all duration-300 hover:border-amber-700/50 hover:shadow-lg hover:shadow-red-900/30">
                <div className="h-2 bg-gradient-to-r from-red-900 via-amber-700 to-red-900"></div>
                <CardContent className="p-6">
                  <div className="mb-4 flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="mb-1 text-xl font-bold text-amber-400 transition-colors group-hover:text-amber-300">
                        {character.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Nivel {character.level || 0}
                      </p>
                    </div>
                    {character.avatar_url && (
                      <div className="h-16 w-16 overflow-hidden rounded-lg border-2 border-red-900/50 bg-gray-800">
                        <img
                          src={character.avatar_url}
                          alt={character.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                  </div>

                  <div className="mb-4 space-y-2">
                    <Badge
                      className={`${getAncestryColor(character.ancestry)} border`}
                    >
                      {character.ancestry}
                    </Badge>
                    {character.novice_path && (
                      <Badge
                        variant="outline"
                        className="ml-2 border-purple-700/50 bg-purple-900/2 text-purple-300"
                      >
                        {character.novice_path}
                      </Badge>
                    )}
                  </div>

                  <div className="mb-4 grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Vida:</span>
                      <span className="font-semibold text-green-400">
                        {character.health}/{character.health}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Defesa:</span>
                      <span className="font-semibold text-blue-400">
                        {character.defese}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Insanidade:</span>
                      <span className="font-semibold text-purple-400">
                        {character.insanity || 0}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Corrupção:</span>
                      <span className="text-orage-400 font-semibold">
                        {character.corruption || 0}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/characters/${character.id}`}
                      className="flex-1"
                    >
                      <Button
                        variant="outline"
                        className="w-full border-gray-700 bg-gray-800/50 text-amber-300 hover:border-amber-600 hover:bg-gray-700"
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        Ver
                      </Button>
                    </Link>
                    <Link
                      href={`/characters/${character.id}/edit`}
                      className="flex-1"
                    >
                      <Button
                        variant="outline"
                        className="w-full border-gray-700 bg-gray-800/50 text-blue-300 hover:border-blue-600 hover:bg-gray-700"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="icon"
                      className="border-gray-700 bg-gray-800/50 text-red-400 hover:border-red-600 hover:bg-red-900/50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

export default DashboardCharacters;
