import {
  Button,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Select,
  Slider,
  TextField,
} from "@mui/material";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { useEffect, useState } from "react";
import type { CreateOrderItemDto } from "../schemas/dto/createOrderItemDto";

type OptionProps = {
  index: number;
  isOpen: boolean;
  handleAddOption: (option: CreateOrderItemDto) => void;
  onClose: () => void;
  initialOption?: CreateOrderItemDto | null;
  submitLabel?: string;
};

type DrinkCategory = "coffee" | "tea" | "other";

interface DrinkOption {
  drinkName: string;
  category: DrinkCategory;
  configuration: {
    milk: boolean;
    strength: boolean;
    decaf: boolean;
    iced: boolean;
    teaBags: boolean;
    sugar: boolean;
    sweetener: boolean;
    extraHot: boolean;
  };
}

const drinkOptions: DrinkOption[] = [
  // Coffee
  {
    drinkName: "Espresso",
    category: "coffee",
    configuration: {
      milk: false,
      strength: true,
      decaf: true,
      iced: false,
      teaBags: false,
      sugar: true,
      sweetener: true,
      extraHot: false,
    },
  },
  {
    drinkName: "Long Black",
    category: "coffee",
    configuration: {
      milk: true,
      strength: true,
      decaf: true,
      iced: true,
      teaBags: false,
      sugar: true,
      sweetener: true,
      extraHot: false,
    },
  },
  {
    drinkName: "Americano",
    category: "coffee",
    configuration: {
      milk: true,
      strength: true,
      decaf: true,
      iced: true,
      teaBags: false,
      sugar: true,
      sweetener: true,
      extraHot: false,
    },
  },
  {
    drinkName: "Flat White",
    category: "coffee",
    configuration: {
      milk: true,
      strength: true,
      decaf: true,
      iced: false,
      teaBags: false,
      sugar: true,
      sweetener: true,
      extraHot: true,
    },
  },
  {
    drinkName: "Cappuccino",
    category: "coffee",
    configuration: {
      milk: true,
      strength: true,
      decaf: true,
      iced: false,
      teaBags: false,
      sugar: true,
      sweetener: true,
      extraHot: true,
    },
  },
  {
    drinkName: "Latte",
    category: "coffee",
    configuration: {
      milk: true,
      strength: true,
      decaf: true,
      iced: true,
      teaBags: false,
      sugar: true,
      sweetener: true,
      extraHot: true,
    },
  },
  {
    drinkName: "Piccolo Latte",
    category: "coffee",
    configuration: {
      milk: true,
      strength: true,
      decaf: true,
      iced: false,
      teaBags: false,
      sugar: true,
      sweetener: true,
      extraHot: true,
    },
  },
  {
    drinkName: "Macchiato",
    category: "coffee",
    configuration: {
      milk: true,
      strength: true,
      decaf: true,
      iced: false,
      teaBags: false,
      sugar: true,
      sweetener: true,
      extraHot: true,
    },
  },
  {
    drinkName: "Mocha",
    category: "coffee",
    configuration: {
      milk: true,
      strength: true,
      decaf: true,
      iced: true,
      teaBags: false,
      sugar: true,
      sweetener: true,
      extraHot: true,
    },
  },
  {
    drinkName: "Scyne Crema",
    category: "coffee",
    configuration: {
      milk: true,
      strength: true,
      decaf: true,
      iced: true,
      teaBags: false,
      sugar: true,
      sweetener: true,
      extraHot: true,
    },
  },

  // Tea
  {
    drinkName: "English Breakfast",
    category: "tea",
    configuration: {
      milk: true,
      strength: false,
      decaf: false,
      iced: true,
      teaBags: true,
      sugar: true,
      sweetener: true,
      extraHot: true,
    },
  },
  {
    drinkName: "Earl Grey",
    category: "tea",
    configuration: {
      milk: true,
      strength: false,
      decaf: false,
      iced: true,
      teaBags: true,
      sugar: true,
      sweetener: true,
      extraHot: false,
    },
  },
  {
    drinkName: "Green Tea",
    category: "tea",
    configuration: {
      milk: false,
      strength: false,
      decaf: false,
      iced: false,
      teaBags: true,
      sugar: true,
      sweetener: true,
      extraHot: false,
    },
  },
  {
    drinkName: "Chamomile",
    category: "tea",
    configuration: {
      milk: false,
      strength: false,
      decaf: false,
      iced: false,
      teaBags: true,
      sugar: true,
      sweetener: true,
      extraHot: false,
    },
  },
  {
    drinkName: "Peppermint",
    category: "tea",
    configuration: {
      milk: false,
      strength: false,
      decaf: false,
      iced: false,
      teaBags: true,
      sugar: true,
      sweetener: true,
      extraHot: false,
    },
  },

  // Other
  {
    drinkName: "Hot Chocolate",
    category: "other",
    configuration: {
      milk: true,
      strength: false,
      decaf: false,
      iced: true,
      teaBags: false,
      sugar: true,
      sweetener: true,
      extraHot: true,
    },
  },
  {
    drinkName: "Chai Latte",
    category: "other",
    configuration: {
      milk: true,
      strength: false,
      decaf: false,
      iced: true,
      teaBags: false,
      sugar: true,
      sweetener: true,
      extraHot: true,
    },
  },
];

