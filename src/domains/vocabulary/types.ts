export interface Word {
  id: string;
  word: string;
  meaning: string;
  partOfSpeech: string | null;
  synonyms: string[];
  example: string | null;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface WordInput {
  word: string;
  meaning: string;
  partOfSpeech?: string;
  synonyms?: string;
  example?: string;
}

export interface WordCreateRequest {
  word: string;
  meaning: string;
  partOfSpeech?: string;
  synonyms?: string;
  example?: string;
}


