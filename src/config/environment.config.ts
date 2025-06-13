// Configure un entorno que sera para el desarrollo
export const ENVIRONMENT = {
    // Cuando firebase este melo cambiarlo a true
    USE_FIREBASE: false,
    
    // Configuración de desarrollo
    DEVELOPMENT: {
        // Usaando datos mockeados
        USE_MOCK_DATA: true,
        
        // Debug logs
        ENABLE_DEBUG: true,
        
        // Debug routing específico
        DEBUG_ROUTING: true,
        
        // Deshabilitar servicios externos que chimbean un resto
        DISABLE_GOOGLE_APIS: true
    },
    
    // imagenes por defectin
    DEFAULT_IMAGES: {
        SALAD: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400",
        BOWL: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400", 
        SMOOTHIE: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400"
    }
};

// Help para el logging
export const debugLog = (message: string, data?: any) => {
    if (ENVIRONMENT.DEVELOPMENT.ENABLE_DEBUG) {
        console.log(`[DEBUG] ${message}`, data || '');
    }
};

// Debug específico para routing
export const debugRoute = (message: string, data?: any) => {
    if (ENVIRONMENT.DEVELOPMENT.DEBUG_ROUTING) {
        console.log(`[🧭 ROUTING] ${message}`, data || '');
    }
}; 