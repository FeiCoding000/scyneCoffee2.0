import type { Timestamp } from "firebase/firestore";

export type GuessStatus = "open" | "settled";

export type GuessEntry = {
  id: string;
  name: string;
  guess: number;
  createdAt: Timestamp;
};

export type GuessWinner = {
  name: string;
  guess: number;
  diff: number;
};

export type GuessDay = {
  dateKey: string;
  weekKey: string;
  status: GuessStatus;
  openedAt: Timestamp;
  settledAt?: Timestamp;
  actualCount?: number;
  entries: GuessEntry[];
  winners?: GuessWinner[];
};

export type LeaderboardPlayer = {
  name: string;
  wins: number;
};

export type GuessLeaderboard = {
  weekKey: string;
  players: Record<string, LeaderboardPlayer>;
  updatedAt?: Timestamp;
};
