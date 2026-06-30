import { Box, Button, TextField, Typography } from "@mui/material";
import { useState } from "react";
import CustomerCoffeeOption from "../components/CustomerCoffeeOption";
import { useAddCustomer } from "../hooks/useAddCustomer";
import type { CreateOrderItemDto } from "../schemas/dto/createOrderItemDto";
import type { CreateCustomerDto } from "../schemas/dto/createCustomerDto";

export default function ProfilePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [options, setOptions] = useState<CreateOrderItemDto[]>([]);
  const { data, isLoading, error, addCustomerTrigger } = useAddCustomer();

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
      options: options,
    };
    await addCustomerTrigger(customer);
  };

  return (
    <div>
      <Box
        component="form"
        autoComplete="off"
        onSubmit={handleSubmit}
        style={{ width: "400px", color: "white" }}
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
        </div>

        <Typography variant="h6">Options</Typography>
        {options.map((option, optionIndex) => (
          <Typography key={`${option.reference}-${optionIndex}`}>
            {option.reference}: {option.title}
          </Typography>
        ))}

        <Button
          variant="contained"
          fullWidth
          type="button"
          onClick={() => setModalOpen(true)}
        >
          +
        </Button>

        <Button
          variant="contained"
          fullWidth
          type="submit"
          disabled={isLoading || options.length === 0}
        >
          Save customer
        </Button>

        {error ? <Typography color="error">{error.message}</Typography> : null}
        {data ? <Typography>Customer saved.</Typography> : null}

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
