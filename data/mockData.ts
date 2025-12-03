import { FileTreeItem, Message } from "@/types";

export const mockMessages: Message[] = [
  {
    id: "1",
    type: "assistant",
    content: "Hello! I'm here to help. What file are we looking at today?",
    timestamp: new Date(),
  },
  {
    id: "2",
    type: "user",
    content: "Let's start with App.js in the components folder.",
    timestamp: new Date(),
  },
  {
    id: "3",
    type: "reasoning",
    content: "Okay, the user wants to look at `components/App.js`. I will locate the file in the file tree and display its content in the viewer.",
    timestamp: new Date(),
  },
  {
    id: "4",
    type: "assistant",
    content: "I've opened `components/App.js` for you on the right. Let me know what you'd like to do with it.",
    timestamp: new Date(),
  },
];

export const mockFileTree: FileTreeItem[] = [
  {
    name: "src",
    type: "directory",
    path: "/src",
    children: [
      {
        name: "components",
        type: "directory",
        path: "/src/components",
        children: [
          {
            name: "App.js",
            type: "file",
            path: "/src/components/App.js",
            content: `import React from 'react';
import Header from './Header';

function App() {
  return (
    <div className="App">
      <Header />
      <main>
        <h1>Welcome to the Application</h1>
      </main>
    </div>
  );
}

export default App;`,
            language: "javascript",
          },
          {
            name: "Header.js",
            type: "file",
            path: "/src/components/Header.js",
            content: `import React from 'react';

function Header() {
  return (
    <header>
      <h1>My App</h1>
    </header>
  );
}

export default Header;`,
            language: "javascript",
          },
          {
            name: "utils",
            type: "directory",
            path: "/src/components/utils",
            children: [],
          },
        ],
      },
      {
        name: "index.js",
        type: "file",
        path: "/src/index.js",
        content: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);`,
        language: "javascript",
      },
    ],
  },
];

