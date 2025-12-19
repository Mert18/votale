"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "../api/api";
import { useAuth } from "../context/AuthContext";
import ProtectedRoute from "../components/ProtectedRoute";

export default function ProfilePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [savedStories, setSavedStories] = useState<SavedStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchSavedStories();
  }, []);

  const fetchSavedStories = async () => {
    try {
      setLoading(true);
      const response = await api.get("/api/saved-stories");
      setSavedStories(response.data);
    } catch (error) {
      console.error("Failed to fetch saved stories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenStory = (storyId: string) => {
    router.push(`/story/${storyId}`);
  };

  const handleCopyLink = (storyId: string) => {
    const link = `${window.location.origin}/story/${storyId}`;
    navigator.clipboard.writeText(link);
    alert("Link copied to clipboard!");
  };

  const handleDeleteStory = async (storyId: string) => {
    if (!confirm("Are you sure you want to delete this saved story?")) {
      return;
    }

    try {
      setDeletingId(storyId);
      await api.delete(`/api/saved-stories/${storyId}`);
      setSavedStories((prev) => prev.filter((story) => story.id !== storyId));
    } catch (error: any) {
      console.error("Failed to delete story:", error);
      alert(error.response?.data?.error || "Failed to delete story");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;

    return date.toLocaleDateString();
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <ProtectedRoute>
      <div className="w-full max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push("/")}
            className="text-text-secondary hover:text-text-accent transition-colors duration-200 mb-4 cursor-pointer"
          >
            ← Back to tales
          </button>
          <h1 className="text-4xl font-bold text-text-accent mb-2">My Profile</h1>
          {user && (
            <p className="text-text-secondary">
              Welcome, {user.name}
            </p>
          )}
        </div>

        {/* Saved Stories Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-text-accent mb-4">Saved Stories</h2>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-text-secondary">Loading saved stories...</p>
            </div>
          ) : savedStories.length === 0 ? (
            <div className="text-center py-12 bg-background-elevated border border-amber-700/40 rounded-lg">
              <p className="text-text-secondary mb-4">You haven't saved any stories yet.</p>
              <button
                onClick={() => router.push("/")}
                className="px-6 py-2 bg-amber-700 hover:bg-amber-600 rounded-lg transition-colors duration-200 font-semibold cursor-pointer"
              >
                Start Exploring Tales
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {savedStories.map((story) => (
                <div
                  key={story.id}
                  className="bg-background-elevated border border-amber-700/30 rounded-lg p-6 hover:border-amber-600 hover:shadow-lg hover:shadow-amber-700/20 transition-all duration-200"
                >
                  <div className="mb-4">
                    <p className="text-text-primary text-lg leading-relaxed">
                      {truncateText(story.firstSentenceContent, 150)}
                      <span className="text-text-secondary mx-2">...</span>
                      {truncateText(story.lastSentenceContent, 150)}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-amber-700/20">
                    <div className="flex items-center gap-4">
                      <span className="text-text-secondary text-sm">
                        {story.pathLength} {story.pathLength === 1 ? "sentence" : "sentences"}
                      </span>
                      <span className="text-text-secondary text-sm">
                        {formatDate(story.createdAt)}
                      </span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleOpenStory(story.id)}
                        className="px-4 py-2 bg-amber-700 hover:bg-amber-600 rounded-lg transition-colors duration-200 text-sm font-semibold cursor-pointer"
                      >
                        Open
                      </button>
                      <button
                        onClick={() => handleCopyLink(story.id)}
                        className="px-4 py-2 border border-amber-700 hover:bg-amber-700/20 rounded-lg transition-colors duration-200 text-sm cursor-pointer"
                      >
                        Copy Link
                      </button>
                      <button
                        onClick={() => handleDeleteStory(story.id)}
                        disabled={deletingId === story.id}
                        className={`px-4 py-2 border border-red-700 text-red-500 hover:bg-red-700/20 rounded-lg transition-colors duration-200 text-sm cursor-pointer ${
                          deletingId === story.id ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {deletingId === story.id ? "Deleting..." : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
