"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function Header() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  if (!session) return null;

  return (
    <header className="bg-gray-900 border-b border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/dashboard" className="text-xl font-bold text-white">
            ShadowChar
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/dashboard" className="text-gray-300 hover:text-white transition">
              Dashboard
            </Link>
            <Link href="/characters" className="text-gray-300 hover:text-white transition">
              Personagens
            </Link>
            <Link href="/campaigns" className="text-gray-300 hover:text-white transition">
              Campanhas
            </Link>
            <Link href="/compendium" className="text-gray-300 hover:text-white transition">
              Compêndio
            </Link>
          </nav>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {session.user.image && (
                <img
                  src={session.user.image}
                  alt={session.user.name ?? "User"}
                  className="w-8 h-8 rounded-full"
                />
              )}
              <span className="text-white">{session.user.name}</span>
            </div>
            <button
              onClick={() => signOut()}
              className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white transition"
            >
              Sair
            </button>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-700">
            <div className="flex flex-col space-y-2">
              <Link href="/dashboard" className="text-gray-300 hover:text-white transition py-2">
                Dashboard
              </Link>
              <Link href="/characters" className="text-gray-300 hover:text-white transition py-2">
                Personagens
              </Link>
              <Link href="/campaigns" className="text-gray-300 hover:text-white transition py-2">
                Campanhas
              </Link>
              <Link href="/compendium" className="text-gray-300 hover:text-white transition py-2">
                Compêndio
              </Link>
              <div className="pt-4 border-t border-gray-700">
                <div className="flex items-center space-x-2 mb-2">
                  {session.user.image && (
                    <img
                      src={session.user.image}
                      alt={session.user.name ?? "User"}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <span className="text-white">{session.user.name}</span>
                </div>
                <button
                  onClick={() => signOut()}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white transition"
                >
                  Sair
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}