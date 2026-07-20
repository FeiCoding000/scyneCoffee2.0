import { Box, Button, TextField, Typography, List, ListItem } from "@mui/material";
import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Alert from '@mui/material/Alert';
import { getAllCustomersFromFirestore } from "../services/customerService";
import type { CustomerEntity } from "../schemas/entity/customerEntity";

const CUSTOMER_CACHE_KEY = "scyneCoffee.customers";
const CUSTOMER_PROFILE_CACHE_KEY = "scyneCoffee.customerCache";

const getCustomerName = (customer: CustomerEntity) =>
  `${customer.firstName} ${customer.lastName}`.trim();

const readCachedCustomers = (): CustomerEntity[] => {
  try {
    const cachedCustomers = window.localStorage.getItem(CUSTOMER_CACHE_KEY);
    return cachedCustomers ? JSON.parse(cachedCustomers) : [];
  } catch {
    return [];
  }
};

const writeCachedCustomers = (customers: CustomerEntity[]) => {
  window.localStorage.setItem(CUSTOMER_CACHE_KEY, JSON.stringify(customers));
};

const writeCachedCustomerProfile = (customer: CustomerEntity) => {
  if (!customer.id) return;

  try {
    const cachedProfiles = window.localStorage.getItem(CUSTOMER_PROFILE_CACHE_KEY);
    const profileCache = cachedProfiles
      ? (JSON.parse(cachedProfiles) as Record<string, CustomerEntity>)
      : {};

    window.localStorage.setItem(
      CUSTOMER_PROFILE_CACHE_KEY,
      JSON.stringify({
        ...profileCache,
        [customer.id]: customer,
      })
    );
  } catch {
    window.localStorage.setItem(
      CUSTOMER_PROFILE_CACHE_KEY,
      JSON.stringify({ [customer.id]: customer })
    );
  }
};

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
  const createdCustomer = data as CustomerEntity | undefined;
  const [showAlert, setShowAlert] = useState(true);
  const [customers, setCustomers] = useState<CustomerEntity[]>(readCachedCustomers);
  const [searchValue, setSearchValue] = useState("");

  const sortedCustomers = useMemo(
    () =>
      [...customers].sort((a, b) =>
        getCustomerName(a).localeCompare(getCustomerName(b))
      ),
    [customers]
  );

  const filteredNameList = useMemo(() => {
    const value = searchValue.trim().toLowerCase();

    if (!value) return [];

    return sortedCustomers.filter((customer) =>
      getCustomerName(customer).toLowerCase().includes(value)
    );
  }, [sortedCustomers, searchValue]);


  useEffect(() => {
    if (customers.length > 0) return;

    let isMounted = true;

    const loadCustomers = async () => {
      const result = await getAllCustomersFromFirestore();

      if (!isMounted || !result.ok) return;

      setCustomers(result.data);
      writeCachedCustomers(result.data);
      result.data.forEach(writeCachedCustomerProfile);
    };

    loadCustomers();

    return () => {
      isMounted = false;
    };
  }, [customers.length]);

  useEffect(() => {
    if (!createdCustomer?.id) return;

    let isMounted = true;

    const refreshCustomersAfterCreate = async () => {
      const result = await getAllCustomersFromFirestore();

      if (!isMounted) return;

      if (result.ok) {
        setCustomers(result.data);
        writeCachedCustomers(result.data);
        result.data.forEach(writeCachedCustomerProfile);
        return;
      }

      setCustomers((currentCustomers) => {
        const nextCustomers = [
          createdCustomer,
          ...currentCustomers.filter(
            (customer) => customer.id !== createdCustomer.id
          ),
        ];
        writeCachedCustomers(nextCustomers);
        writeCachedCustomerProfile(createdCustomer);
        return nextCustomers;
      });
    };

    refreshCustomersAfterCreate();

    return () => {
      isMounted = false;
    };
  }, [createdCustomer]);

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
    setSearchValue(e.target.value);
  };

  const handleOpenProfile = (customer: CustomerEntity) => {
    writeCachedCustomerProfile(customer);
    customer.id && navigate("/profile/" + customer.id);
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

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2 }}>
        <Typography variant="h5">
          Find Your Profile
        </Typography>
        <Button
          onClick={() => navigate("/")}
          sx={{
            color: "#F2C078",
            border: "1px solid rgba(242, 192, 120, 0.75)",
            borderRadius: "12px",
            textTransform: "none",
            px: 2,
            py: 1,
            whiteSpace: "nowrap",
            "&:hover": {
              backgroundColor: "rgba(242, 192, 120, 0.12)",
              borderColor: "#F2C078",
            },
          }}
        >
          Home
        </Button>
      </Box>

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
                onClick={() => handleOpenProfile(customer)}
                sx={{
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "rgba(242, 192, 120, 0.24)",
                  },
                }}
              >
                {getCustomerName(customer)}
              </ListItem>
            ))}
          </List>
        ) : null}
      </Box>
      <Box>
        <Typography variant="subtitle2" sx={{ color: "rgba(255, 255, 255, 0.82)", mb: 1 }}>
          All profiles
        </Typography>
        <List
          sx={{
            maxHeight: "280px",
            overflowY: "auto",
            backgroundColor: "rgba(255, 255, 255, 0.08)",
            border: "1px solid rgba(255, 255, 255, 0.14)",
            borderRadius: "12px",
            py: 0.5,
          }}
        >
          {sortedCustomers.map((customer) => (
            <ListItem
              key={customer.id}
              onClick={() => handleOpenProfile(customer)}
              sx={{
                cursor: "pointer",
                borderRadius: "8px",
                color: "white",
                "&:hover": {
                  backgroundColor: "rgba(242, 192, 120, 0.18)",
                },
              }}
            >
              {getCustomerName(customer)}
            </ListItem>
          ))}
        </List>
      </Box>

      <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "flex-start", sm: "center" }, gap: "10px"}}>
        <Typography variant="subtitle2" sx={{ color: "rgba(255, 255, 255, 0.82)" }}>
          Can't find your name?
        </Typography>
        <Button
          onClick={() => navigate("/create-profile")}
          sx={{
            color: "#F2C078",
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
