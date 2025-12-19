import React, { useState } from "react";
import Link from "next/link";
import FirstSentences from "@/app/components/FirstSentences";
import Sentence from "@/app/components/Sentence";

const HomeContent = () => {
  const [selectedFirstSentence, setSelectedFirstSentence] =
    useState<Sentence | null>(null);

  const handleBackToHome = () => {
    setSelectedFirstSentence(null);
  };

  return (
    <main className="w-full h-full py-10">
      <div className="mb-12 max-w-5xl mx-auto px-4">
        <Link href={"/"} onClick={handleBackToHome}>
          <span className="text-text-accent font-extrabold text-2xl cursor-pointer">
            votale
          </span>
        </Link>
      </div>

      {!selectedFirstSentence ? (
        <FirstSentences setSelectedFirstSentence={setSelectedFirstSentence} />
      ) : (
        <Sentence
          selectedFirstSentence={selectedFirstSentence}
          setSelectedFirstSentence={setSelectedFirstSentence}
        />
      )}
    </main>
  );
};

export default HomeContent;
