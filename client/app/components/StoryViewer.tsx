"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Sentence from "./Sentence";

interface StoryViewerProps {
  initialStory: Sentence[];
}

const StoryViewer = ({ initialStory }: StoryViewerProps) => {
  const router = useRouter();
  const [selectedFirstSentence] = useState<Sentence | null>(
    initialStory.length > 0 ? initialStory[0] : null
  );

  const handleBackToTales = () => {
    router.push("/");
  };

  if (!selectedFirstSentence) {
    return (
      <div className="w-full max-w-5xl mx-auto px-4 py-12 text-center">
        <p className="text-text-secondary">No story found.</p>
        <button
          onClick={handleBackToTales}
          className="mt-4 px-6 py-2 bg-amber-700 hover:bg-amber-600 rounded-lg transition-colors duration-200 font-semibold cursor-pointer"
        >
          Back to Tales
        </button>
      </div>
    );
  }

  return (
    <Sentence
      selectedFirstSentence={selectedFirstSentence}
      setSelectedFirstSentence={handleBackToTales}
      initialActiveTale={initialStory}
    />
  );
};

export default StoryViewer;
