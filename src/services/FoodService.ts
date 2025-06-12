import { FoodItem } from "../types/food.types";
import { 
    getAllRecipes, 
    getPopularRecipes, 
    createRecipe, 
    getUserRecipes, 
    incrementRecipeLikes 
} from "./food.firestore.service";

export async function fetchFoodData(): Promise<FoodItem[]> {
    try {
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
        const data = await getPopularRecipes(limit);
        console.log("Fetched popular food items:", data);
        return data;
    } catch (error) {
        console.error("Failed to fetch popular food data:", error);
        throw error;
    }
}

export async function createNewRecipe(recipe: Omit<FoodItem, 'id'>, userId: string): Promise<string> {
    try {
        const recipeId = await createRecipe(recipe, userId);
        console.log("Created new recipe with ID:", recipeId);
        return recipeId;
    } catch (error) {
        console.error("Failed to create recipe:", error);
        throw error;
    }
}

export async function fetchUserRecipes(userId: string): Promise<FoodItem[]> {
    try {
        const recipes = await getUserRecipes(userId);
        console.log("Fetched user recipes:", recipes);
        return recipes;
    } catch (error) {
        console.error("Failed to fetch user recipes:", error);
        throw error;
    }
}

export async function likeRecipe(recipeId: string): Promise<void> {
    try {
        await incrementRecipeLikes(recipeId);
        console.log("Incremented likes for recipe:", recipeId);
    } catch (error) {
        console.error("Failed to increment recipe likes:", error);
        throw error;
    }
}