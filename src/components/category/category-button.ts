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
          width: 190px;
          height: 40px;
          padding: 95px 20px 20px;
          background: ${this.color};
          border-radius: 15px;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 2px solid transparent;
          margin-top: 50px;
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
          width: 130px;
          height: 130px;
          position: absolute;
          top: -45px;
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
          font-size: 1.2rem;
          color: #2F5A41;
          margin: 0;
          text-align: center;
          line-height: 1.3;
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

        @media (max-width: 768px) {
          .category-button {
            width: 220px;
            height: 160px;
            padding: 85px 15px 20px;
            margin-top: 45px;
          }

          .image-container {
            width: 120px;
            height: 120px;
            top: -40px;
          }

          .category-name {
            font-size: 1.1rem;
          }
        }

        @media (max-width: 480px) {
          .category-button {
            width: 200px;
            height: 150px;
            padding: 80px 12px 20px;
            margin-top: 40px;
          }

          .image-container {
            width: 110px;
            height: 110px;
            top: -35px;
          }

          .category-name {
            font-size: 1rem;
          }
        }
      </style>
      
      <div class="category-button ${this.isSelected ? 'selected' : ''}">
        <div class="image-container">
          <img class="category-image" src="${this.image}" alt="${this.name}">
        </div>
        <h3 class="category-name">${this.name}</h3>
        <div class="decorative-elements"></div>
        <div class="honey-drops"></div>
        <div class="strawberry-accent"></div>
      </div>
    `;
  }
}

if (!customElements.get("category-button")) {
  customElements.define("category-button", CategoryButton);
}