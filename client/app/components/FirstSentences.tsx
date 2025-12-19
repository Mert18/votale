import React, { useEffect, useState } from "react";
import { api } from "../api/api";

interface IFirstSentences {
  setSelectedFirstSentence: (sentence: Sentence | null) => void;
}

const FirstSentences = ({ setSelectedFirstSentence }: IFirstSentences) => {
  const [enteredText, setEnteredText] = useState("");
  const [firstSentences, setFirstSentences] = useState<Sentence[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showRandomStoryModal, setShowRandomStoryModal] = useState(false);
  const [randomStory, setRandomStory] = useState<Sentence[]>([]);
  const [loadingStory, setLoadingStory] = useState(false);

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

  const handleGenerateRandomStory = () => {
    setLoadingStory(true);
    setShowRandomStoryModal(true);
    api
      .get("/api/sentences/random-story")
      .then((response) => {
        setRandomStory(response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch random story:", error);
        alert("Failed to generate random story. Please try again.");
        setShowRandomStoryModal(false);
      })
      .finally(() => {
        setLoadingStory(false);
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
            onClick={handleGenerateRandomStory}
            className="px-4 py-2 border border-amber-700 rounded-lg hover:bg-amber-700/20 transition-colors duration-200 cursor-pointer"
          >
            🎲 Random Story
          </button>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 border border-amber-700 rounded-lg hover:bg-amber-700/20 transition-colors duration-200 cursor-pointer"
          >
            ↻ Refresh
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="px-6 py-2 bg-amber-700 hover:bg-amber-600 rounded-lg transition-colors duration-200 font-semibold cursor-pointer"
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
              <span className="text-gold-400">{sentence.totalPathVotes ?? 0} ❤</span>
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
            className="text-gold-400 hover:text-gold-500 underline cursor-pointer"
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
                className="px-6 py-2 border border-amber-700 rounded-lg hover:bg-amber-700/20 transition-colors duration-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAddNewSentence}
                className="px-6 py-2 bg-amber-700 hover:bg-amber-600 rounded-lg transition-colors duration-200 font-semibold cursor-pointer"
              >
                Create Tale
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Random Story Modal */}
      {showRandomStoryModal && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setShowRandomStoryModal(false)}
        >
          <div
            className="bg-background-elevated border border-amber-700 rounded-lg p-8 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-text-accent">Random Story</h2>
              <button
                onClick={() => setShowRandomStoryModal(false)}
                className="text-text-secondary hover:text-text-accent text-2xl cursor-pointer"
              >
                ×
              </button>
            </div>

            {loadingStory ? (
              <div className="text-center py-12">
                <p className="text-text-secondary text-xl">Generating random story...</p>
              </div>
            ) : randomStory.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-text-secondary text-xl">No stories available yet.</p>
                <button
                  onClick={() => {
                    setShowRandomStoryModal(false);
                    setShowModal(true);
                  }}
                  className="mt-6 px-6 py-3 bg-amber-700 hover:bg-amber-600 rounded-lg transition-colors duration-200 font-semibold cursor-pointer"
                >
                  Create the first story
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-background-deepest border border-amber-700/30 rounded-lg p-6">
                  <p className="text-xl leading-relaxed text-text-primary">
                    {randomStory.map((sentence, index) => (
                      <span key={sentence.id}>
                        {sentence.content}
                        {index < randomStory.length - 1 && " "}
                      </span>
                    ))}
                  </p>
                </div>

                <div className="text-center text-text-secondary text-sm">
                  <p>This story is {randomStory.length} sentence{randomStory.length !== 1 ? "s" : ""} long</p>
                </div>

                <div className="flex justify-center gap-4">
                  <button
                    onClick={handleGenerateRandomStory}
                    className="px-6 py-3 bg-amber-700 hover:bg-amber-600 rounded-lg transition-colors duration-200 font-semibold cursor-pointer"
                  >
                    🎲 Generate Another
                  </button>
                  <button
                    onClick={() => setShowRandomStoryModal(false)}
                    className="px-6 py-3 border border-amber-700 hover:bg-amber-700/20 rounded-lg transition-colors duration-200 font-semibold cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FirstSentences;
