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
        quantity: 29
    }
];

let cart = [];
let lastPurchase = null;
let floatingMenu;
let cartSection;
let isFloatingMenuExpanded = false;

// Inicializa la tienda, carga los productos y configura los eventos
function initializeShop() {
    const itemsContainer = document.getElementById('items-container');
    meatItems.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.className = 'col-12 col-sm-6 col-md-4 col-lg-3 mb-4';
        itemElement.innerHTML = `
            <div class="item h-100">
                <h2>${item.name}</h2>
                <img src="${item.image}" alt="${item.name}" class="img-fluid">
                <p>${item.description}</p>
                <p>Precio: $${item.price.toFixed(2)}</p>
                <p>En stock: <span id="stock-${item.id}">${item.quantity}</span></p>
                <div class="item-controls mt-auto">
                    <button onclick="decreaseQuantity(${item.id})">-</button>
                    <span id="quantity-${item.id}">0</span>
                    <button onclick="increaseQuantity(${item.id})">+</button>
                </div>
            </div>
        `;
        itemsContainer.appendChild(itemElement);
    });

    floatingMenu = document.getElementById('floating-menu');
    cartSection = document.querySelector('.cart');

    window.addEventListener('scroll', handleScroll);
    
    // Contraer el menú flotante al inicio
    toggleFloatingMenu();

    loadCart();
    loadLastPurchase();
    updateCartDisplay();
    updateLastPurchaseDisplay();
    updateFloatingMenu();
}

// Carga el carrito desde el almacenamiento local
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateItemQuantities();
    }
}

// Carga la última compra desde el almacenamiento local
function loadLastPurchase() {
    const savedLastPurchase = localStorage.getItem('lastPurchase');
    if (savedLastPurchase) {
        lastPurchase = JSON.parse(savedLastPurchase);
    }
}

// Actualiza las cantidades de los ítems en la interfaz
function updateItemQuantities() {
    meatItems.forEach(item => {
        const quantityElement = document.getElementById(`quantity-${item.id}`);
        if (quantityElement) {
            const cartItem = cart.find(i => i.id === item.id);
            quantityElement.textContent = cartItem ? cartItem.quantity : 0;
        }
    });
}

// Aumenta la cantidad de un ítem en el carrito
function increaseQuantity(itemId) {
    const item = meatItems.find(i => i.id === itemId);
    if (item && item.quantity > 0) {
        addToCart(itemId);
        updateItemQuantities();
        updateStockDisplay(itemId);
    }
}

// Disminuye la cantidad de un ítem en el carrito
function decreaseQuantity(itemId) {
    const cartItem = cart.find(i => i.id === itemId);
    if (cartItem && cartItem.quantity > 0) {
        cartItem.quantity--;
        const item = meatItems.find(i => i.id === itemId);
        item.quantity++;
        if (cartItem.quantity === 0) {
            cart = cart.filter(i => i.id !== itemId);
        }
        updateCartDisplay();
        saveCart();
        updateStockDisplay(itemId);
        
        // Actualizar el contador visible en la interfaz de usuario
        const quantityElement = document.getElementById(`quantity-${itemId}`);
        if (quantityElement) {
            quantityElement.textContent = cartItem.quantity > 0 ? cartItem.quantity : 0;
        }
    }
}

// Agrega un ítem al carrito
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
        updateStockDisplay(itemId);
    }
}

// Actualiza la visualización del carrito en la interfaz
function updateCartDisplay() {
    const cartItemsElement = document.getElementById('cart-items');
    const floatingCartItemsElement = document.getElementById('floating-cart-items');
    cartItemsElement.innerHTML = '';
    floatingCartItemsElement.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.innerHTML = `
            ${item.name} - Cantidad: ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}
        `;
        cartItemsElement.appendChild(itemElement.cloneNode(true));
        floatingCartItemsElement.appendChild(itemElement);
        total += item.price * item.quantity;
    });

    document.getElementById('cart-total').textContent = total.toFixed(2);
    document.getElementById('floating-cart-total').textContent = total.toFixed(2);

    // Actualizar visibilidad del menú flotante
    const floatingMenu = document.getElementById('floating-menu');
    if (cart.length === 0) {
        floatingMenu.classList.add('hidden');
    } else {
        floatingMenu.classList.remove('hidden');
    }

    updateFloatingMenu();
}

// Guarda el carrito en el almacenamiento local
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Procesa la compra de los ítems en el carrito
function purchaseItems() {
    if (cart.length === 0) {
        Swal.fire('Error', 'Comprá algo, no te vas a arrepentir!', 'error');
        return;
    }

    const fullName = document.getElementById('full-name').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;

    if (!fullName || !phone || !address) {
        Swal.fire('Error', 'Por favor, completa todos los campos', 'error');
        return;
    }

    Swal.fire({
        title: 'Confirmación de compra',
        text: `Te llevás lo mejor de lo mejor, ${fullName}!`,
        icon: 'success',
        confirmButtonText: 'OK'
    }).then((result) => {
        if (result.isConfirmed) {
            lastPurchase = {
                items: [...cart],
                fullName,
                phone,
                address,
                date: new Date().toLocaleString()
            };
            saveLastPurchase();
            resetPurchase();
            updateLastPurchaseDisplay();
            clearCustomerInfo();
        }
    });
}

