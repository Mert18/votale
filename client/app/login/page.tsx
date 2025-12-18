"use client";

import LoginButton from "../components/LoginButton";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="h-full flex flex-col justify-center items-center">
      <div className="text-center space-y-10">
        <div>
          <h1 className="text-text-accent font-extrabold text-6xl mb-6">
            votale
          </h1>
          <p className="font-bold text-xl mb-6">where collaborative writings take place.</p>

          <ul className="text-left space-y-2 text-lg">
            <li>
              <span className="text-gold-400">1.</span> Pick a first sentence or create a new one.
            </li>
            <li>
              <span className="text-gold-400">2.</span> Write a sentence or pick others' that continues the story.
            </li>
            <li>
              <span className="text-gold-400">3.</span> Vote for your favorite sentences.
            </li>
            <li>
              <span className="text-gold-400">4.</span> Share your tales with the community!
            </li>
          </ul>
        </div>

        <div className="space-y-6">
          <p className="text-2xl">Please sign in with Google to continue</p>
          <LoginButton />
        </div>

        <div className="text-sm text-text-accent opacity-20 mt-8">
          <Link href="https://github.com/Mert18/votale">Github</Link>
        </div>
      </div>
    </div>
  );
}
