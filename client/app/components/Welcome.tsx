import React, { useEffect, useState } from "react";
import { api } from "../api/api";

interface WelcomeProps {
  onGetStarted: () => void;
}

const Welcome = ({ onGetStarted }: WelcomeProps) => {
  const [storyStats, setStoryStats] = useState<StoryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRandomStoryModal, setShowRandomStoryModal] = useState(false);
  const [randomStory, setRandomStory] = useState<Sentence[]>([]);
  const [loadingStory, setLoadingStory] = useState(false);

  useEffect(() => {
    api
      .get("/api/stats/stories")
      .then((response) => {
        setStoryStats(response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch story stats:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

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

  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[70vh] items-center">
        {/* Left Section - Welcome Info */}
        <div className="flex flex-col justify-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold text-text-accent">
            Welcome to{" "}
            <span className="text-gold-400">votale</span>
          </h1>
          <p className="text-xl text-text-secondary leading-relaxed">
            A collaborative storytelling platform where every choice matters.
            Start a tale, continue someone else's story, or explore the endless
            possibilities of community-driven narratives.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-text-primary">
              <span className="text-2xl">✍️</span>
              <span>Write your own story paths</span>
            </div>
            <div className="flex items-center gap-3 text-text-primary">
              <span className="text-2xl">🗳️</span>
              <span>Vote for your favorite continuations</span>
            </div>
            <div className="flex items-center gap-3 text-text-primary">
              <span className="text-2xl">🌳</span>
              <span>Explore branching narratives</span>
            </div>
          </div>
          <div className="flex gap-4">
            <button
              onClick={onGetStarted}
              className="px-8 py-4 bg-amber-700 hover:bg-amber-600 rounded-lg transition-colors duration-200 font-semibold text-lg cursor-pointer w-fit"
            >
              Get Started →
            </button>
            <button
              onClick={handleGenerateRandomStory}
              className="px-8 py-4 border border-amber-700 hover:bg-amber-700/20 rounded-lg transition-colors duration-200 font-semibold text-lg cursor-pointer w-fit"
            >
              🎲 Random Story
            </button>
          </div>
        </div>

        {/* Right Section - Stats */}
        <div className="flex flex-col justify-center">
          <div className="bg-background-elevated border border-amber-700/40 rounded-lg p-8 space-y-6">
            <h2 className="text-3xl font-bold text-text-accent text-center">
              Community Stats
            </h2>

            {loading ? (
              <div className="text-center py-12">
                <p className="text-text-secondary">Loading stats...</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="text-center py-6 border-b border-amber-700/20">
                  <div className="text-5xl font-bold text-gold-400 mb-2">
                    {storyStats?.possibleStoryCount?.toLocaleString() ?? "0"}
                  </div>
                  <div className="text-lg text-text-secondary">
                    Possible Different Stories
                  </div>
                  {storyStats?.calculatedAt && (
                    <div className="text-sm text-text-secondary mt-2">
                      Updated:{" "}
                      {new Date(storyStats.calculatedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>

                <div className="text-center py-4">
                  <p className="text-text-secondary text-sm">
                    Every sentence creates new possibilities. Join the community
                    and help expand the story universe!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

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
                    onGetStarted();
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

export default Welcome;
