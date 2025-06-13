import { collection, getDocs, addDoc, query, where, increment, updateDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase.config';
import { FoodItem } from '../types/food.types';

export async function getAllRecipes(): Promise<FoodItem[]> {
    try {
        const recipesRef = collection(db, 'recipes');
        const snapshot = await getDocs(recipesRef);
        return snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: parseInt(doc.id),
                image: data.image || '',
                title: data.title || '',
                description: data.description || '',
                ingredients: data.ingredients || [],
                time: data.time || '',
                likes: data.likes || 0,
                calories: data.calories || 0
            } as FoodItem;
        });
    } catch (error) {
        console.error("Error getting recipes:", error);
        throw error;
    }
}

export async function getPopularRecipes(limit: number = 10): Promise<FoodItem[]> {
    try {
        const recipesRef = collection(db, 'recipes');
        const snapshot = await getDocs(recipesRef);
        const recipes = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: parseInt(doc.id),
                image: data.image || '',
                title: data.title || '',
                description: data.description || '',
                ingredients: data.ingredients || [],
                time: data.time || '',
                likes: data.likes || 0,
                calories: data.calories || 0
            } as FoodItem;
        });
        
        return recipes
            .sort((a, b) => (b.likes || 0) - (a.likes || 0))
            .slice(0, limit);
    } catch (error) {
        console.error("Error getting popular recipes:", error);
        throw error;
    }
}

export async function createRecipe(recipe: Omit<FoodItem, 'id'>, userId: string): Promise<string> {
    try {
        const recipesRef = collection(db, 'recipes');
        const docRef = await addDoc(recipesRef, {
            ...recipe,
            userId,
            createdAt: new Date(),
            likes: 0
        });
        return docRef.id;
    } catch (error) {
        console.error("Error creating recipe:", error);
        throw error;
    }
}

export async function getUserRecipes(userId: string): Promise<FoodItem[]> {
    try {
        const recipesRef = collection(db, 'recipes');
        const q = query(recipesRef, where('userId', '==', userId));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: parseInt(doc.id),
                image: data.image || '',
                title: data.title || '',
                description: data.description || '',
                ingredients: data.ingredients || [],
                time: data.time || '',
                likes: data.likes || 0,
                calories: data.calories || 0
            } as FoodItem;
        });
    } catch (error) {
        console.error("Error getting user recipes:", error);
        throw error;
    }
}

export async function incrementRecipeLikes(recipeId: string): Promise<void> {
    try {
        const recipeRef = doc(db, 'recipes', recipeId);
        await updateDoc(recipeRef, {
            likes: increment(1)
        });
    } catch (error) {
        console.error("Error incrementing recipe likes:", error);
        throw error;
    }
} 