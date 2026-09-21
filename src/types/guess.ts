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
  /** Total absolute difference for the week. Final score is 100 - points / rounds - missed settled round penalty. */
  points: number;
  /** Number of settled rounds played this week. */
  rounds: number;
  /** Kept for backwards compatibility / tie-breaks. */
  wins?: number;
};

export type GuessLeaderboard = {
  weekKey: string;
  /** Number of settled guess days this week; used to penalize only rounds already missed, not future weekdays. */
  settledRounds?: number;
  players: Record<string, LeaderboardPlayer>;
  updatedAt?: Timestamp;
};
