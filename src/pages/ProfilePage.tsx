import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import CoffeeIcon from "@mui/icons-material/Coffee";
import LocalCafeIcon from "@mui/icons-material/LocalCafe";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import HomeIcon from "@mui/icons-material/Home";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type { CustomerEntity } from "../schemas/entity/customerEntity";
import type { OrderItemEntity } from "../schemas/entity/customerOrderItemEntity";
import {
  getCustomerById,
  placeProfileOrder,
  updateCustomerOptions,
} from "../services/customerService";
import ProfileOptionsEditor from "../components/profile/ProfileOptionsEditor";

const CUSTOMER_CACHE_KEY = "scyneCoffee.customerCache";

const getInitials = (firstName = "", lastName = "") =>
  `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

const getCustomerName = (customer: CustomerEntity) =>
  `${customer.firstName} ${customer.lastName}`.trim();

const formatOptionSummary = (option: OrderItemEntity) => {
  const tags = [
    option.isIced ? "Iced" : "Hot",
    option.isXHot ? "Extra hot" : null,
    option.isDecaf ? "Decaf" : null,
    option.milk !== "none" ? option.milk : null,
    option.category === "coffee" && option.strength
      ? `${option.strength}x strength`
      : null,
    option.category === "tea" && option.teaBags
      ? `${option.teaBags} tea bag${option.teaBags > 1 ? "s" : ""}`
      : null,
    option.sugar ? `${option.sugar} sugar` : null,
    option.sweetner ? `${option.sweetner} sweetener` : null,
  ].filter(Boolean);

  return tags.join(" · ");
};

const readCustomerCache = (): Record<string, CustomerEntity> => {
  try {
    const cachedCustomers = window.localStorage.getItem(CUSTOMER_CACHE_KEY);
    if (!cachedCustomers) return {};

    return JSON.parse(cachedCustomers) as Record<string, CustomerEntity>;
  } catch {
    return {};
  }
};

const readCachedCustomer = (customerId?: string): CustomerEntity | null => {
  if (!customerId) return null;

  const customerCache = readCustomerCache();
  return customerCache[customerId] ?? null;
};

const writeCachedCustomer = (customer: CustomerEntity) => {
  if (!customer.id) return;

  const customerCache = readCustomerCache();
  window.localStorage.setItem(
    CUSTOMER_CACHE_KEY,
    JSON.stringify({
      ...customerCache,
      [customer.id]: customer,
    })
  );
};

export default function ProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<CustomerEntity | null>(() =>
    readCachedCustomer(id)
  );
  const [loading, setLoading] = useState(!readCachedCustomer(id));
  const [error, setError] = useState<string | null>(null);
  const [profileSyncStatus, setProfileSyncStatus] = useState<
    "idle" | "syncing" | "synced" | "failed"
  >("idle");
  const [isOrdering, setIsOrdering] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [countdown, setCountdown] = useState(8);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [isEditing, setIsEditing] = useState(false);

  const customerName = useMemo(
    () => (customer ? getCustomerName(customer) : ""),
    [customer]
  );

  useEffect(() => {
    if (!id) {
      navigate("/create-profile", { replace: true });
      return;
    }

    let isMounted = true;

    const loadCustomer = async () => {
      const cachedCustomer = readCachedCustomer(id);
      setLoading(!cachedCustomer);
      setProfileSyncStatus("syncing");
      const result = await getCustomerById(id);

      if (!isMounted) return;

      if (!result.ok) {
        if (cachedCustomer) {
          setCustomer(cachedCustomer);
          setError("Failed to load latest data. Using saved profile for ordering.");
          setProfileSyncStatus("failed");
        } else {
          setError(result.error.message);
          setProfileSyncStatus("failed");
        }
        setLoading(false);
        return;
      }

      setCustomer(result.data);
      writeCachedCustomer(result.data);
      setError(null);
      setProfileSyncStatus("synced");
      setLoading(false);
    };

    loadCustomer();

    return () => {
      isMounted = false;
    };
  }, [id, navigate]);

  useEffect(() => {
    if (!successOpen) return;

    setCountdown(8);

    const intervalTimer = window.setInterval(() => {
      setCountdown((current) => Math.max(current - 1, 0));
    }, 1000);

    const closeTimer = window.setTimeout(() => {
      setSuccessOpen(false);
      navigate("/");
    }, 8000);

    return () => {
      window.clearInterval(intervalTimer);
      window.clearTimeout(closeTimer);
    };
  }, [successOpen, navigate]);

  const handleStartEdit = () => {
    if (!customer) return;
    setIsEditing(true);
    setMenuAnchorEl(null);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setError(null);
  };

  const handleSaveOptions = async (options: OrderItemEntity[]) => {
    if (!customer) return;

    if (options.length === 0) {
      setError("Profile needs at least one saved option.");
      return;
    }

    setIsSaving(true);
    setError(null);

    const result = await updateCustomerOptions(customer, options);

    setIsSaving(false);

    if (!result.ok) {
      setError(result.error.message);
      return;
    }

    setCustomer(result.data);
    writeCachedCustomer(result.data);
    setIsEditing(false);
  };

  const handleOneClickOrder = async (option: OrderItemEntity) => {
    if (!customer) return;

    setIsOrdering(true);
    setError(null);

    const result = await placeProfileOrder(customer, option);

    setIsOrdering(false);

    if (!result.ok) {
      setError(result.error.message);
      return;
    }

    setCustomer(result.data);
    writeCachedCustomer(result.data);
    setSuccessOpen(true);
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
        <CircularProgress sx={{ color: "#F2C078" }} />
      </Box>
    );
  }

  if (!customer) {
    return (
      <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center", color: "white" }}>
        <Typography>{error ?? "Customer not found."}</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        px: 2,
        py: 4,
      }}
    >
      <Box
        sx={{
          width: "min(720px, 100%)",
          color: "white",
          p: { xs: 3, sm: 4 },
          borderRadius: "24px",
          background: "rgba(255, 255, 255, 0.08)",
          border: "1px solid rgba(255, 255, 255, 0.18)",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.22)",
          backdropFilter: "blur(10px)",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate("/profile-order")}
              sx={{ color: "rgba(255,255,255,0.8)", textTransform: "none" }}
            >
              Back to search
            </Button>
            <Button
              startIcon={<HomeIcon />}
              onClick={() => navigate("/")}
              sx={{ color: "rgba(255,255,255,0.8)", textTransform: "none" }}
            >
              Home
            </Button>
          </Box>
          <IconButton
            onClick={(event) => setMenuAnchorEl(event.currentTarget)}
            sx={{ color: "rgba(255,255,255,0.86)" }}
          >
            <MoreVertIcon />
          </IconButton>
          <Menu
            anchorEl={menuAnchorEl}
            open={Boolean(menuAnchorEl)}
            onClose={() => setMenuAnchorEl(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            PaperProps={{
              sx: {
                mt: 1,
                maxWidth: "calc(100vw - 32px)",
              },
            }}
          >
            <MenuItem onClick={handleStartEdit}>Edit profile options</MenuItem>
          </Menu>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          <Avatar
            sx={{
              width: 72,
              height: 72,
              bgcolor: "#F2C078",
              color: "#2E244D",
              fontSize: 28,
            }}
          >
            {getInitials(customer.firstName, customer.lastName)}
          </Avatar>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
              <Typography variant="h4">
                {customerName}
              </Typography>
              {profileSyncStatus === "syncing" && (
                <CircularProgress size={18} thickness={5} sx={{ color: "#F2C078" }} />
              )}
              {profileSyncStatus === "synced" && (
                <Chip
                  size="small"
                  label="Up to date"
                  sx={{
                    color: "#2E244D",
                    backgroundColor: "#F2C078",
                    fontWeight: 500,
                  }}
                />
              )}
              {profileSyncStatus === "failed" && (
                <Chip
                  size="small"
                  label="Using saved data"
                  sx={{
                    color: "white",
                    backgroundColor: "rgba(255, 180, 180, 0.24)",
                    border: "1px solid rgba(255, 180, 180, 0.55)",
                  }}
                />
              )}
            </Box>
            <Typography sx={{ color: "rgba(255,255,255,0.72)" }}>
              Total drinks ordered: {customer.totalDrinksOrdered}
            </Typography>
          </Box>
        </Box>

        {customer.allergies.length > 0 && (
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 3 }}>
            {customer.allergies.map((allergy) => (
              <Chip
                key={allergy}
                label={allergy}
                sx={{
                  color: "white",
                  borderColor: "rgba(242, 192, 120, 0.65)",
                  backgroundColor: "rgba(242, 192, 120, 0.16)",
                }}
                variant="outlined"
              />
            ))}
          </Box>
        )}

        {error && (
          <Typography sx={{ color: "#ffb4b4", mb: 2 }}>{error}</Typography>
        )}

        {isEditing ? (
          <ProfileOptionsEditor
            options={customer.options}
            isSaving={isSaving}
            formatOptionSummary={formatOptionSummary}
            onCancel={handleCancelEdit}
            onSave={handleSaveOptions}
          />
        ) : (
          <>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Saved options
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {customer.options.map((option, optionIndex) => (
                <Card
                  key={`${option.reference}-${optionIndex}`}
                  sx={{
                    borderRadius: "18px",
                    background: "rgba(255, 255, 255, 0.92)",
                    color: "#2E244D",
                  }}
                >
                  <CardContent
                    sx={{
                      display: "flex",
                      alignItems: { xs: "flex-start", sm: "center" },
                      justifyContent: "space-between",
                      gap: 2,
                      flexDirection: { xs: "column", sm: "row" },
                    }}
                  >
                    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                      <Avatar sx={{ bgcolor: "#2E244D" }}>
                        <CoffeeIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="h6">
                          {option.reference}
                        </Typography>
                        <Typography>{option.title}</Typography>
                        <Typography variant="body2" sx={{ color: "rgba(46, 36, 77, 0.72)" }}>
                          {formatOptionSummary(option)}
                        </Typography>
                      </Box>
                    </Box>

                    <Button
                      variant="contained"
                      startIcon={<LocalCafeIcon />}
                      disabled={isOrdering}
                      onClick={() => handleOneClickOrder(option)}
                      sx={{
                        borderRadius: "12px",
                        backgroundColor: "#F2C078",
                        color: "#2E244D",
                        whiteSpace: "nowrap",
                        "&:hover": { backgroundColor: "#FFD49A" },
                      }}
                    >
                      One-click order
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </>
        )}
      </Box>

      <Dialog
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
        PaperProps={{
          sx: {
            width: "min(420px, calc(100% - 32px))",
            borderRadius: "24px",
            background: "rgba(255, 255, 255, 0.96)",
            color: "#2E244D",
            textAlign: "center",
            p: 1,
          },
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          Order placed successfully!
        </DialogTitle>
        <DialogContent>
          <Typography sx={{ color: "rgba(46, 36, 77, 0.72)", mb: 3 }}>
            If you want to order more, click continue. Otherwise, you will return
            home after the countdown.
          </Typography>

          <Box sx={{ position: "relative", display: "inline-flex", mb: 1 }}>
            <CircularProgress
              variant="determinate"
              value={(countdown / 8) * 100}
              size={112}
              thickness={4}
              sx={{ color: "#F2C078" }}
            />
            <Box
              sx={{
                inset: 0,
                position: "absolute",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="h4">
                {countdown}
              </Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => setSuccessOpen(false)}
            sx={{
              borderRadius: "12px",
              borderColor: "#2E244D",
              color: "#2E244D",
            }}
          >
            Continue
          </Button>
          <Button
            fullWidth
            variant="contained"
            onClick={() => navigate("/")}
            sx={{
              borderRadius: "12px",
              backgroundColor: "#F2C078",
              color: "#2E244D",
              "&:hover": { backgroundColor: "#FFD49A" },
            }}
          >
            Home
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
