const express = require('express');
const router = express.Router();
const db = require('../config/db');
const fs = require('fs');
const path = require('path');
const https = require('https');

// Load system prompt
const systemPromptPath = path.join(__dirname, '../data/system_prompt.txt');
let systemPrompt = '';
try {
    systemPrompt = fs.readFileSync(systemPromptPath, 'utf8');
} catch (err) {
    console.error('Error reading system prompt:', err);
    systemPrompt = 'You are a helpful library assistant.';
}

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

// Helper function to call Gemini API using https module (to avoid new dependencies)
function callGeminiAPI(messages) {
    return new Promise((resolve, reject) => {
        if (!GEMINI_API_KEY) {
            return reject(new Error('GEMINI_API_KEY is not set in environment variables.'));
        }

        const url = new URL(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`);

        // Construct the prompt for Gemini
        // Gemini Pro accepts "contents" array with "parts"
        const contents = messages.map(msg => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }]
        }));

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const req = https.request(url, options, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    try {
                        const response = JSON.parse(data);
                        // Extract text from Gemini response
                        const text = response.candidates?.[0]?.content?.parts?.[0]?.text || 'I apologize, but I could not generate a response.';
                        resolve(text);
                    } catch (e) {
                        reject(new Error('Failed to parse Gemini response'));
                    }
                } else {
                    reject(new Error(`Gemini API Error: ${res.statusCode} - ${data}`));
                }
            });
        });

        req.on('error', (e) => {
            reject(e);
        });

        req.write(JSON.stringify({ contents }));
        req.end();
    });
}

// Search books helper
function getBooks(query) {
    return new Promise((resolve, reject) => {
        let sql;
        let params = [];
        const lowerQuery = query.toLowerCase();

        // Check if the user is asking for "best", "all", or "recommendations"
        const genericKeywords = ['best', 'all', 'top', 'recommend', 'list', 'show me books', 'catalog', 'available'];
        const isGeneric = genericKeywords.some(k => lowerQuery.includes(k));

        if (isGeneric) {
            // Fetch ALL books to give the AI complete visibility of the library
            sql = `
                SELECT title, author, shelf_location, available_copies, topics, department, description 
                FROM books 
                ORDER BY department ASC, title ASC
            `;
        } else {
            // Specific search for keywords
            sql = `
                SELECT title, author, shelf_location, available_copies, topics, department, description 
                FROM books 
                WHERE 
                    title LIKE ? OR 
                    author LIKE ? OR 
                    topics LIKE ? OR
                    description LIKE ? OR
                    department LIKE ?
                LIMIT 15
            `;
            const searchTerm = `%${query}%`;
            params = [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm];
        }

        db.query(sql, params, (err, results) => {
            if (err) {
                console.error('Book search error:', err);
                resolve([]);
            } else {
                resolve(results);
            }
        });
    });
}

router.post('/', async (req, res) => {
    const { message, history } = req.body;

    if (!message) {
        return res.status(400).json({ success: false, message: 'Message is required' });
    }

    try {
        // 1. Get relevant books from DB
        const books = await getBooks(message);

        // 2. Construct context string
        let bookContext = 'No specific books found in our catalog for this exact query.';
        if (books.length > 0) {
            bookContext = 'The following books are currently in our library database:\n';
            books.forEach(b => {
                bookContext += `- Title: ${b.title} | Author: ${b.author} | Dept: ${b.department} | Location: ${b.shelf_location} | Status: ${b.available_copies > 0 ? 'Available (' + b.available_copies + ' copies)' : 'Checked Out'}\n`;
            });
        }

        // 3. Update System Prompt with strict formatting rules
        const formattingRules = `
CRITICAL FORMATTING RULES:
1. ALWAYS use bullet points for lists of books.
2. Use **bold text** for book titles.
3. Keep responses clean, professional, and well-structured.
4. If recommending books, group them by department if relevant.
5. Provide the shelf location for every book you mention.
`;

        const fullSystemPrompt = `${systemPrompt}\n${formattingRules}\n\n**Current Library Database Context (Real-time data):**\n${bookContext}`;

        const apiMessages = [
            { role: 'user', content: fullSystemPrompt },
            { role: 'model', content: 'Understood. I have access to the real-time library database and will provide well-structured, bulleted responses with bold titles and locations.' }
        ];

        // Append recent history
        if (Array.isArray(history)) {
            const recentHistory = history.slice(-6);
            recentHistory.forEach(msg => {
                apiMessages.push({ role: msg.role === 'user' ? 'user' : 'model', content: msg.content });
            });
        }

        // Add current message
        apiMessages.push({ role: 'user', content: message });

        // 4. Call Gemini
        const aiResponse = await callGeminiAPI(apiMessages);

        res.json({
            success: true,
            response: aiResponse
        });

    } catch (error) {
        console.error('Chatbot error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to process your request',
            error: error.message
        });
    }
});

module.exports = router;
