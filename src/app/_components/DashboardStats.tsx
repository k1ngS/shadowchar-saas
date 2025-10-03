"use client"
import { motion } from "framer-motion";
import React from "react";
import { api } from "~/trpc/react";
import { Flame, Skull, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

const DashboardStats = ({ characters }) => {
  return (
    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
      <motion.div
        initial={{ opacity: 0, scale: 0.9  }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-gradient-to-br from-gray-900 to-black border-red-900/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Total de Personagens</CardTitle>
            <Users className="w-5 h-5 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-400">{characters.length}</div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-gradient-to-br from-gray-900 to-black border-red-900/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Nivel Medio</CardTitle>
            <Skull className="w-5 h-5 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-400">
              {
                characters.length > 0
                  ? Math.round(characters.reduce((sum, c) => sum + (c.level || 0), 0) / characters.length)
                  : 0
              }
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-gradient-to-br from-gray-900 to-black border-red-900/30">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-400">Corrupção Total</CardTitle>
            <Flame className="w-5 h-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-500">
              {characters.reduce((sum, c) => sum + (c.corruption || 0), 0)}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default DashboardStats;
