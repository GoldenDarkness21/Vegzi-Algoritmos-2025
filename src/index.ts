import "./components/food-card";
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

// Inicializar el listener de autenticación
initAuthListener();

document.body.innerHTML = "<app-container></app-container>";

// Inicializar el router
handleRoute();

