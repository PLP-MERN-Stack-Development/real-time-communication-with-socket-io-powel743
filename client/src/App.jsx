import { useState, useEffect } from 'react';
import { useSocket } from './socket/socket';
import ChatInterface from './components/ChatInterface';
import './App.css'; // We will add styles in Step 3

function App() {
  // 1. Import everything from your custom hook
  const { 
    isConnected, 
    connect, 
    disconnect,
    messages,
    users,
    typingUsers,
    sendMessage,
    sendPrivateMessage,
    setTyping
  } = useSocket();

  const [username, setUsername] = useState("");

  // Handle Login Submit
  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim()) {
      connect(username);
    }
  };

  return (
    <div className="app-container">
      {!isConnected ? (
        /* --- LOGIN SCREEN --- */
        <div className="login-screen">
          <h1>FaceHome</h1>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Enter your username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              maxLength={15}
            />
            <button type="submit">Join Chat</button>
          </form>
        </div>
      ) : (
        /* --- CHAT SCREEN --- */
        <ChatInterface 
          username={username}
          messages={messages}
          users={users}
          typingUsers={typingUsers}
          sendMessage={sendMessage}
          sendPrivateMessage={sendPrivateMessage}
          setTyping={setTyping}
          onLeave={disconnect}
        />
      )}
    </div>
  );
}

export default App;