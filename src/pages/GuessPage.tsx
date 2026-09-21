import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  ClickAwayListener,
  Divider,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CoffeeIcon from "@mui/icons-material/Coffee";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
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
  isAfterSydneyJoinCutoff,
  isAfterSydneySettlement,
} from "../utils/guessDate";

const medalColors = ["#FFD700", "#C0C0C0", "#CD7F32"];

const getPlayerTotalDiff = (player: LeaderboardPlayer) => player.points ?? 0;
const getPlayerRounds = (player: LeaderboardPlayer) => player.rounds ?? 0;
const weeklyRoundCount = 5;
const absencePenaltyPerRound = 1;

const getPlayerAverageDiff = (player: LeaderboardPlayer) => {
  const rounds = getPlayerRounds(player);
  return rounds > 0 ? getPlayerTotalDiff(player) / rounds : Number.MAX_SAFE_INTEGER;
};
const getSettledRoundCount = (leaderboard: GuessLeaderboard | null) =>
  leaderboard?.settledRounds
  ?? Math.min(
    weeklyRoundCount,
    Math.max(0, ...Object.values(leaderboard?.players ?? {}).map(getPlayerRounds))
  );
const getPlayerAbsencePenalty = (player: LeaderboardPlayer, leaderboard: GuessLeaderboard | null) =>
  Math.max(0, getSettledRoundCount(leaderboard) - getPlayerRounds(player)) * absencePenaltyPerRound;
const getPlayerScore = (player: LeaderboardPlayer, leaderboard: GuessLeaderboard | null) =>
  Math.max(0, 100 - getPlayerAverageDiff(player) - getPlayerAbsencePenalty(player, leaderboard));

const sortLeaderboard = (leaderboard: GuessLeaderboard | null): LeaderboardPlayer[] =>
  Object.values(leaderboard?.players ?? {}).sort(
    (a, b) =>
      getPlayerScore(b, leaderboard) - getPlayerScore(a, leaderboard) ||
      (b.wins ?? 0) - (a.wins ?? 0) ||
      getPlayerRounds(b) - getPlayerRounds(a) ||
      a.name.localeCompare(b.name)
  );

const getStatusLabel = (guess: GuessDay | null, isPastSettlement: boolean, isPastJoinCutoff: boolean) => {
  if (!guess) return "Not started";
  if (guess.status === "settled") return "Settled";
  if (isPastSettlement) return "Ready to settle";
  return isPastJoinCutoff ? "Join closed" : "Open";
};

