import { fetchFoodData } from "../services/FoodService";
import { FoodItem } from "../types/food.types";

class FoodCart extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.loadAndRender();
  }

  async loadAndRender() {
    const styles = `
      <style>
        .grid {
          column-count: 3;
          column-gap: 16px;
        }

        food-card {
          display: inline-block;
          width: 100%;
        }

        @media (max-width: 768px) {
          .grid {
            column-count: 2;
          }
        }

        @media (max-width: 480px) {
          .grid {
            column-count: 1;
          }
        }
      </style>
    `;

    try {
      const foodData: FoodItem[] = await fetchFoodData();
      const cards = foodData
        .map(item => `<food-card image="${item.image}"></food-card>`)
        .join("");

      this.shadowRoot!.innerHTML = `
        ${styles}
        <div class="grid">
          ${cards}
        </div>
      `;
    } catch (error) {
      console.error("Error loading food items:", error);
      this.shadowRoot!.innerHTML = `<p>Error loading food items.</p>`;
    }
  }
}


if (!customElements.get("food-cart")) {
  customElements.define("food-cart", FoodCart);
}


  