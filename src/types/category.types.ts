// src/types/category.types.ts
export interface Category {
  id: string;
  name: string;
  description: string;
  image: string;
  color: string;
}

export const CATEGORIES: Category[] = [
  {
    id: 'desayunos',
    name: 'Healthy Breakfasts',
    description: 'Start your day with energy and vitality with our nutritious and delicious breakfast options.',
    image: 'desayuno.jpg',
    color: '#A8D5BA'
  },
  {
    id: 'almuerzos',
    name: 'Nutritious Lunches',
    description: 'Discover balanced and tasty dishes that will keep you satisfied and energized throughout the day.',
    image: 'almuerzo.jpg',
    color: '#B8E6B8'
  },
  {
    id: 'cenas',
    name: 'Light Dinners',
    description: 'End your day with light yet satisfying options that don\'t compromise on taste or nutrition.',
    image: 'cena.jpg',
    color: '#F5E6A3'
  },
  {
    id: 'snacks',
    name: 'Healthy Snacks',
    description: 'Keep your energy up between meals with healthy and delicious options that don\'t compromise your diet.',
    image: 'snack.jpg',
    color: '#A8C8A8'
  },
  {
    id: 'postres',
    name: 'Healthy Desserts',
    description: 'Enjoy sweet pleasures guilt-free with our healthy alternatives to traditional desserts.',
    image: 'postre.jpg',
    color: '#E8B4B8'
  }
];