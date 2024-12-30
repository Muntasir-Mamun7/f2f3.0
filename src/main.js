// Initialize variables
let loggedInUser = null;
let cart = [];

// Product data
let products = [
    {
        id: 1,
        name: "Fresh Organic Apples",
        price: 4.99,
        quantity: 50,
        description: "Sweet and crispy organic apples from local orchards",
        image: "https://images.unsplash.com/photo-1619546813926-a78fa6372cd2?w=500",
        farmer: "Farmer",
        category: "Fruits"
    },
    {
        id: 2,
        name: "Farm Fresh Eggs",
        price: 3.99,
        quantity: 100,
        description: "Free-range chicken eggs, collected daily",
        image: "https://images.unsplash.com/photo-1518492104633-130d0cc84637?w=500",
        farmer: "Farmer",
        category: "Dairy & Eggs"
    },
    {
        id: 3,
        name: "Organic Carrots",
        price: 2.49,
        quantity: 75,
        description: "Fresh organic carrots, perfect for salads and cooking",
        image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=500",
        farmer: "Farmer",
        category: "Vegetables"
    },
    {
        id: 4,
        name: "Fresh Tomatoes",
        price: 2.99,
        quantity: 60,
        description: "Ripe and juicy tomatoes, locally grown",
        image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500",
        farmer: "Farmer",
        category: "Vegetables"
    }
];

// Login Functions
function loginAsBuyer() {
    loggedInUser = {
        username: "Buyer",
        userType: "customer",
        fullName: "Customer User"
    };
    document.getElementById("buyerName").textContent = loggedInUser.fullName;
    showPage("buyerDashboard");
    renderProductsForBuyer();
    showNotification("Welcome Customer!", "success");
}

function loginAsFarmer() {
    loggedInUser = {
        username: "Farmer",
        userType: "farmer",
        fullName: "Farmer User"
    };
    document.getElementById("farmerName").textContent = loggedInUser.fullName;
    showPage("farmerDashboard");
    renderProductsForFarmer();
    showNotification("Welcome Farmer!", "success");
}

function logout() {
    loggedInUser = null;
    cart = [];
    showPage("loginPage");
    showNotification("Logged out successfully", "success");
}

// Page Navigation
function showPage(pageId) {
    document.querySelectorAll(".container").forEach(page => {
        page.classList.add("hidden");
    });
    document.getElementById(pageId).classList.remove("hidden");
}

