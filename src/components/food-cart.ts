import Masonry from "masonry-layout";
import imagesLoaded from "imagesloaded";
import { fetchFoodData } from "../services/FoodService";
import { FoodItem } from "../types/food.types";

class FoodCart extends HTMLElement {
  constructor() {
    super();
  }
  
  connectedCallback() {
    this.loadAndRender();
  }

  async loadAndRender() {
    const styles = `
      <style>
    .masonry-grid {
      display: flex;
      margin-left: -16px;
      width: auto;
      flex-wrap: wrap;
      justify-content: center;
      margin: 0 auto;
    }

    .grid-item {
      width: 300px;
      margin-left: 16px;
      margin-bottom: 16px;
    }

    food-card {
      display: block;
      width: 100%;
    }
      </style>
    `;

    try {
      const foodData: FoodItem[] = await fetchFoodData();

      const cards = foodData
        .map(
          (item) => `
          <div class="grid-item">
            <food-card image="${item.image}"></food-card>
          </div>
        `
        )
        .join("");

      // 🔁 Renderizamos directamente en el DOM (no shadow)
      this.innerHTML = `
        ${styles}
        <div class="masonry-grid">
          ${cards}
        </div>
      `;

      const grid = this.querySelector(".masonry-grid");

      if (grid) {
        imagesLoaded(grid, () => {
          new Masonry(grid, {
            itemSelector: ".grid-item",
            columnWidth: ".grid-item",
            gutter: 16,
            fitWidth: true,
          });
        });
      } else {
        console.error("No se encontró el contenedor .masonry-grid");
      }
    } catch (error) {
      console.error("Error loading food items:", error);
      this.innerHTML = `<p>Error loading food items.</p>`;
    }
  }
}

if (!customElements.get("food-cart")) {
  customElements.define("food-cart", FoodCart);
}

