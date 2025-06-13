import { auth } from '../config/firebase.config'
import { getUserProfile as getFirestoreUserProfile, createUserProfile } from './firestore.service'
import { StorageService } from './storage.service'
import { onAuthStateChanged, updatePassword as firebaseUpdatePassword } from 'firebase/auth'

export interface UserProfile {
    id: string
    email: string
    name: string
    photoURL?: string
    bio?: string
    favoriteRecipes?: string[]
    createdAt: Date
    updatedAt: Date
}

export class UserService {
    /**
     * Obtiene el perfil del usuario actual
     */
    static async getCurrentUserProfile(): Promise<UserProfile | null> {
        try {
            const user = auth.currentUser
            
            if (!user) {
                console.error('No hay usuario autenticado')
                return null
            }

            // Obtener el perfil de Firestore
            let profile = await getFirestoreUserProfile(user.uid)

            // Si no existe el perfil, crearlo
            if (!profile) {
                profile = await this.createProfile(user.uid, user.email || '', user.displayName || '')
            }

            return profile
        } catch (error) {
            console.error('Error en getCurrentUserProfile:', error)
            return null
        }
    }

    /**
     * Crea un perfil inicial para un usuario nuevo
     */
    static async createProfile(userId: string, email: string, displayName?: string): Promise<UserProfile | null> {
        try {
            const newProfile = {
                id: userId,
                email: email,
                name: displayName || email.split('@')[0], // Nombre por defecto
                photoURL: '',
                bio: '',
                favoriteRecipes: [],
                createdAt: new Date(),
                updatedAt: new Date()
            }

            const profile = await createUserProfile(userId, newProfile)
            return profile as UserProfile
        } catch (error) {
            console.error('Error en createProfile:', error)
            return null
        }
    }

    /**
     * Actualiza los datos del perfil del usuario
     */
    static async updateProfile(updates: Partial<UserProfile>): Promise<UserProfile | null> {
        try {
            const user = auth.currentUser
            
            if (!user) {
                console.error('No hay usuario autenticado')
                return null
            }

            // Actualizar los campos proporcionados
            const allowedUpdates = {
                ...updates,
                id: user.uid, // Asegurar que el ID esté presente
                updatedAt: new Date()
            }

            const updatedProfile = await createUserProfile(user.uid, allowedUpdates)
            return updatedProfile as UserProfile
        } catch (error) {
            console.error('Error en updateProfile:', error)
            return null
        }
    }

    /**
     * Actualiza la foto de perfil del usuario
     */
    static async updateAvatar(file: File): Promise<string | null> {
        try {
            const user = auth.currentUser
            
            if (!user) {
                console.error('No hay usuario autenticado')
                return null
            }

            // Obtener el perfil actual para eliminar la foto anterior si existe
            const currentProfile = await this.getCurrentUserProfile()
            
            // Subir la nueva imagen a Supabase Storage
            const path = `profiles/${user.uid}/avatar-${Date.now()}.${file.name.split('.').pop()}`
            const { url, error } = await StorageService.uploadImage(file, path)

            if (error || !url) {
                console.error('Error al subir avatar:', error)
                return null
            }

            // Actualizar la URL en el perfil de Firestore
            const updatedProfile = await this.updateProfile({ 
                photoURL: url
            })

            if (!updatedProfile) {
                console.error('Error al actualizar photoURL en perfil')
                return null
            }

            // Eliminar la imagen anterior si existía
            if (currentProfile?.photoURL) {
                // Extraer el path de la URL anterior
                const oldPath = currentProfile.photoURL.split('/').slice(-3).join('/')
                await StorageService.deleteImage(oldPath)
            }

            return url
        } catch (error) {
            console.error('Error en updateAvatar:', error)
            return null
        }
    }

    /**
     * Actualiza la contraseña del usuario
     */
    static async updatePassword(newPassword: string): Promise<boolean> {
        try {
            const user = auth.currentUser
            
            if (!user) {
                console.error('No hay usuario autenticado')
                return false
            }

            await firebaseUpdatePassword(user, newPassword)
            return true
        } catch (error) {
            console.error('Error en updatePassword:', error)
            return false
        }
    }

    /**
     * Obtiene el perfil de un usuario por ID
     */
    static async getUserProfile(userId: string): Promise<UserProfile | null> {
        try {
            const profile = await getFirestoreUserProfile(userId)
            return profile
        } catch (error) {
            console.error('Error en getUserProfile:', error)
            return null
        }
    }
} 