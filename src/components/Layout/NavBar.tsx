import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Cart from "../Cart";
import { Box, Button } from "@mui/material";

export default function NavBar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate("/login");
  };
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const disPlayName = user?.displayName ? user.displayName : user?.email;

  return user ? (
    <div
      style={{
        height: "30px",
        display: "flex",
        justifyContent: "space-between",
        zIndex: "1000",
        padding: "10px",
      }}
    >
      <Box sx={{ textAlign: "center" }}>
        <img
          src="https://cdn.prod.website-files.com/650aedb6397a7021a593e810/672ac5664163926064db6bd7_scyne-logo.svg"
          alt="Scyne Logo"
          style={{ height: "30px", width: "auto", paddingLeft: "10px" }}
        />
      </Box>

      <div
        style={{
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          gap: "5px",
          alignItems: "center",
          paddingRight: "10px",
        }}
      >
        <span style={{ display: "inline-block" }}>
          Welcome, {disPlayName?.toUpperCase()}
        </span>
        <Cart />
        <Button
          sx={{
            backgroundColor: "#7069d5ff",
            color: "white",
            borderColor: "white",
            marginTop: "5px",
            height: "25px",
            "&:hover": {
              backgroundColor: "#01051bff",
              color: "white",
            },
          }}
          variant="outlined"
          size="small"
          color="primary"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    </div>
  ) : (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "20px",
        marginRight: "10px",
        backgroundColor: "#dbdae4ff",
        zIndex: "1000",
      }}
    >
      <Button onClick={handleNavigate}>Login</Button>
    </div>
  );
}
