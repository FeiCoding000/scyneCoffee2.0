import { Avatar, Card, CardHeader } from "@mui/material";
import { type CreateOrderItemDto } from "../schemas/dto/createOrderItemDto";
import CoffeeIcon from "@mui/icons-material/Coffee";
import EmojiFoodBeverageIcon from "@mui/icons-material/EmojiFoodBeverage";
import LocalDrinkIcon from "@mui/icons-material/LocalDrink";
export default function CoffeeOptionItem({
  option,
}: {
  option: CreateOrderItemDto;
}) {
  return (
    <>
      {option && (
        <Card>
          <CardHeader avatar={
            <Avatar>
              {option.category === "coffee" && <CoffeeIcon />}
              {option.category === "tea" && <EmojiFoodBeverageIcon />}
              {option.category === "other" && <LocalDrinkIcon />}
            </Avatar>
          } title={option.reference} subheader={option.title} />



        </Card>
      )}
    </>
  );
}
