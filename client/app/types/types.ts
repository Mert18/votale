interface Sentence {
  id: string;
  previousSentenceId: string | null;
  votes: number;
  content: string;
}