import "./components/food-cart";
import "./components/app-bar-container";
import "./components/app-bar-pc";
import "./components/food-popup";
import "./layouts/app-container";
import "./components/navbar/navbar";
import "./components/auth/login-form";
import "./components/auth/register-form";
import { initAuthListener } from "./services/auth.service";
import { handleRoute } from "./services/router.service";
import "./components/publication-button";
import "./components/publication-list";
import "./components/publication-popup";

// initialize auth listener
initAuthListener();

document.body.innerHTML = "<app-container></app-container>";

// initialize router
handleRoute();
const appContainer = document.createElement('app-container');
const publicationList = document.createElement('publication-list');
const publicationButton = document.createElement('publication-button');

appContainer.appendChild(publicationList);
appContainer.appendChild(publicationButton);
document.body.appendChild(appContainer);

