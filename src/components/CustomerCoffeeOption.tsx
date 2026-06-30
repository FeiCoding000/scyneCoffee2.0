import { Button, MenuItem, Select, TextField } from "@mui/material";
import type { SelectChangeEvent } from "@mui/material/Select";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { useState } from "react";
import type { CreateOrderItemDto } from "../schemas/dto/createOrderItemDto";

type OptionProps = {
  index: number;
  isOpen: boolean;
  handleAddOption: (option: CreateOrderItemDto) => void;
  onClose: () => void;
};

const drinkOptions = [
  "Flat White",
  "Cappucino",
  "Latte",
  "Long Black",
  "Piccolo",
  "Machiato",
  "Scyne Crema",
  "Chocolate",
  "Chai",
  "English Breakfast Tea",
  "Earl Grey",
  "Green tea",
  "Lemongrass ginger",
  "Peppermint",
];

const createDefaultOption = (index: number): CreateOrderItemDto => ({
  reference: `Option${index}`,
  title: "Flat White",
  isXHot: false,
  isIced: false,
  isDecaf: false,
  strength: 1,
  milk: "none",
  teaBags: 0,
  sugar: 0,
  sweetner: 0,
});

export default function CustomerCoffeeOption({
  isOpen,
  onClose,
  handleAddOption,
  index,
}: OptionProps) {
  const [coffeeOption, setCoffeeOption] = useState<CreateOrderItemDto>(
    createDefaultOption(index)
  );

  const handleDrinkChange = (event: SelectChangeEvent) => {
    setCoffeeOption((current) => ({ ...current, title: event.target.value }));
  };

  const handleSubmit = () => {
    handleAddOption(coffeeOption);
    setCoffeeOption(createDefaultOption(index + 1));
    onClose();
  };

  return (
    <Modal open={isOpen} onClose={onClose} closeAfterTransition>
      <Box
        sx={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "400px",
          maxHeight: "90vh",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          overflowY: "auto",
          bgcolor: "background.paper",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        Name your option for a reference:
        <TextField
          placeholder="give a name for your drink"
          value={coffeeOption.reference}
          onChange={(event) =>
            setCoffeeOption((current) => ({
              ...current,
              reference: event.target.value,
            }))
          }
        />

        Select Your Drink Type:
        <Select value={coffeeOption.title} onChange={handleDrinkChange}>
          {drinkOptions.map((drink) => (
            <MenuItem key={drink} value={drink}>
              {drink}
            </MenuItem>
          ))}
        </Select>

        <Button variant="contained" onClick={handleSubmit}>
          Add option
        </Button>
      </Box>
    </Modal>
  );
}
