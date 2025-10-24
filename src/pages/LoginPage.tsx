import EmailLogin from "../components/EmailLogin";
import { GoogleLogin } from "../components/GoogleLogin";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { loading, user } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return <div>Loading...</div>;
  }
  if (user) {
    navigate("/");
  }
  return (
    <div
      style={{
        width: "400px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "100px",
        gap: "20px",
        backgroundColor: "gainsboro",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <span style={{fontSize: "20px", fontFamily: "sans-serif"}}>WELCOME!</span>
      <EmailLogin />
      <GoogleLogin></GoogleLogin>
    </div>
  )
}
