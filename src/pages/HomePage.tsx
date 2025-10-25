import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Layout/Footer';

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) return null; 

  return (
    <div>
      <h1>Welcome, {user.displayName} start your order now!</h1>
      <button onClick={() => navigate('/menu')}>Start</button>
      <footer
        style={{
          marginLeft: "10%",
          height:"50px",
          width:"90%",
          border:"1px solid blue",
          marginBottom:"5px"
        }}
      >
        <Footer />
      </footer>
    </div>
  );
}
