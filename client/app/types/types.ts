interface Sentence {
  id: string;
  previousSentenceId: string | null;
  votes: number;
  content: string;
  authorName?: string;
  authorId?: string;
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