class AppContainer extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <style>
        :host {
          display: block;
          padding: 20px;
          font-family: sans-serif;
        }
      </style>
          <style>
        body {
            font-family: 'Montserrat', sans-serif;
            margin: 0;
            padding: 0;
            background-color: white;
        }
        .container {
            position: relative;
            overflow: hidden;
        }
        .background {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 50%;
            background-color: #E6F4EA;
        }
        .content {
            position: relative;
            z-index: 10;
            text-align: center;
            padding: 5rem 0;
        }
        .title {
            font-size: 4rem;
            font-weight: bold;
            color: #38A169;
        }
        .image-container {
            display: flex;
            justify-content: center;
            margin-top: 2.5rem;
        }
        .image-container img {
            width: 16rem;
            height: 16rem;
            border-radius: 50%;
            border: 4px solid white;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .subtitle {
            margin-top: 2.5rem;
            font-size: 1.5rem;
            font-weight: 600;
            color: #4A5568;
        }
        .description {
            font-size: 1.125rem;
            color: #A0AEC0;
        }
        .carousel-container {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .carousel {
            display: flex;
            overflow: hidden;
            width: 100%;
            justify-content: center;
        }
        .carousel-track {
            display: flex;
            transition: transform 0.5s ease;
        }
        .carousel-item {
            min-width: 50px;
            margin: 0 10px;
        }
        .carousel-item img {
            width: 3rem;
            height: 3rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="background"></div>
        <div class="content">
            <h1 class="title">VEGZI</h1>
            <div class="image-container">
                <img src="https://storage.googleapis.com/a1aa/image/dlMms-IXX-fMosMee4GeCmYvrE-Bvxum67-eg4xRr9E.jpg" alt="A plate with a variety of healthy foods including salmon, avocado, tomatoes, and greens">
            </div>
            <p class="subtitle">Descubre el sabor de una vida saludable</p>
            <p class="description">Encuentra recetas deliciosas y nutritivas para cada día.</p>
        </div>
        <div class="carousel-container">
            <div class="carousel">
                <div class="carousel-track">
                    <div class="carousel-item">
                        <img src="https://storage.googleapis.com/a1aa/image/uEFfq70OSDOOLwGbfZhm8e3a7UoKvppScB2JW7SnKI4.jpg" alt="Tomato slice">
                    </div>
                    <div class="carousel-item">
                        <img src="https://storage.googleapis.com/a1aa/image/fLH0SOq7U8Vkg5q1U9xnxRtit1AHi6wF6crw_6ZRZ0E.jpg" alt="Bell pepper slice">
                    </div>
                    <div class="carousel-item">
                        <img src="https://storage.googleapis.com/a1aa/image/WyMfv_q9uhLgkZkvbhCrWrM4pHGmb0xRSgI0PdTZNnc.jpg" alt="Cucumber slice">
                    </div>
                    <div class="carousel-item">
                        <img src="https://storage.googleapis.com/a1aa/image/2vQT5HD4ZV8zvD1BOOLo69dNd6VHTLrT_1LuNM_K-bg.jpg" alt="Lettuce leaf">
                    </div>
                    <div class="carousel-item">
                        <img src="https://storage.googleapis.com/a1aa/image/z8H658_B3G9wookuFelAQbLUXqI2YYnxXpC-oDB3JAA.jpg" alt="Spinach leaf">
                    </div>
                    <div class="carousel-item">
                        <img src="https://storage.googleapis.com/a1aa/image/kun0oash9RFIAaU7INZEmiPP9IGm8q1iiZVy3l5o1jM.jpg" alt="Red onion slice">
                    </div>
                    <div class="carousel-item">
                        <img src="https://storage.googleapis.com/a1aa/image/ePh9VA2GckUbAqyjQ_Lsj4dL-e57wHloYMiAegVzyE0.jpg" alt="Mushroom slice">
                    </div>
                    <div class="carousel-item">
                        <img src="https://storage.googleapis.com/a1aa/image/LZmyjy8B5EOx-g8YmsDl0pNDnMbsryFIzD1oKxBjEAc.jpg" alt="Carrot slice">
                    </div>
                    <div class="carousel-item">
                        <img src="https://storage.googleapis.com/a1aa/image/Tv_WbfYJSgxNIGODMCIOPAMv_0xb-cB4cu21QLM-_EY.jpg" alt="Broccoli floret">
                    </div>
                    <div class="carousel-item">
                        <img src="https://storage.googleapis.com/a1aa/image/mWPBPGsOVSnoWTe0AZSc42T7bjXA81-qKq-WQd9a3AY.jpg" alt="Radish slice">
                    </div>
                    <div class="carousel-item">
                        <img src="https://storage.googleapis.com/a1aa/image/j17QE0DcdQlVxCOys3tYyVClyicqx_a4dTqey8cMLUY.jpg" alt="Cauliflower floret">
                    </div>
                    <div class="carousel-item">
                        <img src="https://storage.googleapis.com/a1aa/image/ohhFYW0OeR_nDKkGoYMA6GTPghSZ9CMBxpe75AiEVjY.jpg" alt="Zucchini slice">
                    </div>
                    <div class="carousel-item">
                        <img src="https://storage.googleapis.com/a1aa/image/fLH0SOq7U8Vkg5q1U9xnxRtit1AHi6wF6crw_6ZRZ0E.jpg" alt="Bell pepper slice">
                    </div>
                    <div class="carousel-item">
                        <img src="https://storage.googleapis.com/a1aa/image/uEFfq70OSDOOLwGbfZhm8e3a7UoKvppScB2JW7SnKI4.jpg" alt="Tomato slice">
                    </div>
                </div>
            </div>
        </div>
    </div>
      <app-bar-container></app-bar-container>
      <food-cart></food-cart>
    `;
  }
}

if (!customElements.get("app-container")) {
  customElements.define("app-container", AppContainer);
}
