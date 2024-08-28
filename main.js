        const meatItems = [
            {
                id: 1,
                name: "Ribeye Steak",
                description: "Prime cut, well-marbled ribeye steak",
                image: "https://example.com/ribeye-steak.jpg",
                price: 22.49,
                quantity: 20
            },
            {
                id: 2,
                name: "Chicken Breast",
                description: "Boneless, skinless chicken breast",
                image: "https://example.com/chicken-breast.jpg",
                price: 7.49,
                quantity: 50
            },
            {
                id: 3,
                name: "Ground Beef",
                description: "Lean ground beef, perfect for burgers",
                image: "https://example.com/ground-beef.jpg",
                price: 8.99,
                quantity: 30
            },
            {
                id: 4,
                name: "Pork Chops",
                description: "Thick-cut, bone-in pork chops",
                image: "https://example.com/pork-chops.jpg",
                price: 10.49,
                quantity: 25
            },
            {
                id: 5,
                name: "Lamb Rack",
                description: "Premium New Zealand lamb rack",
                image: "https://example.com/lamb-rack.jpg",
                price: 29.99,
                quantity: 15
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
                alert('Your cart is empty!');
                return;
            }

            alert('Thank you for your purchase!');
            cart = [];
            updateCartDisplay();
            saveCart();
        }

        // Initialize the shop when the page loads
        window.onload = initializeShop;
