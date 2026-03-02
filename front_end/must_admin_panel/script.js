document.addEventListener('DOMContentLoaded', () => {
    // --- Authentication ---
    const adminLoginOverlay = document.getElementById('adminLoginOverlay');
    const adminLoginForm = document.getElementById('adminLoginForm');
    const loginError = document.getElementById('loginError');
    const body = document.body;

    function checkAuth() {
        const token = sessionStorage.getItem('adminToken');
        if (token) {
            body.classList.remove('admin-locked');
            fetchBooks();
        }
    }

    adminLoginForm.onsubmit = async (e) => {
        e.preventDefault();
        const password = document.getElementById('adminPass').value;
        loginError.style.display = 'none';

        try {
            const response = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password })
            });

            const result = await response.json();
            if (result.success) {
                sessionStorage.setItem('adminToken', result.token);
                body.classList.remove('admin-locked');
                hideLoginOverlay();
                fetchBooks();
            } else {
                loginError.innerText = result.message || 'Access Denied';
                loginError.style.display = 'block';
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Server error during login');
        }
    };

    function hideLoginOverlay() {
        adminLoginOverlay.style.opacity = '0';
        setTimeout(() => adminLoginOverlay.style.display = 'none', 500);
    }

    // --- Selectors ---
    const booksView = document.getElementById('booksView');
    const borrowingsView = document.getElementById('borrowingsView');
    const bookTableBody = document.getElementById('bookTableBody');
    const borrowTableBody = document.getElementById('borrowTableBody');
    const bookForm = document.getElementById('bookForm');
    const bookModal = document.getElementById('bookModal');
    const addBookBtn = document.getElementById('addBookBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const closeModal = document.querySelector('.close');
    const modalTitle = document.getElementById('modalTitle');
    const bookSearch = document.getElementById('bookSearch');
    const borrowSearch = document.getElementById('borrowSearch');
    const tabBtns = document.querySelectorAll('.tab-btn');

    let allBooks = [];
    let allBorrowings = [];

    // --- View Switching ---
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            if (tab === 'books') {
                booksView.style.display = 'block';
                borrowingsView.style.display = 'none';
                fetchBooks();
            } else {
                booksView.style.display = 'none';
                borrowingsView.style.display = 'block';
                fetchBorrowings();
            }
        });
    });

    // --- Book Management ---
    async function fetchBooks() {
        try {
            const response = await fetch('/api/books');
            const data = await response.json();
            if (data.success) {
                allBooks = data.books;
                renderBooks(allBooks);
            }
        } catch (error) { console.error('Error fetching books:', error); }
    }

    function renderBooks(books) {
        bookTableBody.innerHTML = '';
        books.forEach(book => {
            const row = document.createElement('tr');
            let stockClass = 'in-stock';
            if (book.available_copies === 0) stockClass = 'out-of-stock';
            else if (book.available_copies < 2) stockClass = 'low-stock';

            const coverStyle = book.image_url
                ? `background-image: url('${book.image_url}')`
                : `background: ${book.cover_color || 'var(--primary)'}`;

            row.innerHTML = `
                <td>#${book.id}</td>
                <td><div class="mini-cover" style="${coverStyle}"></div></td>
                <td><div class="book-info"><h4>${book.title}</h4><p>${book.author}</p></div></td>
                <td><span class="text-muted" style="font-size: 0.875rem">${book.department}</span></td>
                <td><span class="stock-pill ${stockClass}">${book.available_copies} / ${book.total_copies}</span></td>
                <td>
                    <div style="display: flex; gap: 0.5rem">
                        <button class="btn-icon edit" onclick="editBook(${book.id})"><i class="fas fa-edit"></i></button>
                        <button class="btn-icon delete" onclick="deleteBook(${book.id})"><i class="fas fa-trash"></i></button>
                    </div>
                </td>
            `;
            bookTableBody.appendChild(row);
        });
    }

    // --- Borrowing Management ---
    async function fetchBorrowings() {
        try {
            const response = await fetch('/api/admin/borrowings');
            const data = await response.json();
            if (data.success) {
                allBorrowings = data.borrowings;
                renderBorrowings(allBorrowings);
            }
        } catch (error) { console.error('Error fetching borrowings:', error); }
    }

    function renderBorrowings(borrowings) {
        borrowTableBody.innerHTML = '';
        borrowings.forEach(item => {
            const row = document.createElement('tr');
            const bDate = new Date(item.borrowed_date).toLocaleDateString();
            const dDate = new Date(item.due_date).toLocaleDateString();
            row.innerHTML = `
                <td>#${item.id}</td>
                <td><div class="book-info"><h4>${item.student_name}</h4><p>${item.student_id}</p></div></td>
                <td>${item.book_title}</td>
                <td>${bDate}</td>
                <td>${dDate}</td>
                <td><span class="status-badge ${item.status}">${item.status}</span></td>
                <td>
                    <select class="status-select" onchange="updateStatus(${item.id}, this.value)">
                        <option value="active" ${item.status === 'active' ? 'selected' : ''}>Active</option>
                        <option value="returned" ${item.status === 'returned' ? 'selected' : ''}>Returned</option>
                        <option value="overdue" ${item.status === 'overdue' ? 'selected' : ''}>Overdue</option>
                    </select>
                </td>
            `;
            borrowTableBody.appendChild(row);
        });
    }

    window.updateStatus = async (id, status) => {
        const response = await fetch(`/api/admin/borrowings/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status })
        });
        if ((await response.json()).success) { alert('Updated'); fetchBorrowings(); }
    };

    // --- Search ---
    bookSearch.oninput = (e) => {
        const term = e.target.value.toLowerCase();
        renderBooks(allBooks.filter(b => b.title.toLowerCase().includes(term) || b.author.toLowerCase().includes(term)));
    };

    borrowSearch.oninput = (e) => {
        const term = e.target.value.toLowerCase();
        renderBorrowings(allBorrowings.filter(i => i.student_name.toLowerCase().includes(term) || i.student_id.toLowerCase().includes(term)));
    };

    // --- Modal Logic ---
    addBookBtn.onclick = () => {
        modalTitle.innerText = 'Add New Book';
        bookForm.reset();
        document.getElementById('bookId').value = '';
        bookModal.style.display = 'block';
    };

    const hideModal = () => { bookModal.style.display = 'none'; bookForm.reset(); };
    closeModal.onclick = hideModal;
    cancelBtn.onclick = hideModal;
    window.onclick = (e) => { if (e.target == bookModal) hideModal(); };

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

        const res = await fetch(bookId ? `/api/admin/books/${bookId}` : '/api/admin/books', {
            method: bookId ? 'PUT' : 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bookData)
        });
        if ((await res.json()).success) { alert('Saved'); hideModal(); fetchBooks(); }
    };

    window.editBook = (id) => {
        const b = allBooks.find(x => x.id === id);
        if (!b) return;
        document.getElementById('bookId').value = b.id;
        document.getElementById('title').value = b.title;
        document.getElementById('author').value = b.author;
        document.getElementById('department').value = b.department;
        document.getElementById('description').value = b.description || '';
        document.getElementById('cover_color').value = b.cover_color;
        document.getElementById('image_url').value = b.image_url || '';
        document.getElementById('shelf_location').value = b.shelf_location || '';
        document.getElementById('total_copies').value = b.total_copies;
        document.getElementById('available_copies').value = b.available_copies;
        document.getElementById('topics').value = b.topics || '';
        bookModal.style.display = 'block';
    };

    window.deleteBook = async (id) => {
        if (confirm('Delete?')) {
            const res = await fetch(`/api/admin/books/${id}`, { method: 'DELETE' });
            if ((await res.json()).success) fetchBooks();
        }
    };

    checkAuth();
});
