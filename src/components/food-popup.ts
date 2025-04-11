class FoodPopup extends HTMLElement {
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
  
    closePopup() {
      this.remove();
    }
  
    render() {
      this.shadowRoot!.innerHTML = `
        <style>
          .overlay {
            position: fixed;
            top: 0;
            left: 0;
            height: 100vh;
            width: 100vw;
            background: rgba(0, 0, 0, 0.6);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 9999;
          }
  
          .popup {
            background: white;
            border-radius: 10px;
            padding: 20px;
            max-width: 90%;
            max-height: 90%;
            overflow: auto;
            box-shadow: 0 4px 8px rgba(0,0,0,0.3);
          }
  
          img {
            max-width: 100%;
            border-radius: 8px;
          }
  
          .close-btn {
            margin-top: 10px;
            background: #f44336;
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 4px;
            cursor: pointer;
          }
        </style>
        <div class="overlay" id="overlay">
          <div class="popup">
            <img src="/images/${this.image}" alt="Food detail" />
            <button class="close-btn">Cerrar</button>
          </div>
        </div>
      `;
  
      this.shadowRoot!.querySelector(".close-btn")?.addEventListener("click", () => this.closePopup());
      this.shadowRoot!.querySelector("#overlay")?.addEventListener("click", (e) => {
        if (e.target === this.shadowRoot!.querySelector("#overlay")) {
          this.closePopup();
        }
      });
    }
  }
  
  if (!customElements.get("food-popup")) {
    customElements.define("food-popup", FoodPopup);
  }
  