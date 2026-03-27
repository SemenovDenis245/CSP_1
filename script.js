const CART_STORAGE_KEY = "cart";
let cart = [];

const addButtons = document.querySelectorAll(".add-to-cart");
const products = document.querySelectorAll(".product");

const cartToggle = document.querySelector("#cartToggle");
const cartDropdown = document.querySelector("#cartDropdown");
const cartCount = document.querySelector("#cartCount");
const cartItems = document.querySelector("#cartItems");
const cartTotal = document.querySelector("#cartTotal");
const payButton = document.querySelector("#payButton");
const categoryFilter = document.querySelector("#categoryFilter");

const saveCartToLocalStorage = () => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
};

const loadCartFromLocalStorage = () => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);

    if (!savedCart) {
        return;
    }

    try {
        const parsedCart = JSON.parse(savedCart);

        if (Array.isArray(parsedCart)) {
            cart = parsedCart;
        }
    } catch (error) {
        console.error("Не удалось загрузить корзину из localStorage:", error);
        cart = [];
    }
};

const calculateTotal = () => {
    let total = 0;

    cart.forEach(item => {
        total += item.price;
    });

    return total;
};

const renderCart = () => {
    cartItems.innerHTML = "";
    cartCount.textContent = cart.length;

    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="cart-empty">Корзина пуста</p>';
        cartTotal.textContent = "Итого: 0 ₽";
        return;
    }

    cart.forEach((item, index) => {
        if (!cartItems || !cartCount || !cartTotal) {
            return;
        }

        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");

        cartItem.innerHTML = `
            <p class="cart-item-name">${item.name}</p>
            <p class="cart-item-price">${item.price.toLocaleString("ru-RU")} ₽</p>
            <button class="remove-button" data-index="${index}">Удалить</button>
        `;

        cartItems.appendChild(cartItem);
    });

    cartTotal.textContent = "Итого: " + calculateTotal().toLocaleString("ru-RU") + " ₽";

    const removeButtons = document.querySelectorAll(".remove-button");

    removeButtons.forEach(button => {
        button.addEventListener("click", () => {
            const index = Number(button.dataset.index);
            cart.splice(index, 1);
            saveCartToLocalStorage();
            renderCart();
        });
    });
};

addButtons.forEach(button => {
    button.addEventListener("click", () => {
        const product = button.closest(".product");

        if (!product) {
            return;
        }

        const item = {
            name: product.dataset.name,
            price: Number(product.dataset.price)
        };

        cart.push(item);
        saveCartToLocalStorage();
        renderCart();
    });
});

if (cartToggle && cartDropdown) {
    cartToggle.addEventListener("click", () => {
        cartDropdown.classList.toggle("active");
    });
}

if (payButton) {
    payButton.addEventListener("click", () => {
        if (cart.length === 0) {
            alert("Корзина пуста");
            return;
        }

        alert("Покупка прошла успешно!");
        cart = [];
        saveCartToLocalStorage();
        renderCart();
    });
}

if (categoryFilter) {
    categoryFilter.addEventListener("change", () => {
        const selectedCategory = categoryFilter.value;

        products.forEach(product => {
            const productCategory = product.dataset.category;

            if (selectedCategory === "all" || productCategory === selectedCategory) {
                product.style.display = "block";
            } else {
                product.style.display = "none";
            }
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    loadCartFromLocalStorage();
    renderCart();
});