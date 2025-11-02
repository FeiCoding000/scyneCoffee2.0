import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Footer from '../components/Layout/Footer';
import { Button } from '@mui/material';

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
    <div className='home-container'>
      <div style={{ minHeight: "90vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
        <h1 style={{marginBottom:"20px", color:"white", padding:"10px"}}>Welcome, {user.displayName} start your order now!</h1>
        <Button variant='contained' onClick={() => navigate('/menu')}>Start</Button>
      </div>
      
      <footer
        style={{
          position:"fixed",
          bottom:"0",
          height:"50px",
          width:"100%"
        }}
      >
        <Footer />
      </footer>
    </div>
  );
}
