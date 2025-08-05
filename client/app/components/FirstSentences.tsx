import React, { useEffect, useState } from "react";
import { api } from "../api/api";

interface IFirstSentences {
  setSelectedFirstSentence: (sentence: Sentence | null) => void;
}

const FirstSentences = ({ setSelectedFirstSentence }: IFirstSentences) => {
  const [enteredText, setEnteredText] = useState("");
  const [firstSentences, setFirstSentences] = useState<Sentence[]>([]);

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
      handleRefresh();
    });
  };

  useEffect(() => {
    handleRefresh();
  }, []);
  return (
    <div>
      <h2 className="font-bold text-sm text-gold-400 py-2">Select a First Sentence:</h2>
      {firstSentences.map((sentence) => (
        <button
          key={sentence.id}
          className={`hover:text-amber-600 cursor-pointer transition-colors duration-200 w-full flex justify-start items-center`}
          onClick={() => setSelectedFirstSentence(sentence)}
        >
          {sentence.content}
        </button>
      ))}

      <button
        onClick={handleRefresh}
        className="my-4 flex justify-center items-center cursor-pointer py-2 transition-colors duration-200 text-gold-400 hover:text-gold-500"
      >
        Refresh First Sentences
      </button>

      <span className="text-amber-100 font-extrabold mt-4">
        Or create a new one:
      </span>
      <div className="flex items-center my-4">
        <input
          type="text"
          placeholder="Or type your first sentence here..."
          className="px-4 py-2 border border-amber-700 bg-background-elevated rounded-md w-2/3 mr-4"
          value={enteredText}
          onChange={(e) => setEnteredText(e.target.value)}
        />
        <button
          onClick={() => handleAddNewSentence()}
          className="flex hover:text-amber-600 justify-center items-center cursor-pointer py-2 transition-colors duration-200"
        >
          + Add
        </button>
      </div>
    </div>
  );
};

export default FirstSentences;
