import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CoffeeIcon from "@mui/icons-material/Coffee";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { GuessDay, GuessLeaderboard, LeaderboardPlayer } from "../types/guess";
import {
  addGuessEntry,
  getCurrentWeekLeaderboard,
  getTodayGuess,
  settleTodayGuess,
  startTodayGuess,
} from "../services/guessService";
import {
  formatSydneyDisplayDate,
  getNextSydneyDateKey,
  getSydneyDateKey,
  getSydneyWeekKey,
  isAfterSydneySettlement,
} from "../utils/guessDate";

const medalColors = ["#FFD700", "#C0C0C0", "#CD7F32"];

const sortLeaderboard = (leaderboard: GuessLeaderboard | null): LeaderboardPlayer[] =>
  Object.values(leaderboard?.players ?? {}).sort((a, b) => b.wins - a.wins || a.name.localeCompare(b.name));

const getStatusLabel = (guess: GuessDay | null, isPastSettlement: boolean) => {
  if (!guess) return "Not started";
  if (guess.status === "settled") return "Settled";
  return isPastSettlement ? "Ready to settle" : "Open";
};

export default function GuessPage() {
  const todayDateKey = useMemo(() => getSydneyDateKey(), []);
  const [now, setNow] = useState(() => new Date());
  const isTodayPastSettlement = isAfterSydneySettlement(todayDateKey, now);
  const dateKey = isTodayPastSettlement ? getNextSydneyDateKey(todayDateKey) : todayDateKey;
  const weekKey = useMemo(() => getSydneyWeekKey(dateKey), [dateKey]);
  const [guess, setGuess] = useState<GuessDay | null>(null);
  const [leaderboard, setLeaderboard] = useState<GuessLeaderboard | null>(null);
  const [name, setName] = useState("");
  const [guessNumber, setGuessNumber] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [settling, setSettling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isPastSettlement = isAfterSydneySettlement(dateKey, now);
  const leaderboardPlayers = sortLeaderboard(leaderboard);

  const loadData = useCallback(async () => {
    setError(null);

    const todayGuess = await getTodayGuess(todayDateKey);
    if (todayGuess?.status === "open" && isAfterSydneySettlement(todayDateKey)) {
      setSettling(true);
      await settleTodayGuess(todayDateKey);
      setSettling(false);
    }

    const [activeGuess, currentLeaderboard] = await Promise.all([
      getTodayGuess(dateKey),
      getCurrentWeekLeaderboard(weekKey),
    ]);

    setGuess(activeGuess);
    setLeaderboard(currentLeaderboard);
  }, [dateKey, todayDateKey, weekKey]);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        await loadData();
      } catch (loadError) {
        console.error(loadError);
        if (isMounted) setError("Failed to load guess data.");
      } finally {
        if (isMounted) {
          setLoading(false);
          setSettling(false);
        }
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [loadData]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!guess || guess.status !== "open" || !isPastSettlement || settling) return;

    const settle = async () => {
      try {
        setSettling(true);
        const settledGuess = await settleTodayGuess(dateKey);
        const refreshedLeaderboard = await getCurrentWeekLeaderboard(weekKey);
        setGuess(settledGuess ?? guess);
        setLeaderboard(refreshedLeaderboard);
      } catch (settleError) {
        console.error(settleError);
        setError("Failed to settle today's guess.");
      } finally {
        setSettling(false);
      }
    };

    settle();
  }, [dateKey, guess, isPastSettlement, settling, weekKey]);

  const handleStartGuess = async () => {
    try {
      setSubmitting(true);
      setError(null);
      const newGuess = await startTodayGuess(dateKey);
      setGuess(newGuess);
    } catch (startError) {
      console.error(startError);
      setError("Failed to start today's guess.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitGuess = async () => {
    const trimmedName = name.trim();
    const parsedGuess = Number(guessNumber);

    if (!trimmedName) {
      setError("Please enter your name.");
      return;
    }

    if (!Number.isInteger(parsedGuess) || parsedGuess < 0) {
      setError("Please enter a valid whole number.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      await addGuessEntry(dateKey, trimmedName, parsedGuess);
      setName("");
      setGuessNumber("");
      const refreshedGuess = await getTodayGuess(dateKey);
      setGuess(refreshedGuess);
    } catch (submitError) {
      console.error(submitError);
      setError("Failed to submit your guess.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: "70vh", display: "grid", placeItems: "center" }}>
        <CircularProgress sx={{ color: "#F2C078" }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: "100%",
        display: "grid",
        gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1fr) 360px" },
        gap: 3,
        pb: 5,
      }}
    >
      <Box
        sx={{
          color: "white",
          p: { xs: 3, sm: 4 },
          borderRadius: "24px",
          background: "rgba(255, 255, 255, 0.08)",
          border: "1px solid rgba(255, 255, 255, 0.18)",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.22)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2, flexWrap: "wrap", mb: 4 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Coffee Guess
            </Typography>
            <Typography sx={{ color: "rgba(255,255,255,0.72)", mt: 0.5 }}>
              {formatSydneyDisplayDate(dateKey)} · settlement at 12:30 PM
              {isTodayPastSettlement && " · new rounds now open for tomorrow"}
            </Typography>
          </Box>
          <Chip
            label={getStatusLabel(guess, isPastSettlement)}
            sx={{
              height: 34,
              color: "#2E244D",
              backgroundColor: guess?.status === "settled" ? "#B7F7C2" : "#F2C078",
              fontWeight: 700,
            }}
          />
        </Box>

        {error && (
          <Typography sx={{ color: "#ffb4b4", mb: 2 }}>{error}</Typography>
        )}

        {!guess ? (
          <Card sx={{ borderRadius: "20px", background: "rgba(255,255,255,0.94)", color: "#2E244D" }}>
            <CardContent sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
              <Box>
                <Typography variant="h6">No guess has been started for this round.</Typography>
                <Typography sx={{ color: "rgba(46, 36, 77, 0.68)" }}>
                  Open this guessing round, then everyone can join before settlement.
                </Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<PlayArrowIcon />}
                disabled={submitting || isPastSettlement}
                onClick={handleStartGuess}
                sx={{ borderRadius: "12px", backgroundColor: "#F2C078", color: "#2E244D", "&:hover": { backgroundColor: "#FFD49A" } }}
              >
                Start round
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Stack spacing={3}>
            <Card sx={{ borderRadius: "20px", background: "rgba(255,255,255,0.94)", color: "#2E244D" }}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2, flexWrap: "wrap", mb: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Avatar sx={{ bgcolor: "#2E244D" }}>
                      <CoffeeIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="h6">Join the guess</Typography>
                      <Typography variant="body2" sx={{ color: "rgba(46,36,77,0.68)" }}>
                        Enter your name and the coffee count you think we will hit by 12:30.
                      </Typography>
                    </Box>
                  </Box>
                  {settling && <CircularProgress size={24} sx={{ color: "#F2C078" }} />}
                </Box>

                {guess.status === "open" && !isPastSettlement ? (
                  <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 160px auto" }, gap: 2 }}>
                    <TextField label="Name" value={name} onChange={(event) => setName(event.target.value)} size="small" />
                    <TextField
                      label="Guess"
                      type="number"
                      value={guessNumber}
                      onChange={(event) => setGuessNumber(event.target.value)}
                      size="small"
                      inputProps={{ min: 0, step: 1 }}
                    />
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      disabled={submitting}
                      onClick={handleSubmitGuess}
                      sx={{ borderRadius: "12px", backgroundColor: "#F2C078", color: "#2E244D", "&:hover": { backgroundColor: "#FFD49A" } }}
                    >
                      Submit
                    </Button>
                  </Box>
                ) : (
                  <Typography sx={{ color: "rgba(46,36,77,0.72)" }}>
                    Guess submissions are closed for this round.
                  </Typography>
                )}
              </CardContent>
            </Card>

            {guess.status === "settled" && (
              <Card sx={{ borderRadius: "20px", background: "rgba(255,255,255,0.94)", color: "#2E244D" }}>
                <CardContent>
                  <Typography variant="h6" sx={{ mb: 1 }}>Today's result</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                    {guess.actualCount ?? 0} coffees
                  </Typography>
                  <Divider sx={{ mb: 2 }} />
                  <Typography sx={{ fontWeight: 700, mb: 1 }}>Winner{(guess.winners?.length ?? 0) > 1 ? "s" : ""}</Typography>
                  {guess.winners?.length ? (
                    <Stack spacing={1}>
                      {guess.winners.map((winner) => (
                        <Box key={`${winner.name}-${winner.guess}`} sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                          <Typography>{winner.name}</Typography>
                          <Typography sx={{ color: "rgba(46,36,77,0.72)" }}>
                            guessed {winner.guess} · diff {winner.diff}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  ) : (
                    <Typography sx={{ color: "rgba(46,36,77,0.72)" }}>No entries for this round.</Typography>
                  )}
                </CardContent>
              </Card>
            )}

            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>Current guesses</Typography>
              <Stack spacing={1.5}>
                {guess.entries.length ? (
                  guess.entries.map((entry) => (
                    <Card key={entry.id} sx={{ borderRadius: "16px", background: "rgba(255,255,255,0.92)", color: "#2E244D" }}>
                      <CardContent sx={{ py: 1.5, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Typography sx={{ fontWeight: 600 }}>{entry.name}</Typography>
                        <Typography>{entry.guess}</Typography>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Typography sx={{ color: "rgba(255,255,255,0.72)" }}>No guesses yet.</Typography>
                )}
              </Stack>
            </Box>
          </Stack>
        )}
      </Box>

      <Box
        sx={{
          color: "white",
          p: 3,
          borderRadius: "24px",
          background: "rgba(255, 255, 255, 0.08)",
          border: "1px solid rgba(255, 255, 255, 0.18)",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.22)",
          backdropFilter: "blur(10px)",
          height: "fit-content",
          position: { lg: "sticky" },
          top: { lg: 96 },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
          <Avatar sx={{ bgcolor: "#F2C078", color: "#2E244D" }}>
            <EmojiEventsIcon />
          </Avatar>
          <Box>
            <Typography variant="h6">Leaderboard</Typography>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.72)" }}>
              This week · {weekKey}
            </Typography>
          </Box>
        </Box>

        <Stack spacing={1.5}>
          {leaderboardPlayers.length ? (
            leaderboardPlayers.slice(0, 5).map((player, index) => (
              <Card key={player.name} sx={{ borderRadius: "16px", background: "rgba(255,255,255,0.92)", color: "#2E244D" }}>
                <CardContent sx={{ py: 1.5, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Avatar
                      sx={{
                        width: 34,
                        height: 34,
                        bgcolor: index < 3 ? medalColors[index] : "#2E244D",
                        color: index < 3 ? "#2E244D" : "white",
                        fontWeight: 700,
                      }}
                    >
                      {index < 3 ? <EmojiEventsIcon fontSize="small" /> : index + 1}
                    </Avatar>
                    <Typography sx={{ fontWeight: 700 }}>{player.name}</Typography>
                  </Box>
                  <Typography sx={{ whiteSpace: "nowrap", color: "rgba(46,36,77,0.72)" }}>
                    {player.wins} win{player.wins === 1 ? "" : "s"}
                  </Typography>
                </CardContent>
              </Card>
            ))
          ) : (
            <Typography sx={{ color: "rgba(255,255,255,0.72)" }}>
              No winners this week yet.
            </Typography>
          )}
        </Stack>
      </Box>
    </Box>
  );
}
