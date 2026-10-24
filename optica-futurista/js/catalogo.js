const productGrid = document.getElementById("product-grid");
const resultsCount = document.getElementById("results-count");
const emptyState = document.getElementById("empty-state");
const searchInput = document.getElementById("product-search");
const resetButton = document.getElementById("reset-filters");
const filterButtons = document.querySelectorAll(".filter-button");
const menuToggle = document.getElementById("menu-toggle");
const nav = document.getElementById("nav");

const products = [
    ...Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        name: `Grau ${String(i + 1).padStart(2, "0")}`,
        category: "grau",
        label: "Óculos de grau",
        description: "Design moderno para o dia a dia.",
        price: 15000 + i * 1500
    })),
    ...Array.from({ length: 10 }, (_, i) => ({
        id: i + 11,
        name: `Sol ${String(i + 1).padStart(2, "0")}`,
        category: "sol",
        label: "Óculos de sol",
        description: "Estilo e conforto para os teus dias.",
        price: 12000 + i * 2000
    })),
    ...Array.from({ length: 10 }, (_, i) => ({
        id: i + 21,
        name: `Infantil ${String(i + 1).padStart(2, "0")}`,
        category: "infantil",
        label: "Infantil",
        description: "Modelos pensados para os mais pequenos.",
        price: 8000 + i * 1000
    }))
];

let activeFilter = "todos";
let searchTerm = "";

function getVisibleProducts() {
    return products.filter(product => {
        const matchesCategory =
            activeFilter === "todos" || product.category === activeFilter;

        const matchesSearch =
            product.name.toLowerCase().includes(searchTerm) ||
            product.label.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm);

        return matchesCategory && matchesSearch;
    });
}

function formatPrice(price) {
    return new Intl.NumberFormat("pt-AO", {
        style: "currency",
        currency: "AOA",
        maximumFractionDigits: 0
    }).format(price);
}

function renderProducts() {
    const visibleProducts = getVisibleProducts();

    productGrid.innerHTML = "";

    visibleProducts.forEach(product => {
        const card = document.createElement("article");
        card.className = "product-card";

        let imageName;

        if (product.category === "infantil") {
            imageName = `f${product.id - 20}`;
        } else if (product.category === "sol") {
            imageName = `e${product.id - 10}`;
        } else {
            imageName = `g${product.id}`;
        }

        card.innerHTML = `
            <div class="product-image">
                <span class="product-tag">${product.label}</span>
                <img src="img/${imageName}.jfif"
                     alt="${product.name}"
                     loading="lazy">
            </div>

            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <strong class="product-price">${formatPrice(product.price)}</strong>
            </div>

            <a href="servicos.html#agendamento">Consultar modelo</a>
        `;

        const image = card.querySelector("img");

        image.addEventListener("error", () => {
            image.style.display = "none";
            image.parentElement.classList.add("no-image");
        });

        productGrid.appendChild(card);
    });

    resultsCount.textContent =
        `${visibleProducts.length} modelos apresentados`;

    emptyState.hidden = visibleProducts.length !== 0;
    productGrid.hidden = visibleProducts.length === 0;
}

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        activeFilter = button.dataset.filter;

        filterButtons.forEach(item => {
            const selected = item === button;
            item.classList.toggle("active", selected);
            item.setAttribute("aria-pressed", String(selected));
        });

        renderProducts();
    });
});

searchInput.addEventListener("input", () => {
    searchTerm = searchInput.value.trim().toLowerCase();
    renderProducts();
});

resetButton.addEventListener("click", () => {
    activeFilter = "todos";
    searchTerm = "";
    searchInput.value = "";

    filterButtons.forEach(button => {
        const selected = button.dataset.filter === "todos";
        button.classList.toggle("active", selected);
        button.setAttribute("aria-pressed", String(selected));
    });

    renderProducts();
});

menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Fechar menu" : "Abrir menu");
});

nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
        nav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
    });
});

renderProducts();