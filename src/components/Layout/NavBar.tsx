import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Cart from "../Cart";
import { Box, Button, Typography } from "@mui/material";
import packageJson from "../../../package.json";

const LogoWithVersion = () => (
  <Box sx={{ position: "relative", display: "inline-block", ml: "10px", mt: "5px" }}>
    <img
      src="https://cdn.prod.website-files.com/650aedb6397a7021a593e810/672ac5664163926064db6bd7_scyne-logo.svg"
      alt="Scyne Logo"
      style={{ height: "30px", width: "auto" }}
    />
    <Typography
      component="span"
      sx={{
        position: "absolute",
        right: -22,
        bottom: -2,
        color: "rgba(255, 255, 255, 0.72)",
        fontSize: "0.52rem",
        lineHeight: 1,
      }}
    >
      v{packageJson.version}
    </Typography>
  </Box>
);

export default function NavBar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate("/login");
  };
  // const handleLogout = () => {
  //   logout();
  //   navigate("/login");
  // };

  // const disPlayName = user?.displayName ? user.displayName : user?.email;

  return user ? (
    <div className="navBar-left" 
      style={{
        height: "40px",
        display: "flex",
        justifyContent: "space-between",
        zIndex: "1000",
        width:"100%"
      }}
    >
      <Box sx={{ textAlign: "center" }}>
        <LogoWithVersion />
      </Box>

      <div className="navBar-right"
        style={{
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          gap: "5px",
          alignItems: "center",
          paddingRight: "10px",
        }}
      >
        <span>
          {/* Happy New Year! {disPlayName?.toUpperCase()} */}
        </span>
        <Button
          size="small"
          onClick={() => navigate("/")}
          sx={{
            color: "white",
            textTransform: "none",
            fontWeight: "normal",
            minWidth: "auto",
            px: 1,
            "&:hover": { backgroundColor: "rgba(255,255,255,0.12)" },
          }}
        >
          Home
        </Button>
        <Button
          size="small"
          onClick={() => navigate("/orders")}
          sx={{
            color: "white",
            textTransform: "none",
            fontWeight: "normal",
            minWidth: "auto",
            px: 1,
            "&:hover": { backgroundColor: "rgba(255,255,255,0.12)" },
          }}
        >
          Orders
        </Button>
        <Button
          size="small"
          onClick={() => navigate("/statistic")}
          sx={{
            color: "white",
            textTransform: "none",
            fontWeight: "normal",
            minWidth: "auto",
            px: 1,
            "&:hover": { backgroundColor: "rgba(255,255,255,0.12)" },
          }}
        >
          Statistic
        </Button>
        <Button
          size="small"
          onClick={() => navigate("/guess")}
          sx={{
            color: "white",
            textTransform: "none",
            fontWeight: "normal",
            minWidth: "auto",
            px: 1,
            "&:hover": { backgroundColor: "rgba(255,255,255,0.12)" },
          }}
        >
          Guess
        </Button>
        <Cart />
        {/* <Button
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
        </Button> */}

      </div>
    </div>
  ) : (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "space-between",
        padding: "20px",
        marginRight: "10px",
        backgroundColor: "rgba(219, 218, 228, 0)",
        zIndex: "1000",
      }}
    >
      <Box sx={{ textAlign: "center" }}>
        <LogoWithVersion />
      </Box>
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
          onClick={handleNavigate}
        >
          Login
        </Button>
    </div>
  );
}
