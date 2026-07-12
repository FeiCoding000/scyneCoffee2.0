import { Autocomplete, Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import CustomerCoffeeOption from "../components/CustomerCoffeeOption";
import { useAddCustomer } from "../hooks/useAddCustomer";
import { useNavigate } from "react-router-dom";
import type { CreateOrderItemDto } from "../schemas/dto/createOrderItemDto";
import type { CreateCustomerDto } from "../schemas/dto/createCustomerDto";
import CoffeeOptionItem from "../components/CoffeeOptionItem";

export default function CreateProfilePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [options, setOptions] = useState<CreateOrderItemDto[]>([]);
  const [allergies, setAllergies] = useState<string[]>([]);
  const { data, isLoading, error, addCustomerTrigger } = useAddCustomer();
  const navigate = useNavigate();

  const handleAddOption = (option: CreateOrderItemDto) => {
    setOptions((current) => [...current, option]);
  };

  const handleClose = () => {
    setModalOpen(false);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const customer: CreateCustomerDto = {
      firstName,
      lastName,
      allergies,
      options: options,
    };
    await addCustomerTrigger(customer);
    if (!error) {
      setFirstName("");
      setLastName("");
      setOptions([]);
      setAllergies([]);
      navigate("/profile-order", { state: { data, error } });
      console.log("Customer added successfully:", data);
    }
  };

  return (
    <div>
      <Box
        component="form"
        autoComplete="off"
        onSubmit={handleSubmit}
        style={{ width: "600px" }}
      >
        <Typography variant="h6">Customer Details</Typography>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <TextField
            required
            label="First name"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
          />
          <TextField
            required
            label="Last name"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
          />
          <Autocomplete
            multiple
            freeSolo
            options={["Dairy", "Gluten", "Soy"]}
            value={allergies}
            onChange={(_, newValue) => setAllergies(newValue)}
            renderInput={(params) => (
              <TextField {...params} label="Allergies" placeholder="Enter allergies..." />
            )}
          />
        </div>

        {options.length > 0 &&
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '20px' }}>
            {options.map((option, optionIndex) => (
                <CoffeeOptionItem
                  key={`${option.reference}-${optionIndex}`}
                  option={option}
                />
            ))}
          </Box>
        }

        <Button
          variant="outlined"
          fullWidth
          type="button"
          onClick={() => setModalOpen(true)}
          sx={{ marginTop: "20px", marginBottom: "20px", borderColor: "white", color: "white" }}
        >
          +
        </Button>

        <Button
          variant="contained"
          fullWidth
          type="submit" 
          disabled={isLoading || options.length === 0}
        >
          Save
        </Button>

        <CustomerCoffeeOption
          isOpen={modalOpen}
          onClose={handleClose}
          handleAddOption={handleAddOption}
          index={options.length + 1}
        />
      </Box>
    </div>
  );
}
