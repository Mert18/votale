import React, { useState } from "react";
import Link from "next/link";
import FirstSentences from "@/app/components/FirstSentences";
import Sentence from "@/app/components/Sentence";

const HomeContent = () => {
  const [selectedFirstSentence, setSelectedFirstSentence] =
    useState<Sentence | null>(null);

  return (
    <div className="bg-background-secondary min-h-screen py-4 text-text-primary font-inknut w-full lg:w-1/2 p-2">
      <Link href={"/"}>
        <span className="text-text-accent font-extrabold text-2xl">votale</span>
      </Link>

      {!selectedFirstSentence ? (
        <FirstSentences
          setSelectedFirstSentence={setSelectedFirstSentence}
        />
      ) : (
        <Sentence selectedFirstSentence={selectedFirstSentence} setSelectedFirstSentence={setSelectedFirstSentence} />
      )}
    </div>
  );
};

export default HomeContent;
