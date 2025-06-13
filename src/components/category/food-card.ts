import "./food-popup";
import { FoodItem } from "../../types/food.types";

class FoodCard extends HTMLElement {
  data: FoodItem = {
    id: 0,
    image: "",
    title: "",
    description: "",
    ingredients: [],
    time: "",
    likes: 0,
    calories: 0,
    category: ""
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
        :host {
          display: block;
          width: 100%;
          height: 100%;
        }

        :host(.card-large) .card {
          grid-row: span 2;
          grid-column: span 2;
          height: 100%;
        }

        :host(.card-medium) .card {
          grid-row: span 2;
          height: 100%;
        }

        :host(.card-small) .card {
          height: 100%;
        }

        .card {
          width: 100%;
          height: 100%;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          background: #fff;
          position: relative;
        }

        .card:hover {
          transform: translateY(-8px);
          box-shadow: rgba(0, 0, 0, 0.15) 0px 8px 24px;
        }

        .image-container {
          width: 100%;
          height: 100%;
          position: relative;
          overflow: hidden;
        }

        :host(.card-large) .image-container {
          min-height: 400px;
        }

        :host(.card-medium) .image-container {
          min-height: 300px;
        }

        :host(.card-small) .image-container {
          min-height: 200px;
        }

        .food-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .card:hover .food-image {
          transform: scale(1.08);
        }

        @media (max-width: 768px) {
          :host(.card-large) .image-container {
            min-height: 300px;
          }

          :host(.card-medium) .image-container {
            min-height: 250px;
          }

          :host(.card-small) .image-container {
            min-height: 200px;
          }
        }

        :host([title="Coconut Mango Chia Pudding"]),
        :host([title="Light Berry Cheesecake Cups"]) {
          height: 350px;
        }

        :host([title="Coconut Mango Chia Pudding"]) .image-container,
        :host([title="Light Berry Cheesecake Cups"]) .image-container {
          height: 350px;
        }

        @media (max-width: 768px) {
          :host([title="Coconut Mango Chia Pudding"]),
          :host([title="Light Berry Cheesecake Cups"]) {
            height: 300px;
          }

          :host([title="Coconut Mango Chia Pudding"]) .image-container,
          :host([title="Light Berry Cheesecake Cups"]) .image-container {
            height: 300px;
          }
        }

        :host([title="Light Vegetable Curry"]),
        :host([title="Garlic Shrimp Zoodles"]) {
          height: 320px;
        }

        :host([title="Light Vegetable Curry"]) .image-container,
        :host([title="Garlic Shrimp Zoodles"]) .image-container {
          height: 320px;
        }

        @media (max-width: 768px) {
          :host([title="Light Vegetable Curry"]),
          :host([title="Garlic Shrimp Zoodles"]) {
            height: 280px;
          }

          :host([title="Light Vegetable Curry"]) .image-container,
          :host([title="Garlic Shrimp Zoodles"]) .image-container {
            height: 280px;
          }
        }

        :host([title="Fresh Mango Sorbet"]),
        :host([title="Layered Chia Pudding Parfait"]) {
          height: 330px;
        }

        :host([title="Fresh Mango Sorbet"]) .image-container,
        :host([title="Layered Chia Pudding Parfait"]) .image-container {
          height: 330px;
        }

        @media (max-width: 768px) {
          :host([title="Fresh Mango Sorbet"]),
          :host([title="Layered Chia Pudding Parfait"]) {
            height: 290px;
          }

          :host([title="Fresh Mango Sorbet"]) .image-container,
          :host([title="Layered Chia Pudding Parfait"]) .image-container {
            height: 290px;
          }
        }

        :host([title="Grilled Chicken Quinoa Salad"]),
        :host([title="Asian Turkey Lettuce Wraps"]) {
          height: 340px;
        }

        :host([title="Grilled Chicken Quinoa Salad"]) .image-container,
        :host([title="Asian Turkey Lettuce Wraps"]) .image-container {
          height: 340px;
        }

        @media (max-width: 768px) {
          :host([title="Grilled Chicken Quinoa Salad"]),
          :host([title="Asian Turkey Lettuce Wraps"]) {
            height: 285px;
          }

          :host([title="Grilled Chicken Quinoa Salad"]) .image-container,
          :host([title="Asian Turkey Lettuce Wraps"]) .image-container {
            height: 285px;
          }
        }
      </style>
      <div class="card">
        <div class="image-container">
          <img class="food-image" src="/images/${this.data.image}" alt="${this.data.title}">
        </div>
      </div>
    `;
  }
}

if (!customElements.get("food-card")) {
  customElements.define("food-card", FoodCard);
}



  