export interface Word {
  id: string;
  word: string;
  meaning: string;
  partOfSpeech: string;
  synonyms: string[];
  example: string;
}

export interface WordInput {
  word: string;
  meaning: string;
  partOfSpeech: string;
  synonyms: string;
  example: string;
}

