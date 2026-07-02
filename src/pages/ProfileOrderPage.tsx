import { Button, TextField, Typography, List, ListItem } from "@mui/material";
import { useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";

export default function ProfileOrderPage() {
  const navgate = useNavigate();
  const [filteredNameList, setFilteredNameList] = useState<string[]>([]);
  const mockedList = ['Yafei','Aorui','Muzi','Dora','Hammer','Yeye','Laoye','lAOLAO' ];

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const value = e.target.value.toLowerCase();
    if(!value){
      setFilteredNameList([]);
      return;
    } 
    const filteredList = mockedList.filter((item) => item.toLowerCase().includes(value));
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
          <List style={{position: "absolute", top: "60px", left: "0", width: "100%", backgroundColor: "white", color: "black"}}>
            {filteredNameList.map((name) => (
              <ListItem key={name}>{name}</ListItem>
            ))}
          </List>
        ) : null}
        <Button variant="contained">Go</Button>
      </div>
      <div style={{ display: "flex", flexDirection: "row", alignItems:"center", gap: "10px"}}>
        <Typography variant="subtitle2" >Can't find your name? </Typography>
        <Button onClick={() => navgate("/profile")} color="warning" > Add your profile.</Button>
      </div>
    </div>
  );
}
