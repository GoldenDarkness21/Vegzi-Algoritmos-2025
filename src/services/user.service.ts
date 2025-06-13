import { supabase } from '../config/supabase.config'
import { StorageService } from './storage.service'

export interface UserProfile {
    id: string
    email: string
    name: string
    avatar_url: string | null
    created_at: string
    updated_at: string
}

export class UserService {
    /**
     * Obtiene el perfil del usuario actual
     */
    static async getCurrentUserProfile(): Promise<UserProfile | null> {
        try {
            // Obtener el usuario autenticado
            const { data: { user }, error: authError } = await supabase.auth.getUser()
            
            if (authError || !user) {
                console.error('No hay usuario autenticado:', authError)
                return null
            }

            // Obtener el perfil de la tabla profiles
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single()

            if (error) {
                console.error('Error al obtener perfil:', error)
                
                // Si no existe el perfil, crearlo
                if (error.code === 'PGRST116') {
                    return await this.createProfile(user.id, user.email || '')
                }
                return null
            }

            return data as UserProfile
        } catch (error) {
            console.error('Error en getCurrentUserProfile:', error)
            return null
        }
    }

    /**
     * Crea un perfil inicial para un usuario nuevo
     */
    static async createProfile(userId: string, email: string): Promise<UserProfile | null> {
        try {
            const newProfile = {
                id: userId,
                email: email,
                name: email.split('@')[0], // Nombre por defecto
                avatar_url: null,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            }

            const { data, error } = await supabase
                .from('profiles')
                .insert([newProfile])
                .select()
                .single()

            if (error) {
                console.error('Error al crear perfil:', error)
                return null
            }

            return data as UserProfile
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
            const { data: { user }, error: authError } = await supabase.auth.getUser()
            
            if (authError || !user) {
                console.error('No hay usuario autenticado:', authError)
                return null
            }

            // Actualizar solo los campos permitidos
            const allowedUpdates = {
                name: updates.name,
                updated_at: new Date().toISOString()
            }

            const { data, error } = await supabase
                .from('profiles')
                .update(allowedUpdates)
                .eq('id', user.id)
                .select()
                .single()

            if (error) {
                console.error('Error al actualizar perfil:', error)
                return null
            }

            return data as UserProfile
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
            const { data: { user }, error: authError } = await supabase.auth.getUser()
            
            if (authError || !user) {
                console.error('No hay usuario autenticado:', authError)
                return null
            }

            // Obtener el perfil actual para eliminar la foto anterior si existe
            const currentProfile = await this.getCurrentUserProfile()
            
            // Subir la nueva imagen
            const path = `profiles/${user.id}/avatar-${Date.now()}.${file.name.split('.').pop()}`
            const { url, error } = await StorageService.uploadImage(file, path)

            if (error || !url) {
                console.error('Error al subir avatar:', error)
                return null
            }

            // Actualizar la URL en el perfil
            const { data, error: updateError } = await supabase
                .from('profiles')
                .update({ 
                    avatar_url: url,
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.id)
                .select()
                .single()

            if (updateError) {
                console.error('Error al actualizar avatar_url:', updateError)
                return null
            }

            // Eliminar la imagen anterior si existía
            if (currentProfile?.avatar_url) {
                // Extraer el path de la URL anterior
                const oldPath = currentProfile.avatar_url.split('/').slice(-3).join('/')
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
            const { error } = await supabase.auth.updateUser({
                password: newPassword
            })

            if (error) {
                console.error('Error al actualizar contraseña:', error)
                return false
            }

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
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single()

            if (error) {
                console.error('Error al obtener perfil de usuario:', error)
                return null
            }

            return data as UserProfile
        } catch (error) {
            console.error('Error en getUserProfile:', error)
            return null
        }
    }
} 