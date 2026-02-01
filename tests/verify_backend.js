const http = require('http');

async function testEndpoint(path) {
    return new Promise((resolve, reject) => {
        http.get(`http://localhost:3000${path}`, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, body: JSON.parse(data) });
                } catch (e) {
                    resolve({ status: res.statusCode, body: data });
                }
            });
        }).on('error', (err) => reject(err));
    });
}

async function runTests() {
    console.log('--- Library System Verification ---');

    try {
        // 1. Test Fetch All Books
        console.log('Testing: GET /api/books...');
        const allBooks = await testEndpoint('/api/books');
        if (allBooks.status === 200 && allBooks.body.success) {
            console.log(`✅ SUCCESS: Found ${allBooks.body.books.length} books in database.`);

            // Validate Image URLs for first 10
            const booksWithImages = allBooks.body.books.filter(b => b.image_url);
            console.log(`✅ SUCCESS: ${booksWithImages.length} books have cover images assigned.`);
        } else {
            console.log('❌ FAILED: Could not fetch books.');
        }

        // 2. Test Fetch Specific Book (ID 1 - Clean Code)
        console.log('\nTesting: GET /api/books/1 (Clean Code)...');
        const singleBook = await testEndpoint('/api/books/1');
        if (singleBook.status === 200 && singleBook.body.success) {
            const book = singleBook.body.book;
            console.log(`✅ SUCCESS: Fetched "${book.title}" by ${book.author}`);
            console.log(`✅ Image Path: ${book.image_url}`);
            console.log(`✅ Shelf Location: ${book.shelf_location}`);
        } else {
            console.log('❌ FAILED: Could not fetch book detail for ID 1.');
        }

        // 3. Test Invalid ID
        console.log('\nTesting: GET /api/books/999 (Invalid Book)...');
        const invalidBook = await testEndpoint('/api/books/999');
        if (invalidBook.status === 404) {
            console.log('✅ SUCCESS: Correctly returned 404 for non-existent book.');
        } else {
            console.log('❌ FAILED: Should have returned 404.');
        }

        console.log('\n--- Verification Complete ---');
    } catch (error) {
        console.error('❌ CRITICAL ERROR: Is the server running on port 3000?', error.message);
    }
}

runTests();
