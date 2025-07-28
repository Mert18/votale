"use client";

import { useEffect, useState } from "react";
import HomeContent from "../components/HomeContent";

export default function Home() {
  const [showWelcome, setShowWelcome] = useState(true);

  const handleGetStarted = () => {
    setShowWelcome(false);
    localStorage.setItem("welcomeShown", "true");
  };

  useEffect(() => {
    const welcomeShown = localStorage.getItem("welcomeShown");
    if (welcomeShown) {
      setShowWelcome(false);
    }
  })
  return (
    <div className="relative overflow-hidden">
      <div
        className={`transition-transform duration-700 ease-in-out ${
          showWelcome ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <main className="bg-background-primary min-h-screen text-text-primary font-inknut flex flex-col justify-center items-center gap-6">
          <h1 className="text-2xl font-bold">
            Welcome to{" "}
            <span className="text-text-accent font-extrabold">votale</span>
          </h1>
          <p className="text-base">where collaborative writings take place.</p>

          <button
            onClick={handleGetStarted}
            className="mt-4 px-8 py-3 bg-interactive-gold hover:bg-interactive-gold-dark text-background-primary font-bold rounded-lg transition-colors duration-200"
          >
            Get Started
          </button>
        </main>
      </div>

      <div
        className={`absolute inset-0 transition-transform duration-700 ease-in-out ${
          showWelcome ? "translate-x-full" : "translate-x-0"
        }`}
      >
        <main className="bg-background-secondary min-h-screen text-text-primary font-inknut flex flex-col justify-center items-center gap-6">
          <HomeContent />
        </main>
      </div>

      <footer className="absolute bottom-0 left-0 right-0 flex gap-6 flex-wrap items-center justify-center p-4 z-10"></footer>
    </div>
  );
}
