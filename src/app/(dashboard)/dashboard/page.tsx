import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import { api } from "~/trpc/server";
import Link from "next/link";
import { Dice1Icon } from "lucide-react";
import DashboardHeader from "~/app/_components/DashboardHeader";
import DashboardStats from "~/app/_components/DashboardStats";
import DashboardCharacters from "~/app/_components/DashboardCharacters";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  const characters = await api.characters.getMyCharacters();

  return (
    <div className="min-h-screen p-6 md:p-8">
      <DashboardHeader session={session} />

      {/* Cards de Estatísticas */}
      <DashboardStats characters={characters} />

      {/* Personagens */}
      <DashboardCharacters characters={characters} />
    </div>
  );
}
