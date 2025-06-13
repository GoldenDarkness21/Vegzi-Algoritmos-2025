import { createClient } from '@supabase/supabase-js'

// Configuración de Supabase
// IMPORTANTE: Reemplaza estos valores con los de tu proyecto de Supabase
const supabaseUrl = process.env.SUPABASE_URL || 'https://hbrhdgjeduyhkpwwfpuv.supabase.co'
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhicmhkZ2plZHV5aGtwd3dmcHV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3OTIwMDAsImV4cCI6MjA2NTM2ODAwMH0.IHFIJBcOJfiNnOWz4t_pzqRh3HPonyy1zGSqcalTV48'

// Crear cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Configuración del bucket de storage
export const STORAGE_BUCKET = 'recipe-images' // Nombre del bucket para las imágenes de recetas

// Tipos para el storage
export interface UploadFileResponse {
    data: {
        path: string
    } | null
    error: Error | null
}

// URL base para acceder a las imágenes públicas
export const getPublicUrl = (path: string): string => {
    const { data } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(path)
    
    return data.publicUrl
} 