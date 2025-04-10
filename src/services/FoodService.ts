import { FoodItem } from "../types/food.types";

export async function fetchFoodData(): Promise<FoodItem[]> {
  try {
    const response = await fetch("/data/food.json");
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data: FoodItem[] = await response.json();
    console.log("Fetched food items:", data);
    return data;
  } catch (error) {
    console.error("Failed to fetch food data:", error);
    throw error;
  }
}
