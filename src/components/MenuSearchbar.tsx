import { Input, Box, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";

type PropType = {
  onSearch: (input: string) => void;
};

export default function MenuSearchbar({ onSearch }: PropType) {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        position: "relative",
        height: "30px",
      }}
    >
      <IconButton>
        <SearchIcon sx={{ color: "white",  cursor: "auto"}} />
      </IconButton>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Input
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            onSearch(e.target.value);
          }}
          sx={{
            width: 200,
            color: "white",
            "& .MuiInput-underline:before": {
              borderBottomColor: "white", 
            },
            "& .MuiInput-underline:hover:before": {
              borderBottomColor: "blue", 
            },
            "& .MuiInput-underline:after": {
              borderBottomColor: "green", 
            },
          }}
        />
      </Box>
    </Box>
  );
}
