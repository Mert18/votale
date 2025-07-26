import React, { useState } from 'react';
import Link from 'next/link';

interface Story {
  id: string;
  title: string;
  description: string;
  sentences: string[];
  lastUpdated: string;
}

const HomeContent = () => {
  // Sample stories data
  const [stories] = useState<Story[]>([
    {
      id: '1',
      title: 'The Mysterious Forest',
      description: 'A tale of adventure and discovery in an enchanted woodland.',
      sentences: [
        'Once upon a time, there was a forest that appeared only at midnight.',
        'Sarah had heard the legends but never believed them until that fateful night.',
        'The trees seemed to whisper secrets in languages she had never heard before.'
      ],
      lastUpdated: '2 hours ago'
    },
    {
      id: '2',
      title: 'Digital Dreams',
      description: 'A cyberpunk story about consciousness and reality.',
      sentences: [
        'In the year 2087, the line between dreams and digital reality had completely dissolved.',
        'Marcus jacked into the neural network one last time, knowing he might never return.'
      ],
      lastUpdated: '1 day ago'
    },
    {
      id: '3',
      title: 'The Last Library',
      description: 'A post-apocalyptic story about preserving knowledge.',
      sentences: [
        'The books were the last remnants of a civilization that once thrived.',
        'Elena carefully turned each page, knowing she was one of the few who could still read.'
      ],
      lastUpdated: '3 days ago'
    }
  ]);

  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

  return (
    <div className="bg-background-secondary min-h-screen text-text-primary font-inknut w-3/4">
      <div className="flex h-screen w-full">
        {/* Left Half - Stories List */}
        <div className="w-1/2 p-6 border-r border-brown-800">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-text-accent mb-2">Stories</h2>
            <button className="px-4 py-2 bg-interactive-gold hover:bg-interactive-gold-dark text-background-primary font-bold rounded-lg transition-colors duration-200">
              + New Story
            </button>
          </div>
          
          <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-140px)]">
            {stories.map((story) => (
              <div
                key={story.id}
                className={`p-4 bg-background-elevated hover:bg-brown-800 rounded-lg cursor-pointer transition-colors duration-200 border-l-4 ${
                  selectedStory?.id === story.id ? 'border-interactive-gold' : 'border-transparent'
                }`}
                onClick={() => setSelectedStory(story)}
              >
                <Link href={`/story/${story.id}`} className="block">
                  <h3 className="text-lg font-bold text-text-accent mb-2">{story.title}</h3>
                  <p className="text-text-secondary text-sm mb-2 line-clamp-2">{story.description}</p>
                  <div className="flex justify-between items-center text-xs text-text-muted">
                    <span>{story.sentences.length} sentences</span>
                    <span>Updated {story.lastUpdated}</span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Right Half - Two Components */}
        <div className="w-1/2 flex flex-col">
          {/* Top Component */}
          <div className="h-1/2 p-6 border-b border-brown-800">
            <div className="bg-background-elevated rounded-lg p-4 h-full">
              <h3 className="text-xl font-bold text-text-accent mb-4">Your Favorite Stories</h3>
              {selectedStory ? (
                <div className="h-full overflow-y-auto">
                  <h4 className="text-lg font-bold text-text-primary mb-2">{selectedStory.title}</h4>
                  <p className="text-text-secondary mb-4">{selectedStory.description}</p>
                  <div className="space-y-2">
                    {selectedStory.sentences.slice(0, 3).map((sentence, index) => (
                      <p key={index} className="text-text-primary text-sm p-2 bg-background-primary rounded">
                        {sentence}
                      </p>
                    ))}
                    {selectedStory.sentences.length > 3 && (
                      <p className="text-text-muted text-sm italic">
                        +{selectedStory.sentences.length - 3} more sentences...
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-text-muted">
                  Select a story to preview
                </div>
              )}
            </div>
          </div>

          {/* Bottom Component */}
          <div className="h-1/2 p-6">
            <div className="bg-background-elevated rounded-lg p-4 h-full">
              <h3 className="text-xl font-bold text-text-accent mb-4">Recent Activity</h3>
              <div className="space-y-3 overflow-y-auto h-full">
                <div className="p-3 bg-background-primary rounded">
                  <p className="text-text-primary text-sm">
                    <span className="font-bold text-interactive-gold">Alex</span> added a sentence to "The Mysterious Forest"
                  </p>
                  <p className="text-text-muted text-xs mt-1">2 hours ago</p>
                </div>
                <div className="p-3 bg-background-primary rounded">
                  <p className="text-text-primary text-sm">
                    <span className="font-bold text-interactive-gold">Maria</span> created a new story "Digital Dreams"
                  </p>
                  <p className="text-text-muted text-xs mt-1">1 day ago</p>
                </div>
                <div className="p-3 bg-background-primary rounded">
                  <p className="text-text-primary text-sm">
                    <span className="font-bold text-interactive-gold">John</span> edited "The Last Library"
                  </p>
                  <p className="text-text-muted text-xs mt-1">3 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeContent;