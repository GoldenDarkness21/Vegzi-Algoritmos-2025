import { 
    getFirestore, 
    collection, 
    doc, 
    setDoc, 
    getDoc, 
    getDocs, 
    updateDoc, 
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    increment
} from 'firebase/firestore';
import { app } from '../config/firebase.config';
import { FoodItem } from '../types/food.types';

const db = getFirestore(app);
const RECIPES_COLLECTION = 'recipes';

// Crear o actualizar una receta
export const createRecipe = async (recipe: Omit<FoodItem, 'id'>, userId: string): Promise<string> => {
    try {
        const recipesRef = collection(db, RECIPES_COLLECTION);
        const newRecipeRef = doc(recipesRef);
        
        const newRecipe = {
            ...recipe,
            id: newRecipeRef.id,
            authorId: userId,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        await setDoc(newRecipeRef, newRecipe);
        return newRecipeRef.id;
    } catch (error) {
        console.error('Error al crear receta:', error);
        throw error;
    }
};

// Obtener una receta por ID
export const getRecipeById = async (recipeId: string): Promise<FoodItem | null> => {
    try {
        const recipeRef = doc(db, RECIPES_COLLECTION, recipeId);
        const recipeDoc = await getDoc(recipeRef);

        if (recipeDoc.exists()) {
            return recipeDoc.data() as FoodItem;
        }
        return null;
    } catch (error) {
        console.error('Error al obtener receta:', error);
        throw error;
    }
};

// Obtener todas las recetas
export const getAllRecipes = async (): Promise<FoodItem[]> => {
    try {
        const recipesRef = collection(db, RECIPES_COLLECTION);
        const querySnapshot = await getDocs(recipesRef);
        
        return querySnapshot.docs.map(doc => doc.data() as FoodItem);
    } catch (error) {
        console.error('Error al obtener recetas:', error);
        throw error;
    }
};

// Obtener recetas por usuario
export const getUserRecipes = async (userId: string): Promise<FoodItem[]> => {
    try {
        const recipesRef = collection(db, RECIPES_COLLECTION);
        const q = query(recipesRef, where('authorId', '==', userId));
        const querySnapshot = await getDocs(q);
        
        return querySnapshot.docs.map(doc => doc.data() as FoodItem);
    } catch (error) {
        console.error('Error al obtener recetas del usuario:', error);
        throw error;
    }
};

// Actualizar una receta
export const updateRecipe = async (recipeId: string, updates: Partial<FoodItem>): Promise<void> => {
    try {
        const recipeRef = doc(db, RECIPES_COLLECTION, recipeId);
        await updateDoc(recipeRef, {
            ...updates,
            updatedAt: new Date()
        });
    } catch (error) {
        console.error('Error al actualizar receta:', error);
        throw error;
    }
};

// Eliminar una receta
export const deleteRecipe = async (recipeId: string): Promise<void> => {
    try {
        const recipeRef = doc(db, RECIPES_COLLECTION, recipeId);
        await deleteDoc(recipeRef);
    } catch (error) {
        console.error('Error al eliminar receta:', error);
        throw error;
    }
};

// Incrementar likes de una receta
export const incrementRecipeLikes = async (recipeId: string): Promise<void> => {
    try {
        const recipeRef = doc(db, RECIPES_COLLECTION, recipeId);
        await updateDoc(recipeRef, {
            likes: increment(1)
        });
    } catch (error) {
        console.error('Error al incrementar likes:', error);
        throw error;
    }
};

// Obtener recetas más populares
export const getPopularRecipes = async (limit_count: number = 10): Promise<FoodItem[]> => {
    try {
        const recipesRef = collection(db, RECIPES_COLLECTION);
        const q = query(recipesRef, orderBy('likes', 'desc'), limit(limit_count));
        const querySnapshot = await getDocs(q);
        
        return querySnapshot.docs.map(doc => doc.data() as FoodItem);
    } catch (error) {
        console.error('Error getting popular recipes:', error);
        throw error;
    }
}; 