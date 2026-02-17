const https = require('https');
require('dotenv').config();

const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = 'gemini-2.5-flash';

console.log('Testing Gemini API from backend...');
console.log('Model:', MODEL);

if (!API_KEY) {
    console.error('❌ Error: GEMINI_API_KEY not found in .env');
    process.exit(1);
}

const data = JSON.stringify({
    contents: [{
        parts: [{ text: "Hello! Are you working?" }]
    }]
});

const options = {
    hostname: 'generativelanguage.googleapis.com',
    path: `/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`,
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

const req = https.request(options, (res) => {
    let responseBody = '';

    res.on('data', (chunk) => {
        responseBody += chunk;
    });

    res.on('end', () => {
        console.log('\nResponse Status:', res.statusCode);
        try {
            const parsed = JSON.parse(responseBody);
            if (parsed.error) {
                console.error('❌ API Error:', JSON.stringify(parsed.error, null, 2));
            } else if (parsed.candidates && parsed.candidates[0].content) {
                console.log('✅ Success! Gemini Response:');
                console.log(parsed.candidates[0].content.parts[0].text);
            } else {
                console.log('⚠️ Unexpected response structure.');
                console.log(responseBody);
            }
        } catch (e) {
            console.error('❌ Failed to parse response:', e);
            console.log('Raw response:', responseBody);
        }
    });
});

req.on('error', (error) => {
    console.error('❌ Request Error:', error);
});

req.write(data);
req.end();
