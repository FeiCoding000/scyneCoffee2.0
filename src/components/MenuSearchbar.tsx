import {
  Input,
  Box,
  IconButton,
} from "@mui/material";
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
        }}
      >
        <IconButton >
          <SearchIcon sx={{color:"white"}}/>
        </IconButton>

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Input
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                onSearch(e.target.value);
              }}
              sx={{ width: 200, color: "white"}}
            />

          </Box>
      </Box>
  );
}
