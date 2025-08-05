import React from "react";

interface IWelcomeContent {
  handleGetStarted: () => void;
}

const WelcomeContent = ({ handleGetStarted }: IWelcomeContent) => {
  return (
    <main>
      <div className="flex flex-col justify-center items-center gap-4">
        <h1 className="text-center text-text-accent font-[900] font-inknut text-4xl">
          votale
        </h1>
        <p className="font-bold">where collaborative writings take place.</p>

        <ul className="p-1">
          <li>
            <span className="text-gold-400">1.</span> Pick a first sentence or
            create a new one.
          </li>
          <li>
            <span className="text-gold-400">2.</span> Write a sentence or pick
            others' that continues the story.
          </li>
          <li>
            <span className="text-gold-400">3.</span> Vote for your favorite
            sentences.
          </li>
          <li>
            <span className="text-gold-400">4.</span> Share your tales with the
            community!
          </li>
        </ul>
        <button
          onClick={handleGetStarted}
          className="mt-4 px-8 py-3 text-gold-400 hover:text-gold-500 cursor-pointer font-bold rounded-lg transition-colors duration-200"
        >
          Get Started
        </button>
      </div>
    </main>
  );
};

export default WelcomeContent;
