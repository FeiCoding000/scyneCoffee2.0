import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Layout/Footer";
import { Button } from "@mui/material";

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div
        style={{
          minHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1 style={{ marginBottom: "20px", color: "white", padding: "10px" }}>
          Welcome, start your order now!
        </h1>
        {user ? (
          <Button variant="contained" onClick={() => navigate("/menu")}>
            Start
          </Button>
        ) : (
          <Button variant="contained" onClick={() => navigate("/login")}>
            Login
          </Button>
        )}
      </div>

      <footer
        style={{
          position: "fixed",
          bottom: "0",
          height: "50px",
          width: "100%",
        }}
      >
        <Footer />
      </footer>
    </div>
  );
}
