// src/services/FoodService.ts

export interface FoodItem {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  ingredients: string[];
  time: string;
  calories: number | string;
  likes: number | string;
}

// Función para obtener los datos de comida desde el archivo JSON
export const fetchFoodData = async (): Promise<FoodItem[]> => {
  try {
    const response = await fetch('/data/food.json');
    if (!response.ok) {
      throw new Error('Error al cargar los datos');
    }
    const data = await response.json();
    
    // Asignar categorías solo si no existen
    return data.map((item: any) => ({
      ...item,
      id: item.id.toString(), // Convertir ID a string
      category: item.category || assignCategoryByKeywords(item), // Solo asignar si no existe
      calories: typeof item.calories === 'string' ? 
        parseInt(item.calories.split(' ')[0]) : item.calories, // Normalizar calorías
      likes: typeof item.likes === 'string' ? 
        parseInt(item.likes) : item.likes // Normalizar likes
    }));
  } catch (error) {
    console.error('Error fetching food data:', error);
    return [];
  }
};

// Función auxiliar para asignar categorías automáticamente
function assignCategoryByKeywords(item: any): string {
  const title = item.title.toLowerCase();
  const description = item.description.toLowerCase();
  const content = `${title} ${description}`;

  // Reglas específicas para platos
  if (title.includes('crunchy veggie sticks') || title.includes('grilled chicken wrap')) {
    return 'desayunos';
  }

  if (title.includes('zucchini noodles') || 
      title.includes('tofu vegetable') || 
      title.includes('herb-steamed') ||
      title.includes('light vegetable curry')) {
    return 'cenas';
  }

  // Mover platos específicos a postres
  if (title.includes('vanilla chia pudding') ||
      title.includes('coconut mango chia pudding') ||
      title.includes('tropical smoothie bowl') ||
      title.includes('light berry cheesecake') ||
      title.includes('banana nice cream')) {
    return 'postres';
  }

  // Palabras clave para cada categoría
  const categoryKeywords = {
    'desayunos': ['breakfast', 'oatmeal', 'yogurt', 'cereal', 'toast', 'morning', 'banana'],
    'almuerzos': ['salad', 'wrap', 'bowl', 'burger', 'sandwich', 'lunch'],
    'cenas': ['dinner', 'pasta', 'salmon', 'chicken', 'shrimp', 'tacos', 'rice'],
    'snacks': ['snack', 'nuts', 'fruit', 'small', 'quick', 'light'],
    'postres': ['dessert', 'cheesecake', 'sweet', 'cake', 'ice cream', 'chocolate']
  };

  // Buscar coincidencias
  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(keyword => content.includes(keyword))) {
      return category;
    }
  }

  // Por defecto, asignar a almuerzos si no encuentra coincidencias
  return 'almuerzos';
}

// Función para filtrar items por categoría
export function filterByCategory(items: FoodItem[], category: string): FoodItem[] {
  return items.filter(item => item.category === category);
}

// Función para obtener estadísticas por categoría
export function getCategoryStats(items: FoodItem[]) {
  const stats: { [key: string]: number } = {};
  
  items.forEach(item => {
    stats[item.category] = (stats[item.category] || 0) + 1;
  });
  
  return stats;
}