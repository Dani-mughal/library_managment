# AI Chatbot Documentation

The MUST Library Management System now includes an AI-powered chatbot feature to assist students.

## 🤖 Feature Overview

The chatbot uses the Google Gemini API to provide intelligent responses to student queries. It has access to:
1.  **Library Policies**: Borrowing rules, fines, hours, etc. (defined in `backend/data/system_prompt.txt`).
2.  **Book Catalog**: It can search the database to recommend *actual* books available in the library.

## ⚙️ Configuration

To enable the chatbot, you must set the `GEMINI_API_KEY` in the `backend/.env` file.

```env
GEMINI_API_KEY=your_api_key_here
```

**Model Used:** `gemini-2.5-flash`

## 🔌 API Endpoint

### POST /api/chatbot

**Request Body:**
```json
{
  "message": "User's question here",
  "history": [
    { "role": "user", "content": "previous question" },
    { "role": "model", "content": "previous answer" }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "response": "AI's answer here"
}
```

## 🧠 How It Works

1.  **Receive Message**: The backend receives the user's message.
2.  **Context Retrieval**:
    -   The system searches the MySQL `books` table for titles/authors/topics matching the user's query.
    -   Top 5 matching books are retrieved.
3.  **Prompt Construction**:
    -   A "System Prompt" is loaded from `backend/data/system_prompt.txt`.
    -   The retrieved book details are appended to the prompt as "Current Library Data Context".
    -   Conversation history is appended.
4.  **AI Generation**: The constructed prompt is sent to the Gemini API (`gemini-2.5-flash`).
5.  **Response**: The AI's text response is sent back to the frontend.

## FILES
-   `backend/routes/chatbot.js`: Main logic.
-   `backend/data/system_prompt.txt`: Persona and policies.
-   `front_end/must_student_dashboard/chatbot_view.html`: Frontend UI.
