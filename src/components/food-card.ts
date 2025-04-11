import "./food-popup";

class FoodCard extends HTMLElement {
  image: string = "";
  title: string = "";
  description: string = "";
  ingredients: string[] = [];
  time: string = "";
  likes: number = 0;
  calories: number = 0;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return [
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
    if (name === "image") this.image = newVal;
    if (name === "title") this.title = newVal;
    if (name === "description") this.description = newVal;
    if (name === "ingredients") this.ingredients = JSON.parse(newVal);
    if (name === "time") this.time = newVal;
    if (name === "likes") this.likes = Number(newVal);
    if (name === "calories") this.calories = Number(newVal);
    this.render();
  }

  connectedCallback() {
    this.render();

    this.shadowRoot?.querySelector(".card")?.addEventListener("click", () => {
      const popup = document.createElement("food-popup");
      popup.setAttribute("image", this.image);
      popup.setAttribute("title", this.title);
      popup.setAttribute("description", this.description);
      popup.setAttribute("ingredients", JSON.stringify(this.ingredients));
      popup.setAttribute("time", this.time);
      popup.setAttribute("likes", String(this.likes));
      popup.setAttribute("calories", String(this.calories));
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
        <img src="/images/${this.image}" alt="Food image">
      </div>
    `;
  }
}

if (!customElements.get("food-card")) {
  customElements.define("food-card", FoodCard);
}


  