const meatItems = [
    {
        id: 1,
        name: "Bife ancho",
        description: "No vas a quedar mal con esto",
        image: "./img/bifea.jpg",
        price: 22.49,
        quantity: 20
    },
    {
        id: 2,
        name: "Chinchulines",
        description: "No los quemes, fuego alto pero no tanto",
        image: "./img/chinchu.jpg",
        price: 7.49,
        quantity: 50
    },
    {
        id: 3,
        name: "Entraña",
        description: "Sal y a fuego medio, no podés quedar mal",
        image: "./img/entrana.jpg",
        price: 8.99,
        quantity: 30
    },
    {
        id: 4,
        name: "Mollejas",
        description: "No las de cogote, las del bobo que no te hacen quedar mal",
        image: "./img/molleja.webp",
        price: 10.49,
        quantity: 25
    },
    {
        id: 5,
        name: "Pechugas de pollo",
        description: "De campo, sin hormonas ni esas cosas raras",
        image: "./img/pechugapollo.webp",
        price: 29.99,
        quantity: 15
    },
    {
        id: 6,
        name: "T-bone",
        description: "Para el porteño que dice que sabe hacer asado",
        image: "./img/tbone.webp",
        price: 47.99,
        quantity: 26
    }
];

let cart = [];

function initializeShop() {
    const itemsContainer = document.getElementById('items-container');
    meatItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'item';
        itemElement.innerHTML = `
            <h2>${item.name}</h2>
            <img src="${item.image}" alt="${item.name}">
            <p>${item.description}</p>
            <p>Price: $${item.price.toFixed(2)}</p>
            <p>In stock: ${item.quantity}</p>
            <button onclick="addToCart(${item.id})">Add to Cart</button>
        `;
        itemsContainer.appendChild(itemElement);
    });

    // Load cart from local storage
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartDisplay();
    }
}

function addToCart(itemId) {
    const item = meatItems.find(i => i.id === itemId);
    if (item && item.quantity > 0) {
        const cartItem = cart.find(i => i.id === itemId);
        if (cartItem) {
            cartItem.quantity++;
        } else {
            cart.push({ ...item, quantity: 1 });
        }
        item.quantity--;
        updateCartDisplay();
        saveCart();
    }
}

function updateCartDisplay() {
    const cartItemsElement = document.getElementById('cart-items');
    cartItemsElement.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.innerHTML = `
            ${item.name} - Quantity: ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}
        `;
        cartItemsElement.appendChild(itemElement);
        total += item.price * item.quantity;
    });

    document.getElementById('cart-total').textContent = total.toFixed(2);
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function purchaseItems() {
    if (cart.length === 0) {
        alert('Comprá algo, no te vas a arrepentir!');
        return;
    }

    alert('Te llevás lo mejor de lo mejor');
    cart = [];
    updateCartDisplay();
    saveCart();
}

// Initialize the shop when the page loads
window.onload = initializeShop;
