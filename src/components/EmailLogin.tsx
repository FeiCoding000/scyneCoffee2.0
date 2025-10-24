import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function EmailLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, emailLogin } = useAuth();

  return user ? (
    <div></div>
  ) : (
    <form
      action=""
      onSubmit={() => emailLogin(email, password)}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",      
        marginBottom: "16px",
        alignItems: "center",
      }}
    >
      <div>
        <input
          style={{ width: "300px", 
                  height: "40px",
                  border:"none",
                  borderRadius: "4px",
                  padding: "0 10px",
                  marginTop:"10px"
          }}
          type="email"
          value={email}
          placeholder="email"
          
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <input
          style={{ width: "300px", 
                  height: "40px",
                  border:"none",
                  borderRadius: "4px",
                  padding: "0 10px"
          }}         
          type="password"
          value={password}
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit" style={{ width: "180px", 
                  height: "40px",
                  border:"none",
                  borderRadius: "20px",
                  padding: "0 10px",
                  color: "white",
                  backgroundColor: "purple",
          }}  >
        Login
      </button>
    </form>
  );
}
