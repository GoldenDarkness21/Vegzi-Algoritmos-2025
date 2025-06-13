import { collection, addDoc, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../config/firebase.config';
import { FoodItem } from '../types/food.types';

export class RecipeService {
    private static instance: RecipeService;
    private readonly collectionName = 'recipes';

    private constructor() {}

    public static getInstance(): RecipeService {
        if (!RecipeService.instance) {
            RecipeService.instance = new RecipeService();
        }
        return RecipeService.instance;
    }

    async createRecipe(recipe: Omit<FoodItem, 'id'>): Promise<string> {
        try {
            const docRef = await addDoc(collection(db, this.collectionName), {
                ...recipe,
                createdAt: new Date(),
                likes: 0
            });
            return docRef.id;
        } catch (error) {
            console.error('Error creating recipe:', error);
            throw error;
        }
    }

    async getRecipes(): Promise<FoodItem[]> {
        try {
            const querySnapshot = await getDocs(collection(db, this.collectionName));
            return querySnapshot.docs.map(doc => ({
                id: parseInt(doc.id),
                ...doc.data()
            } as FoodItem));
        } catch (error) {
            console.error('Error getting recipes:', error);
            throw error;
        }
    }

    async getPopularRecipes(limitCount: number = 10): Promise<FoodItem[]> {
        try {
            const q = query(
                collection(db, this.collectionName),
                orderBy('likes', 'desc'),
                limit(limitCount)
            );
            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => ({
                id: parseInt(doc.id),
                ...doc.data()
            } as FoodItem));
        } catch (error) {
            console.error('Error getting popular recipes:', error);
            throw error;
        }
    }
} 