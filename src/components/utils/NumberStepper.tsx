// NumberStepperRHF.tsx
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
} from "react-hook-form";
import { IconButton, TextField, Box, FormHelperText } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

interface NumberStepperRHFProps<T extends FieldValues> {
  name: Path<T>; // ✅ 自动推断为 OrderItem 里的字段
  control: Control<T>;
  label?: string;
  min?: number;
  max?: number;
}

export function NumberStepperRHF<T extends FieldValues>({
  name,
  control,
  label,
  min = 0,
  max = 10,
}: NumberStepperRHFProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      rules={{
        min: { value: min, message: `Minimum is ${min}` },
        max: { value: max, message: `Maximum is ${max}` },
        validate: (value) =>
          value === undefined ||
          value === null ||
          value === "" ||
          Number.isInteger(value) ||
          "Must be an integer",
      }}
      render={({ field, fieldState: { error } }) => (
        <Box>
          <Box display="flex" alignItems="center" gap={1}>
            <IconButton
              size="small"
              color="error"
              onClick={() =>
                field.onChange(Math.max(min, (field.value ?? 0) - 1))
              }
              disabled={field.value <= min}
            >
              <RemoveIcon />
            </IconButton>

            <TextField
              label={label}
              value={field.value ?? 0}
              onChange={(e) => {
                const newValue = parseInt(e.target.value);
                if (!isNaN(newValue)) field.onChange(newValue);
              }}
              size="small"
              sx={{ width: "70px" }}
              inputProps={{ style: { textAlign: "center" } }}
              error={!!error}
            />

            <IconButton
              size="small"
              color="primary"
              onClick={() =>
                field.onChange(Math.min(max, (field.value ?? 0) + 1))
              }
              disabled={field.value >= max}
            >
              <AddIcon />
            </IconButton>
          </Box>

          {error && <FormHelperText error>{error.message}</FormHelperText>}
        </Box>
      )}
    />
  );
}

export default NumberStepperRHF;
