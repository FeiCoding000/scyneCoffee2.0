import { Box, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";

type PropType = {
  onSearch: (input: string) => void;
};

export default function MenuSearchbar({ onSearch }: PropType) {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <Box sx={{ position: "relative", width: { xs: "100%", sm: 280 } }}>
      <SearchIcon
        sx={{
          position: "absolute",
          left: 14,
          top: "50%",
          transform: "translateY(-50%)",
          color: "rgba(255, 255, 255, 0.78)",
          zIndex: 1,
        }}
      />
      <TextField
        fullWidth
        variant="filled"
        placeholder="Search menu..."
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          onSearch(e.target.value);
        }}
        sx={{
          "& .MuiFilledInput-root": {
            color: "#ffffff",
            borderRadius: "12px",
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            border: "1px solid rgba(255, 255, 255, 0.65)",
            overflow: "hidden",
            "&:before, &:after": { display: "none" },
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.12)",
              borderColor: "#F2C078",
            },
            "&.Mui-focused": {
              backgroundColor: "rgba(255, 255, 255, 0.12)",
              borderColor: "#F2C078",
              boxShadow: "0 0 0 1px #F2C078",
            },
          },
          "& .MuiInputBase-input": {
            color: "#ffffff",
            pl: 5,
            pr: 2,
            py: 1.6,
          },
          "& .MuiInputBase-input::placeholder": {
            color: "rgba(255, 255, 255, 0.72)",
            opacity: 1,
          },
        }}
      />
    </Box>
  );
}
