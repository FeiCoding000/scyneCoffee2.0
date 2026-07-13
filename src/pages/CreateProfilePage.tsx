import {
  Alert,
  Autocomplete,
  Box,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import CustomerCoffeeOption from "../components/CustomerCoffeeOption";
import { useAddCustomer } from "../hooks/useAddCustomer";
import { useNavigate } from "react-router-dom";
import type { CreateOrderItemDto } from "../schemas/dto/createOrderItemDto";
import type { CreateCustomerDto } from "../schemas/dto/createCustomerDto";
import CoffeeOptionItem from "../components/CoffeeOptionItem";

const profileTextFieldSx = {
  "& .MuiOutlinedInput-root": {
    color: "#ffffff",
    borderRadius: "12px",
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    "& fieldset": {
      borderColor: "rgba(255, 255, 255, 0.75)",
    },
    "&:hover fieldset": {
      borderColor: "#F2C078",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#F2C078",
      borderWidth: "2px",
    },
  },
  "& .MuiInputBase-input": {
    color: "#ffffff",
  },
  "& .MuiInputBase-input::placeholder": {
    color: "rgba(255, 255, 255, 0.72)",
    opacity: 1,
  },
  "& .MuiInputLabel-root": {
    color: "rgba(255, 255, 255, 0.82)",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#F2C078",
  },
  "& .MuiInputLabel-root.MuiInputLabel-shrink": {
    color: "#F2C078",
  },
  "& .MuiChip-root": {
    backgroundColor: "rgba(242, 192, 120, 0.18)",
    border: "1px solid rgba(242, 192, 120, 0.65)",
    color: "#ffffff",
  },
  "& .MuiChip-deleteIcon": {
    color: "rgba(255, 255, 255, 0.72)",
    "&:hover": {
      color: "#F2C078",
    },
  },
  "& .MuiAutocomplete-popupIndicator, & .MuiAutocomplete-clearIndicator": {
    color: "rgba(255, 255, 255, 0.75)",
  },
};

export default function CreateProfilePage() {
  const [modalOpen, setModalOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [options, setOptions] = useState<CreateOrderItemDto[]>([]);
  const [allergies, setAllergies] = useState<string[]>([]);
  const { isLoading, error, addCustomerTrigger } = useAddCustomer();
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(true);

  const handleAddOption = (option: CreateOrderItemDto) => {
    setOptions((current) => [...current, option]);
  };

  useEffect(() => {
    if (!error) return;

    setShowAlert(true);

    const timer = window.setTimeout(() => {
      setShowAlert(false);
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [error]);

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
    try {
      const savedCustomer = await addCustomerTrigger(customer);

      setFirstName("");
      setLastName("");
      setOptions([]);
      setAllergies([]);
      navigate("/profile-order", { state: { data: savedCustomer, error: null } });
      console.log("Customer added successfully:", savedCustomer);
    } catch (error) {
      console.error("Failed to add customer:", error);
    }
  };

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
      {error && showAlert && (
        <Alert severity="error" sx={{ mb: 2, width: "min(600px, 100%)", position: "absolute", top: "50px", left: "50%", transform: "translateX(-50%)" }}>
          {error.message}
        </Alert>
      )}
      <Box
        component="form"
        autoComplete="off"
        onSubmit={handleSubmit}
        sx={{
          width: "min(600px, 100%)",
          color: "white",
          p: { xs: 3, sm: 4 },
          borderRadius: "24px",
          background: "rgba(255, 255, 255, 0.08)",
          border: "1px solid rgba(255, 255, 255, 0.18)",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.22)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Typography variant="h5" sx={{ mb: 3, fontWeight: 700 }}>
          Customer Details
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <TextField
            required
            label="First name"
            placeholder="Enter first name"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
            sx={profileTextFieldSx}
          />
          <TextField
            required
            label="Last name"
            placeholder="Enter last name"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
            sx={profileTextFieldSx}
          />
          <Autocomplete
            multiple
            freeSolo
            options={["Dairy", "Gluten", "Soy"]}
            value={allergies}
            onChange={(_, newValue) => setAllergies(newValue)}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Allergies"
                placeholder="Enter allergies..."
                sx={profileTextFieldSx}
              />
            )}
          />
        </Box>

        {options.length > 0 && (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              marginTop: "20px",
            }}
          >
            {options.map((option, optionIndex) => (
              <CoffeeOptionItem
                key={`${option.reference}-${optionIndex}`}
                option={option}
              />
            ))}
          </Box>
        )}

        <Button
          variant="outlined"
          fullWidth
          type="button"
          onClick={() => setModalOpen(true)}
          sx={{
            mt: 3,
            mb: 2,
            height: 48,
            borderRadius: "12px",
            borderColor: "rgba(255, 255, 255, 0.75)",
            color: "white",
            fontSize: "22px",
            "&:hover": {
              borderColor: "#F2C078",
              backgroundColor: "rgba(242, 192, 120, 0.08)",
            },
          }}
        >
          +
        </Button>

        <Button
          variant="contained"
          fullWidth
          type="submit"
          disabled={isLoading || options.length === 0}
          sx={{
            height: 48,
            borderRadius: "12px",
            backgroundColor: "#F2C078",
            color: "#2E244D",
            fontWeight: 700,
            "&:hover": {
              backgroundColor: "#FFD49A",
            },
            "&.Mui-disabled": {
              backgroundColor: "rgba(255, 255, 255, 0.18)",
              color: "rgba(255, 255, 255, 0.45)",
            },
          }}
        >
          {isLoading ? "Saving..." : "Save"}
        </Button>

        <CustomerCoffeeOption
          isOpen={modalOpen}
          onClose={handleClose}
          handleAddOption={handleAddOption}
          index={options.length + 1}
        />
      </Box>
    </Box>
  );
}
