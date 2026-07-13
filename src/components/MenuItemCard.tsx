import { Box, Chip, Typography } from "@mui/material";
import type { Coffee } from "../types/coffee";

export default function MenuItemCard(props: {
  coffee: Coffee;
  onSelect: (coffee: Coffee) => void;
  maxPopularity?: number;
}) {
  const { name, imageUrl, popularity, isAvailable, tags } = props.coffee;
  const maxPopularity = props.maxPopularity || 1;
  const raw = (Math.sqrt(popularity) / Math.sqrt(maxPopularity)) * 5;
  const starNumber = popularity > 0 ? Math.max(1, Math.ceil(raw)) : 0;

  return (
    <Box
      onClick={() => {
        if (isAvailable) {
          props.onSelect(props.coffee);
        } else {
          alert("This item is currently unavailable.");
        }
      }}
      sx={{
        height: "100%",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        borderRadius: "20px",
        background: "rgba(255, 255, 255, 0.08)",
        border: "1px solid rgba(255, 255, 255, 0.18)",
        boxShadow: "0 16px 40px rgba(0, 0, 0, 0.18)",
        backdropFilter: "blur(10px)",
        transition: "transform 160ms ease, border-color 160ms ease, background 160ms ease",
        opacity: isAvailable ? 1 : 0.62,
        "&:hover": {
          transform: isAvailable ? "translateY(-3px)" : "none",
          borderColor: isAvailable ? "#F2C078" : "rgba(255, 255, 255, 0.18)",
          background: isAvailable ? "rgba(255, 255, 255, 0.12)" : "rgba(255, 255, 255, 0.08)",
        },
      }}
    >
      <Box sx={{ position: "relative" }}>
        {!isAvailable && (
          <Chip
            label="Unavailable"
            size="small"
            sx={{
              position: "absolute",
              right: 10,
              top: 10,
              zIndex: 2,
              color: "white",
              backgroundColor: "rgba(0, 0, 0, 0.58)",
              border: "1px solid rgba(255,255,255,0.7)",
            }}
          />
        )}
        <Box
          component="img"
          src={imageUrl}
          alt={name}
          sx={{
            width: "100%",
            height: 190,
            display: "block",
            objectFit: "cover",
          }}
        />
      </Box>

      <Box sx={{ p: 2, display: "flex", flexDirection: "column", flex: 1 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>
          {name}
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 1,
            mb: 2,
          }}
        >
          <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.82)" }}>
            Popularity:
          </Typography>
          <Typography variant="body2" sx={{ color: "#F2C078", letterSpacing: 0.5 }}>
            {"★".repeat(starNumber) + "☆".repeat(5 - starNumber)}
          </Typography>
        </Box>

        <Box sx={{ mt: "auto", display: "flex", flexWrap: "wrap", gap: 0.75 }}>
          {tags?.slice(0, 2).map((tag, index) => (
            <Chip
              key={`${tag}-${index}`}
              label={tag}
              size="small"
              sx={{
                color: "white",
                border: "1px solid rgba(255, 255, 255, 0.65)",
                backgroundColor: "rgba(255, 255, 255, 0.08)",
              }}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
}