const getEntryGuessDisplay = (guessValue: number, shouldHide: boolean) =>
  shouldHide ? String(guessValue).replace(/\d/g, "●") : guessValue;

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
  const [isScoreInfoOpen, setIsScoreInfoOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isPastSettlement = isAfterSydneySettlement(dateKey, now);
  const isPastJoinCutoff = isAfterSydneyJoinCutoff(dateKey, now);
  const canJoinGuess = Boolean(guess && guess.status === "open" && !isPastJoinCutoff);
  const shouldHideEntryGuesses = !isPastJoinCutoff && guess?.status !== "settled";
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
    if (isAfterSydneyJoinCutoff(dateKey)) {
      setError("Guess rounds cannot be started after 10:00 AM Sydney time.");
      return;
    }

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

    if (isAfterSydneyJoinCutoff(dateKey)) {
      setError("Guess submissions close at 10:00 AM Sydney time. You can no longer join this round.");
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
        minHeight: "calc(100vh - 96px)",
        display: "grid",
        gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1fr) 300px" },
        "@media (min-width: 768px)": {
          gridTemplateColumns: "minmax(0, 1fr) 260px",
        },
        "@media (min-width: 1200px)": {
          gridTemplateColumns: "minmax(0, 1fr) 300px",
        },
        gap: { xs: 3, md: 0 },
        color: "white",
        p: { xs: 3, sm: 4 },
        borderRadius: "24px",
        background: "rgba(255, 255, 255, 0.08)",
        border: "1px solid rgba(255, 255, 255, 0.18)",
        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.22)",
        backdropFilter: "blur(10px)",
        mb: 5,
      }}
    >
      <Box
        sx={{
          minWidth: 0,
          "@media (min-width: 768px)": {
            pr: 3,
          },
          "@media (min-width: 1200px)": {
            pr: 4,
          },
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
            label={getStatusLabel(guess, isPastSettlement, isPastJoinCutoff)}
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
                  Open this guessing round, then everyone can join before 10:00 AM Sydney time.
                </Typography>
                {isPastJoinCutoff && (
                  <Typography sx={{ color: "rgba(46, 36, 77, 0.68)", mt: 0.75 }}>
                    It is after 10:00 AM, so joining is closed for this round.
                  </Typography>
                )}
              </Box>
              <Button
                variant="contained"
                startIcon={<PlayArrowIcon />}
                disabled={submitting || isPastJoinCutoff}
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
                        Enter your name and the coffee count you think we will hit by 12:30. Entries close at 10:00 AM Sydney time.
                      </Typography>
                    </Box>
                  </Box>
                  {settling && <CircularProgress size={24} sx={{ color: "#F2C078" }} />}
                </Box>

                {canJoinGuess ? (
                  <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr auto" }, gap: 2 }}>
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
                    Guess submissions are closed after 10:00 AM Sydney time. You can no longer join this round.
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
                      <CardContent sx={{ py: 1.5, display: "flex", alignItems: "center", justifyContent: "space-between", "&:last-child": { pb: 1.5 } }}>
                        <Typography sx={{ fontWeight: 600, lineHeight: 1 }}>{entry.name}</Typography>
                        <Typography sx={{ lineHeight: 1 }}>{getEntryGuessDisplay(entry.guess, shouldHideEntryGuesses)}</Typography>
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
          alignSelf: "stretch",
          pt: 3,
          borderTop: "1px solid rgba(255, 255, 255, 0.16)",
          "@media (min-width: 768px)": {
            pt: 0,
            pl: 3,
            borderTop: "none",
            borderLeft: "1px solid rgba(255, 255, 255, 0.16)",
          },
          "@media (min-width: 1200px)": {
            pl: 4,
          },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
          <Avatar sx={{ bgcolor: "#F2C078", color: "#2E244D" }}>
            <EmojiEventsIcon />
          </Avatar>
          <Box>
            <Typography variant="h6">Leaderboard</Typography>
            <Typography
              variant="body2"
              sx={{ color: "rgba(255,255,255,0.72)", display: "flex", alignItems: "center", gap: 0.5 }}
            >
              This week · {weekKey}
              <ClickAwayListener onClickAway={() => setIsScoreInfoOpen(false)}>
                <Tooltip
                  arrow
                  open={isScoreInfoOpen}
                  onOpen={() => setIsScoreInfoOpen(true)}
                  onClose={() => setIsScoreInfoOpen(false)}
                  enterTouchDelay={0}
                  leaveTouchDelay={5000}
                  title="Score = 100 - average difference - missed settled rounds. Missed future weekdays are not counted."
                  slotProps={{
                    tooltip: {
                      sx: {
                        bgcolor: "white",
                        color: "#2E244D",
                        fontSize: "0.78rem",
                        boxShadow: "0 10px 28px rgba(0, 0, 0, 0.24)",
                      },
                    },
                    arrow: {
                      sx: {
                        color: "white",
                      },
                    },
                  }}
                >
                  <IconButton
                    aria-label="How leaderboard score is calculated"
                    size="small"
                    onClick={() => setIsScoreInfoOpen((isOpen) => !isOpen)}
                    sx={{
                      width: 32,
                      height: 32,
                      ml: 0.25,
                      color: "rgba(255,255,255,0.72)",
                      "&:hover": {
                        color: "#F2C078",
                        backgroundColor: "rgba(242, 192, 120, 0.12)",
                      },
                    }}
                  >
                    <InfoOutlinedIcon
                      sx={{
                        fontSize: 18,
                        transition: "transform 160ms ease",
                        transform: isScoreInfoOpen ? "scale(1.12)" : "scale(1)",
                      }}
                    />
                  </IconButton>
                </Tooltip>
              </ClickAwayListener>
            </Typography>
          </Box>
        </Box>

        <Stack
          spacing={0}
          sx={{
            borderTop: "1px solid rgba(255,255,255,0.14)",
            borderBottom: leaderboardPlayers.length ? "1px solid rgba(255,255,255,0.14)" : "none",
          }}
        >
          {leaderboardPlayers.length ? (
            leaderboardPlayers.slice(0, 5).map((player, index) => (
              <Box
                key={player.name}
                sx={{
                  py: 1.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                  borderBottom: index < Math.min(leaderboardPlayers.length, 5) - 1
                    ? "1px solid rgba(255,255,255,0.12)"
                    : "none",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>
                  <Avatar
                    sx={{
                      width: 34,
                      height: 34,
                      bgcolor: index < 3 ? medalColors[index] : "rgba(255,255,255,0.16)",
                      color: index < 3 ? "#2E244D" : "white",
                      fontWeight: 700,
                    }}
                  >
                    {index < 3 ? <EmojiEventsIcon fontSize="small" /> : index + 1}
                  </Avatar>
                  <Typography sx={{ fontWeight: 700, lineHeight: 1.2, overflow: "hidden", textOverflow: "ellipsis" }}>
                    {player.name}
                  </Typography>
                </Box>
                <Typography sx={{ whiteSpace: "nowrap", color: "rgba(255,255,255,0.72)", lineHeight: 1 }}>
                  {getPlayerScore(player, leaderboard).toFixed(1)} pts
                </Typography>
              </Box>
            ))
          ) : (
            <Typography sx={{ color: "rgba(255,255,255,0.72)", py: 1.5 }}>
              No players this week yet.
            </Typography>
          )}
        </Stack>
      </Box>
    </Box>
  );
}
