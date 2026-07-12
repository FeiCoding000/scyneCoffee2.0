import { Button, TextField, Typography, List, ListItem } from "@mui/material";
import { useEffect, useState, type ChangeEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Alert from '@mui/material/Alert';

export default function ProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { data, error } = location.state || {};
  const [showAlert, setShowAlert] = useState(true);
  const [filteredNameList, setFilteredNameList] = useState<{ name: string; id: number }[]>([]);
  const mockedList = [ { name: 'Yafei', id: 1 }, { name: 'Aorui', id: 2 }, { name: 'Muzi', id: 3 }, { name: 'Dora', id: 4 }, { name: 'Hammer', id: 5 }, { name: 'Yeye', id: 6 }, { name: 'Laoye', id: 7 }, { name: 'lAOLAO', id: 8 }];


  useEffect(() => {
    setTimeout(() => {
      setShowAlert(false);
    }, 3000);
  }, [data, error]);

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
    <div
      style={{
        width: 600,
        color: "white",
        display: "flex",
        gap:"20px",
        flexDirection: "column"
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

      
      <div style={{ display: "flex", flexDirection: "row", position:"relative"}}>
        <TextField
          fullWidth
          variant="filled"
          placeholder="Enter you name to continue..."
          color="warning"
          sx={{
            input: {color: "white"}
          }}
          onChange={handleInputChange}
         />
        {filteredNameList.length > 0 ? (
          <List style={{position: "absolute", top: "60px", left: "0", width: "100%", backgroundColor: "white", color: "black", zIndex: 1}}>
            {filteredNameList.map((customer) => (
              <ListItem key={customer.id} onClick={() => navigate("/profile/" + customer.id)}>
                {customer.name}
              </ListItem>
            ))}
          </List>
        ) : null}
      </div>
      <div style={{ display: "flex", flexDirection: "row", alignItems:"center", gap: "10px"}}>
        <Typography variant="subtitle2" >Can't find your name? </Typography>
        <Button onClick={() => navigate("/create-profile")} color="warning" > Add your profile.</Button>
      </div>
      
    </div>
  );
}
