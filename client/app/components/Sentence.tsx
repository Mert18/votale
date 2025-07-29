import Link from "next/link";
import React, { useEffect, useState } from "react";
import { api } from "../api/api";

interface ISentence {
  selectedFirstSentence: Sentence | null;
  setSelectedFirstSentence: (sentence: Sentence | null) => void;
}

const Sentence = ({
  selectedFirstSentence,
  setSelectedFirstSentence,
}: ISentence) => {
  const [activeTale, setActiveTale] = useState<Sentence[]>(
    selectedFirstSentence ? [selectedFirstSentence] : []
  );
  const [lastSentence, setLastSentence] = useState<Sentence | null>(
    selectedFirstSentence
  );
  const [nextSentenceOptions, setNextSentenceOptions] = useState<Sentence[]>(
    []
  );

  useEffect(() => {
    if (!lastSentence) return;
    api.get(`/api/sentences/${lastSentence.id}`).then((response) => {
      setNextSentenceOptions(response.data);
    });
  }, [lastSentence]);

  const handleSentenceSelect = (selectedSentence: Sentence) => {
    setActiveTale(prev => [...prev, selectedSentence]);
    setLastSentence(selectedSentence);
  };

  return (
    <div className="py-4">
      <div className="my-4">
        <button
          onClick={() => {
            setSelectedFirstSentence(null);
          }}
          className="py-2 px-4 text-text-primary cursor-pointer rounded-lg transition-colors duration-200"
        >
          Go Back
        </button>
      </div>
      
      <div className="space-y-4 mb-6">
        <h3 className="text-lg font-semibold">Your Tale:</h3>
        <div className="p-4 bg-background-elevated rounded-lg">
          {activeTale.map((sentence, index) => (
            <span key={sentence.id}>
              {sentence.content}
              {index < activeTale.length - 1 && " "}
            </span>
          ))}
        </div>
      </div>

      {nextSentenceOptions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Choose your next sentence:</h3>
          <div className="space-y-2">
            {nextSentenceOptions.map((sentence) => (
              <button
                key={sentence.id}
                onClick={() => handleSentenceSelect(sentence)}
                className="w-full p-4 text-left bg-background-elevated hover:bg-background-hover rounded-lg transition-colors duration-200 cursor-pointer"
              >
                {sentence.content}
              </button>
            ))}
          </div>
        </div>
      )}

      {nextSentenceOptions.length === 0 && lastSentence && (
        <div className="text-center py-8 text-text-secondary">
          <p>No more sentence options available. Your tale is complete!</p>
        </div>
      )}
    </div>
  );
};

export default Sentence;