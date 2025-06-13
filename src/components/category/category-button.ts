// src/components/category/category-button.ts
import { stateService } from "../../services/StateService";

class CategoryButton extends HTMLElement {
  categoryId: string = "";
  name: string = "";
  image: string = "";
  color: string = "";
  isSelected: boolean = false;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  static get observedAttributes() {
    return ["category-id", "name", "image", "color", "selected"];
  }

  attributeChangedCallback(name: string, _oldVal: string, newVal: string) {
    if (name === "category-id") this.categoryId = newVal;
    if (name === "name") this.name = newVal;
    if (name === "image") this.image = newVal;
    if (name === "color") this.color = newVal;
    if (name === "selected") this.isSelected = newVal === "true";
    this.render();
  }

  connectedCallback() {
    this.render();
    this.addEventListener("click", this.handleClick.bind(this));
  }

  disconnectedCallback() {
    this.removeEventListener("click", this.handleClick.bind(this));
  }

  private handleClick() {
    // Actualizar estado global
    stateService.setSelectedCategory(this.categoryId);
    
    // Dispatch evento personalizado para que otros componentes puedan escuchar
    const event = new CustomEvent('category-selected', {
      detail: { categoryId: this.categoryId },
      bubbles: true
    });
    this.dispatchEvent(event);
  }

  render() {
    this.shadowRoot!.innerHTML = `
      <style>
        .category-button {
          position: relative;
          width: 160px;
          height: 38px;
          padding: 75px 14px 18px;
          background: ${this.color};
          border-radius: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 2px solid transparent;
          margin-top: 36px;
          display: flex;
          flex-direction: column;
          align-items: center;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          flex-shrink: 0;
        }

        .category-button:hover {
          transform: translateY(-8px);
          box-shadow: 0 12px 35px rgba(0,0,0,0.2);
          border-color: rgba(255,255,255,0.3);
        }

        .category-button.selected {
          border-color: #4CAF50;
          box-shadow: 0 8px 25px rgba(76, 175, 80, 0.4);
          transform: translateY(-5px);
        }

        .category-button.selected:hover {
          transform: translateY(-10px);
        }

        .image-container {
          width: 90px;
          height: 90px;
          position: absolute;
          top: -34px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 1;
        }

        .category-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .category-button:hover .category-image {
          transform: scale(1.05);
        }

        .category-name {
          font-weight: 600;
          font-size: 1.08rem;
          color: #2F5A41;
          margin: 0;
          text-align: center;
          line-height: 1.22;
          text-shadow: none;
        }

        .decorative-elements {
          position: absolute;
          top: -8px;
          right: -8px;
          width: 30px;
          height: 30px;
          pointer-events: none;
        }

        .decorative-elements::before {
          content: '';
          position: absolute;
          width: 10px;
          height: 10px;
          background: #FF6B6B;
          border-radius: 50%;
          top: 0;
          right: 0;
          box-shadow: 0 2px 4px rgba(255,107,107,0.3);
        }

        .decorative-elements::after {
          content: '';
          position: absolute;
          width: 8px;
          height: 8px;
          background: #4ECDC4;
          border-radius: 50%;
          bottom: 8px;
          left: 0;
          box-shadow: 0 2px 4px rgba(78,205,196,0.3);
        }

        /* Elementos decorativos adicionales para coincidir con la imagen */
        .honey-drops {
          position: absolute;
          top: 10px;
          left: 15px;
          width: 6px;
          height: 6px;
          background: #FFA726;
          border-radius: 50%;
          opacity: 0.7;
        }

        .honey-drops::after {
          content: '';
          position: absolute;
          width: 4px;
          height: 4px;
          background: #FFA726;
          border-radius: 50%;
          top: 8px;
          left: 6px;
        }

        .strawberry-accent {
          position: absolute;
          bottom: 10px;
          right: 20px;
          width: 8px;
          height: 8px;
          background: #E57373;
          border-radius: 0 50% 50% 50%;
          transform: rotate(-45deg);
          opacity: 0.8;
        }

        /* Animación sutil para los elementos decorativos */
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-3px); }
        }

        .decorative-elements::before {
          animation: float 3s ease-in-out infinite;
        }

        .decorative-elements::after {
          animation: float 3s ease-in-out infinite 1.5s;
        }

        @media (max-width: 900px) {
          .category-button {
            width: 120px;
            height: 28px;
            padding: 58px 7px 12px;
            margin-top: 18px;
          }

          .image-container {
            width: 60px;
            height: 60px;
            top: -18px;
          }

          .category-name {
            font-size: 0.92rem;
          }
        }

        @media (max-width: 600px) {
          .category-button {
            width: 95px;
            height: 20px;
            padding: 40px 3px 7px;
            margin-top: 8px;
          }

          .image-container {
            width: 38px;
            height: 38px;
            top: -10px;
          }

          .category-name {
            font-size: 0.75rem;
          }
        }
      </style>
      
      <div class="category-button ${this.isSelected ? 'selected' : ''}">
        <div class="decorative-elements"></div>
        <div class="honey-drops"></div>
        <div class="strawberry-accent"></div>
        <div class="image-container">
          <img class="category-image" src="/images/${this.image}" alt="${this.name}">
        </div>
        <h3 class="category-name">${this.name}</h3>
      </div>
    `;
  }
}

if (!customElements.get("category-button")) {
  customElements.define("category-button", CategoryButton);
}