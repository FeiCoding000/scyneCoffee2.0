import type { Order } from "../types/order";
import HourglassFullIcon from '@mui/icons-material/HourglassFull';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
export default function QueueElement({ order}: { order: Order}) {
  return (
    <div className="queue-element">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          {order.customerName}
        </div>
        <div>
            {order.isCompleted? <CheckCircleIcon style={{ color: "green" }} /> : <HourglassFullIcon style={{ color: "blue" }} /> }
        </div>
         
      </div>
    </div>
  );
}
