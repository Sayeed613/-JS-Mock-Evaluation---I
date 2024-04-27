

document.addEventListener("DOMContentLoaded", async function() {
    let searchBtn = document.querySelector(".searchBtn");
    let closeBtn = document.querySelector(".closeBtn");
    let searchBox = document.querySelector(".search-box");
    const categoryFilter = document.getElementById("categoryFilter");
    const priceSort = document.getElementById("priceSort");
    const searchInput = document.getElementById("searchInput");
    const productList = document.querySelector(".product-list");

    searchBtn.onclick = function () {
        searchBox.classList.add("active");
        closeBtn.classList.add("active");
        searchBtn.classList.add("active");
    };

    closeBtn.onclick = function () {
        searchBox.classList.remove("active");
        closeBtn.classList.remove("active");
        searchBtn.classList.remove("active");
    };


    let productsData = [];

    async function fetchProducts() {
        try {
            const response = await fetch("https://fakestoreapi.com/products");
            const products = await response.json();
            productsData = products;
            renderProducts(productsData);
        } catch (error) {
            console.log(error);
        }
    }

    async function populateCategory() {
        try {
            const response = await fetch('https://fakestoreapi.com/products/categories');
            const categories = await response.json();
            categories.forEach(category => {
                const option = document.createElement("option");
                option.value = category;
                option.textContent = category;
                categoryFilter.appendChild(option);
            });
        } catch (error) {
            console.log(error);
        }
    }

    function renderProducts(products) {
        productList.innerHTML = "";
        products.forEach(product => {
            const productItem = document.createElement("div");
            productItem.classList.add("products");
            productItem.innerHTML = `
                <img src="${product.image}" alt="${product.title}">
                <h5>${product.title}</h5>
                <p>${product.category}</p>
                <div>
                    <p>$${product.price}</p>
                    <p>Rating: ${product.rating.rate}</p>
                </div>`;
            productList.appendChild(productItem);
        });
    }

    function filterAndSortProducts() {
        let filteredProducts = [...productsData];
        const category = categoryFilter.value;
        if (category !== "all") {
            filteredProducts = filteredProducts.filter(product => product.category === category);
        }
        const sort = priceSort.value;
        if (sort === "asc") {
            filteredProducts.sort((a, b) => a.price - b.price);
        } else if (sort === "desc") {
            filteredProducts.sort((a, b) => b.price - a.price);
        }
        const searchTerm = searchInput.value.toLowerCase();
        if (searchTerm) {
            filteredProducts = filteredProducts.filter(product =>
                product.title.toLowerCase().includes(searchTerm)
            );
        }
        renderProducts(filteredProducts);
    }

    categoryFilter.addEventListener("change", filterAndSortProducts);
    priceSort.addEventListener("change", filterAndSortProducts);
    searchInput.addEventListener("input", filterAndSortProducts);

    await fetchProducts();
    await populateCategory();
});
