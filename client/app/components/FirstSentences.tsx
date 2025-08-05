import React, { useEffect, useState } from "react";
import { api } from "../api/api";

interface IFirstSentences {
  setSelectedFirstSentence: (sentence: Sentence | null) => void;
}

const FirstSentences = ({
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
    if(!enteredText.trim()) {
      alert("Please enter a sentence.");
      return;
    }
    api.post("/api/sentences", { content: enteredText }).then(() => {
      setEnteredText("");
        handleRefresh();
    });
  };

  useEffect(() => {
    handleRefresh();
  }, []);
  return (
    <div>
      <button
        onClick={handleRefresh}
        className="px-2 my-4 flex justify-center items-center cursor-pointer py-2 bg-interactive-gold hover:bg-interactive-gold-dark text-background-primary font-bold rounded-lg transition-colors duration-200"
      >
        Refresh
      </button>
      <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-140px)] flex flex-col justify-start items-start w-full">
        {firstSentences.map((sentence) => (
          <button
            key={sentence.id}
            className={`hover:text-amber-600 rounded-lg cursor-pointer transition-colors duration-200 w-full flex justify-start items-center`}
            onClick={() => setSelectedFirstSentence(sentence)}
          >
            {sentence.content}
          </button>
        ))}
      </div>

      <div className="flexjustify-between items-center my-4">
        <input
          type="text"
          placeholder="Or type your first sentence here..."
          className="px-4 py-2 border border-amber-600 bg-background-elevated rounded-lg w-full mb-4"
          value={enteredText}
          onChange={(e) => setEnteredText(e.target.value)}
        />
        <button
          onClick={() => handleAddNewSentence()}
          className="flex hover:text-amber-600 justify-center items-center cursor-pointer py-2 font-bold rounded-lg transition-colors duration-200"
        >
          + New Sentence
        </button>
      </div>
    </div>
  );
};

export default FirstSentences;
