"use client";
import React from "react";
import { motion } from "framer-motion";
import type { Session } from "next-auth";
import Link from "next/link";
import { Dice1Icon, PlusCircle } from "lucide-react";
import { Button } from "~/components/ui/button";

const DashboardHeader = ({ session }: { session: Session }) => {
  return (
    <div className="mx-auto max-w-7xl">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center"
      >
        <div>
          <h1 className="mb-2 text-4xl font-bold tracking-wider text-amber-400">
            Bem-vindo, {session.user.name}
          </h1>
          <p className="text-gray-400">
            Gerencie seus personagens e campanhas de Shadow of the Demon Lord
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/characters/new">
            <Button className="border border-amber-700/50 bg-gradient-to-r from-red-900 to-red-950 text-amber-200 shadow-lg shadow-red-900/50 hover:from-red-800 hover:to-red-900">
              <PlusCircle className="mr-2 h-5 w-5" />
              Novo Personagem
            </Button>
          </Link>
          <Link
            href="/campaigns/new"
          >
            <Button className="border border-amber-700/50 bg-gradient-to-r from-red-900 to-red-950 text-amber-200 shadow-lg shadow-red-900/50 hover:from-red-800 hover:to-red-900">
              + Nova Campanha
            </Button>
          </Link>
          <Link
            href="/dice-tester"
          >
            <Button className="border border-amber-700/50 bg-gradient-to-r from-red-900 to-red-950 text-amber-200 shadow-lg shadow-red-900/50 hover:from-red-800 hover:to-red-900">
              <Dice1Icon /> Testador de Dados
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardHeader;
