// src/components/category/categories-page.ts

import { CATEGORIES } from "../../types/category.types";
import { stateService } from "../../services/StateService";
import { fetchFoodData } from "../../services/FoodService";
import "./category-button";
import "./food-card";

class CategoriesPage extends HTMLElement {
  private selectedCategory: string | null = null;
  private foodItems: any[] = [];
  private unsubscribe: (() => void) | null = null;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  async connectedCallback() {
    // Cargar datos de comida primero
    try {
      this.foodItems = await fetchFoodData();
      stateService.setFoodItems(this.foodItems);
      
      // Suscribirse a cambios de estado después de cargar los datos
      this.unsubscribe = stateService.subscribe((state) => {
        if (this.selectedCategory !== state.selectedCategory) {
          this.selectedCategory = state.selectedCategory;
          this.renderFoodCards();
          this.updateSelectedCategoryInfo();
        }
      });

      // Seleccionar categoría por defecto solo si no hay una ya seleccionada
      if (!stateService.getSelectedCategory()) {
        stateService.setSelectedCategory(CATEGORIES[0].id);
      }
      this.selectedCategory = stateService.getSelectedCategory();

      this.render();
      this.attachEventListeners();
    } catch (error) {
      console.error("Error loading food data:", error);
      // Mostrar mensaje de error en la UI
      this.renderError();
    }
  }

  private renderError() {
    if (!this.shadowRoot) return;
    this.shadowRoot.innerHTML = `
      <div style="text-align: center; padding: 2rem; color: #721c24; background-color: #f8d7da; border: 1px solid #f5c6cb; border-radius: 4px;">
        <h2>Error al cargar los datos</h2>
        <p>Lo sentimos, ha ocurrido un error al cargar la información. Por favor, intenta recargar la página.</p>
      </div>
    `;
  }

  disconnectedCallback() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  private attachEventListeners() {
    this.addEventListener('category-selected', (event: any) => {
      this.selectedCategory = event.detail.categoryId;
      stateService.setSelectedCategory(this.selectedCategory);
      this.renderCategoryButtons();
      this.renderFoodCards();
      this.updateSelectedCategoryInfo();
    });
  }

  private renderCategoryButtons() {
    const buttonsContainer = this.shadowRoot?.querySelector('.categories-container');
    if (!buttonsContainer) return;

    buttonsContainer.innerHTML = '';
    
    CATEGORIES.forEach(category => {
      const button = document.createElement('category-button');
      button.setAttribute('category-id', category.id);
      button.setAttribute('name', category.name);
      button.setAttribute('image', category.image);
      button.setAttribute('color', category.color);
      button.setAttribute('selected', category.id === this.selectedCategory ? 'true' : 'false');
      buttonsContainer.appendChild(button);
    });
  }

  private renderFoodCards() {
    const cardsContainer = this.shadowRoot?.querySelector('.food-cards-container');
    if (!cardsContainer) return;

    // Filtrar items por categoría seleccionada
    const filteredItems = this.foodItems.filter(item => 
      item.category === this.selectedCategory
    );

    cardsContainer.innerHTML = '';

    if (filteredItems.length === 0) {
      cardsContainer.innerHTML = `
        <div class="no-items">
          <p>No hay recetas disponibles para esta categoría aún.</p>
        </div>
      `;
      return;
    }

    filteredItems.forEach((item, index) => {
      const card = document.createElement('food-card');
      // Asignar tamaños diferentes basados en el índice
      const sizeClass = this.getCardSize(index);
      card.setAttribute('class', sizeClass);
      card.setAttribute('image', item.image);
      card.setAttribute('title', item.title);
      card.setAttribute('description', item.description);
      card.setAttribute('ingredients', JSON.stringify(item.ingredients));
      card.setAttribute('time', item.time);
      card.setAttribute('likes', String(item.likes));
      card.setAttribute('calories', String(item.calories));
      cardsContainer.appendChild(card);
    });
  }

  private getCardSize(index: number): string {
    // Patrón para asignar tamaños diferentes
    const pattern = index % 6;
    switch (pattern) {
      case 0:
      case 4:
        return 'card-large'; // Tarjetas grandes
      case 1:
      case 3:
        return 'card-medium'; // Tarjetas medianas
      default:
        return 'card-small'; // Tarjetas pequeñas
    }
  }

  private getCurrentCategoryInfo() {
    return CATEGORIES.find(cat => cat.id === this.selectedCategory) || CATEGORIES[0];
  }

  private updateSelectedCategoryInfo() {
    const categoryInfoSection = this.shadowRoot?.querySelector('.selected-category-info');
    const currentCategory = this.getCurrentCategoryInfo();
    
    if (categoryInfoSection) {
      categoryInfoSection.innerHTML = `
        <div class="decorative-bg-container">
          <div class="decorative-bg"></div>
        </div>
        <div class="category-header">
          <img class="category-image-large" src="/images/${currentCategory.image}" alt="${currentCategory.name}">
          <div class="category-info">
            <h2 class="category-title">${currentCategory.name}</h2>
            <p class="category-description">${currentCategory.description}</p>
          </div>
        </div>
      `;
      
      // Actualizar el color de fondo
      categoryInfoSection.setAttribute('style', `
        background: linear-gradient(135deg, ${currentCategory.color}22 0%, ${currentCategory.color}44 100%);
      `);
    }
  }

