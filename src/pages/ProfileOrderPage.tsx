import { Button, TextField } from "@mui/material";

export default function ProfileOrderPage() {
  return (
    <div
      style={{
        width: 800,
      }}
    >
      <div style={{ display: "flex", flexDirection: "row"}}>
        <TextField
          fullWidth
          variant="filled"
          placeholder="Enter you name to continue..."
        />
        <Button variant="contained">Go</Button>
      </div>
    </div>
  );
}