// Restablece el carrito y el stock después de una compra
function resetPurchase() {
    // Restablecer el stock de los ítems
    cart.forEach(cartItem => {
        const item = meatItems.find(i => i.id === cartItem.id);
        if (item) {
            item.quantity += cartItem.quantity;
            updateStockDisplay(item.id);
        }
    });

    // Vaciar el carrito
    cart = [];
    updateCartDisplay();
    saveCart();

    // Restablecer los contadores de cantidad en la pantalla
    meatItems.forEach(item => {
        const quantityElement = document.getElementById(`quantity-${item.id}`);
        if (quantityElement) {
            quantityElement.textContent = '0';
        }
    });
}

// Guarda la última compra en el almacenamiento local
function saveLastPurchase() {
    localStorage.setItem('lastPurchase', JSON.stringify(lastPurchase));
}

// Actualiza la visualización de la última compra en la interfaz
function updateLastPurchaseDisplay() {
    const lastPurchaseElement = document.getElementById('last-purchase');
    lastPurchaseElement.innerHTML = '';

    if (lastPurchase) {
        let total = 0;
        lastPurchaseElement.innerHTML = `
            <h3>Compra realizada el ${lastPurchase.date}</h3>
            <p>Nombre: ${lastPurchase.fullName}</p>
            <p>Teléfono: ${lastPurchase.phone}</p>
            <p>Dirección: ${lastPurchase.address}</p>
            <h4>Artículos:</h4>
        `;

        lastPurchase.items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.innerHTML = `
                ${item.name} - Cantidad: ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}
            `;
            lastPurchaseElement.appendChild(itemElement);
            total += item.price * item.quantity;
        });

        const totalElement = document.createElement('div');
        totalElement.innerHTML = `<strong>Total: $${total.toFixed(2)}</strong>`;
        lastPurchaseElement.appendChild(totalElement);
    } else {
        lastPurchaseElement.innerHTML = '<p>No hay compras previas</p>';
    }
}

// Repite la última compra realizada
function repeatLastPurchase() {
    if (!lastPurchase) {
        Swal.fire('Error', 'No hay compras previas para repetir', 'error');
        return;
    }

    cart = [...lastPurchase.items];
    updateCartDisplay();
    saveCart();
    updateItemQuantities();

    document.getElementById('full-name').value = lastPurchase.fullName;
    document.getElementById('phone').value = lastPurchase.phone;
    document.getElementById('address').value = lastPurchase.address;
}

// Limpia la información del cliente en el formulario
function clearCustomerInfo() {
    document.getElementById('full-name').value = '';
    document.getElementById('phone').value = '';
    document.getElementById('address').value = '';
}

// Vacía el carrito de compras
function clearCart() {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "Se vaciará todo el carrito de compras",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, vaciar carrito',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {
            resetPurchase();
            updateCartDisplay();
            Swal.fire({
                title: 'Carrito vaciado',
                text: 'El carrito de compras ha sido vaciado exitosamente',
                icon: 'success',
                confirmButtonText: 'OK'
            }).then(() => {
                scrollToTop();
            });
            scrollToTop();
        }
    });
}

// Actualiza la visualización del stock de un ítem
function updateStockDisplay(itemId) {
    const item = meatItems.find(i => i.id === itemId);
    const stockElement = document.getElementById(`stock-${itemId}`);
    if (stockElement) {
        stockElement.textContent = item.quantity;
    }
}

// Maneja el evento de desplazamiento para ocultar/mostrar el menú flotante
function handleScroll() {
    const cartRect = cartSection.getBoundingClientRect();
    const floatingMenuRect = floatingMenu.getBoundingClientRect();

    if (cartRect.top <= floatingMenuRect.bottom && cartRect.bottom >= floatingMenuRect.top) {
        floatingMenu.classList.add('hidden');
    } else {
        floatingMenu.classList.remove('hidden');
    }
}

// Desplaza la página hasta la sección del carrito
function scrollToCart() {
    cartSection.scrollIntoView({ behavior: 'smooth' });
}

// Actualiza el contenido y la visibilidad del menú flotante
function updateFloatingMenu() {
    const floatingCartItems = document.getElementById('floating-cart-items');
    const floatingTotal = document.getElementById('floating-cart-total');
    const floatingMenu = document.getElementById('floating-menu');
    const expandBtn = document.getElementById('expand-btn');

    if (cart.length === 0) {
        floatingMenu.classList.add('hidden');
        expandBtn.style.display = 'none';
    } else {
        floatingMenu.classList.remove('hidden');
        if (!isFloatingMenuExpanded) {
            expandBtn.style.display = 'block';
        }
        floatingCartItems.innerHTML = '';
        let total = 0;

        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.innerHTML = `
                ${item.name} - Cantidad: ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}
            `;
            floatingCartItems.appendChild(itemElement);
            total += item.price * item.quantity;
        });

        floatingTotal.textContent = total.toFixed(2);
    }
}

// Alterna la expansión/contracción del menú flotante
function toggleFloatingMenu() {
    const floatingMenuContent = document.getElementById('floating-menu-content');
    const expandBtn = document.getElementById('expand-btn');

    if (isFloatingMenuExpanded) {
        floatingMenuContent.style.display = 'none';
        expandBtn.style.display = 'block';
        floatingMenu.classList.add('contracted');
    } else {
        floatingMenuContent.style.display = 'block';
        expandBtn.style.display = 'none';
        floatingMenu.classList.remove('contracted');
    }

    isFloatingMenuExpanded = !isFloatingMenuExpanded;
}

// Desplaza la página hasta la parte superior
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Inicializa la tienda cuando se carga la página
window.onload = initializeShop;