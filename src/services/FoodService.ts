import { FoodItem } from "../types/food.types";
import { ENVIRONMENT, debugLog } from "../config/environment.config";

// ⚠️  NOTA: Temporalmente comente las importaciones de Firestore 
// para no tener errores de permiso por que no voy a hacer eso jajajaja
// 
// Cuando quieran usar Firebase:
// 1. Cambiar ENVIRONMENT.USE_FIREBASE = true en environment.config.ts
// 2. Descomentar estas importaciones:
// import { 
//     getAllRecipes, 
//     getPopularRecipes, 
//     createRecipe, 
//     getUserRecipes, 
//     incrementRecipeLikes 
// } from "./food.firestore.service";

// Datos mockeaditos para desarrollo
const MOCK_FOOD_DATA: FoodItem[] = [
    {
        id: 1,
        image: "/images/ensalada cesar.jpg",
        title: "Ensalada César Fresca",
        description: "Una deliciosa ensalada césar con vegetales frescos y aderezo casero",
        ingredients: ["Lechuga", "Tomate", "Pepino", "Aceite de oliva"],
        time: "15 min",
        likes: 24,
        calories: 120
    },
    {
        id: 2,
        image: "/images/salmon.jpg",
        title: "Salmón con Vegetales",
        description: "Salmón a la plancha con quinoa, verduras y proteínas",
        ingredients: ["Salmón", "Quinoa", "Brócoli", "Aguacate"],
        time: "25 min",
        likes: 45,
        calories: 350
    },
    {
        id: 3,
        image: "/images/banana.jpg",
        title: "Smoothie de Banana",
        description: "Batido nutritivo lleno de vitaminas y minerales",
        ingredients: ["Banana", "Espinaca", "Manzana", "Jengibre"],
        time: "5 min",
        likes: 32,
        calories: 180
    },
    {
        id: 4,
        image: "/images/chicken.jpg",
        title: "Pollo Saludable",
        description: "Pechuga de pollo con especias y verduras",
        ingredients: ["Pollo", "Especias", "Brócoli", "Zanahoria"],
        time: "30 min",
        likes: 28,
        calories: 280
    },
    {
        id: 5,
        image: "/images/vegan.jpg",
        title: "Bowl Vegano",
        description: "Bowl completamente vegano con ingredientes frescos",
        ingredients: ["Quinoa", "Tofu", "Vegetales", "Tahini"],
        time: "20 min",
        likes: 56,
        calories: 320
    },
    {
        id: 6,
        image: "/images/creamy.jpg",
        title: "Sopa Cremosa",
        description: "Sopa cremosa de vegetales con hierbas frescas",
        ingredients: ["Calabaza", "Leche de coco", "Especias", "Hierbas"],
        time: "35 min",
        likes: 41,
        calories: 200
    }
];

export async function fetchFoodData(): Promise<FoodItem[]> {
    try {
        if (ENVIRONMENT.DEVELOPMENT.USE_MOCK_DATA) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    debugLog("Using mock data for development", MOCK_FOOD_DATA);
                    resolve(MOCK_FOOD_DATA);
                }, 100);
            });
        }
        
        // Código original
        // if (ENVIRONMENT.USE_FIREBASE) {
        //     const data = await getAllRecipes();
        //     debugLog("Fetched food items from Firebase:", data);
        //     return data;
        // }
        
        return MOCK_FOOD_DATA;
    } catch (error) {
        console.error("Failed to fetch food data:", error);
        throw error;
    }
}

export async function fetchPopularFoodData(limit: number = 10): Promise<FoodItem[]> {
    try {
        // Retornamos los datos
        return new Promise((resolve) => {
            setTimeout(() => {
                const limitedData = MOCK_FOOD_DATA.slice(0, limit);
                console.log("Fetched popular mock food items:", limitedData);
                resolve(limitedData);
            }, 100);
        });
        
        // Código original comentado
        // const data = await getPopularRecipes(limit);
        // console.log("Fetched popular food items:", data);
        // return data;
    } catch (error) {
        console.error("Failed to fetch popular food data:", error);
        throw error;
    }
}

export async function createNewRecipe(recipe: Omit<FoodItem, 'id'>, userId: string): Promise<string> {
    try {
        // Mock response
        const mockId = Math.random().toString(36).substr(2, 9);
        console.log("Mock: Created new recipe with ID:", mockId);
        return mockId;
        
        // Código original comentado
        // const recipeId = await createRecipe(recipe, userId);
        // console.log("Created new recipe with ID:", recipeId);
        // return recipeId;
    } catch (error) {
        console.error("Failed to create recipe:", error);
        throw error;
    }
}

export async function fetchUserRecipes(userId: string): Promise<FoodItem[]> {
    try {
        // Retornamos datos mock para el usuario
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log("Fetched mock user recipes for:", userId);
                resolve(MOCK_FOOD_DATA);
            }, 100);
        });
        
        // Código original comentado
        // const recipes = await getUserRecipes(userId);
        // console.log("Fetched user recipes:", recipes);
        // return recipes;
    } catch (error) {
        console.error("Failed to fetch user recipes:", error);
        throw error;
    }
}

export async function likeRecipe(recipeId: string): Promise<void> {
    try {
        // Mock response
        console.log("Mock: Incremented likes for recipe:", recipeId);
        
        // Código original comentado
        // await incrementRecipeLikes(recipeId);
        // console.log("Incremented likes for recipe:", recipeId);
    } catch (error) {
        console.error("Failed to increment recipe likes:", error);
        throw error;
    }
}