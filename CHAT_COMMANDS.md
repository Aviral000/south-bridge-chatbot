# Chat Commands Documentation

## Overview

The SouthBridge chat interface supports both **command-based interactions** and **natural language conversations** with an AI assistant powered by Google's Gemini AI.

---

## Available Commands

### 1. Read File Command

**Command:** `read <filename>`

**Description:** Opens and displays a specific file in the file viewer panel on the right side of the screen.

**Usage Examples:**
- `read App.js`
- `read Header.js`
- `read index.js`

**How it works:**
- The system searches for the file in the file tree
- If found, the file is automatically opened in the code viewer
- The AI assistant confirms the action with a message
- If the file is not found, the assistant suggests available files

**Example Interaction:**
```
User: read App.js
Assistant: I've opened `/src/components/App.js` for you. The file is now displayed on the right side.
```

---

### 2. Clear History Command

**Command:** `clear` or `clear history`

**Description:** Clears all chat history and resets the conversation to the initial state.

**Usage Examples:**
- `clear`
- `clear history`

**How it works:**
- All previous messages are deleted
- Chat history is cleared from persistent storage
- The conversation resets to default mock messages
- The AI assistant shows a reasoning message before clearing

**Example Interaction:**
```
User: clear
Reasoning: The user wants to clear the chat history. I will delete all previous messages and start fresh.
[History is cleared]
```

---

## Natural Language Chat

Beyond commands, users can interact with the AI assistant using natural language. The assistant can:

- **Answer questions** about code and programming
- **Explain code** from files currently open in the viewer
- **Help with file navigation** when users mention file-related keywords
- **Provide coding assistance** and suggestions

**File Context Awareness:**
- When a file is selected in the viewer, the AI has access to that file's content
- The AI can answer questions about the currently open file
- File context is automatically included in AI conversations

**Example Interactions:**
```
User: What does this function do?
Assistant: [Explains the function in the currently open file]

User: How can I improve this code?
Assistant: [Provides suggestions based on the open file]

User: Show me the Header component
Assistant: [Opens and explains the Header.js file]
```

---

## Command Summary

| Command | Syntax | Purpose |
|---------|--------|---------|
| Read File | `read <filename>` | Opens a file in the viewer |
| Clear History | `clear` or `clear history` | Resets chat conversation |

---

## Notes for Users

1. **Commands are case-insensitive** - `READ App.js` works the same as `read App.js`
2. **File names are flexible** - Partial matches work (e.g., `read App` will find `App.js`)
3. **Natural language works too** - You don't always need commands; just ask questions naturally
4. **File context** - The AI automatically knows about files you have open
5. **Chat persistence** - Your conversation history is automatically saved and restored

---

## Technical Details

- Commands are processed before being sent to the AI
- File search uses case-insensitive partial matching
- Chat history is automatically saved with 1-second debouncing
- All commands show reasoning messages to explain the AI's actions
- Commands return immediately and don't trigger AI responses

---

*Last Updated: Current Version*

