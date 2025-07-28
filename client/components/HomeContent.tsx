import React, { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/app/api/api";

interface Sentence {
  id: string;
  previousSentenceId: string | null;
  votes: number;
  content: string;
}

const HomeContent = () => {
  const [loading, setLoading] = useState(true);
  const [firstSentences, setFirstSentences] = useState<Sentence[]>([]);
  const [selectedFirstSentence, setSelectedFirstSentence] =
    useState<Sentence | null>(null);

  useEffect(() => {
    api
      .get("/api/sentences/first")
      .then((response) => {
        console.log("First sentences fetched:", response.data);
        setFirstSentences(response.data);
      })
      .catch((error) => {
        console.error("Error fetching first sentences:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);


  return (
    <div className="bg-background-secondary min-h-screen text-text-primary font-inknut w-3/4">
      <div className="flex h-screen w-full">
        {/* Left Half - Stories List */}
        <div className="w-1/2 p-6 border-r border-brown-800">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-text-accent mb-2">
              First Sentences
            </h2>
            <button className="px-4 py-2 bg-interactive-gold hover:bg-interactive-gold-dark text-background-primary font-bold rounded-lg transition-colors duration-200">
              + New Sentence
            </button>
          </div>

          <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-140px)] flex flex-col justify-start items-start w-full">
            {firstSentences.map((sentence) => (
              <button
                key={sentence.id}
                className={`p-4 ${selectedFirstSentence != null && selectedFirstSentence.id === sentence.id ? "bg-amber-700" : "bg-background-elevated"} hover:bg-amber-700 rounded-lg cursor-pointer transition-colors duration-200 border-l-4 w-full flex justify-start items-center`}
                onClick={() => setSelectedFirstSentence(sentence)}
              >
                {sentence.content}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeContent;
