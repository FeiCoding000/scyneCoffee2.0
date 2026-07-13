import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import CoffeeIcon from "@mui/icons-material/Coffee";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import CustomerCoffeeOption from "../CustomerCoffeeOption";
import type { CreateOrderItemDto } from "../../schemas/dto/createOrderItemDto";
import type { OrderItemEntity } from "../../schemas/entity/customerOrderItemEntity";

type ProfileOptionsEditorProps = {
  options: OrderItemEntity[];
  isSaving: boolean;
  formatOptionSummary: (option: OrderItemEntity) => string;
  onCancel: () => void;
  onSave: (options: OrderItemEntity[]) => void;
};

const toCreateOrderItemDto = (option: OrderItemEntity): CreateOrderItemDto => ({
  reference: option.reference,
  title: option.title,
  category: option.category,
  isIced: option.isIced,
  isXHot: option.isXHot,
  isDecaf: option.isDecaf,
  strength: option.strength,
  milk: option.milk,
  teaBags: option.teaBags,
  sugar: option.sugar,
  sweetner: option.sweetner,
});

export default function ProfileOptionsEditor({
  options,
  isSaving,
  formatOptionSummary,
  onCancel,
  onSave,
}: ProfileOptionsEditorProps) {
  const [editingOptions, setEditingOptions] = useState<OrderItemEntity[]>(options);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const handleAddOption = (option: CreateOrderItemDto) => {
    setEditingOptions((currentOptions) => {
      if (editingIndex === null) {
        return [...currentOptions, option];
      }

      return currentOptions.map((currentOption, optionIndex) =>
        optionIndex === editingIndex ? option : currentOption
      );
    });
    setEditingIndex(null);
  };

  const openAddModal = () => {
    setEditingIndex(null);
    setModalOpen(true);
  };

  const openEditModal = (index: number) => {
    setEditingIndex(index);
    setModalOpen(true);
  };

  const deleteOption = (index: number) => {
    setEditingOptions((currentOptions) =>
      currentOptions.filter((_, optionIndex) => optionIndex !== index)
    );
  };

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Edit saved options
        </Typography>
        <Stack direction="row" spacing={1}>
          <Button onClick={onCancel} sx={{ color: "white" }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={isSaving}
            onClick={() => onSave(editingOptions)}
            sx={{
              backgroundColor: "#F2C078",
              color: "#2E244D",
              fontWeight: 800,
              "&:hover": { backgroundColor: "#FFD49A" },
            }}
          >
            Save
          </Button>
        </Stack>
      </Box>

      <Stack spacing={2}>
        {editingOptions.map((option, optionIndex) => (
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
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
              }}
            >
              <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                <Avatar sx={{ bgcolor: "#2E244D" }}>
                  <CoffeeIcon />
                </Avatar>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    {option.reference}
                  </Typography>
                  <Typography sx={{ fontWeight: 600 }}>{option.title}</Typography>
                  <Typography variant="body2" sx={{ color: "rgba(46, 36, 77, 0.72)" }}>
                    {formatOptionSummary(option)}
                  </Typography>
                </Box>
              </Box>

              <Stack direction="row" spacing={1}>
                <IconButton onClick={() => openEditModal(optionIndex)} disabled={isSaving}>
                  <EditIcon />
                </IconButton>
                <IconButton color="error" onClick={() => deleteOption(optionIndex)} disabled={isSaving}>
                  <DeleteIcon />
                </IconButton>
              </Stack>
            </CardContent>
          </Card>
        ))}

        <Button
          variant="outlined"
          fullWidth
          startIcon={<AddIcon />}
          onClick={openAddModal}
          sx={{
            height: 48,
            borderRadius: "12px",
            borderColor: "rgba(255, 255, 255, 0.75)",
            color: "white",
            "&:hover": {
              borderColor: "#F2C078",
              backgroundColor: "rgba(242, 192, 120, 0.08)",
            },
          }}
        >
          Add option
        </Button>
      </Stack>

      <CustomerCoffeeOption
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingIndex(null);
        }}
        handleAddOption={handleAddOption}
        index={editingOptions.length + 1}
        initialOption={
          editingIndex === null ? null : toCreateOrderItemDto(editingOptions[editingIndex])
        }
        submitLabel={editingIndex === null ? "Add option" : "Save option"}
      />
    </>
  );
}
