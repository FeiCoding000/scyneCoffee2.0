import { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { collection, getDocs } from "firebase/firestore";
import type { Coffee } from "../types/coffee";
import {
  Box,
  Typography,
  Grid,
  Card,
  Stack,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import CreateCoffeeForm from "../components/forms/CreateCoffeeForm";

export default function AdminPage() {
  const [fetchedList, setFetchedList] = useState<Coffee[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // fetch coffee list
  const fetchCoffeeList = async () => {
    try {
      const coffeeCollection = collection(db, "coffee");
      const coffeeSnapshot = await getDocs(coffeeCollection);
      const coffeeList = coffeeSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setFetchedList(coffeeList as Coffee[]);
    } catch (error) {
      console.error("Error fetching coffee list: ", error);
    }
  };

  useEffect(() => {
    fetchCoffeeList();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{ mb: 3 }}
      >
        <Typography variant="h4">Admin Page - Coffee Management</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setIsDialogOpen(true)}
        >
          Add Coffee
        </Button>
      </Stack>

      {/* Coffee List */}
      <Grid container spacing={3}>
        {fetchedList.map((coffee: Coffee) => (
          <Grid
            key={coffee.id}
            sx={{
              gridColumn: {
                xs: "span 12",
                sm: "span 6",
                md: "span 4",
              },
            }}
          >
            <Card
              sx={{
                display: "flex",
                alignItems: "flex-start",
                p: 1,
                height: "100%",
                width: "100%",
              }}
            >
              {coffee.imageUrl && (
                <Box
                  component="img"
                  src={coffee.imageUrl}
                  alt={coffee.name || "Coffee Image"}
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    objectFit: "cover",
                    mr: 2,
                  }}
                />
              )}
              <Box sx={{ flex: 1 }}>
                <Typography>{coffee.name}</Typography>
                <Divider sx={{ my: 0.5 }} />
                <Typography
                  sx={{ width: "200px" }}
                  variant="body2"
                  color="text.secondary"
                  noWrap
                >
                  {coffee.description}
                </Typography>

                <Stack
                  direction="column"
                  spacing={1}
                  sx={{ mt: 0.5, flexWrap: "wrap", display: "flex", gap: 1 }}
                >
                  <div>
                    {coffee.category && (
                      <Typography variant="caption" color="primary">
                        {coffee.category}
                      </Typography>
                    )}
                  </div>

                  <div>
                    {coffee.tags
                    ?.slice(0, 3)
                    .map((tag: string, index: number) => (
                      <Box
                        key={index}
                        component="span"
                        sx={{
                          mr: 0.5,
                          border: "1px solid blue",
                          px: 0.5,
                          borderRadius: 1,
                          fontSize: "0.75rem",
                          color: "secondary.main",
                          display: "inline-block",
                        }}
                      >
                        {tag}
                      </Box>
                    ))}
                  </div>
                  
                </Stack>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add Coffee Dialog */}
      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 2,
            bgcolor: "#f5f5f5", // light grey background
            boxShadow: 6,
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: "bold",
            fontSize: "1.5rem",
            borderBottom: "2px solid #1976d2",
            mb: 2,
            pb: 1,
          }}
        >
          Add New Coffee
        </DialogTitle>

        <DialogContent
          dividers
          sx={{
            maxHeight: "60vh",
            overflowY: "auto",
            px: 0,
          }}
        >
          <CreateCoffeeForm
            onSuccess={() => {
              setIsDialogOpen(false);
              fetchCoffeeList(); // refresh list after adding
            }}
          />
        </DialogContent>

        {/* <DialogActions sx={{ justifyContent: "space-between", px: 2, py: 1 }}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => setIsDialogOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="create-coffee-form" // 如果 CreateCoffeeForm 使用 form id
            variant="contained"
            color="primary"
          >
            Add Coffee
          </Button>
        </DialogActions> */}
      </Dialog>
    </Box>
  );
}
