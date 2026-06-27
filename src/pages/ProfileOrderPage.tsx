import { Button, TextField, Typography, Link } from "@mui/material";

export default function ProfileOrderPage() {
  return (
    <div
      style={{
        width: 600,
        color: "white",
        display: "flex",
        gap:"20px",
        flexDirection: "column"
      }}
    >
      <div style={{ display: "flex", flexDirection: "row" }}>
        <TextField
          fullWidth
          variant="filled"
          placeholder="Enter you name to continue..."
        />
        <Button variant="contained">Go</Button>
      </div>
      <div style={{ display: "flex", flexDirection: "row", alignItems:"center", gap: "10px"}}>
        <Typography variant="subtitle2" >Can't find your name? </Typography>
        <Link href= "/" color="warning" > Add your profile.</Link>
      </div>
    </div>
  );
}