  render() {
    const currentCategory = this.getCurrentCategoryInfo();
    
    this.shadowRoot!.innerHTML = `
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .container {
          width: 100%;
          max-width: 100%;
          margin: 0 auto;
          padding: 20px 0;
          font-family: 'Poppins', sans-serif;
          background-color: #fff;
        }

        .page-title {
          text-align: center;
          font-size: 2.2rem;
          color: #2F5A41;
          margin-bottom: 40px;
          font-weight: 600;
          letter-spacing: 0.5px;
          font-family: 'Poppins', sans-serif;
        }

        .categories-container {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-bottom: 50px;
          padding: 30px 40px 20px 40px;
          min-height: 280px;
          flex-wrap: nowrap;
          overflow-x: auto;
          width: 100%;
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        .categories-container::-webkit-scrollbar {
          display: none;
        }

        @media (max-width: 1200px) {
          .categories-container {
            justify-content: flex-start;
            padding-left: calc((100% - 1000px) / 2);
          }
        }

        @media (max-width: 1000px) {
          .categories-container {
            padding-left: 40px;
          }
        }

        .selected-category-info {
          max-width: 1200px;
          height: 200px;
          margin: 0 auto;
          background: linear-gradient(135deg, ${currentCategory.color}22 0%, ${currentCategory.color}44 100%);
          border-radius: 30px;
          padding: 30px 50px;
          margin-bottom: 40px;
          position: relative;
          border: 1px solid ${currentCategory.color}33;
        }

        .category-header {
          display: flex;
          align-items: center;
          gap: 40px;
          position: relative;
          height: 140px;
          z-index: 1;
        }

        .category-image-large {
          width: 280px;
          height: 280px;
          object-fit: cover;
          border-radius: 15px;
          flex-shrink: 0;
          margin-left: -80px;
          margin-top: -40px;
          position: relative;
          z-index: 2;
        }

        .category-info {
          flex: 1;
          padding-left: 20px;
          max-height: 140px;
          overflow: hidden;
        }

        .category-title {
          font-size: 1.6rem;
          color: #5a7c65;
          margin: 0 0 8px 0;
          font-weight: 600;
          line-height: 1.2;
        }

        .category-description {
          font-size: 0.9rem;
          color: #4A4A4A;
          line-height: 1.4;
          margin: 0;
          max-width: 380px;
        }

        .decorative-bg-container {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          overflow: hidden;
          border-radius: 30px;
        }

        .decorative-bg {
          position: absolute;
          top: -100px;
          right: -100px;
          width: 300px;
          height: 300px;
          background: url('/images/${currentCategory.image}') center/cover;
          opacity: 0.08;
          border-radius: 50%;
        }

        .food-cards-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 12px;
          padding: 12px;
          max-width: 1400px;
          margin: 0 auto;
          grid-auto-rows: minmax(200px, auto);
          grid-auto-flow: dense;
        }

        .card {
          width: 100%;
          height: 100%;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          background: #fff;
          position: relative;
        }

        @media (min-width: 768px) {
          .food-cards-container {
            grid-template-columns: repeat(auto-fill, 220px);
            justify-content: center;
          }

          .card-large {
            grid-row: span 2;
          }

          .card-medium {
            grid-row: span 1.5;
          }

          .card-small {
            grid-row: span 1;
          }
        }

        @media (max-width: 768px) {
          .food-cards-container {
            grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
            gap: 8px;
            padding: 8px;
          }
        }

        .no-items {
          grid-column: 1 / -1;
          text-align: center;
          padding: 40px;
          background: #f8f9fa;
          border-radius: 15px;
          color: #6c757d;
        }

        @media (max-width: 768px) {
          .container {
            padding: 15px;
          }

          .page-title {
            font-size: 2.2rem;
            margin-bottom: 30px;
          }

          .categories-container {
            gap: 20px;
            margin-bottom: 40px;
          }
          
          .selected-category-info {
            padding: 30px;
            border-radius: 20px;
          }

          .category-header {
            flex-direction: column;
            text-align: center;
            gap: 25px;
          }

          .category-image-large {
            width: 200px;
            height: 200px;
            border-radius: 12px;
            margin-left: -40px;
          }

          .category-title {
            font-size: 1.4rem;
          }

          .category-description {
            font-size: 0.85rem;
          }
        }

        @media (max-width: 480px) {
          .categories-container {
            gap: 15px;
          }

          .food-cards-container {
            grid-template-columns: 1fr;
            gap: 15px;
          }
        }
      </style>

      <div class="container">
        <h1 class="page-title">Categories</h1>
        
        <div class="categories-container">
          <!-- Los botones se renderizan aquí -->
        </div>

        <div class="selected-category-info">
          <div class="decorative-bg-container">
            <div class="decorative-bg"></div>
          </div>
          <div class="category-header">
            <img class="category-image-large" src="/images/${currentCategory.image}" alt="${currentCategory.name}">
            <div class="category-info">
              <h2 class="category-title">${currentCategory.name}</h2>
              <p class="category-description">${currentCategory.description}</p>
            </div>
          </div>
        </div>

        <div class="food-cards-container">
          <!-- Las cards se renderizan aquí -->
        </div>
      </div>
    `;

    // Renderizar botones y cards después de que el DOM esté listo
    setTimeout(() => {
      this.renderCategoryButtons();
      this.renderFoodCards();
    }, 0);
  }
}

if (!customElements.get("categories-page")) {
  customElements.define("categories-page", CategoriesPage);
}