const milkOptions = [
  "none",
  "full cream",
  "lite",
  "soy",
  "almond",
  "oat",
  "lactose free",
];

const strengthOptions = [0.5, 1, 2, 3];
const teaBagOptions = [1, 2, 3];

const createDefaultOption = (index: number): CreateOrderItemDto => ({
  reference: `Option${index}`,
  title: drinkOptions[0].drinkName,
  category: drinkOptions[0].category,
  isXHot: false,
  isIced: false,
  isDecaf: false,
  strength: 1,
  milk: "none",
  teaBags: 1,
  sugar: 0,
  sweetner: 0,
});

export default function CustomerCoffeeOption({
  isOpen,
  onClose,
  handleAddOption,
  index,
  initialOption = null,
  submitLabel = "Add option",
}: OptionProps) {
  const [coffeeOption, setCoffeeOption] = useState<CreateOrderItemDto>(
    initialOption ?? createDefaultOption(index),
  );

  useEffect(() => {
    if (!isOpen) return;
    setCoffeeOption(initialOption ?? createDefaultOption(index));
  }, [isOpen, initialOption, index]);

  const updateCoffeeOption = <K extends keyof CreateOrderItemDto>(
    key: K,
    value: CreateOrderItemDto[K],
  ) => {
    setCoffeeOption((current) => {
      const next = {
        ...current,
        [key]: value,
      };

      if (key === "isIced" && value === true) {
        next.isXHot = false;
      }

      if (key === "isXHot" && value === true) {
        next.isIced = false;
      }

      return next;
    });
  };

  const updateDrink = (drinkName: string) => {
    const drink = drinkOptions.find((item) => item.drinkName === drinkName);

    setCoffeeOption((current) => ({
      ...current,
      title: drinkName,
      category: drink?.category ?? "other",
      milk: drink?.configuration.milk ? current.milk : "none",
      strength: drink?.configuration.strength ? current.strength : 1,
      teaBags: drink?.configuration.teaBags ? current.teaBags : 1,
      sugar: drink?.configuration.sugar ? current.sugar : 0,
      sweetner: drink?.configuration.sweetener ? current.sweetner : 0,
      isIced: drink?.configuration.iced ? current.isIced : false,
      isXHot: drink?.configuration.extraHot ? current.isXHot : false,
      isDecaf: drink?.category === "coffee" ? current.isDecaf : false,
    }));
  };

  const handleSubmit = () => {
    handleAddOption({...coffeeOption, category: selectedDrinkResult?.category || "other"});
    setCoffeeOption(createDefaultOption(index + 1));
    onClose();
  };

  const selectedDrinkResult = drinkOptions.find(
    (drink) => drink.drinkName === coffeeOption.title,
  );

  const isCoffee = selectedDrinkResult?.category === "coffee";
  const canAddMilk = selectedDrinkResult?.configuration.milk;
  const hasIcedVersion = selectedDrinkResult?.configuration.iced;
  const isXHote = selectedDrinkResult?.configuration.extraHot;
  const strengthTag = selectedDrinkResult?.configuration.strength;
  const teaBagTag = selectedDrinkResult?.configuration.teaBags;
  const sugarTag = selectedDrinkResult?.configuration.sugar;
  const sweetenerTag = selectedDrinkResult?.configuration.sweetener;
  // const otherTag = selectedDrinkResult?.category === "other";

  return (
    <Modal open={isOpen} onClose={onClose} closeAfterTransition>
      <Box
        sx={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          maxHeight: "90vh",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          overflowY: "auto",
          bgcolor: "background.paper",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        Name your option for a reference:
        <TextField
          placeholder="Give a name for your drink"
          value={coffeeOption.reference}
          onChange={(event) =>
            setCoffeeOption((current) => ({
              ...current,
              reference: event.target.value,
            }))
          }
        />
        Select Your Drink Type:
        <Select
          value={coffeeOption.title}
          onChange={(e) => updateDrink(e.target.value)}
        >
          {drinkOptions.map((drink) => (
            <MenuItem key={drink.drinkName} value={drink.drinkName}>
              {drink.drinkName}
            </MenuItem>
          ))}
        </Select>
        {canAddMilk && (
          <>
            <p>Add your milk:</p>{" "}
            <Select
              value={coffeeOption.milk}
              onChange={(e) => updateCoffeeOption("milk", e.target.value)}
            >
              {milkOptions.map((milk) => (
                <MenuItem key={milk} value={milk}>
                  {milk}
                </MenuItem>
              ))}
            </Select>
          </>
        )}
        {strengthTag && (
          <>
            <p>Strength:</p>
            <Select
              value={coffeeOption.strength}
              onChange={(e) =>
                updateCoffeeOption("strength", Number(e.target.value))
              }
            >
              {strengthOptions.map((strength) => (
                <MenuItem key={strength} value={strength}>
                  {strength}
                </MenuItem>
              ))}
            </Select>
          </>
        )}
        {teaBagTag && (
          <>
            <p>Tea Bags:</p>
            <Select
              value={coffeeOption.teaBags}
              onChange={(e) =>
                updateCoffeeOption("teaBags", Number(e.target.value))
              }
            >
              {teaBagOptions.map((teaBag) => (
                <MenuItem key={teaBag} value={teaBag}>
                  {teaBag}
                </MenuItem>
              ))}
            </Select>
          </>
        )}
        {sugarTag && (
          <Box>
            <p>Sugar: {coffeeOption.sugar}</p>
            <Slider
              value={coffeeOption.sugar}
              min={0}
              max={5}
              step={1}
              marks
              valueLabelDisplay="auto"
              onChange={(_, value) =>
                updateCoffeeOption("sugar", value as number)
              }
            />
          </Box>
        )}
        {sweetenerTag && (
          <Box>
            <p>Sweetener: {coffeeOption.sweetner}</p>
            <Slider
              value={coffeeOption.sweetner}
              min={0}
              max={5}
              step={1}
              marks
              valueLabelDisplay="auto"
              onChange={(_, value) =>
                updateCoffeeOption("sweetner", value as number)
              }
            />
          </Box>
        )}
        {hasIcedVersion && (
          <FormControlLabel
            label="Iced"
            control={
              <Checkbox
                checked={coffeeOption.isIced}
                onChange={(e) => updateCoffeeOption("isIced", e.target.checked)}
              />
            }
          />
        )}
        {isCoffee && (
          <FormControlLabel
            label="Decaf"
            control={
              <Checkbox
                checked={coffeeOption.isDecaf}
                onChange={(e) =>
                  updateCoffeeOption("isDecaf", e.target.checked)
                }
              />
            }
          />
        )}
        {isXHote && (
          <FormControlLabel
            label="Extra Hot"
            control={
              <Checkbox
                checked={coffeeOption.isXHot}
                onChange={(e) => updateCoffeeOption("isXHot", e.target.checked)}
              />
            }
          />
        )}
        <Button variant="contained" onClick={handleSubmit}>
          {submitLabel}
        </Button>
      </Box>
    </Modal>
  );
}
