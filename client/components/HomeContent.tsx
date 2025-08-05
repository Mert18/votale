import React, { useState } from "react";
import Link from "next/link";
import FirstSentences from "@/app/components/FirstSentences";
import Sentence from "@/app/components/Sentence";

const HomeContent = () => {
  const [selectedFirstSentence, setSelectedFirstSentence] =
    useState<Sentence | null>(null);

  return (
    <main className="lg:w-2/5 lg:text-base w-full h-full py-10 px-2">
      <div className="my-20">
        <Link href={"/"}>
          <span className="text-text-accent font-extrabold text-xl">
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
