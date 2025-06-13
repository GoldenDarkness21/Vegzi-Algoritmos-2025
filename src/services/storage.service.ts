import { supabase, STORAGE_BUCKET, getPublicUrl } from '../config/supabase.config'

export class StorageService {
    /**
     * Sube una imagen al storage de Supabase
     * @param file - Archivo a subir
     * @param path - Ruta donde se guardará el archivo (ej: 'recipes/123/image.jpg')
     * @returns URL pública de la imagen o error
     */
    static async uploadImage(file: File, path: string): Promise<{ url: string | null; error: Error | null }> {
        try {
            // Validar que sea una imagen
            if (!file.type.startsWith('image/')) {
                return { url: null, error: new Error('El archivo debe ser una imagen') }
            }

            // Validar tamaño (máximo 5MB)
            const maxSize = 5 * 1024 * 1024 // 5MB
            if (file.size > maxSize) {
                return { url: null, error: new Error('La imagen no debe superar los 5MB') }
            }

            // Subir archivo
            const { data, error } = await supabase.storage
                .from(STORAGE_BUCKET)
                .upload(path, file, {
                    cacheControl: '3600',
                    upsert: true // Sobrescribir si ya existe
                })

            if (error) {
                console.error('Error al subir imagen:', error)
                return { url: null, error }
            }

            // Obtener URL pública
            const publicUrl = getPublicUrl(data.path)
            return { url: publicUrl, error: null }

        } catch (error) {
            console.error('Error en uploadImage:', error)
            return { url: null, error: error as Error }
        }
    }

    /**
     * Sube múltiples imágenes
     * @param files - Array de archivos
     * @param basePath - Ruta base (ej: 'recipes/123')
     * @returns Array de URLs públicas
     */
    static async uploadMultipleImages(files: File[], basePath: string): Promise<string[]> {
        const uploadPromises = files.map(async (file, index) => {
            const extension = file.name.split('.').pop()
            const path = `${basePath}/image-${Date.now()}-${index}.${extension}`
            const result = await this.uploadImage(file, path)
            return result.url
        })

        const results = await Promise.all(uploadPromises)
        return results.filter((url): url is string => url !== null)
    }

    /**
     * Elimina una imagen del storage
     * @param path - Ruta del archivo a eliminar
     * @returns true si se eliminó correctamente, false si hubo error
     */
    static async deleteImage(path: string): Promise<boolean> {
        try {
            const { error } = await supabase.storage
                .from(STORAGE_BUCKET)
                .remove([path])

            if (error) {
                console.error('Error al eliminar imagen:', error)
                return false
            }

            return true
        } catch (error) {
            console.error('Error en deleteImage:', error)
            return false
        }
    }

    /**
     * Lista todas las imágenes en una carpeta
     * @param folder - Carpeta a listar (ej: 'recipes/123')
     * @returns Array de objetos con información de los archivos
     */
    static async listImages(folder: string): Promise<any[]> {
        try {
            const { data, error } = await supabase.storage
                .from(STORAGE_BUCKET)
                .list(folder, {
                    limit: 100,
                    offset: 0
                })

            if (error) {
                console.error('Error al listar imágenes:', error)
                return []
            }

            return data || []
        } catch (error) {
            console.error('Error en listImages:', error)
            return []
        }
    }

    /**
     * Genera una URL temporal con expiración
     * @param path - Ruta del archivo
     * @param expiresIn - Segundos hasta que expire el link (default: 3600 = 1 hora)
     * @returns URL temporal o null si hay error
     */
    static async getSignedUrl(path: string, expiresIn: number = 3600): Promise<string | null> {
        try {
            const { data, error } = await supabase.storage
                .from(STORAGE_BUCKET)
                .createSignedUrl(path, expiresIn)

            if (error) {
                console.error('Error al generar URL firmada:', error)
                return null
            }

            return data.signedUrl
        } catch (error) {
            console.error('Error en getSignedUrl:', error)
            return null
        }
    }
} 