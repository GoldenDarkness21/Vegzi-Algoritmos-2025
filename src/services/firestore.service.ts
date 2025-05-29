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

// Crear o actualizar perfil de usuario
export const createUserProfile = async (userId: string, userData: Partial<UserProfile>) => {
    try {
        const userRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
            // Si el usuario no existe, crear nuevo perfil
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
            // Si el usuario existe, actualizar datos
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

// Obtener perfil de usuario
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

// Agregar receta a favoritos
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

// Remover receta de favoritos
export const removeFromFavorites = async (userId: string, recipeId: string) => {
    try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
            favoriteRecipes: arrayRemove(recipeId),
            updatedAt: new Date()
        });
    } catch (error) {
        console.error('Error al remover de favoritos:', error);
        throw error;
    }
}; 