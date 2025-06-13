import { fetchFoodData } from '../services/FoodService';
import { FoodItem } from '../types/food.types';

export class FoodCart extends HTMLElement {
    private foodItems: FoodItem[] = [];

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    async connectedCallback() {
        try {
            this.foodItems = await fetchFoodData();
            this.render();
        } catch (error) {
            console.error('Error fetching food data:', error);
        }
    }

    render() {
        if (!this.shadowRoot) return;

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    padding: 1rem;
                }
                .food-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
                    gap: 1rem;
                    padding: 1rem;
                }
                .food-item {
                    background: white;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    transition: transform 0.3s ease;
                }
                .food-item:hover {
                    transform: translateY(-4px);
                }
                .food-image {
                    width: 100%;
                    height: 200px;
                    object-fit: cover;
                }
                .food-content {
                    padding: 1rem;
                }
                .food-title {
                    font-size: 1.2rem;
                    font-weight: 600;
                    margin-bottom: 0.5rem;
                }
                .food-description {
                    font-size: 0.9rem;
                    color: #666;
                    margin-bottom: 1rem;
                }
                .food-meta {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 0.8rem;
                    color: #888;
                }
            </style>
            <div class="food-grid">
                ${this.foodItems.map(item => `
                    <div class="food-item">
                        <img class="food-image" src="${item.image}" alt="${item.title}">
                        <div class="food-content">
                            <h3 class="food-title">${item.title}</h3>
                            <p class="food-description">${item.description}</p>
                            <div class="food-meta">
                                <span>${item.time}</span>
                                <span>${item.calories}</span>
                                <span>❤️ ${item.likes}</span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
}

customElements.define('food-cart', FoodCart); 