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

  