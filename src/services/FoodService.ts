import { FoodItem } from "../types/food.types";
import { getAllRecipes, getPopularRecipes } from "./food.firestore.service";

export async function fetchFoodData(): Promise<FoodItem[]> {
  try {
    // Obtener todas las recetas de Firestore
    const data = await getAllRecipes();
    console.log("Fetched food items:", data);
    return data;
  } catch (error) {
    console.error("Failed to fetch food data:", error);
    throw error;
  }
}

export async function fetchPopularFoodData(limit: number = 10): Promise<FoodItem[]> {
  try {
    // Obtener las recetas más populares de Firestore
    const data = await getPopularRecipes(limit);
    console.log("Fetched popular food items:", data);
    return data;
  } catch (error) {
    console.error("Failed to fetch popular food data:", error);
    throw error;
  }
}
