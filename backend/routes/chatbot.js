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
function searchBooks(query) {
    return new Promise((resolve, reject) => {
        // Simple search: find books with matching title, author, or topics
        // We'll fetch top 5 matches
        const sql = `
            SELECT title, author, shelf_location, available_copies, topics 
            FROM books 
            WHERE 
                title LIKE ? OR 
                author LIKE ? OR 
                topics LIKE ? OR
                description LIKE ?
            LIMIT 5
        `;
        const searchTerm = `%${query}%`;
        db.query(sql, [searchTerm, searchTerm, searchTerm, searchTerm], (err, results) => {
            if (err) {
                // If error, just return empty list, don't break the chat
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
        // 1. Search for relevant books based on the user's message
        // This is a simple RAG (Retrieval Augmented Generation) approach
        const books = await searchBooks(message);

        // 2. Construct context string
        let bookContext = 'No specific books found in our catalog matching this query.';
        if (books.length > 0) {
            bookContext = 'Here are some relevant books available in our library:\n';
            books.forEach(b => {
                bookContext += `- "${b.title}" by ${b.author} (Shelf: ${b.shelf_location}, Available: ${b.available_copies})\n`;
            });
        }

        // 3. Prepare messages for Gemini
        // We assume 'history' is an array of { role: 'user'|'model', content: 'text' }
        // We'll prepend the system prompt and context to the current interaction

        const fullSystemPrompt = `${systemPrompt}\n\n**Current Library Data Context:**\n${bookContext}`;

        const apiMessages = [
            { role: 'user', content: fullSystemPrompt }, // Instruction as first user message (or system if supported, but user is safe for Gemini Pro)
            { role: 'model', content: 'Understood. I am the MUST Library AI. How can I help you today?' }
        ];

        // Append conversation history (limit to last 5 turns to save tokens)
        if (Array.isArray(history)) {
            const recentHistory = history.slice(-5);
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
