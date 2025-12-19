interface Sentence {
  id: string;
  previousSentenceId: string | null;
  votes: number;
  content: string;
  authorName?: string;
  authorId?: string;
  totalPathVotes?: number;
  childCount?: number;
}

interface User {
  id: string;
  email: string;
  name: string;
  pictureUrl: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

interface StoryStats {
  id: string;
  possibleStoryCount: number;
  calculatedAt: string | null;
}

interface SavedStory {
  id: string;
  userId: string;
  userName: string;
  sentenceIds: string[];
  firstSentenceContent: string;
  lastSentenceContent: string;
  pathLength: number;
  createdAt: string;
}