// Notification System
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type} fade-in`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function getNotificationIcon(type) {
    switch (type) {
        case 'success': return 'fa-check-circle';
        case 'error': return 'fa-times-circle';
        case 'warning': return 'fa-exclamation-triangle';
        default: return 'fa-info-circle';
    }
}

// Product Display Functions
function renderProductsForBuyer() {
    const availableProducts = document.getElementById("availableProducts");
    availableProducts.innerHTML = products.length
        ? products.map(product => `
            <div class="product-card fade-in">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="product-price">$${product.price.toFixed(2)}</p>
                    <p class="product-quantity">Available: ${product.quantity}</p>
                    <p>${product.description}</p>
                    <button onclick="addToCart(${product.id})" class="btn btn-primary">
                        <i class="fas fa-cart-plus"></i> Add to Cart
                    </button>
                </div>
            </div>
        `).join("")
        : "<p class='text-center'>No products available.</p>";
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product && product.quantity > 0) {
        const cartItem = cart.find(item => item.id === productId);
        if (cartItem) {
            if (cartItem.quantity < product.quantity) {
                cartItem.quantity++;
                showNotification("Added one more to cart", "success");
            } else {
                showNotification("No more items available", "error");
                return;
            }
        } else {
            cart.push({ ...product, quantity: 1 });
            showNotification(`${product.name} added to cart!`, "success");
        }
        updateCartCount();
        renderCart();
    }
}

function updateCartCount() {
    const cartCount = document.getElementById("cartCount");
    cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
}

// Product Management for Farmers
function addProduct() {
    const name = document.getElementById("productName").value;
    const price = parseFloat(document.getElementById("productPrice").value);
    const quantity = parseInt(document.getElementById("productQuantity").value);
    const description = document.getElementById("productDescription").value;
    const image = document.getElementById("productImage").value;

    if (!name || !price || !quantity || !description || !image) {
        showNotification("Please fill in all fields", "error");
        return;
    }

    if (price <= 0 || quantity <= 0) {
        showNotification("Price and quantity must be positive numbers", "error");
        return;
    }

    const newProduct = {
        id: products.length + 1,
        name,
        price,
        quantity,
        description,
        image,
        farmer: loggedInUser.username
    };

    products.push(newProduct);
    renderProductsForFarmer();
    showNotification("Product added successfully!", "success");

    // Clear form
    document.getElementById("productName").value = "";
    document.getElementById("productPrice").value = "";
    document.getElementById("productQuantity").value = "";
    document.getElementById("productDescription").value = "";
    document.getElementById("productImage").value = "";
}

function renderProductsForFarmer() {
    const farmerProducts = document.getElementById("farmerProducts");
    const myProducts = products.filter(p => p.farmer === loggedInUser.username);

    farmerProducts.innerHTML = myProducts.length
        ? myProducts.map(product => `
            <div class="product-card fade-in">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="product-price">$${product.price.toFixed(2)}</p>
                    <p class="product-quantity">Stock: ${product.quantity}</p>
                    <p>${product.description}</p>
                    <div class="product-actions">
                        <button onclick="deleteProduct(${product.id})" class="btn btn-danger">
                            <i class="fas fa-trash"></i> Delete
                        </button>
                        <button onclick="editProduct(${product.id})" class="btn btn-primary">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                    </div>
                </div>
            </div>
        `).join("")
        : "<p class='text-center'>No products added yet.</p>";
}

function deleteProduct(productId) {
    if (confirm("Are you sure you want to delete this product?")) {
        products = products.filter(p => p.id !== productId);
        renderProductsForFarmer();
        showNotification("Product deleted successfully", "success");
    }
}

function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        document.getElementById("productName").value = product.name;
        document.getElementById("productPrice").value = product.price;
        document.getElementById("productQuantity").value = product.quantity;
        document.getElementById("productDescription").value = product.description;
        document.getElementById("productImage").value = product.image;
        
        products = products.filter(p => p.id !== productId);
        showNotification("Edit the product and click 'Add Product' to update", "info");
    }
}

// Cart Management
function showCart() {
    const cartContainer = document.getElementById("cart");
    const productsContainer = document.getElementById("availableProducts");
    
    if (cartContainer.classList.contains("hidden")) {
        cartContainer.classList.remove("hidden");
        productsContainer.classList.add("hidden");
    } else {
        cartContainer.classList.add("hidden");
        productsContainer.classList.remove("hidden");
    }
    renderCart();
}

function renderCart() {
    const cartItems = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");
    
    if (cart.length === 0) {
        cartItems.innerHTML = "<p class='text-center'>Your cart is empty</p>";
        cartTotal.textContent = "0.00";
        return;
    }

    let total = 0;
    cartItems.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        return `
            <div class="cart-item fade-in">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>$${item.price.toFixed(2)} × ${item.quantity}</p>
                </div>
                <div class="cart-item-actions">
                    <span class="item-total">$${itemTotal.toFixed(2)}</span>
                    <button onclick="updateCartItem(${item.id}, -1)" class="btn btn-small">-</button>
                    <button onclick="updateCartItem(${item.id}, 1)" class="btn btn-small">+</button>
                    <button onclick="removeFromCart(${item.id})" class="btn btn-danger btn-small">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }).join("");

    cartTotal.textContent = total.toFixed(2);
}

function updateCartItem(productId, change) {
    const cartItem = cart.find(item => item.id === productId);
    const product = products.find(p => p.id === productId);
    
    if (cartItem) {
        const newQuantity = cartItem.quantity + change;
        if (newQuantity > 0 && newQuantity <= product.quantity) {
            cartItem.quantity = newQuantity;
            showNotification("Cart updated!", "success");
        } else if (newQuantity <= 0) {
            removeFromCart(productId);
            return;
        } else {
            showNotification("Maximum available quantity reached", "warning");
            return;
        }
        renderCart();
        updateCartCount();
    }
}

function removeFromCart(productId) {
    const index = cart.findIndex(item => item.id === productId);
    if (index !== -1) {
        cart.splice(index, 1);
        showNotification("Item removed from cart", "success");
        renderCart();
        updateCartCount();
    }
}

function clearCart() {
    if (cart.length === 0) {
        showNotification("Cart is already empty", "info");
        return;
    }
    
    if (confirm("Are you sure you want to clear your cart?")) {
        cart = [];
        showNotification("Cart cleared successfully", "success");
        renderCart();
        updateCartCount();
    }
}

function checkout() {
    if (cart.length === 0) {
        showNotification("Your cart is empty", "warning");
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const orderSummary = cart.map(item => 
        `${item.name} (${item.quantity}x) - $${(item.price * item.quantity).toFixed(2)}`
    ).join("\n");

    if (confirm(`Order Summary:\n\n${orderSummary}\n\nTotal: $${total.toFixed(2)}\n\nProceed with checkout?`)) {
        cart.forEach(cartItem => {
            const product = products.find(p => p.id === cartItem.id);
            if (product) {
                product.quantity -= cartItem.quantity;
            }
        });

        cart = [];
        showNotification("Order placed successfully! Thank you for your purchase.", "success");
        renderCart();
        renderProductsForBuyer();
    }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    showPage("loginPage");
});