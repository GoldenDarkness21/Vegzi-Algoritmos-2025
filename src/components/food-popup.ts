class FoodPopup extends HTMLElement {
  image = "";
  title = "";
  description = "";
  ingredients: string[] = [];
  time = "";
  calories = "";
  likes = "";

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
      "calories",
      "likes",
    ];
  }

  attributeChangedCallback(name: string, _oldVal: string, newVal: string) {
    if (name === "image") this.image = newVal;
    if (name === "title") this.title = newVal;
    if (name === "description") this.description = newVal;
    if (name === "ingredients") this.ingredients = JSON.parse(newVal);
    if (name === "time") this.time = newVal;
    if (name === "calories") this.calories = newVal;
    if (name === "likes") this.likes = newVal;
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
      popup.setAttribute("calories", this.calories);
      popup.setAttribute("likes", this.likes);
      document.body.appendChild(popup);
    });
  }

  closePopup() {
    const popup = this.shadowRoot?.querySelector(".popup") as HTMLElement;
    popup.classList.add("closing");
    setTimeout(() => {
      this.remove();
    }, 300);
  }

  render() {
    this.shadowRoot!.innerHTML = `
      <style>
        * {
          box-sizing: border-box;
        }

        .overlay {
          position: fixed;
          top: 0; left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.4);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease-in-out;
        }

        .popup {
          background: white;
          border-radius: 24px;
          max-width: 900px;
          width: 90%;
          overflow: hidden;
          display: flex;
          flex-direction: row;
          box-shadow: 0 12px 30px rgba(0,0,0,0.2);
          font-family: 'Poppins', sans-serif;
          transform: translateY(30px);
          opacity: 0;
          animation: slideUp 0.4s ease forwards;
          position: relative;
        }

        .popup.closing {
          animation: slideDown 0.3s ease forwards;
        }

        .close-btn {
          position: absolute;
          top: 16px;
          right: 16px;
          background: transparent;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #666;
          transition: transform 0.2s ease;
        }

        .close-btn:hover {
          transform: scale(1.2);
        }

        .content {
          flex: 1;
          padding: 32px;
        }

        .title {
          font-size: 1.8rem;
          font-weight: 600;
          margin-bottom: 12px;
        }

        .description {
          font-size: 1rem;
          line-height: 1.6;
          color: #444;
          margin-bottom: 20px;
        }

        .ingredients {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .ingredient {
          background: #E8F5E9;
          padding: 8px 12px;
          border-radius: 12px;
          font-size: 0.9rem;
          color: #388E3C;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .ingredient:hover {
          background: #C8E6C9;
          transform: translateY(-2px);
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        }

        .image {
          flex: 1;
          background: #f0f0f0;
        }

        .image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        @keyframes fadeIn {
          from { opacity: 0 }
          to { opacity: 1 }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 1;
            transform: translateY(0);
          }
          to {
            opacity: 0;
            transform: translateY(30px);
          }
        }

        .actions {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.actions button {
  padding: 10px 16px;
  border-radius: 12px;
  font-size: 0.95rem;
  cursor: pointer;
  border: none;
  font-weight: 600;
  transition: background 0.3s, transform 0.2s;
}

.save-btn {
  background-color: #1976D2;
  color: white;
}

.like-btn {
  background-color: #E91E63;
  color: white;
}

.actions button:hover {
  transform: scale(1.05);
  filter: brightness(1.1);
}


        @media (max-width: 768px) {
          .popup {
            flex-direction: column;
          }
          .image img {
            height: auto;
          }
        }
.meta {
          font-size: 0.95rem;
          color: #555;
          margin-bottom: 16px;
          display: flex;
          flex-direction: row;
          gap: 4px;
        }
      </style>

      <div class="overlay">
        <div class="popup">
          <button class="close-btn" aria-label="Cerrar popup">&times;</button>
          <div class="content">
            <div class="title">${this.title}</div>
            <div class="meta">
              <div><strong>⏱ Tiempo:</strong> ${this.time}</div>
              <div><strong>🔥 Calorías:</strong> ${this.calories}</div>
              <div><strong>❤️ Likes:</strong> ${this.likes}</div>
            </div>
            <div class="description">${this.description}</div>  
            <div class="ingredients">
              ${this.ingredients
                .map((i) => `<div class="ingredient">${i}</div>`)
                .join("")}
            </div>
            <div class="actions">
            <button class="save-btn">💾 Guardar</button>
            <button class="like-btn">❤️ Me gusta</button>
          </div>
          </div>
          <div class="image">
            <img src="/images/${this.image}" alt="${this.title}">
          </div>
        </div>
      </div>
    `;

    this.shadowRoot!.querySelector(".close-btn")?.addEventListener(
      "click",
      () => this.closePopup()
    );

    const saveButton = this.shadowRoot!.querySelector(
      ".save-btn"
    ) as HTMLButtonElement;
    saveButton.addEventListener("click", () => {
      alert("Receta guardada");
    });

    const likeButton = this.shadowRoot!.querySelector(
      ".like-btn"
    ) as HTMLButtonElement;
    likeButton.addEventListener("click", () => {
      alert("Receta marcada como favorita");
    });

  }
}

if (!customElements.get("food-popup")) {
  customElements.define("food-popup", FoodPopup);
}
