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
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

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

        .section-title {
          font-family: 'Poppins', sans-serif;
          text-align: center;
          font-size: 2.2rem;
          font-weight: 600;
          color: #4CAF50;
          margin: 40px 0 20px 0;
          position: relative;
        }

        .section-title::after {
          content: '';
          width: 60px;
          height: 4px;
          background-color: #A5D6A7;
          display: block;
          margin: 12px auto 0;
          border-radius: 2px;
        }
      </style>
    `;

    try {
      const foodData: FoodItem[] = await fetchFoodData();

      const cards = foodData
        .map(
          (item) => `
        <div class="grid-item">
          <food-card 
            image="${item.image}" 
            title="${item.title}" 
            description="${item.description}" 
            ingredients='${JSON.stringify(item.ingredients)}'
            time="${item.time}"
            likes="${item.likes}"
            calories="${item.calories}">
          </food-card>
        </div>
      `
        )
        .join("");

      this.innerHTML = `
        ${styles}
        <h2 class="section-title">For you</h2>
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

