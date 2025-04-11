class AppBarContainer extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
        <div class="app-bar-container">
        <style>
            .app-bar-container {
                --bar-height: 60px;
                height: var(--bar-height);
                margin-bottom: 20px;
                z-index: 10;
            }
        </style>
        <app-bar-pc></app-bar-pc>
        </div>
      `;
    }
}

if (!customElements.get("app-bar-container")) {
    customElements.define("app-bar-container", AppBarContainer);
}