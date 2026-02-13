import type { Order } from "../types/order";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
export default function QueueElement({ order}: { order: Order}) {
  return (
    <div className="queue-element">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          {order.customerName}
        </div>
        <div>
            {order.isCompleted? <EmojiEmotionsIcon style={{ color: "green" }} /> : <SentimentSatisfiedIcon style={{ color: "orange" }} /> }
        </div>
         
      </div>
    </div>
  );
}
