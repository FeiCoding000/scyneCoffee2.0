import { useForm } from "react-hook-form";
import { db } from "../../services/firebase";
import { collection, addDoc } from "firebase/firestore";
import type { Coffee } from "../../types/coffee";
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Button,
  Stack,
} from "@mui/material";

type CoffeeFormData = Omit<Coffee, "id" | "createdAt" | "updatedAt">;

type Props = {
  onSuccess?: () => void;
};

export default function CreateCoffeeForm({ onSuccess }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CoffeeFormData>({
    defaultValues: {
      name: "",
      description: "",
      category: "coffee",
      hotOnly: true,
      isAvailable: true,
      defaultMilk: "full cream",
      tags: [],
      defaultStrength: 1,
      popularity: 0,
      imageUrl: "",
    },
  });

  const onSubmit = async (data: CoffeeFormData) => {
    try {
      await addDoc(collection(db, "coffee"), {
        ...data,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      reset();
      onSuccess?.(); // 成功后回调
    } catch (err) {
      console.error("Error adding coffee:", err);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <TextField
        label="Name"
        {...register("name", { required: true })}
        error={!!errors.name}
        helperText={errors.name && "Name is required"}
        fullWidth
      />

      <TextField
        label="Description"
        {...register("description")}
        multiline
        rows={2}
        fullWidth
      />

      <FormControl fullWidth>
        <InputLabel>Category</InputLabel>
        <Select {...register("category", { required: true })} defaultValue="coffee">
          <MenuItem value="" disabled>Select category</MenuItem>
          <MenuItem value="coffee">Coffee</MenuItem>
          <MenuItem value="tea">Tea</MenuItem>
          <MenuItem value="other">Other</MenuItem>
        </Select>
      </FormControl>

      <FormGroup row>
        <FormControlLabel control={<Checkbox {...register("hotOnly")} defaultChecked />} label="Hot Only" />
        <FormControlLabel control={<Checkbox {...register("isAvailable")} defaultChecked />} label="Available" />
      </FormGroup>

      <FormControl fullWidth>
        <InputLabel>Default Milk</InputLabel>
        <Select {...register("defaultMilk")} defaultValue="full cream">
          <MenuItem value="">No Milk</MenuItem>
          <MenuItem value="full cream">Full Cream</MenuItem>
          <MenuItem value="lite">Lite</MenuItem>
          <MenuItem value="almond">Almond</MenuItem>
          <MenuItem value="oat">Oat</MenuItem>
          <MenuItem value="lactose free">Lactose Free</MenuItem>
          <MenuItem value="soy">Soy</MenuItem>
        </Select>
      </FormControl>

      <FormGroup row>
        {["hot","iced","milk-based","black","white","chocolate","new","strong","pure coffee"].map(tag => (
          <FormControlLabel
            key={tag}
            control={<Checkbox value={tag} {...register("tags")} />}
            label={tag}
          />
        ))}
      </FormGroup>

      <Stack direction="row" spacing={2}>
        <TextField
          type="number"
          label="Default Strength"
          {...register("defaultStrength", { valueAsNumber: true })}
          defaultValue={1}
        />
        <TextField
          type="number"
          label="Popularity"
          {...register("popularity", { valueAsNumber: true })}
          defaultValue={0}
        />
      </Stack>

      <TextField
        label="Image URL"
        {...register("imageUrl")}
        fullWidth
      />

      <Stack direction="row" spacing={2} justifyContent="flex-end">
        <Button type="button" variant="outlined" color="secondary" onClick={() => reset()}>
          Reset
        </Button>
        <Button type="submit" variant="contained" color="primary">
          Add Coffee
        </Button>
      </Stack>
    </Box>
  );
}
