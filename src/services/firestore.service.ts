import { getFirestore, doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { app } from '../config/firebase.config';

const db = getFirestore(app);

interface UserProfile {
    id: string;
    name: string;
    email: string;
    photoURL?: string;
    bio?: string;
    favoriteRecipes?: string[];
    createdAt: Date;
    updatedAt: Date;
}

// create or update user profile
export const createUserProfile = async (userId: string, userData: Partial<UserProfile>) => {
    try {
        const userRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
            // if user does not exist, create new profile
            const newProfile: UserProfile = {
                id: userId,
                name: userData.name || '',
                email: userData.email || '',
                createdAt: new Date(),
                updatedAt: new Date(),
                ...userData
            };
            await setDoc(userRef, newProfile);
            return newProfile;
        } else {
            // if user exists, update data
            const updatedData = {
                ...userData,
                updatedAt: new Date()
            };
            await updateDoc(userRef, updatedData);
            return {
                ...userDoc.data(),
                ...updatedData
            };
        }
    } catch (error) {
        console.error('Error al crear/actualizar perfil:', error);
        throw error;
    }
};

// get user profile
export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
        const userRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            return userDoc.data() as UserProfile;
        }
        return null;
    } catch (error) {
        console.error('Error al obtener perfil:', error);
        throw error;
    }
};

// add recipe to favorites
export const addToFavorites = async (userId: string, recipeId: string) => {
    try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
            favoriteRecipes: arrayUnion(recipeId),
            updatedAt: new Date()
        });
    } catch (error) {
        console.error('Error al agregar a favoritos:', error);
        throw error;
    }
};

// remove recipe from favorites
export const removeFromFavorites = async (userId: string, recipeId: string) => {
    try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
            favoriteRecipes: arrayRemove(recipeId),
            updatedAt: new Date()
        });
    } catch (error) {
        console.error('Error removing from favorites:', error);
        throw error;
    }
}; 