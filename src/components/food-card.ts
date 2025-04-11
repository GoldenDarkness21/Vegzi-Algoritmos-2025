import "./food-popup"; // Asegúrate de que esta ruta sea correcta según tu estructura de carpetas

class FoodCard extends HTMLElement {
  image: string = "";

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["image"];
  }

  attributeChangedCallback(name: string, _oldVal: string, newVal: string) {
    if (name === "image") {
      this.image = newVal;
      this.render();
    }
  }

  connectedCallback() {
    this.render();

    // 👉 Evento para mostrar el popup al hacer clic
    this.shadowRoot?.querySelector(".card")?.addEventListener("click", () => {
      const popup = document.createElement("food-popup");
      popup.setAttribute("image", this.image);
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

  