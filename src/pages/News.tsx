import { db } from "../services/firebase";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { NewsSchema } from "../types/news";
import { z } from "zod";

export default function News() {
  const [newsList, setNewsList] = useState<z.infer<typeof NewsSchema>[]>([]);

  const fetchNews = async () => {
    try {
      const newsCollection = collection(db, "news");
      const newsSnapshot = await getDocs(newsCollection);
      const newsList = newsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNewsList(newsList as z.infer<typeof NewsSchema>[]);
    } catch (error) {
      console.error("Error fetching news: ", error);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);
  return (
    <>
      <Box>
        {newsList.map((news) => (
            <div key ={news.id} style={{ marginBottom: "40px", padding: "20px", border: "1px solid #ccc", borderRadius: "10px", backgroundColor: "#f9f9f9", color: "#2c0202" }}>
            <Typography variant="h4">{news.title}</Typography>
            <hr style={{ margin: "20px 0", borderBottom: "1px solid #ccc" }} />
            <Typography variant="body1">{news.content}</Typography>
            <img src={news.url} alt={news.title} style={{ width: "400px", height: "auto", borderRadius: "10px", margin: "20px auto" }} />
            </div>
        ))}
      </Box>
    </>
  );
}
