import React, { useEffect, useState } from "react";
import { api } from "../api/api";

interface IFirstSentences {
  selectedFirstSentence: Sentence | null;
  setSelectedFirstSentence: (sentence: Sentence | null) => void;
}

const FirstSentences = ({
  selectedFirstSentence,
  setSelectedFirstSentence,
}: IFirstSentences) => {
  const [enteredText, setEnteredText] = useState("");
  const [firstSentences, setFirstSentences] = useState<Sentence[]>([]);

  const handleRefresh = () => {
    api.get("/api/sentences/first").then((response) => {
      setFirstSentences(response.data);
    });
  };

  const handleAddNewSentence = () => {
    api.post("/api/sentences", { content: enteredText }).then(() => {
      setEnteredText("");
        handleRefresh();
    });
  };

  useEffect(() => {
    handleRefresh();
  }, []);
  return (
    <div className="p-4">
      <button
        onClick={handleRefresh}
        className="px-4 my-4 flex justify-center items-center cursor-pointer py-2 bg-interactive-gold hover:bg-interactive-gold-dark text-background-primary font-bold rounded-lg transition-colors duration-200"
      >
        Refresh
      </button>
      <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-140px)] flex flex-col justify-start items-start w-full">
        {firstSentences.map((sentence) => (
          <button
            key={sentence.id}
            className={`p-4 ${
              selectedFirstSentence != null &&
              selectedFirstSentence.id === sentence.id
                ? "bg-amber-900"
                : "bg-background-elevated"
            } hover:bg-amber-900 rounded-lg cursor-pointer transition-colors duration-200 border border-yellow-900 w-full flex justify-start items-center`}
            onClick={() => setSelectedFirstSentence(sentence)}
          >
            {sentence.content}
          </button>
        ))}
      </div>

      <div className="flexjustify-between items-center my-4">
        <input
          type="text"
          placeholder="Type your first sentence here..."
          className="px-4 py-2 border border-amber-600 bg-background-elevated rounded-lg w-full mb-4"
          value={enteredText}
          onChange={(e) => setEnteredText(e.target.value)}
        />
        <button
          onClick={() => handleAddNewSentence()}
          className="flex justify-center items-center cursor-pointer py-2 font-bold rounded-lg transition-colors duration-200"
        >
          + New Sentence
        </button>
      </div>
    </div>
  );
};

export default FirstSentences;
