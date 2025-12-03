# SouthBridge - Agent Chat & File Viewer

A modern full-stack application built with Next.js featuring an AI-powered chat interface and interactive file viewer. This application allows users to chat with an AI assistant powered by Google's Gemini API while viewing and navigating code files in a split-screen interface.

## 🚀 Features

### Chat Window (Left Panel)
- **AI-Powered Conversations**: Chat with Google Gemini 2.0 Flash model
- **Streaming Responses**: Real-time token streaming for natural conversation flow
- **Message Types**: 
  - User messages (blue, right-aligned)
  - Assistant messages (gray, left-aligned)
  - Reasoning messages (yellow, italic) - shows AI's thought process
- **Smart Scroll Behavior**: 
  - Auto-scrolls to bottom when new messages arrive
  - Maintains scroll position when user scrolls up
  - Scroll-to-bottom button appears when not at bottom
- **Chat Commands**:
  - `read <filename>` - Opens a file in the viewer (e.g., `read App.js`)
  - `clear` or `clear history` - Clears chat history and starts fresh
- **Persistent History**: Chat history is automatically saved and restored on reload

### File Viewer (Right Panel)
- **File Tree Navigation**: Expandable/collapsible directory structure
- **File Selection**: Click files to view their content
- **Syntax Highlighting**: Code files are highlighted with proper syntax colors
- **Line Numbers**: Code viewer displays line numbers for easy reference
- **Multiple File Types**: Supports JavaScript, TypeScript, Python, Java, HTML, CSS, JSON, and more

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **UI Library**: React 19
- **Styling**: Tailwind CSS
- **Syntax Highlighting**: react-syntax-highlighter
- **Icons**: react-icons (Material Symbols)

### Backend
- **API Routes**: Next.js API Routes
- **AI Integration**: Google Generative AI (Gemini 2.0 Flash)
- **Data Persistence**: JSON file-based storage (`data/chatHistory.json`)

### Development Tools
- **TypeScript**: Type safety and better developer experience
- **PostCSS**: CSS processing
- **Autoprefixer**: Automatic vendor prefixing

## 📋 Prerequisites

Before setting up the project, make sure you have:

- **Node.js** (v18 or higher recommended)
- **npm** or **yarn** package manager
- **Google Gemini API Key** (free tier available at [Google AI Studio](https://makersuite.google.com/app/apikey))

## 🔧 Local Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd SouthBridge
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```bash
touch .env.local
```

Add your Gemini API key:

```env
GEMINI_API_KEY=your_api_key_here
```

**How to get a Gemini API Key:**
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and paste it in your `.env.local` file

### 4. Run the Development Server

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### 5. Build for Production (Optional)

```bash
npm run build
npm start
```

## 📁 Project Structure

```
SouthBridge/
├── app/
│   ├── api/
│   │   └── chat/
│   │       ├── route.ts              # Gemini API integration endpoint
│   │       └── history/
│   │           └── route.ts          # Chat history API (GET, POST, DELETE)
│   ├── globals.css                   # Global styles
│   ├── layout.tsx                     # Root layout component
│   └── page.tsx                       # Main page component
├── components/
│   ├── ChatWindow/                    # Chat interface components
│   │   ├── index.tsx                 # Main chat window container
│   │   ├── ChatMessage.tsx           # Individual message component
│   │   ├── ChatInput.tsx             # Message input field
│   │   └── ScrollToBottomButton.tsx  # Scroll to bottom button
│   └── FileViewer/                    # File viewer components
│       ├── index.tsx                 # Main file viewer container
│       ├── FileSidebar.tsx           # File tree sidebar
│       ├── FileTreeItem.tsx          # Recursive file/folder item
│       └── CodeViewer.tsx            # Code display with syntax highlighting
├── data/
│   ├── chatHistory.json              # Persistent chat storage (auto-generated)
│   └── mockData.ts                   # Mock messages and file tree data
├── types/
│   └── index.ts                      # TypeScript type definitions
├── .env.local                        # Environment variables (create this)
├── package.json                      # Dependencies and scripts
├── tailwind.config.ts                # Tailwind CSS configuration
├── tsconfig.json                     # TypeScript configuration
└── README.md                         # This file
```

## 🎯 How to Use

### Basic Usage

1. **Start a Conversation**: Type a message in the chat input and press Enter or click Send
2. **View Files**: Use the file tree on the right to navigate and select files
3. **Use Commands**:
   - Type `read App.js` to open a specific file
   - Type `clear` to clear chat history and start fresh
4. **Ask Questions**: The AI can help you understand code, answer questions, and provide assistance

### Chat Commands

- **`read <filename>`**: Opens the specified file in the viewer
  - Example: `read App.js`, `read Header.js`
  - The AI will locate the file and display it on the right side

- **`clear`** or **`clear history`**: Clears all chat history and resets to initial state
  - Removes all previous messages
  - Starts with default mock messages

### File Navigation

- Click on folders in the sidebar to expand/collapse them
- Click on files to view their content in the code viewer
- The selected file is highlighted in the sidebar
- Code is automatically syntax-highlighted based on file extension

## 🔌 API Endpoints

### POST `/api/chat`
Sends a message to the Gemini AI and streams the response.

**Request Body:**
```json
{
  "message": "Your message here",
  "fileContext": "Optional file context"
}
```

**Response:** Server-Sent Events (SSE) stream with JSON data

### GET `/api/chat/history`
Retrieves saved chat history.

**Response:**
```json
{
  "messages": [...],
  "lastUpdated": "2024-11-25T22:00:00.000Z"
}
```

### POST `/api/chat/history`
Saves chat messages to persistent storage.

**Request Body:**
```json
{
  "messages": [...]
}
```

### DELETE `/api/chat/history`
Clears all chat history.

## 🎨 Design Features

- **Dark Mode**: Enabled by default with a modern dark theme
- **Responsive Layout**: Split-screen design (50/50) for chat and file viewer
- **Smooth Animations**: Streaming messages and smooth scrolling
- **Material Design Icons**: Clean, modern iconography
- **Custom Color Palette**: Primary blue (#3caff6) for accents

## 🐛 Troubleshooting

### API Key Issues

If you see errors about the API key:
1. Make sure `.env.local` exists in the root directory
2. Verify `GEMINI_API_KEY` is set correctly
3. Restart the development server after adding/changing the key
4. Check that the API key is valid and has not expired

### Chat History Not Saving

- Ensure the `data/` directory exists and is writable
- Check server console for file system errors
- Verify file permissions on `data/chatHistory.json`

### Build Errors

- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version` (should be v18+)

## 📝 Development Notes

- Chat history is automatically saved with a 1-second debounce to avoid excessive file writes
- The application uses mock data for demonstration when no history exists
- File tree structure is defined in `data/mockData.ts`
- All messages include timestamps and unique IDs
- Streaming responses are handled via Server-Sent Events (SSE)

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini API key | Yes |

## 📄 License

This project is private and proprietary.

## 👤 Author

Built as a frontend take-home project demonstrating modern React/Next.js development practices.

---

**Happy Coding! 🚀**

