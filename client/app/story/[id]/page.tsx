"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "../../api/api";
import StoryViewer from "../../components/StoryViewer";
import ProtectedRoute from "../../components/ProtectedRoute";

export default function StoryPage() {
  const params = useParams();
  const [story, setStory] = useState<Sentence[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/saved-stories/${params.id}/story`);
        setStory(response.data);
      } catch (err: any) {
        console.error("Failed to fetch story:", err);
        setError(err.response?.data?.error || "Failed to load story");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchStory();
    }
  }, [params.id]);

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="w-full max-w-5xl mx-auto px-4 py-12 text-center">
          <p className="text-text-accent text-xl">Loading story...</p>
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="w-full max-w-5xl mx-auto px-4 py-12 text-center">
          <p className="text-red-500 text-xl mb-4">{error}</p>
          <a
            href="/"
            className="px-6 py-2 bg-amber-700 hover:bg-amber-600 rounded-lg transition-colors duration-200 font-semibold cursor-pointer inline-block"
          >
            Back to Tales
          </a>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <StoryViewer initialStory={story} />
    </ProtectedRoute>
  );
}
