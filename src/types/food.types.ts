// src/types/food.types.ts
export interface FoodItem {
  id: number;
  image: string;
  title: string;
  description: string;
  ingredients: string[];
  time: string;
  likes: number;
  calories: number;
  category: string; // Nueva propiedad para la categoría
}

// Tipo para el estado de la aplicación
export interface AppState {
  currentPage: 'home' | 'categories' | 'profile' | 'add-post';
  selectedCategory: string | null;
  foodItems: FoodItem[];
}