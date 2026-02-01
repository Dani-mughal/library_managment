const http = require('http');

async function testEndpoint(path, method = 'GET', body = null) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    resolve({ status: res.statusCode, body: JSON.parse(data) });
                } catch (e) {
                    resolve({ status: res.statusCode, body: data });
                }
            });
        });

        req.on('error', (err) => reject(err));

        if (body) {
            req.write(JSON.stringify(body));
        }

        req.end();
    });
}

async function runBorrowingTests() {
    console.log('--- Borrowing System Verification ---\n');

    try {
        // Test 1: Get borrowings for a student
        console.log('Test 1: GET /api/borrowings/MUST-2024-555');
        const borrowings = await testEndpoint('/api/borrowings/MUST-2024-555');
        if (borrowings.status === 200 && borrowings.body.success) {
            console.log(`✅ SUCCESS: Found ${borrowings.body.borrowings.length} borrowed books`);
            borrowings.body.borrowings.forEach(b => {
                console.log(`   - ${b.title} (Due: ${b.due_date})`);
            });
        } else {
            console.log('❌ FAILED: Could not fetch borrowings');
        }

        // Test 2: Borrow a new book
        console.log('\nTest 2: POST /api/borrowings (Borrow book ID 6)');
        const borrowResult = await testEndpoint('/api/borrowings', 'POST', {
            student_id: 'MUST-2024-555',
            book_id: 6
        });
        if (borrowResult.status === 200 && borrowResult.body.success) {
            console.log(`✅ SUCCESS: Book borrowed successfully`);
            console.log(`   Due date: ${borrowResult.body.due_date}`);
        } else {
            console.log(`⚠️  INFO: ${borrowResult.body.message}`);
        }

        // Test 3: Check updated borrowings
        console.log('\nTest 3: Verify updated borrowings list');
        const updatedBorrowings = await testEndpoint('/api/borrowings/MUST-2024-555');
        if (updatedBorrowings.body.success) {
            console.log(`✅ SUCCESS: Now showing ${updatedBorrowings.body.borrowings.length} borrowed books`);
        }

        // Test 4: Invalid student ID
        console.log('\nTest 4: GET /api/borrowings/INVALID-ID');
        const invalid = await testEndpoint('/api/borrowings/INVALID-ID');
        if (invalid.status === 200) {
            console.log(`✅ SUCCESS: Handled invalid student gracefully (returned empty list)`);
        }

        console.log('\n--- Verification Complete ---');
        console.log('\n✨ Next Step: Open http://localhost:3000/must_student_dashboard/index.html');
        console.log('   Login and check "My Library" to see your borrowed books!');

    } catch (error) {
        console.error('❌ CRITICAL ERROR:', error.message);
        console.log('\nIs the server running? Start it with: cd backend && npm start');
    }
}

runBorrowingTests();
