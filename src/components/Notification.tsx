import type { Notification } from "../types/notification";
import { useState, useEffect } from "react";
import CloseIcon from "@mui/icons-material/Close";
import { Typography, Stack } from "@mui/material";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardActionArea from "@mui/material/CardActionArea";
import Timer from "./Timer";

export default function Notification({
  notification,
  toggleNoti,
}: {
  notification: Notification;
  toggleNoti: () => void;
}) {
  const [timesOfClicks, setTimesOfClicks] = useState(0);
  useEffect(() => {
    console.log("Times of clicks updated:", timesOfClicks);
  }, [timesOfClicks]);

  console.log(
    "Notification component rendered with notification:",
    notification.createdAt,
  );

  return (
    <Paper
      style={{
        position: "fixed",
        top: "0",
        left: "0",
        bottom: "0",
        right: "0",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 1001,
      }}
    >
      <Card
        style={{
          position: "fixed",
          top: "40%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          borderRadius: "15px"
        }}
      >
        {timesOfClicks >= 6 || notification.type !== "admin" ? (
          <CloseIcon
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              cursor: "pointer",
              zIndex: 1002,
              color: "white",
            }}
            onClick={() => {
              setTimesOfClicks(0);
              toggleNoti();
            }}
          >
            Close popup
          </CloseIcon>
        ) : null}
        <CardActionArea
          style={{
            overflow: "hidden",
            isolation: "isolate",
            position: "relative",
          }}
        >
          <CardMedia
            component="img"
            width="800"
            image="https://cdn.prod.website-files.com/6615ecd6dcd6b196af21aa2d/673d849cc11b966bd7ea66a2_Factsheet%20purple%20thumbnail.png"
            title="Notification Image"
            alt="scyne logo"
          />
          <Stack
            style={{
              position: "absolute",
              top: "20%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              gap: "10px",
              color: "white",
            }}
          >
            <Typography variant="h4">{notification.title}</Typography>
            <Typography variant="body2">
              {notification.description}
            </Typography>
          </Stack>

          <CardContent>
            <Typography
              style={{
                opacity: "0",
                position: "absolute",
                bottom: "10px",
                right: "10px",
                cursor: "pointer",
              }}
              onClick={() => setTimesOfClicks(timesOfClicks + 1)}
            >
              This text is invisible but clickable
            </Typography>
            <Typography style={{ textAlign: "center" }}>
              {notification.createdAt && notification.timer && (
                <Timer
                  createdAt={notification.createdAt.seconds * 1000}
                  duration={notification.timer}
                  message={notification.message}
                >
                </Timer>
              )}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Paper>
  );
}
