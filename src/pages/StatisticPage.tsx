import { useEffect, useState } from "react";
import { db } from "../services/firebase";
import { collection, getDocs, query, orderBy, limit } from "firebase/firestore";
import type { Order } from "../types/order";
import DailyDataLineChart from "../components/dataComponents/DailyDataLineChart";
import MilkPieChart from "../components/dataComponents/MilkPieChart";
import { Box } from "@mui/material";
import type { Coffee } from "../types/coffee";

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
  const [mostPopular, setMostPopular] = useState<Coffee[]>([]);

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
      const timestamp = order.createdAt;
      const date = timestamp.toDate();
      const formatter = new Intl.DateTimeFormat("en-AU", {
        timeZone: "Australia/Sydney",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      const dayKey = formatter.format(date);
      if (!dailyInfo[dayKey]) {
        dailyInfo[dayKey] = 0;
      }
      order.items.forEach((item) => {
        dailyInfo[dayKey] += item.quantity ?? 1;
      });
    });
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
          createdAt: doc.data().createdAt,
          updatedAt: doc.data().updatedAt,
        })) as Order[];
        setOrders(orders);
      } catch (error) {
        console.log(error);
      }
    };

    fetchedOrderInfo();
  }, []);

  //fetch most popular coffee
  useEffect(() => {
    const fetchMostPPLcoffee = async () => {
      const coffeeRef = collection(db, "coffee");
      const q = query(coffeeRef, orderBy("popularity", "desc"), limit(3));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Coffee[];
        setMostPopular(data);
      }
    };

    fetchMostPPLcoffee();
  }, []);

  //get data for line chart
  const sortedArray = Object.entries(dailyCoffeeNumber)
    .map(([date, value]) => ({ date, value }))
    .sort((a, b) => {
      const [dayA, monthA, yearA] = a.date.split("/");
      const [dayB, monthB, yearB] = b.date.split("/");
      const dateA = new Date(`${yearA}-${monthA}-${dayA}`);
      const dateB = new Date(`${yearB}-${monthB}-${dayB}`);
      return dateA.getTime() - dateB.getTime();
    });

  const xData = sortedArray.map((item) => item.date);
  const yData = sortedArray.map((item) => item.value);

  //  //get data for pie

  return (
    <Box
      className="container"
      style={{
        width: "98%",
        height: "80vh",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <Box
        style={{
          width: "100%",
          display: "flex",
          gap: "20px",
          justifyContent: "space-between",
        }}
      >
        <Box
          className="top"
          style={{
            height: "120px",
            width: "200px",
            border: "1px solid white",
            padding: "5px",
            borderRadius: "3px",
          }}
        >
          <p>Most Pupolar</p>
          <h1>{mostPopular[0]?.name}</h1>
          <p>{mostPopular[1]?.name}</p>
          <p>{mostPopular[2]?.name}</p>
        </Box>
        {/* <Box
          className="top"
          style={{ height: "100px", width: "200px", border: "1px solid white", padding: "5px", borderRadius: "3px" }}
        >
          <p>Most Pupolar</p>
          <h1>{totalNumber}</h1>
        </Box> */}
        <Box
          className="top"
          style={{
            height: "120px",
            width: "200px",
            border: "1px solid white",
            padding: "5px",
            borderRadius: "3px",
          }}
        >
          <p>Total Coffees</p>
          <h1>{totalNumber}</h1>
        </Box>
        <Box
          className="top"
          style={{
            height: "120px",
            width: "200px",
            border: "1px solid white",
            padding: "5px",
            borderRadius: "3px",
          }}
        >
          <p>Busiest Date</p>
          <h2>Who knows</h2>
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
