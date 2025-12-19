"use client";

import { useAuth } from "./context/AuthContext";
import HomeContent from "../components/HomeContent";
import Link from "next/link";
import ProtectedRoute from "./components/ProtectedRoute";

export default function Home() {
  const { user, logout } = useAuth();

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col">
        {/* Top Navigation Bar */}
        {user && (
          <div className="fixed top-0 left-0 right-0 bg-background-deepest/80 backdrop-blur-sm border-b border-amber-700/20 z-40">
            <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-end space-x-4">
              <img
                src={user.pictureUrl}
                alt={""}
                className="w-8 h-8 rounded-full border-none"
              />
              <span className="text-sm">{user.name}</span>
              <Link
                href="/profile"
                className="text-sm text-text-accent hover:text-amber-600 transition-colors cursor-pointer"
              >
                Profile
              </Link>
              <button
                onClick={logout}
                className="text-sm text-text-accent hover:text-amber-600 transition-colors cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        )}

        {/* Main Content with padding for fixed header */}
        <div className="flex-1 pt-16">
          <HomeContent />
        </div>

        {/* Footer */}
        <div className="py-4 text-center text-xs text-text-accent opacity-20">
          <Link href={"https://github.com/Mert18/votale"}>Github</Link>
        </div>
      </div>
    </ProtectedRoute>
  );
}
