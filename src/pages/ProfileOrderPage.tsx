import { Box, Button, TextField, Typography, List, ListItem } from "@mui/material";
import { useEffect, useState, type ChangeEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Alert from '@mui/material/Alert';

const profileOrderTextFieldSx = {
  "& .MuiFilledInput-root": {
    color: "#ffffff",
    borderRadius: "12px",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    border: "1px solid rgba(255, 255, 255, 0.65)",
    overflow: "hidden",
    "&:before, &:after": {
      display: "none",
    },
    "&:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.12)",
      borderColor: "#F2C078",
    },
    "&.Mui-focused": {
      backgroundColor: "rgba(255, 255, 255, 0.12)",
      borderColor: "#F2C078",
      boxShadow: "0 0 0 1px #F2C078",
    },
  },
  "& .MuiInputBase-input": {
    color: "#ffffff",
    px: 2,
    py: 1.6,
  },
  "& .MuiInputBase-input::placeholder": {
    color: "rgba(255, 255, 255, 0.72)",
    opacity: 1,
  },
};

export default function ProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { data, error } = location.state || {};
  const [showAlert, setShowAlert] = useState(true);
  const [filteredNameList, setFilteredNameList] = useState<{ name: string; id: number }[]>([]);
  const mockedList = [ { name: 'Yafei', id: 1 }, { name: 'Aorui', id: 2 }, { name: 'Muzi', id: 3 }, { name: 'Dora', id: 4 }, { name: 'Hammer', id: 5 }, { name: 'Yeye', id: 6 }, { name: 'Laoye', id: 7 }, { name: 'lAOLAO', id: 8 }];


  useEffect(() => {
    if (!data && !error) return;

    setShowAlert(true);

    const timer = window.setTimeout(() => {
      setShowAlert(false);
      navigate(".", { replace: true, state: null });
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [data, error, navigate]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value.toLowerCase();
    if(!value){
      setFilteredNameList([]);
      return;
    } 
    const filteredList = mockedList.filter((item) => item.name.toLowerCase().includes(value));
    setFilteredNameList(filteredList);
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        py: 4,
      }}
    >
           {showAlert && data && !error && (
        <Alert severity="success" sx= { {position: "absolute", top: "50px", left: "50%", transform: "translateX(-50%)"} }>Customer added successfully!</Alert>
      )}
      {showAlert && error && (
        <Alert severity="error" sx= { {position: "absolute", top: "50px", left: "50%", transform: "translateX(-50%)"} }>
          {error.message}
        </Alert>
      )}
      <Box
        sx={{
          width: "min(600px, 100%)",
          color: "white",
          display: "flex",
          gap: "20px",
          flexDirection: "column",
          p: { xs: 3, sm: 4 },
          borderRadius: "24px",
          background: "rgba(255, 255, 255, 0.08)",
          border: "1px solid rgba(255, 255, 255, 0.18)",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.22)",
          backdropFilter: "blur(10px)",
        }}
      >

      <Typography variant="h5" sx={{ fontWeight: 700 }}>
        Find Your Profile
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "row", position:"relative"}}>
        <TextField
          fullWidth
          variant="filled"
          placeholder="Enter you name to continue..."
          color="warning"
          sx={profileOrderTextFieldSx}
          onChange={handleInputChange}
         />
        {filteredNameList.length > 0 ? (
          <List
            sx={{
              position: "absolute",
              top: "60px",
              left: 0,
              width: "100%",
              backgroundColor: "rgba(255, 255, 255, 0.96)",
              color: "#2E244D",
              zIndex: 1,
              borderRadius: "12px",
              boxShadow: "0 12px 30px rgba(0, 0, 0, 0.2)",
              overflow: "hidden",
              py: 0.5,
            }}
          >
            {filteredNameList.map((customer) => (
              <ListItem
                key={customer.id}
                onClick={() => navigate("/profile/" + customer.id)}
                sx={{
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "rgba(242, 192, 120, 0.24)",
                  },
                }}
              >
                {customer.name}
              </ListItem>
            ))}
          </List>
        ) : null}
      </Box>
      <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "flex-start", sm: "center" }, gap: "10px"}}>
        <Typography variant="subtitle2" sx={{ color: "rgba(255, 255, 255, 0.82)" }}>
          Can't find your name?
        </Typography>
        <Button
          onClick={() => navigate("/create-profile")}
          sx={{
            color: "#F2C078",
            fontWeight: 700,
            textTransform: "none",
            px: 0,
            "&:hover": {
              backgroundColor: "transparent",
              color: "#FFD49A",
              textDecoration: "underline",
            },
          }}
        >
          Add your profile.
        </Button>
      </Box>
      </Box>
    </Box>
  );
}
