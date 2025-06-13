import "./food-popup";
import { FoodItem } from "../types/food.types";

class FoodCard extends HTMLElement {
  data: FoodItem = {
    id: 0,
    image: "",
    title: "",
    description: "",
    ingredients: [],
    time: "",
    likes: 0,
    calories: 0
  };

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return [
      "id",
      "image",
      "title",
      "description",
      "ingredients",
      "time",
      "likes",
      "calories"
    ];
  }

  attributeChangedCallback(name: string, _oldVal: string, newVal: string) {
    if (name === "id") this.data.id = Number(newVal);
    if (name === "image") this.data.image = newVal;
    if (name === "title") this.data.title = newVal;
    if (name === "description") this.data.description = newVal;
    if (name === "ingredients") this.data.ingredients = JSON.parse(newVal);
    if (name === "time") this.data.time = newVal;
    if (name === "likes") this.data.likes = Number(newVal);
    if (name === "calories") this.data.calories = Number(newVal);
    this.render();
  }

  connectedCallback() {
    this.render();

    this.shadowRoot?.querySelector(".card")?.addEventListener("click", () => {
      const popup = document.createElement("food-popup");
      popup.setAttribute("id", String(this.data.id));
      popup.setAttribute("image", this.data.image);
      popup.setAttribute("title", this.data.title);
      popup.setAttribute("description", this.data.description);
      popup.setAttribute("ingredients", JSON.stringify(this.data.ingredients));
      popup.setAttribute("time", this.data.time);
      popup.setAttribute("likes", String(this.data.likes));
      popup.setAttribute("calories", String(this.data.calories));
      document.body.appendChild(popup);
    });
  }

  render() {
    this.shadowRoot!.innerHTML = `
      <style>
        .card {
          width: 100%;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          margin-bottom: 16px;
          cursor: pointer;
          transition: transform 0.2s ease;
          background: #fff;
        }

        .card:hover {
          transform: scale(1.02);
        }

        img {
          width: 100%;
          display: block;
        }
      </style>
      <div class="card">
        <img src="/images/${this.data.image}" alt="${this.data.title}">
      </div>
    `;
  }
}

if (!customElements.get("food-card")) {
  customElements.define("food-card", FoodCard);
}



  