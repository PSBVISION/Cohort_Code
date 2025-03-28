const API_URL = 'https://api.freeapi.app/api/v1/public/books';
const booksContainer = document.getElementById('booksContainer');
const searchInput = document.getElementById('searchInput');
const sortSelect = document.getElementById('sortSelect');
const listViewBtn = document.getElementById('listViewBtn');
const gridViewBtn = document.getElementById('gridViewBtn');
const prevPageBtn = document.getElementById('prevPageBtn');
const nextPageBtn = document.getElementById('nextPageBtn');
const paginationContainer = document.getElementById('paginationContainer');

let currentPage = 1;
let totalPages = 1;
let allBooks = [];

// Fetch books from API
async function fetchBooks(page = 1) {
    try {
        const response = await fetch(`${API_URL}?page=${page}&limit=20`);
        const data = await response.json();
        
        if (data.success) {
            allBooks = data.data.data;
            totalPages = data.data.totalPages;
            renderBooks(allBooks);
            updateNavigation();
        } else {
            throw new Error('Failed to fetch books');
        }
    } catch (error) {
        console.error('Error fetching books:', error);
        booksContainer.innerHTML = `<p>Error loading books: ${error.message}</p>`;
    }
}

// Render books in list or grid view
function renderBooks(books) {
    booksContainer.innerHTML = '';
    books.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.classList.add('book-card');
        bookCard.innerHTML = `
            <img src="${book.volumeInfo.imageLinks?.thumbnail || 'placeholder.jpg'}" alt="${book.volumeInfo.title}">
            <div class="book-details">
                <h3>${book.volumeInfo.title}</h3>
                <p>Author: ${book.volumeInfo.authors?.join(', ') || 'Unknown'}</p>
                <p>Published: ${book.volumeInfo.publishedDate || 'N/A'}</p>
                <p class="publisher">Publisher: ${book.volumeInfo.publisher || 'N/A'}</p>
                <a href="${book.volumeInfo.infoLink}" target="_blank">More Details</a>
            </div>
        `;
        booksContainer.appendChild(bookCard);
    });
}

// Update Navigation Controls
function updateNavigation() {
    // Update Previous and Next buttons
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage === totalPages;

    // Render Pagination
    paginationContainer.innerHTML = '';
    
    // Calculate page range to display
    const pagesToShow = 5;
    const halfPagesToShow = Math.floor(pagesToShow / 2);
    
    // Determine start and end pages
    let startPage = Math.max(1, currentPage - halfPagesToShow);
    let endPage = Math.min(totalPages, startPage + pagesToShow - 1);
    
    // Adjust if we're near the start or end
    if (endPage - startPage + 1 < pagesToShow) {
        if (currentPage <= halfPagesToShow) {
            startPage = 1;
            endPage = Math.min(totalPages, pagesToShow);
        } else {
            endPage = totalPages;
            startPage = Math.max(1, totalPages - pagesToShow + 1);
        }
    }
    
    // Show first page and ellipsis if needed
    if (startPage > 1) {
        // First page button
        const firstPageBtn = createPageButton(1);
        paginationContainer.appendChild(firstPageBtn);
        
        // Ellipsis if there's a gap
        if (startPage > 2) {
            const ellipsis1 = document.createElement('span');
            ellipsis1.textContent = '...';
            ellipsis1.classList.add('ellipsis');
            paginationContainer.appendChild(ellipsis1);
        }
    }
    
    // Generate page buttons
    for (let page = startPage; page <= endPage; page++) {
        const pageBtn = createPageButton(page);
        paginationContainer.appendChild(pageBtn);
    }
    
    // Show last page and ellipsis if needed
    if (endPage < totalPages) {
        // Ellipsis if there's a gap
        if (endPage < totalPages - 1) {
            const ellipsis2 = document.createElement('span');
            ellipsis2.textContent = '...';
            ellipsis2.classList.add('ellipsis');
            paginationContainer.appendChild(ellipsis2);
        }
        
        // Last page button
        const lastPageBtn = createPageButton(totalPages);
        paginationContainer.appendChild(lastPageBtn);
    }
}

// Create page number button
function createPageButton(page) {
    const pageBtn = document.createElement('button');
    pageBtn.textContent = page;
    pageBtn.classList.add('page-btn');
    
    if (page === currentPage) {
        pageBtn.classList.add('active');
    }
    
    pageBtn.addEventListener('click', () => {
        currentPage = page;
        fetchBooks(currentPage);
    });
    
    return pageBtn;
}

// Search and filter books
function filterBooks() {
    const searchTerm = searchInput.value.toLowerCase();
    const sortValue = sortSelect.value;

    let filteredBooks = allBooks.filter(book => 
        book.volumeInfo.title.toLowerCase().includes(searchTerm) ||
        (book.volumeInfo.authors && 
         book.volumeInfo.authors.some(author => 
             author.toLowerCase().includes(searchTerm)
         ))
    );

    // Sorting logic
    switch(sortValue) {
        case 'title-asc':
            filteredBooks.sort((a, b) => a.volumeInfo.title.localeCompare(b.volumeInfo.title));
            break;
        case 'title-desc':
            filteredBooks.sort((a, b) => b.volumeInfo.title.localeCompare(a.volumeInfo.title));
            break;
        case 'date-asc':
            filteredBooks.sort((a, b) => 
                new Date(a.volumeInfo.publishedDate || 0) - 
                new Date(b.volumeInfo.publishedDate || 0)
            );
            break;
        case 'date-desc':
            filteredBooks.sort((a, b) => 
                new Date(b.volumeInfo.publishedDate || 0) - 
                new Date(a.volumeInfo.publishedDate || 0)
            );
            break;
    }

    renderBooks(filteredBooks);
}

// Event Listeners
searchInput.addEventListener('input', filterBooks);
sortSelect.addEventListener('change', filterBooks);

listViewBtn.addEventListener('click', () => {
    booksContainer.classList.remove('books-grid');
    booksContainer.classList.add('books-list');
});

gridViewBtn.addEventListener('click', () => {
    booksContainer.classList.remove('books-list');
    booksContainer.classList.add('books-grid');
});

prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        fetchBooks(currentPage);
    }
});

nextPageBtn.addEventListener('click', () => {
    if (currentPage < totalPages) {
        currentPage++;
        fetchBooks(currentPage);
    }
});

// Initial load
fetchBooks();