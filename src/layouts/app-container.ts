import "./../views/MainView"
import "./../views/ProfileView"

class AppContainer extends HTMLElement {
  constructor() {
    super();

    this.attachShadow({mode: "open"})
  }

  connectedCallback() {
    if (!this.shadowRoot)
      return

    const routes = [
      {route: /^\/$/, tag: '<main-view></main-view>'},
      {route: /^\/profile\/?/, tag: '<profile-view></profile-view>'}
    ]

    const currentTag = routes.find(
        el => !!document.location.pathname.match(el.route))?.tag

    this.shadowRoot.innerHTML = `
      <style>
        :host {
            min-height: 100dvh;
            display: block;
        }
    </style>
    
    <app-bar-container></app-bar-container>
    
    ${currentTag}
    `;
  }
}

if (!customElements.get("app-container")) {
  customElements.define("app-container", AppContainer);
}
