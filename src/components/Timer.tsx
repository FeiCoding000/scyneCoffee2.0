import { useState, useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
export default function Timer({
  createdAt,
  duration,
    message,
}: {
  createdAt: number;
  duration: number;
  message?: string;
}) {
  const [time, setTime] = useState(() => {
    const elapsed = Math.floor((Date.now() - createdAt) / 1000);
    console.log(Date.now(), createdAt);
    return Math.max(duration - elapsed, 0);
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - createdAt) / 1000);
      const remaining = Math.max(duration - elapsed, 0);

      setTime(remaining);
      console.log("Timer updated:", remaining, "seconds remaining");

      if (remaining <= 0) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [createdAt, duration]);

    const percent = ((duration - time) / duration) * 100;
    const getColor = () => {
    if (percent > 50) return "#1976d2"; 
    if (percent > 20) return "#ed6c02"; 
    return "#d32f2f"; 
  };

  return (
    
  <Box position="relative" display="inline-flex">
    <CircularProgress
        variant="determinate"
        value={100}
        size={240}
        thickness={5}
        sx={{
          color: "#e0e0e0",
          position: "absolute",
        }}
      />

      <CircularProgress
        variant="determinate"
        value={percent}
        size={240}
        thickness={5}
        sx={{
          color: getColor(),
          transition: "color 0.5s ease, stroke-dashoffset 1s linear",
        }}
      />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection={'column'}
      >
        <Typography>
            {message}
        </Typography>
        <Typography variant="h2">
          {time}s
        </Typography>
      </Box>
    </Box>

  ) 
  
}