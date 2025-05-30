import "./components/food-card";
import "./components/food-cart";
import "./components/app-bar-container";
import "./components/app-bar-pc";
import "./components/food-popup";
import "./layouts/app-container";
import "./components/navbar/navbar";
import "./components/publication-button";
import "./components/publication-list";
import "./components/publication-popup";

const appContainer = document.createElement('app-container');
const publicationList = document.createElement('publication-list');
const publicationButton = document.createElement('publication-button');

appContainer.appendChild(publicationList);
appContainer.appendChild(publicationButton);
document.body.appendChild(appContainer);

