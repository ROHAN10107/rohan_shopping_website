
// Get HTML Elements
const productContainer = document.getElementById("productContainer");

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");

const cartButton = document.getElementById("cartButton");
const cartSidebar = document.getElementById("cartSidebar");
const cartOverlay = document.getElementById("cartOverlay");
const closeCart = document.getElementById("closeCart");

const cartItems = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");

// Store Products and Cart
let products = [];
let cart = [];

// Format price in Indian Rupees
function formatPrice(price) {
    return "₹" + Number(price).toLocaleString("en-IN");
}

// Fetch Products from JSON File
async function loadProducts() {

    try {

        const response = await fetch("products.json");

        if (!response.ok) {
            throw new Error("Unable to load products.");
        }

        products = await response.json();

        displayProducts(products);

    } catch (error) {

        productContainer.innerHTML =
            `<p class="no-products">
                ${error.message}
                Please run the project using Live Server.
            </p>`;

        console.error(error);

    }

}

// Display Products Dynamically
function displayProducts(productList) {

    productContainer.innerHTML = "";

    if (productList.length === 0) {

        productContainer.innerHTML =
            `<p class="no-products">No products found!</p>`;

        return;
    }

    productList.forEach(product => {

        const productCard = document.createElement("div");

        productCard.className = "product-card";

        const imageBox = document.createElement("div");
        imageBox.className = "product-image";

        const image = document.createElement("img");
        image.src = product.image;
        image.alt = product.name;
        image.loading = "lazy";

        image.onerror = function () {
            this.src = "https://placehold.co/400x300?text=ShopZone";
        };

        imageBox.appendChild(image);

        const info = document.createElement("div");
        info.className = "product-info";

        const category = document.createElement("p");
        category.className = "product-category";
        category.textContent = product.category;

        const name = document.createElement("h3");
        name.className = "product-name";
        name.textContent = product.name;

        const rating = document.createElement("div");
        rating.className = "product-rating";
        rating.textContent =
            "★".repeat(Math.round(product.rating)) +
            "☆".repeat(5 - Math.round(product.rating)) +
            ` (${product.rating})`;

        const bottom = document.createElement("div");
        bottom.className = "product-bottom";

        const price = document.createElement("span");
        price.className = "product-price";
        price.textContent = formatPrice(product.price);

        const addButton = document.createElement("button");
        addButton.className = "add-cart-btn";
        addButton.textContent = "Add to Cart";

        addButton.addEventListener("click", function () {
            addToCart(product.id);
        });

        bottom.appendChild(price);
        bottom.appendChild(addButton);

        info.appendChild(category);
        info.appendChild(name);
        info.appendChild(rating);
        info.appendChild(bottom);

        productCard.appendChild(imageBox);
        productCard.appendChild(info);

        productContainer.appendChild(productCard);

    });

}

// Search Products
function searchProducts() {

    const searchText = searchInput.value.toLowerCase().trim();

    const filteredProducts = products.filter(product => {

        return (
            product.name.toLowerCase().includes(searchText) ||
            product.category.toLowerCase().includes(searchText)
        );

    });

    displayProducts(filteredProducts);

}

searchBtn.addEventListener("click", searchProducts);

searchInput.addEventListener("input", searchProducts);

// Add Product to Cart
function addToCart(productId) {

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {

        existingItem.quantity++;

    } else {

        cart.push({
            id: productId,
            quantity: 1
        });

    }

    updateCart();

}

// Increase or Decrease Quantity
function changeQuantity(productId, amount) {

    const item = cart.find(item => item.id === productId);

    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {

        cart = cart.filter(item => item.id !== productId);

    }

    updateCart();

}

// Remove Product from Cart
function removeFromCart(productId) {

    cart = cart.filter(item => item.id !== productId);

    updateCart();

}

// Update Shopping Cart
function updateCart() {

    cartItems.innerHTML = "";

    let total = 0;
    let totalQuantity = 0;

    if (cart.length === 0) {

        cartItems.innerHTML =
            `<p class="empty-cart">Your cart is empty!</p>`;

    }

    cart.forEach(item => {

        const product = products.find(p => p.id === item.id);

        if (!product) return;

        const itemTotal = product.price * item.quantity;

        total += itemTotal;
        totalQuantity += item.quantity;

        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";

        const image = document.createElement("img");
        image.src = product.image;
        image.alt = product.name;

        const info = document.createElement("div");
        info.className = "cart-item-info";

        const name = document.createElement("h4");
        name.textContent = product.name;

        const price = document.createElement("p");
        price.textContent = formatPrice(itemTotal);

        const quantityBox = document.createElement("div");
        quantityBox.className = "cart-quantity";

        const minusBtn = document.createElement("button");
        minusBtn.textContent = "-";

        minusBtn.addEventListener("click", () => {
            changeQuantity(product.id, -1);
        });

        const quantity = document.createElement("span");
        quantity.textContent = item.quantity;

        const plusBtn = document.createElement("button");
        plusBtn.textContent = "+";

        plusBtn.addEventListener("click", () => {
            changeQuantity(product.id, 1);
        });

        quantityBox.appendChild(minusBtn);
        quantityBox.appendChild(quantity);
        quantityBox.appendChild(plusBtn);

        info.appendChild(name);
        info.appendChild(price);
        info.appendChild(quantityBox);

        const removeBtn = document.createElement("button");
        removeBtn.className = "remove-btn";
        removeBtn.textContent = "✕";

        removeBtn.addEventListener("click", () => {
            removeFromCart(product.id);
        });

        cartItem.appendChild(image);
        cartItem.appendChild(info);
        cartItem.appendChild(removeBtn);

        cartItems.appendChild(cartItem);

    });

    cartCount.textContent = totalQuantity;

    cartTotal.textContent = formatPrice(total);

}

// Open Cart
function openCart() {

    cartSidebar.classList.add("active");
    cartOverlay.classList.add("active");

}

// Close Cart
function hideCart() {

    cartSidebar.classList.remove("active");
    cartOverlay.classList.remove("active");

}

cartButton.addEventListener("click", openCart);

closeCart.addEventListener("click", hideCart);

cartOverlay.addEventListener("click", hideCart);

// Checkout Button
checkoutBtn.addEventListener("click", function () {

    if (cart.length === 0) {

        alert("Your cart is empty!");

        return;
    }

    alert(
        "Thank you for shopping with ShopZone!\n" +
        "Your order total is " + cartTotal.textContent
    );

    cart = [];

    updateCart();

    hideCart();

});

// Load Products When Website Starts
loadProducts();
