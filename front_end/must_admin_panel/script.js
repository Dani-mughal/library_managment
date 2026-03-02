document.addEventListener('DOMContentLoaded', () => {
    const bookTableBody = document.getElementById('bookTableBody');
    const bookForm = document.getElementById('bookForm');
    const bookModal = document.getElementById('bookModal');
    const addBookBtn = document.getElementById('addBookBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const closeModal = document.querySelector('.close');
    const modalTitle = document.getElementById('modalTitle');
    const bookSearch = document.getElementById('bookSearch');

    let allBooks = [];

    // Fetch and display books
    async function fetchBooks() {
        try {
            const response = await fetch('/api/books');
            const data = await response.json();
            if (data.success) {
                allBooks = data.books;
                renderBooks(allBooks);
            }
        } catch (error) {
            console.error('Error fetching books:', error);
            alert('Failed to load books. Please check the backend connection.');
        }
    }

    function renderBooks(books) {
        bookTableBody.innerHTML = '';
        books.forEach(book => {
            const row = document.createElement('tr');

            // Stock Status
            let stockClass = 'in-stock';
            if (book.available_copies === 0) stockClass = 'out-of-stock';
            else if (book.available_copies < 2) stockClass = 'low-stock';

            const coverStyle = book.image_url
                ? `background-image: url('${book.image_url}')`
                : `background: ${book.cover_color || 'var(--primary)'}`;

            row.innerHTML = `
                <td>#${book.id}</td>
                <td><div class="mini-cover" style="${coverStyle}"></div></td>
                <td>
                    <div class="book-info">
                        <h4>${book.title}</h4>
                        <p>${book.author}</p>
                    </div>
                </td>
                <td><span class="text-muted" style="font-size: 0.875rem">${book.department}</span></td>
                <td>
                    <span class="stock-pill ${stockClass}">
                        ${book.available_copies} / ${book.total_copies}
                    </span>
                </td>
                <td>
                    <div style="display: flex; gap: 0.5rem">
                        <button class="btn-icon edit" onclick="editBook(${book.id})" title="Edit Book">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon delete" onclick="deleteBook(${book.id})" title="Delete Book">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            bookTableBody.appendChild(row);
        });
    }

    // Search functionality
    bookSearch.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = allBooks.filter(book =>
            book.title.toLowerCase().includes(term) ||
            book.author.toLowerCase().includes(term) ||
            book.department.toLowerCase().includes(term)
        );
        renderBooks(filtered);
    });

    // Modal controls
    addBookBtn.onclick = () => {
        modalTitle.innerText = 'Add New Book';
        bookForm.reset();
        document.getElementById('bookId').value = '';
        bookModal.style.display = 'block';
    };

    const hideModal = () => {
        bookModal.style.display = 'none';
        bookForm.reset();
    };

    closeModal.onclick = hideModal;
    cancelBtn.onclick = hideModal;
    window.onclick = (event) => {
        if (event.target == bookModal) hideModal();
    };

    // Form submission
    bookForm.onsubmit = async (e) => {
        e.preventDefault();
        const bookId = document.getElementById('bookId').value;
        const bookData = {
            title: document.getElementById('title').value,
            author: document.getElementById('author').value,
            department: document.getElementById('department').value,
            description: document.getElementById('description').value,
            cover_color: document.getElementById('cover_color').value,
            image_url: document.getElementById('image_url').value,
            shelf_location: document.getElementById('shelf_location').value,
            total_copies: parseInt(document.getElementById('total_copies').value),
            available_copies: parseInt(document.getElementById('available_copies').value),
            topics: document.getElementById('topics').value
        };

        const url = bookId ? `/api/admin/books/${bookId}` : '/api/admin/books';
        const method = bookId ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookData)
            });
            const result = await response.json();
            if (result.success) {
                alert(bookId ? 'Book updated successfully!' : 'Book added successfully!');
                hideModal();
                fetchBooks();
            } else {
                alert('Error: ' + result.message);
            }
        } catch (error) {
            console.error('Error saving book:', error);
            alert('Failed to save book.');
        }
    };

    // Globally accessible functions for inline buttons
    window.editBook = (id) => {
        const book = allBooks.find(b => b.id === id);
        if (!book) return;

        modalTitle.innerText = 'Edit Book: ' + book.title;
        document.getElementById('bookId').value = book.id;
        document.getElementById('title').value = book.title;
        document.getElementById('author').value = book.author;
        document.getElementById('department').value = book.department;
        document.getElementById('description').value = book.description || '';
        document.getElementById('cover_color').value = book.cover_color || 'linear-gradient(135deg, #1e3c72, #2a5298)';
        document.getElementById('image_url').value = book.image_url || '';
        document.getElementById('shelf_location').value = book.shelf_location || '';
        document.getElementById('total_copies').value = book.total_copies;
        document.getElementById('available_copies').value = book.available_copies;
        document.getElementById('topics').value = book.topics || '';

        bookModal.style.display = 'block';
    };

    window.deleteBook = async (id) => {
        if (!confirm('Are you sure you want to delete this book? This action cannot be undone.')) return;

        try {
            const response = await fetch(`/api/admin/books/${id}`, { method: 'DELETE' });
            const result = await response.json();
            if (result.success) {
                alert('Book deleted successfully');
                fetchBooks();
            } else {
                alert('Error deleting book: ' + result.message);
            }
        } catch (error) {
            console.error('Error deleting book:', error);
            alert('Failed to delete book.');
        }
    };

    fetchBooks();
});
