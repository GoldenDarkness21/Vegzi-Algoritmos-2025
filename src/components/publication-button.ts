export class PublicationButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  private setupEventListeners() {
    const button = this.shadowRoot?.querySelector('.floating-button');
    button?.addEventListener('click', () => {
      const popup = document.createElement('publication-popup');
      document.body.appendChild(popup);
    });
  }

  render() {
    this.shadowRoot!.innerHTML = `
      <style>
        .floating-button {
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background-color: rgb(30, 155, 51);
          color: white;
          border: none;
          font-size: 24px;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s ease, background-color 0.3s ease;
          z-index: 100;
        }

        .floating-button:hover {
          transform: scale(1.1);
          background-color: rgb(25, 135, 45);
        }

        @media (max-width: 768px) {
          .floating-button {
            bottom: 16px;
            right: 16px;
            width: 50px;
            height: 50px;
            font-size: 20px;
          }
        }
      </style>

      <button class="floating-button">+</button>
    `;
  }
}

customElements.define('publication-button', PublicationButton); 