import {
  Timestamp,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  runTransaction,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "./firebase";
import type { GuessDay, GuessEntry, GuessLeaderboard, GuessWinner } from "../types/guess";
import type { Order } from "../types/order";
import {
  getSydneyBoundaryDate,
  getSydneyDateKey,
  getSydneySettlementDate,
  getSydneyWeekKey,
} from "../utils/guessDate";

const GUESSES_COLLECTION = "coffeeGuesses";
const LEADERBOARDS_COLLECTION = "guessLeaderboards";

const createEntryId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const getGuessRef = (dateKey: string) => doc(db, GUESSES_COLLECTION, dateKey);
const getLeaderboardRef = (weekKey: string) => doc(db, LEADERBOARDS_COLLECTION, weekKey);

export const getTodayGuess = async (dateKey = getSydneyDateKey()) => {
  const snapshot = await getDoc(getGuessRef(dateKey));
  return snapshot.exists() ? (snapshot.data() as GuessDay) : null;
};

export const startTodayGuess = async (dateKey = getSydneyDateKey()) => {
  const weekKey = getSydneyWeekKey(dateKey);
  const guess: GuessDay = {
    dateKey,
    weekKey,
    status: "open",
    openedAt: Timestamp.now(),
    entries: [],
  };

  await setDoc(getGuessRef(dateKey), guess);
  return guess;
};

export const addGuessEntry = async (dateKey: string, name: string, guess: number) => {
  const entry: GuessEntry = {
    id: createEntryId(),
    name: name.trim(),
    guess,
    createdAt: Timestamp.now(),
  };

  await updateDoc(getGuessRef(dateKey), {
    entries: arrayUnion(entry),
  });

  return entry;
};

export const getCurrentWeekLeaderboard = async (weekKey = getSydneyWeekKey()) => {
  const snapshot = await getDoc(getLeaderboardRef(weekKey));
  return snapshot.exists()
    ? (snapshot.data() as GuessLeaderboard)
    : ({ weekKey, players: {} } satisfies GuessLeaderboard);
};

export const getCoffeeCountUntilSettlement = async (dateKey: string) => {
  const start = Timestamp.fromDate(getSydneyBoundaryDate(dateKey, 0, 0));
  const end = Timestamp.fromDate(getSydneySettlementDate(dateKey));

  const ordersQuery = query(
    collection(db, "orders"),
    where("createdAt", ">=", start),
    where("createdAt", "<=", end)
  );

  const snapshot = await getDocs(ordersQuery);

  return snapshot.docs.reduce((total, orderDoc) => {
    const order = orderDoc.data() as Order;
    return total + order.items.reduce((sum, item) => sum + (item.quantity ?? 1), 0);
  }, 0);
};

const getWinners = (entries: GuessEntry[], actualCount: number): GuessWinner[] => {
  if (entries.length === 0) return [];

  const minDiff = Math.min(...entries.map((entry) => Math.abs(entry.guess - actualCount)));

  return entries
    .filter((entry) => Math.abs(entry.guess - actualCount) === minDiff)
    .map((entry) => ({
      name: entry.name,
      guess: entry.guess,
      diff: minDiff,
    }));
};

export const settleTodayGuess = async (dateKey = getSydneyDateKey()) => {
  const actualCount = await getCoffeeCountUntilSettlement(dateKey);
  const guessRef = getGuessRef(dateKey);

  return runTransaction(db, async (transaction) => {
    const guessSnapshot = await transaction.get(guessRef);

    if (!guessSnapshot.exists()) return null;

    const guess = guessSnapshot.data() as GuessDay;
    if (guess.status === "settled") return guess;

    const winners = getWinners(guess.entries ?? [], actualCount);
    const settledGuess: GuessDay = {
      ...guess,
      status: "settled",
      settledAt: Timestamp.now(),
      actualCount,
      winners,
    };

    const leaderboardRef = getLeaderboardRef(guess.weekKey);
    const leaderboardSnapshot = winners.length > 0
      ? await transaction.get(leaderboardRef)
      : null;

    transaction.update(guessRef, {
      status: "settled",
      settledAt: serverTimestamp(),
      actualCount,
      winners,
    });

    if (winners.length > 0 && leaderboardSnapshot) {
      const leaderboard = leaderboardSnapshot.exists()
        ? (leaderboardSnapshot.data() as GuessLeaderboard)
        : ({ weekKey: guess.weekKey, players: {} } satisfies GuessLeaderboard);

      const players = { ...leaderboard.players };
      winners.forEach((winner) => {
        const currentWins = players[winner.name]?.wins ?? 0;
        players[winner.name] = {
          name: winner.name,
          wins: currentWins + 1,
        };
      });

      transaction.set(
        leaderboardRef,
        {
          weekKey: guess.weekKey,
          players,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    }

    return settledGuess;
  });
};
