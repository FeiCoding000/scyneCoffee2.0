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
          width:"500px",
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
          <div style = {
            {
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              width: "100%"
            }
          }>
            <Button variant="contained" onClick={() => navigate("/menu")} style={{width: "100%"}}>
              Classic Order
            </Button>
            <Button variant="contained" onClick={() => navigate("/profile-order")}>Profile Order</Button>
          </div>
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
