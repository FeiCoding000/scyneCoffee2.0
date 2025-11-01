import { useEffect,  useState } from "react";
import { db } from "../services/firebase";
import { collection, getDocs } from "firebase/firestore";
import type { Order } from "../types/order";
import DailyDataLineChart from "../components/dataComponents/DailyDataLineChart";
import MilkPieChart from "../components/dataComponents/MilkPieChart";
import { Box } from "@mui/material";

export default function StatisticPage() {
  const [milkData, setMilkData] = useState<
    { id: number; value: number; label: string }[]
  >([]);
  //   const [waterData, setWaterData] = useState([]);
  const [dailyCoffeeNumber, setDailyCoffeeNumber] = useState<
    Record<string, number>
  >({});
  const [totalNumber, setTotalNumber] = useState(0);
  const [orders, setOrders] = useState<Order[]>();

  //total coffees ordered
  const calculateTotalNumber = (orders: Order[]) => {
    const totalNumber = orders.reduce((sum, order) => {
      return (
        sum + order.items.reduce((itemSum, item) => itemSum + item.quantity, 0)
      );
    }, 0);

    setTotalNumber(totalNumber);
  };

  useEffect(() => {
    if (orders) calculateTotalNumber(orders);
  }, [orders]);

  //milk detalis
  const calculateMilkInfo = (orders: Order[] | undefined) => {
    const milkInfo: Record<string, number> = {
      "full cream": 0,
      lite: 0,
      soy: 0,
      "lactose free": 0,
      oat: 0,
      almond: 0,
      skim: 0,
    };
    orders?.forEach((order) => {
      order.items.forEach((item) => {
        milkInfo[item.milk] = (milkInfo[item.milk] ?? 0) + item.quantity;
      });
    });
    console.log("Milk info", milkInfo);
    const pieChartArray = Object.entries(milkInfo).map(
      ([key, value], index) => ({
        id: index,
        value: value,
        label: key,
      })
    );
    setMilkData(pieChartArray);
    return milkInfo;
  };

  useEffect(() => {
    calculateMilkInfo(orders);
  }, [orders]);
  //process milk info for bar chart

  // daily coffee# details
  const calculateDailyCoffeeInfo = (orders: Order[] | undefined) => {
    const dailyInfo: Record<string, number> = {};

    orders?.forEach((order: Order) => {
      const date = order.createdAt;
      const dayKey = date.toLocaleDateString("en-AU", {
        timeZone: "Australia/Sydney",
      });
      if (!dailyInfo[dayKey]) {
        dailyInfo[dayKey] = 0;
      }
      order.items.forEach((item) => {
        dailyInfo[dayKey] += item.quantity ?? 1;
      });
    });
    console.log("dailyInfo", dailyInfo);
    setDailyCoffeeNumber(dailyInfo);
    return dailyInfo;
  };

  useEffect(() => {
    calculateDailyCoffeeInfo(orders);
  }, [orders]);

  //Fetch Orders
  useEffect(() => {
    const fetchedOrderInfo = async () => {
      try {
        const orderRef = collection(db, "orders");
        const snapshot = await getDocs(orderRef);
        const orders: Order[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt.toDate(),
          updatedAt: doc.data().updatedAt.toDate(),
        })) as Order[];
        console.log("Orders:", orders);
        setOrders(orders);
      } catch (error) {
        console.log(error);
      }
    };

    fetchedOrderInfo();
  }, []);

  //get data for line chart
  const sortedArray = Object.entries(dailyCoffeeNumber)
    .map(([date, value]) => ({ date, value }))
    .sort((a, b) => {
      // DD/MM/YYYY -> YYYY-MM-DD
      const dateA = new Date(a.date.split("/").reverse().join("-"));
      const dateB = new Date(b.date.split("/").reverse().join("-"));
      return dateA.getTime() - dateB.getTime();
    });

  const xData = sortedArray.map((item) => item.date);
  const yData = sortedArray.map((item) => item.value);

  //  //get data for pie

  return (
    <Box
      className="container"
      style={{
        width: "100%",
        height: "80vh",
        border: "1px solid white",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <Box
        style={{
          width: "100%",
          border: "1px solid white",
          display: "flex",
          gap: "20px",
          justifyContent: "space-between"
        }}
      >
        <Box
          className="top"
          style={{ height: "100px", width: "200px", border: "1px solid white"}}
        >
          <p>Most Pupolar</p>
          <h1>{totalNumber}</h1>
        </Box>
        <Box
          className="top"
          style={{ height: "100px", width: "200px", border: "1px solid white" }}
        >
          <p>Most Pupolar</p>
          <h1>{totalNumber}</h1>
        </Box>
        <Box
          className="top"
          style={{ height: "100px", width: "200px", border: "1px solid white" }}
        >
          <p>Total Coffees</p>
          <h1>{totalNumber}</h1>
        </Box>
        <Box
          className="top"
          style={{ height: "100px", width: "200px", border: "1px solid white" }}
        >
          <p>Busiest Date</p>
          <h1>{totalNumber}</h1>
        </Box>
      </Box>

      <Box className="bottom" style={{ display: "flex", gap: "10px" }}>
        <Box
          className="left"
          style={{ border: "1px solid white", width: "60%" }}
        >
          <DailyDataLineChart
            xData={xData}
            yData={yData}
            title="Daily Coffee"
          />
        </Box>
        <Box
          className="right"
          style={{ border: "1px solid white", width: "60%" }}
        >
          <MilkPieChart data={milkData}></MilkPieChart>
        </Box>
      </Box>
    </Box>
  );
}
