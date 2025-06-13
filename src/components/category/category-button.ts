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
          width: 140px;
          height: 40px;
          padding: 65px 12px 16px;
          background: ${this.color};
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 2px solid transparent;
          margin-top: 28px;
          display: flex;
          flex-direction: column;
          align-items: center;
          box-shadow: 0 3px 12px rgba(0,0,0,0.12);
          flex-shrink: 0;
        }

        .category-button:hover {
          transform: translateY(-7px);
          box-shadow: 0 8px 22px rgba(0,0,0,0.18);
          border-color: rgba(255,255,255,0.3);
        }

        .category-button.selected {
          border-color: #4CAF50;
          box-shadow: 0 6px 18px rgba(76, 175, 80, 0.3);
          transform: translateY(-4px);
        }

        .category-button.selected:hover {
          transform: translateY(-10px);
        }

        .image-container {
          width: 110px;
          height: 110px;
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
          font-size: 1.05rem;
          color: #2F5A41;
          margin: 0;
          text-align: center;
          line-height: 1.18;
          text-shadow: none;
        }

        .decorative-elements {
          position: absolute;
          top: -7px;
          right: -7px;
          width: 20px;
          height: 20px;
          pointer-events: none;
        }

        .decorative-elements::before {
          content: '';
          position: absolute;
          width: 7px;
          height: 7px;
          background: #FF6B6B;
          border-radius: 50%;
          top: 0;
          right: 0;
          box-shadow: 0 2px 3px rgba(255,107,107,0.3);
        }

        .decorative-elements::after {
          content: '';
          position: absolute;
          width: 6px;
          height: 6px;
          background: #4ECDC4;
          border-radius: 50%;
          bottom: 5px;
          left: 0;
          box-shadow: 0 2px 3px rgba(78,205,196,0.3);
        }

        .honey-drops {
          position: absolute;
          top: 7px;
          left: 10px;
          width: 4px;
          height: 4px;
          background: #FFA726;
          border-radius: 50%;
          opacity: 0.7;
        }

        .honey-drops::after {
          content: '';
          position: absolute;
          width: 3px;
          height: 3px;
          background: #FFA726;
          border-radius: 50%;
          top: 5px;
          left: 4px;
        }

        .strawberry-accent {
          position: absolute;
          bottom: 7px;
          right: 12px;
          width: 6px;
          height: 6px;
          background: #E57373;
          border-radius: 0 50% 50% 50%;
          transform: rotate(-45deg);
          opacity: 0.8;
        }
      </style>
      
      <div class="category-button ${this.isSelected ? 'selected' : ''}">
        <div class="image-container">
          <img class="category-image" src="/images/${this.image}" alt="${this.name}">
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