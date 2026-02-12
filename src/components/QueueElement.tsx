import type { Order } from "../types/order";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
export default function QueueElement({ order, index }: { order: Order, index: number }) {
  return (
    <div className="queue-element">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          {order.customerName}
        </div>
        <div>
            {order.isCompleted? <EmojiEmotionsIcon style={{ color: "green" }} /> : (index <= 4 ? <SentimentSatisfiedIcon style={{ color: "orange" }} /> : <SentimentVeryDissatisfiedIcon style={{ color: "red" }} />)}
        </div>
         
      </div>
    </div>
  );
}
