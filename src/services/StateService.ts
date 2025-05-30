// src/services/StateService.ts
import { AppState } from "../types/food.types";

class StateService {
  private state: AppState = {
    currentPage: 'home',
    selectedCategory: null,
    foodItems: []
  };

  private listeners: Array<(state: AppState) => void> = [];

  // Suscribirse a cambios de estado
  subscribe(callback: (state: AppState) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  // Notificar a todos los suscriptores
  private notify() {
    const stateCopy = this.getState();
    this.listeners.forEach(callback => callback(stateCopy));
    this.saveToLocalStorage();
  }

  // Getters
  getState(): AppState {
    return { ...this.state };
  }

  getCurrentPage(): string {
    return this.state.currentPage;
  }

  getSelectedCategory(): string | null {
    return this.state.selectedCategory;
  }

  // Setters con verificación de cambios
  setCurrentPage(page: AppState['currentPage']) {
    if (this.state.currentPage !== page) {
      this.state.currentPage = page;
      this.notify();
    }
  }

  setSelectedCategory(category: string | null) {
    if (this.state.selectedCategory !== category) {
      this.state.selectedCategory = category;
      this.notify();
    }
  }

  setFoodItems(items: any[]) {
    // Solo actualizar si hay cambios reales
    if (JSON.stringify(this.state.foodItems) !== JSON.stringify(items)) {
      this.state.foodItems = items;
      this.notify();
    }
  }

  // Persistencia
  saveToLocalStorage() {
    try {
      localStorage.setItem('vegzi-state', JSON.stringify(this.state));
    } catch (error) {
      console.error('Error saving state to localStorage:', error);
    }
  }

  loadFromLocalStorage() {
    try {
      const saved = localStorage.getItem('vegzi-state');
      if (saved) {
        const parsedState = JSON.parse(saved);
        this.state = { ...this.state, ...parsedState };
        this.notify();
      }
    } catch (error) {
      console.error('Error loading state from localStorage:', error);
    }
  }

  // Filtrar items por categoría
  getItemsByCategory(category: string | null) {
    if (!category) return this.state.foodItems;
    return this.state.foodItems.filter(item => item.category === category);
  }
}

// Singleton
export const stateService = new StateService();
