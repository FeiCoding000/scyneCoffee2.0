import useSWR from "swr";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../services/firebase";
import type { Coffee } from "../types/coffee";

const MENU_ITEMS_CACHE_KEY = "menu-items-cache-v1";
const MENU_ITEMS_SWR_KEY = "menu-items";

const readCachedMenuItems = (): Coffee[] => {
  if (typeof window === "undefined") return [];

  try {
    const cachedValue = window.localStorage.getItem(MENU_ITEMS_CACHE_KEY);
    if (!cachedValue) return [];

    const parsedValue = JSON.parse(cachedValue);
    return Array.isArray(parsedValue) ? (parsedValue as Coffee[]) : [];
  } catch (error) {
    console.warn("Failed to read cached menu items:", error);
    return [];
  }
};

const writeCachedMenuItems = (menuItems: Coffee[]) => {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(MENU_ITEMS_CACHE_KEY, JSON.stringify(menuItems));
  } catch (error) {
    console.warn("Failed to cache menu items:", error);
  }
};

const fetchMenuItems = async (): Promise<Coffee[]> => {
  const menuCollection = collection(db, "coffee");
  const menuQuery = query(
    menuCollection,
    orderBy("category", "asc"),
    orderBy("popularity", "desc"),
  );

  const menuSnapshot = await getDocs(menuQuery);
  const menuItems: Coffee[] = menuSnapshot.docs.map((doc) => {
    const data = doc.data();

    return {
      id: doc.id,
      name: data.name,
      description: data.description,
      category: data.category,
      imageUrl: data.imageUrl,
      isAvailable: data.isAvailable,
      tags: data.tags,
      popularity: data.popularity,
      hotOnly: data.hotOnly,
      defaultMilk: data.defaultMilk,
    };
  });

  writeCachedMenuItems(menuItems);
  return menuItems;
};

export function useMenuItems() {
  return useSWR(MENU_ITEMS_SWR_KEY, fetchMenuItems, {
    fallbackData: readCachedMenuItems(),
    revalidateOnFocus: false,
    dedupingInterval: 5 * 60 * 1000,
  });
}
