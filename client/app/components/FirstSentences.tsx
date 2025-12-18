import React, { useEffect, useState } from "react";
import { api } from "../api/api";

interface IFirstSentences {
  setSelectedFirstSentence: (sentence: Sentence | null) => void;
}

const FirstSentences = ({ setSelectedFirstSentence }: IFirstSentences) => {
  const [enteredText, setEnteredText] = useState("");
  const [firstSentences, setFirstSentences] = useState<Sentence[]>([]);
  const [showModal, setShowModal] = useState(false);

  const handleRefresh = () => {
    api.get("/api/sentences/first").then((response) => {
      setFirstSentences(response.data);
    });
  };

  const handleAddNewSentence = () => {
    if (!enteredText.trim()) {
      alert("Please enter a sentence.");
      return;
    }
    api.post("/api/sentences", { content: enteredText }).then(() => {
      setEnteredText("");
      setShowModal(false);
      handleRefresh();
    });
  };

  useEffect(() => {
    handleRefresh();
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      {/* Header with action buttons */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-text-accent">Begin Your Tale</h1>
        <div className="flex gap-3">
          <button
            onClick={handleRefresh}
            className="px-4 py-2 border border-amber-700 rounded-lg hover:bg-amber-700/20 transition-colors duration-200"
          >
            ↻ Refresh
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-2 bg-amber-700 hover:bg-amber-600 rounded-lg transition-colors duration-200 font-semibold"
          >
            + Create New
          </button>
        </div>
      </div>

      {/* Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {firstSentences.map((sentence) => (
          <div
            key={sentence.id}
            onClick={() => setSelectedFirstSentence(sentence)}
            className="bg-background-elevated border border-amber-700/30 rounded-lg p-6 cursor-pointer hover:border-amber-600 hover:shadow-lg hover:shadow-amber-700/20 transition-all duration-200 flex flex-col justify-between min-h-[180px]"
          >
            <p className="text-text-primary text-lg mb-4 leading-relaxed">
              "{sentence.content}"
            </p>
            <div className="flex items-center justify-between text-sm">
              {sentence.authorName && (
                <span className="text-text-secondary italic">
                  — {sentence.authorName}
                </span>
              )}
              <span className="text-gold-400">{sentence.votes} ❤</span>
            </div>
          </div>
        ))}
      </div>

      {/* Empty state */}
      {firstSentences.length === 0 && (
        <div className="text-center py-20">
          <p className="text-text-secondary text-xl mb-4">No tales yet...</p>
          <button
            onClick={() => setShowModal(true)}
            className="text-gold-400 hover:text-gold-500 underline"
          >
            Be the first to create one!
          </button>
        </div>
      )}

      {/* Modal for creating new sentence */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-background-elevated border border-amber-700 rounded-lg p-8 max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-text-accent mb-6">Start a New Tale</h2>
            <p className="text-text-secondary mb-4">
              Write the first sentence of your story. Others will continue from here.
            </p>
            <textarea
              value={enteredText}
              onChange={(e) => setEnteredText(e.target.value)}
              placeholder="Once upon a time..."
              className="w-full px-4 py-3 border border-amber-700 bg-background-deepest rounded-lg text-text-primary focus:outline-none focus:border-amber-600 mb-6 min-h-[120px] resize-none"
              autoFocus
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 border border-amber-700 rounded-lg hover:bg-amber-700/20 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNewSentence}
                className="px-6 py-2 bg-amber-700 hover:bg-amber-600 rounded-lg transition-colors duration-200 font-semibold"
              >
                Create Tale
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FirstSentences;
