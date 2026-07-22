import { useAuth } from "../contexts/AuthContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Layout/Footer";
import { Box, Button, Card, CardContent, IconButton, Tooltip, Typography } from "@mui/material";
import LocalCafeIcon from "@mui/icons-material/LocalCafe";
import BadgeIcon from "@mui/icons-material/Badge";
import LoginIcon from "@mui/icons-material/Login";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import BarChartIcon from "@mui/icons-material/BarChart";
import ListAltIcon from "@mui/icons-material/ListAlt";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import RecentOrders from "../components/RecentOrders";
import packageJson from "../../package.json";

export default function HomePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isQuickMenuOpen, setIsQuickMenuOpen] = useState(false);

  const quickLinks = [
    { label: "Statistics", path: "/statistic", icon: <BarChartIcon sx={{ fontSize: 18 }} /> },
    { label: "Orders", path: "/orders", icon: <ListAltIcon sx={{ fontSize: 18 }} /> },
    { label: "Create Profile", path: "/create-profile", icon: <PersonAddIcon sx={{ fontSize: 18 }} /> },
  ];

  return (
    <Box
      className="home-container"
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 2,
        pt: 6,
        pb: 10,
      }}
    >
      <Box
        sx={{
          width: "min(720px, 100%)",
          color: "white",
          textAlign: "center",
          // Optical centering: move the content slightly above mathematical center.
          transform: "translateY(clamp(-72px, -6vh, -32px))",
        }}
      >
        <Box sx={{ position: "relative", display: "inline-block", mb: 2 }}>
          <Box
            component="img"
            src="https://cdn.prod.website-files.com/650aedb6397a7021a593e810/672ac5664163926064db6bd7_scyne-logo.svg"
            alt="Scyne Logo"
            sx={{
              height: 48,
              width: "auto",
              filter: "brightness(0) invert(1)",
            }}
          />
          <Typography
            variant="caption"
            sx={{
              position: "absolute",
              right: -28,
              bottom: -4,
              color: "rgba(255,255,255,0.72)",
              fontSize: "0.58rem",
              lineHeight: 1,
            }}
          >
            v{packageJson.version}
          </Typography>
        </Box>

        <Typography sx={{ color: "rgba(255,255,255,0.72)", mb: 4 }}>
          Choose how you would like to place your order.
        </Typography>

        {user ? (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 2,
            }}
          >
            <Card
              sx={{
                borderRadius: "24px",
                background: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.18)",
                backdropFilter: "blur(10px)",
                color: "white",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <LocalCafeIcon sx={{ fontSize: 46, color: "#F2C078", mb: 1 }} />
                <Typography variant="h5" sx={{ fontWeight: 500, mb: 1 }}>
                  Classic Order
                </Typography>
                <Typography sx={{ color: "rgba(255,255,255,0.7)", mb: 3 }}>
                  Best for visitors or clients who want to order without a saved
                  profile.
                </Typography>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => navigate("/menu")}
                  sx={{
                    height: 46,
                    borderRadius: "12px",
                    backgroundColor: "#F2C078",
                    color: "#2E244D",
                    fontWeight: 500,
                    "&:hover": { backgroundColor: "#FFD49A" },
                  }}
                >
                  Start Classic Order
                </Button>
              </CardContent>
            </Card>

            <Card
              sx={{
                borderRadius: "24px",
                background: "rgba(255, 255, 255, 0.1)",
                border: "1px solid rgba(255, 255, 255, 0.18)",
                backdropFilter: "blur(10px)",
                color: "white",
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <BadgeIcon sx={{ fontSize: 46, color: "#F2C078", mb: 1 }} />
                <Typography variant="h5" sx={{ fontWeight: 500, mb: 1 }}>
                  Profile Order
                </Typography>
                <Typography sx={{ color: "rgba(255,255,255,0.7)", mb: 3 }}>
                  Best for staff with saved drink options and one-click
                  ordering.
                </Typography>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => navigate("/profile-order")}
                  sx={{
                    height: 46,
                    borderRadius: "12px",
                    backgroundColor: "#F2C078",
                    color: "#2E244D",
                    fontWeight: 500,
                    "&:hover": { backgroundColor: "#FFD49A" },
                  }}
                >
                  Find My Profile
                </Button>
              </CardContent>
            </Card>
          </Box>
        ) : (
          <Button
            variant="contained"
            startIcon={<LoginIcon />}
            onClick={() => navigate("/login")}
            sx={{
              height: 48,
              px: 4,
              borderRadius: "12px",
              backgroundColor: "#F2C078",
              color: "#2E244D",
              fontWeight: 500,
              "&:hover": { backgroundColor: "#FFD49A" },
            }}
          >
            Login
          </Button>
        )}

        {user && (
          <Box sx={{ mt: 3, textAlign: "left" }}>
            <RecentOrders variant="glass" />
          </Box>
        )}
      </Box>

      {user && (
        <Box
          sx={{
            position: "fixed",
            right: { xs: 18, sm: 28 },
            bottom: { xs: 68, sm: 72 },
            width: 56,
            height: 56,
            zIndex: 20,
          }}
        >
          {quickLinks.map((link, index) => {
            const positions = [
              { right: 0, bottom: 70 },
              { right: 52, bottom: 52 },
              { right: 70, bottom: 0 },
            ];

            return (
              <Tooltip key={link.path} title={link.label} placement="left">
                <IconButton
                  onClick={() => navigate(link.path)}
                  sx={{
                    position: "absolute",
                    ...positions[index],
                    width: 38,
                    height: 38,
                    color: "#2E244D",
                    backgroundColor: "#F2C078",
                    border: "1px solid rgba(255, 255, 255, 0.65)",
                    boxShadow: "0 10px 24px rgba(0, 0, 0, 0.24)",
                    opacity: isQuickMenuOpen ? 1 : 0,
                    pointerEvents: isQuickMenuOpen ? "auto" : "none",
                    transform: isQuickMenuOpen ? "scale(1)" : "scale(0.6)",
                    transition: `opacity 160ms ease ${index * 40}ms, transform 160ms ease ${index * 40}ms`,
                    "&:hover": {
                      backgroundColor: "#FFD49A",
                    },
                  }}
                >
                  {link.icon}
                </IconButton>
              </Tooltip>
            );
          })}
          <IconButton
            aria-label="Toggle quick links"
            onClick={() => setIsQuickMenuOpen((isOpen) => !isOpen)}
            sx={{
              position: "absolute",
              right: 0,
              bottom: 0,
              width: 48,
              height: 48,
              color: "#2E244D",
              backgroundColor: "#F2C078",
              border: "1px solid rgba(255, 255, 255, 0.72)",
              boxShadow: "0 12px 30px rgba(0, 0, 0, 0.28)",
              "&:hover": {
                backgroundColor: "#FFD49A",
              },
            }}
          >
            <KeyboardArrowUpIcon
              sx={{
                fontSize: 20,
                transform: isQuickMenuOpen ? "rotate(135deg)" : "rotate(0deg)",
                transition: "transform 160ms ease",
              }}
            />
          </IconButton>
        </Box>
      )}

      <Box
        component="footer"
        sx={{
          position: "fixed",
          bottom: 0,
          height: "50px",
          width: "100%",
        }}
      >
        <Footer />
      </Box>
    </Box>
  );
}
