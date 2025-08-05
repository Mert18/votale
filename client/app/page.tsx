"use client";

import { useEffect, useState } from "react";
import HomeContent from "../components/HomeContent";
import Link from "next/link";
import WelcomeContent from "./components/WelcomeContent";

export default function Home() {
  const [showWelcome, setShowWelcome] = useState(true);

  const handleGetStarted = () => {
    setShowWelcome(false);
    // localStorage.setItem("welcomeShown", "true");
  };

  useEffect(() => {
    const welcomeShown = localStorage.getItem("welcomeShown");
    if (welcomeShown) {
      setShowWelcome(false);
    }
  });
  return (
    <div className="h-full flex justify-center items-center">
      {showWelcome ? (
        <WelcomeContent handleGetStarted={handleGetStarted} />
      ) : (
        <HomeContent />
      )}

      <div className="absolute bottom-4 right-4 text-xs text-text-accent opacity-20">
        <Link href={"https://github.com/Mert18/votale"}>Github</Link>
      </div>
    </div>
  );
}
