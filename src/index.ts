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

document.body.innerHTML = `
  <app-container>
    <publication-list></publication-list>
    <publication-button></publication-button>
  </app-container>
`;

