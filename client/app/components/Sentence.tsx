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
    setActiveTale((prev) => [...prev, selectedSentence]);
    setLastSentence(selectedSentence);
  };

  const handleShareYourTale = () => {
    const taleContent = activeTale
      .map((sentence) => sentence.content)
      .join(" ");
    alert(`Your tale: ${taleContent}`);
  };

  return (
    <div>
      <div className="my-4">
        <button
          onClick={() => {
            setSelectedFirstSentence(null);
          }}
          className="py-2 text-text-primary hover:text-amber-600 cursor-pointer rounded-lg transition-colors duration-200"
        >
          Go Back
        </button>
      </div>

      <div>
        <h3 className="text-gold-400">Your Tale:</h3>
        <div className="py-4">
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
          <h3 className="text-gold-400">Choose your next sentence:</h3>
          <div className="space-y-2 flex flex-col justify-start items-start">
            {nextSentenceOptions.map((sentence) => (
              <button
                key={sentence.id}
                onClick={() => handleSentenceSelect(sentence)}
                className="w-full text-left cursor-pointer hover:text-amber-600 transition-colors duration-200"
              >
                {sentence.content}
              </button>
            ))}
          </div>
        </div>
      )}

      {nextSentenceOptions.length === 0 && lastSentence && (
        <div className="text-center py-8">
          <p className="text-amber-700">
            No more sentence options available. Your tale is complete!
          </p>
          <button className="cursor-pointer hover:text-amber-600 my-4 transition-colors duration-200" onClick={() => handleShareYourTale()}>
            Share your tale!
          </button>
        </div>
      )}
    </div>
  );
};

export default Sentence;
