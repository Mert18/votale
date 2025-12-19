import React, { useEffect, useState } from "react";
import { api } from "../api/api";

interface ISentence {
  selectedFirstSentence: Sentence | null;
  setSelectedFirstSentence: (sentence: Sentence | null) => void;
  initialActiveTale?: Sentence[];
}

const Sentence = ({
  selectedFirstSentence,
  setSelectedFirstSentence,
  initialActiveTale,
}: ISentence) => {
  const [activeTale, setActiveTale] = useState<Sentence[]>(
    initialActiveTale || (selectedFirstSentence ? [selectedFirstSentence] : [])
  );
  const [lastSentence, setLastSentence] = useState<Sentence | null>(
    initialActiveTale ? initialActiveTale[initialActiveTale.length - 1] : selectedFirstSentence
  );
  const [nextSentenceOptions, setNextSentenceOptions] = useState<Sentence[]>(
    []
  );
  const [showAddSentenceModal, setShowAddSentenceModal] = useState(false);
  const [newSentenceText, setNewSentenceText] = useState("");
  const [sortBy, setSortBy] = useState<"votes" | "random">("votes");
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMorePages, setHasMorePages] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareableLink, setShareableLink] = useState("");

  useEffect(() => {
    if (!lastSentence) return;
    api.get(`/api/sentences/${lastSentence.id}?sortBy=${sortBy}&page=${currentPage}`).then((response) => {
      setNextSentenceOptions(response.data);
      setHasMorePages(response.data.length === 4);
    });
  }, [lastSentence, sortBy, currentPage]);

  const handleSentenceSelect = (selectedSentence: Sentence) => {
    setActiveTale((prev) => [...prev, selectedSentence]);
    setLastSentence(selectedSentence);
    setCurrentPage(0);
  };

  const handleSortChange = (newSort: "votes" | "random") => {
    setSortBy(newSort);
    setCurrentPage(0);
  };

  const handleRefreshRandom = () => {
    // Force refresh by updating currentPage (even if same page)
    setCurrentPage((prev) => prev);
    if (lastSentence) {
      api.get(`/api/sentences/${lastSentence.id}?sortBy=random&page=${currentPage}`).then((response) => {
        setNextSentenceOptions(response.data);
        setHasMorePages(response.data.length === 4);
      });
    }
  };

  const handleNextPage = () => {
    if (hasMorePages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleGoBackToSentence = (clickedSentence: Sentence) => {
    const clickedIndex = activeTale.findIndex(s => s.id === clickedSentence.id);
    if (clickedIndex !== -1) {
      // Truncate the tale up to and including the clicked sentence
      const newTale = activeTale.slice(0, clickedIndex + 1);
      setActiveTale(newTale);
      setLastSentence(clickedSentence);
      setCurrentPage(0);
    }
  };

  const handleVote = async (sentenceId: string) => {
    try {
      await api.post(`/api/sentences/${sentenceId}/vote`);
      // Refresh next sentence options to show updated vote count
      if (lastSentence) {
        const response = await api.get(`/api/sentences/${lastSentence.id}?sortBy=${sortBy}&page=${currentPage}`);
        setNextSentenceOptions(response.data);
        setHasMorePages(response.data.length === 4);
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
      // Reset to first page and refresh the sentence options to show the new one
      setCurrentPage(0);
      const refreshResponse = await api.get(`/api/sentences/${lastSentence.id}?sortBy=${sortBy}&page=0`);
      setNextSentenceOptions(refreshResponse.data);
      setHasMorePages(refreshResponse.data.length === 4);
    } catch (error) {
      console.error("Failed to add continuation:", error);
      alert("Failed to add your sentence. Please try again.");
    }
  };

  const handleSaveStory = async () => {
    if (activeTale.length === 0) {
      alert("No story to save.");
      return;
    }

    try {
      const sentenceIds = activeTale.map((s) => s.id);
      const response = await api.post("/api/saved-stories", { sentenceIds });
      const savedStoryId = response.data.id;
      const shareableLink = `${window.location.origin}/story/${savedStoryId}`;

      setShareableLink(shareableLink);
      setShowShareModal(true);
    } catch (error) {
      console.error("Failed to save story:", error);
      alert("Failed to save your story. Please try again.");
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareableLink);
    alert("Link copied to clipboard!");
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <button
          onClick={() => setSelectedFirstSentence(null)}
          className="text-text-secondary hover:text-text-accent transition-colors duration-200 cursor-pointer"
        >
          ← Back to tales
        </button>
        <button
          onClick={handleSaveStory}
          className="px-6 py-2 bg-amber-700 hover:bg-amber-600 rounded-lg transition-colors duration-200 font-semibold cursor-pointer"
        >
          💾 Save Story
        </button>
      </div>

      {/* Your Tale Display */}
      <div className="bg-background-elevated border border-amber-700/40 rounded-lg p-8 mb-8">
        <h2 className="text-2xl font-bold text-text-accent mb-4">Your Tale</h2>
        <p className="text-sm text-text-secondary mb-4 italic">
          Click on any sentence to go back to that point in the story
        </p>
        <div className="text-xl leading-relaxed text-text-primary">
          {activeTale.map((sentence, index) => {
            const isLastSentence = index === activeTale.length - 1;
            return (
              <span key={sentence.id}>
                <span
                  onClick={() => !isLastSentence && handleGoBackToSentence(sentence)}
                  className={`${
                    !isLastSentence
                      ? "cursor-pointer hover:text-gold-400 hover:underline transition-colors"
                      : "text-gold-400 font-semibold"
                  }`}
                  title={!isLastSentence ? "Click to go back to this point" : "Current position"}
                >
                  {sentence.content}
                </span>
                {index < activeTale.length - 1 && " "}
              </span>
            );
          })}
        </div>
      </div>

      {/* Next Sentence Options */}
      {nextSentenceOptions.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold text-text-accent">Continue the story...</h3>
            <button
              onClick={() => setShowAddSentenceModal(true)}
              className="px-4 py-2 bg-amber-700 hover:bg-amber-600 rounded-lg transition-colors duration-200 text-sm font-semibold cursor-pointer"
            >
              + Write Continuation
            </button>
          </div>

          {/* Sort Toggle */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <span className="text-text-secondary text-sm">Show options:</span>
              <div className="flex gap-2">
                <button
                  onClick={() => handleSortChange("votes")}
                  className={`px-4 py-2 rounded-lg transition-colors duration-200 text-sm cursor-pointer ${
                    sortBy === "votes"
                      ? "bg-amber-700 text-white"
                      : "border border-amber-700 text-text-primary hover:bg-amber-700/20"
                  }`}
                >
                  Most Voted
                </button>
                <button
                  onClick={() => handleSortChange("random")}
                  className={`px-4 py-2 rounded-lg transition-colors duration-200 text-sm cursor-pointer ${
                    sortBy === "random"
                      ? "bg-amber-700 text-white"
                      : "border border-amber-700 text-text-primary hover:bg-amber-700/20"
                  }`}
                >
                  Random
                </button>
              </div>
            </div>

            {/* Refresh Button for Random Mode */}
            {sortBy === "random" && (
              <button
                onClick={handleRefreshRandom}
                className="px-4 py-2 border border-amber-700 rounded-lg hover:bg-amber-700/20 transition-colors duration-200 text-sm flex items-center gap-2 cursor-pointer"
                title="Get new random options"
              >
                <span>↻</span>
                <span>Refresh</span>
              </button>
            )}

            {/* Pagination for Most Voted Mode */}
            {sortBy === "votes" && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 0}
                  className={`px-3 py-2 border border-amber-700 rounded-lg transition-colors duration-200 text-sm ${
                    currentPage === 0
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-amber-700/20 cursor-pointer"
                  }`}
                  title="Previous page"
                >
                  ←
                </button>
                <span className="text-text-secondary text-sm px-2">
                  Page {currentPage + 1}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={!hasMorePages}
                  className={`px-3 py-2 border border-amber-700 rounded-lg transition-colors duration-200 text-sm ${
                    !hasMorePages
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-amber-700/20 cursor-pointer"
                  }`}
                  title="Next page"
                >
                  →
                </button>
              </div>
            )}
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
                    <span className="text-text-secondary text-sm">{sentence.childCount || 0} →</span>
                    {sentence.authorName && (
                      <span className="text-text-secondary text-sm italic">
                        by {sentence.authorName}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleVote(sentence.id)}
                    className="px-4 py-1 border border-amber-700 rounded hover:bg-amber-700/30 transition-colors text-sm cursor-pointer"
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
                className="px-8 py-3 bg-amber-700 hover:bg-amber-600 rounded-lg transition-colors duration-200 font-semibold cursor-pointer"
              >
                + Write Continuation
              </button>
              <button
                onClick={() => handleShareYourTale()}
                className="px-8 py-3 border border-amber-700 hover:bg-amber-700/20 rounded-lg transition-colors duration-200 font-semibold cursor-pointer"
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
                className="px-6 py-2 border border-amber-700 rounded-lg hover:bg-amber-700/20 transition-colors duration-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAddContinuation}
                className="px-6 py-2 bg-amber-700 hover:bg-amber-600 rounded-lg transition-colors duration-200 font-semibold cursor-pointer"
              >
                Add to Story
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for sharing saved story */}
      {showShareModal && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setShowShareModal(false)}
        >
          <div
            className="bg-background-elevated border border-amber-700 rounded-lg p-8 max-w-2xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-bold text-text-accent mb-6">Story Saved!</h2>
            <p className="text-text-secondary mb-4">
              Your story has been saved to your profile. Share it with this link:
            </p>
            <div className="bg-background-deepest border border-amber-700/30 rounded-lg p-4 mb-6">
              <p className="text-text-primary break-all">{shareableLink}</p>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowShareModal(false)}
                className="px-6 py-2 border border-amber-700 rounded-lg hover:bg-amber-700/20 transition-colors duration-200 cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={handleCopyLink}
                className="px-6 py-2 bg-amber-700 hover:bg-amber-600 rounded-lg transition-colors duration-200 font-semibold cursor-pointer"
              >
                Copy Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sentence;
