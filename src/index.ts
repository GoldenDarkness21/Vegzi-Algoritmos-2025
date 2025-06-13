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

const appContainer = document.createElement('app-container');
const publicationList = document.createElement('publication-list');
const publicationButton = document.createElement('publication-button');

appContainer.appendChild(publicationList);
appContainer.appendChild(publicationButton);
document.body.appendChild(appContainer);

// initialize router
handleRoute();

