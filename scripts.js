let currentPage = 1;

function changePage(page) {
    currentPage = page;
    const productGrid = document.getElementById('product-grid');
    const products = Array.from(document.querySelectorAll('.product'));
    const startIndex = (page - 1) * 6;
    const endIndex = startIndex + 6;

    // Hide all products
    products.forEach(product => {
        product.style.display = 'none';
    });

    // Display the current page's products
    for (let i = startIndex; i < endIndex; i++) {
        if (products[i]) {
            products[i].style.display = 'block';
        }
    }
}

// Initialize the page
changePage(1);

function goToPreviousPage() {
    if (currentPage > 1) {
        changePage(currentPage - 1);
    }
}

function goToNextPage() {
    if (currentPage < 3) { // Change this number if you add more pages
        changePage(currentPage + 1);
    }
}

// Function to parse price from the SRP string
function getPrice(product) {
    const priceText = product.querySelector('p').textContent; // Get the text of the first <p> element
    const priceMatch = priceText.match(/\d+/g); // Extract numbers
    return priceMatch ? parseInt(priceMatch.join('')) : 0; // Combine and convert to number
}

function applyFilters() {
    const searchInput = document.getElementById('search-input').value.toLowerCase();
    const priceFilter = document.getElementById('price-filter').value;
    const productGrid = document.getElementById('product-grid');
    const searchResultsMessage = document.getElementById('search-results-message');
    const products = Array.from(document.querySelectorAll('.product'));

    if (priceFilter === 'low-to-high') {
        products.sort((a, b) => getPrice(a) - getPrice(b));
    } else if (priceFilter === 'high-to-low') {
        products.sort((a, b) => getPrice(b) - getPrice(a));
    }
       // Clear the grid and append sorted products
       productGrid.innerHTML = '';
       products.forEach(product => productGrid.appendChild(product));

    // Filter products by search input
    let filteredProducts = products.filter(product => {
        const title = product.querySelector('h3').textContent.toLowerCase();
        const price = parseInt(product.querySelector('p').textContent.replace(/[^\d.-]/g, ''));

        // Return true if the product matches the search input
        return title.includes(searchInput);
    });

    // Sort products based on price filter (if applicable)
    if (priceFilter === 'low-to-high') {
        filteredProducts.sort((a, b) => {
            const priceA = parseInt(a.querySelector('p').textContent.replace(/[^\d.-]/g, ''));
            const priceB = parseInt(b.querySelector('p').textContent.replace(/[^\d.-]/g, ''));
            return priceA - priceB;
        });
    } else if (priceFilter === 'high-to-low') {
        filteredProducts.sort((a, b) => {
            const priceA = parseInt(a.querySelector('p').textContent.replace(/[^\d.-]/g, ''));
            const priceB = parseInt(b.querySelector('p').textContent.replace(/[^\d.-]/g, ''));
            return priceB - priceA;
        });
    }

    // Update search results message
    if (filteredProducts.length === 0) {
        searchResultsMessage.textContent = 'No products match your search criteria.';
        searchResultsMessage.style.color = 'red'; // Red for no results
    } else {
        searchResultsMessage.textContent = `${filteredProducts.length} product${filteredProducts.length > 1 ? 's' : ''} found.`;
        searchResultsMessage.style.color = 'green'; // Green for matching results
    }

    // Hide all products initially
    products.forEach(product => {
        product.style.display = 'none';
    });

    // Only show filtered products from the current page
    const startIndex = (currentPage - 1) * 6;
    const endIndex = startIndex + 6;

    // Show only filtered products within the page range
    let displayedProducts = 0;
    filteredProducts.forEach((product, index) => {
        if (index >= startIndex && index < endIndex) {
            product.style.display = 'block';
            displayedProducts++;
        }
    });

    // Show a message if there are no products to display on the current page
    if (displayedProducts === 0) {
        searchResultsMessage.textContent = 'No products to display on this page for your search criteria.';
        searchResultsMessage.style.color = 'red';
    }
}

// Hide the search results message when any button is clicked
document.querySelectorAll('button, a').forEach(button => {
    button.addEventListener('click', () => {
        const searchResultsMessage = document.getElementById('search-results-message');
        searchResultsMessage.textContent = ''; // Hide the message
    });
});
