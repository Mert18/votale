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
  const [showAddSentenceModal, setShowAddSentenceModal] = useState(false);
  const [newSentenceText, setNewSentenceText] = useState("");

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

  const handleVote = async (sentenceId: string) => {
    try {
      await api.post(`/api/sentences/${sentenceId}/vote`);
      // Refresh next sentence options to show updated vote count
      if (lastSentence) {
        const response = await api.get(`/api/sentences/${lastSentence.id}`);
        setNextSentenceOptions(response.data);
      }
    } catch (error: any) {
      if (error.response?.status === 409) {
        alert("You have already voted for this sentence");
      } else {
        console.error("Vote failed:", error);
        alert("Failed to vote. Please try again.");
      }
    }
  };

  const handleShareYourTale = () => {
    const taleContent = activeTale
      .map((sentence) => sentence.content)
      .join(" ");
    alert(`Your tale: ${taleContent}`);
  };

  const handleAddContinuation = async () => {
    if (!newSentenceText.trim()) {
      alert("Please enter a sentence.");
      return;
    }
    if (!lastSentence) return;

    try {
      const response = await api.post("/api/sentences", {
        content: newSentenceText,
        previousSentenceId: lastSentence.id,
      });
      setNewSentenceText("");
      setShowAddSentenceModal(false);
      // Refresh the sentence options to show the new one
      const refreshResponse = await api.get(`/api/sentences/${lastSentence.id}`);
      setNextSentenceOptions(refreshResponse.data);
    } catch (error) {
      console.error("Failed to add continuation:", error);
      alert("Failed to add your sentence. Please try again.");
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => setSelectedFirstSentence(null)}
          className="text-text-secondary hover:text-text-accent transition-colors duration-200 mb-4"
        >
          ← Back to tales
        </button>
      </div>

      {/* Your Tale Display */}
      <div className="bg-background-elevated border border-amber-700/40 rounded-lg p-8 mb-8">
        <h2 className="text-2xl font-bold text-text-accent mb-4">Your Tale</h2>
        <div className="text-xl leading-relaxed text-text-primary">
          {activeTale.map((sentence, index) => (
            <span key={sentence.id}>
              {sentence.content}
              {index < activeTale.length - 1 && " "}
            </span>
          ))}
        </div>
      </div>

      {/* Next Sentence Options */}
      {nextSentenceOptions.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-text-accent">Continue the story...</h3>
            <button
              onClick={() => setShowAddSentenceModal(true)}
              className="px-4 py-2 bg-amber-700 hover:bg-amber-600 rounded-lg transition-colors duration-200 text-sm font-semibold"
            >
              + Write Your Own
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {nextSentenceOptions.map((sentence) => (
              <div
                key={sentence.id}
                className="bg-background-elevated border border-amber-700/30 rounded-lg p-6 hover:border-amber-600 hover:shadow-lg hover:shadow-amber-700/20 transition-all duration-200"
              >
                <div
                  onClick={() => handleSentenceSelect(sentence)}
                  className="cursor-pointer mb-4"
                >
                  <p className="text-text-primary text-lg leading-relaxed">
                    {sentence.content}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-amber-700/20">
                  <div className="flex items-center gap-4">
                    <span className="text-gold-400">{sentence.votes} ❤</span>
                    {sentence.authorName && (
                      <span className="text-text-secondary text-sm italic">
                        by {sentence.authorName}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleVote(sentence.id)}
                    className="px-4 py-1 border border-amber-700 rounded hover:bg-amber-700/30 transition-colors text-sm"
                  >
                    Vote
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tale Complete or No Options */}
      {nextSentenceOptions.length === 0 && lastSentence && (
        <div className="text-center py-12">
          <div className="bg-background-elevated border border-amber-700/40 rounded-lg p-12 max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold text-text-accent mb-4">No more paths... 📖</h3>
            <p className="text-text-secondary mb-6">
              No one has continued from here yet. Be the first to write what happens next!
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setShowAddSentenceModal(true)}
                className="px-8 py-3 bg-amber-700 hover:bg-amber-600 rounded-lg transition-colors duration-200 font-semibold"
              >
                + Write Continuation
              </button>
              <button
                onClick={() => handleShareYourTale()}
                className="px-8 py-3 border border-amber-700 hover:bg-amber-700/20 rounded-lg transition-colors duration-200 font-semibold"
              >
                Share Your Tale
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for adding continuation sentence */}
      {showAddSentenceModal && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setShowAddSentenceModal(false)}
        >
          <div
            className="bg-background-elevated border border-amber-700 rounded-lg p-8 max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-text-accent mb-6">Continue the Tale</h2>
            <div className="bg-background-deepest border border-amber-700/30 rounded-lg p-4 mb-4">
              <p className="text-text-secondary text-sm mb-2">Current story:</p>
              <p className="text-text-primary italic">
                ...{activeTale[activeTale.length - 1]?.content}
              </p>
            </div>
            <p className="text-text-secondary mb-4">
              Write the next sentence to continue the story.
            </p>
            <textarea
              value={newSentenceText}
              onChange={(e) => setNewSentenceText(e.target.value)}
              placeholder="And then..."
              className="w-full px-4 py-3 border border-amber-700 bg-background-deepest rounded-lg text-text-primary focus:outline-none focus:border-amber-600 mb-6 min-h-[120px] resize-none"
              autoFocus
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowAddSentenceModal(false);
                  setNewSentenceText("");
                }}
                className="px-6 py-2 border border-amber-700 rounded-lg hover:bg-amber-700/20 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAddContinuation}
                className="px-6 py-2 bg-amber-700 hover:bg-amber-600 rounded-lg transition-colors duration-200 font-semibold"
              >
                Add to Story
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sentence;
