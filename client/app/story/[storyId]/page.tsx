"use client"
import Link from "next/link";
import React from "react";

interface IStory {
  params: Promise<{
    storyId: string;
  }>;
}

export default function Story({ params }: IStory) {
  const { storyId } = React.use(params);

  return (
    <div className="bg-background-elevated min-h-screen p-6 text-text-primary font-inknut flex flex-col items-center">
      <h1 className="text-2xl font-bold text-text-primary">Story Page</h1>
      <p className="text-base text-text-secondary">
        This is the story page where you can read and contribute to stories.
      </p>
      <h1>{storyId}</h1>
      <Link
        href="/"
        className="mt-4 px-6 py-2 bg-interactive-gold hover:bg-interactive-gold-dark text-background-primary font-bold rounded-lg transition-colors duration-200"
      >
        Back to Home
      </Link>
    </div>
  );
}