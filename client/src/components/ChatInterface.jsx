import { useState, useEffect, useRef } from 'react';
// You will need a sound file in public/notification.mp3, or remove the play() line
import notificationSound from '../assets/notification.wav'; // Optional: see note below

const ChatInterface = ({ username, messages, users, typingUsers, sendMessage, sendPrivateMessage, setTyping, onLeave }) => {
  const [newMessage, setNewMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState(null); // null = Global Chat
  const messagesEndRef = useRef(null);

  // Filter messages: Show global if selectedUser is null, otherwise show private with that user
  const filteredMessages = messages.filter(msg => {
    if (!selectedUser) return !msg.isPrivate; // Global chat shows public messages
    
    // Private chat shows messages between ME and SELECTED USER
    return (msg.isPrivate && 
      ((msg.sender === username && msg.to === selectedUser.username) || 
       (msg.sender === selectedUser.username && msg.to === username))
    );
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    
    // Play sound if the last message was received (not sent by me)
    const lastMsg = messages[messages.length - 1];
    if (lastMsg && lastMsg.sender !== username) {
        try {
          // Use the imported variable here
          const audio = new Audio(notificationSound);
          audio.play();
        } catch (error) {
          console.log("Audio play failed:", error);
        }
    }
  }, [messages, username]);

  const handleSend = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      if (selectedUser) {
        // Send Private
        sendPrivateMessage(selectedUser.id, newMessage); 
      } else {
        // Send Global
        sendMessage(newMessage);
      }
      setNewMessage("");
      setTyping(false);
    }
  };

  return (
    <div className="chat-container">
      {/* --- SIDEBAR --- */}
      <div className="sidebar">
        <div className="sidebar-header">
          <h3>Users ({users.length})</h3>
        </div>
        <ul className="user-list">
          {/* Button to return to Global Chat */}
          <li 
            className={!selectedUser ? "active-room" : ""} 
            onClick={() => setSelectedUser(null)}
            style={{cursor: 'pointer', borderBottom: '1px solid #444'}}
          >
            🌐 Global Chat
          </li>

          {users.map((user) => (
            user.username !== username && (
              <li 
                key={user.id} 
                onClick={() => setSelectedUser(user)}
                className={selectedUser?.id === user.id ? "active-room" : ""}
                style={{cursor: 'pointer'}}
              >
                <span className="status-dot"></span>
                {user.username}
              </li>
            )
          ))}
        </ul>
        <div className="user-info">Logged in as: <strong>{username}</strong></div>
        <button onClick={onLeave} className="leave-btn">Logout</button>
      </div>

      {/* --- MAIN CHAT --- */}
      <div className="chat-main">
        <div className="chat-header">
          <h2>{selectedUser ? `🔒 Private with ${selectedUser.username}` : "🌐 Global Room"}</h2>
          <p className="typing-indicator">
             {typingUsers.length > 0 && `${typingUsers.join(", ")} is typing...`}
          </p>
        </div>

        <div className="message-list">
          {filteredMessages.map((msg, index) => (
            <div 
              key={index} 
              className={`message ${msg.system ? "system" : msg.sender === username ? "sent" : "received"}`}
            >
              {!msg.system && <small className="sender-name">{msg.sender}</small>}
              <div className="message-bubble">
                {msg.message}
              </div>
              <small className="timestamp">
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </small>
            </div>
          ))}
          {filteredMessages.length === 0 && (
            <div className="system-message">No messages here yet. Say hi!</div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className="message-input-area" onSubmit={handleSend}>
          <input
            type="text"
            placeholder={selectedUser ? `Message ${selectedUser.username}...` : "Message everyone..."}
            value={newMessage}
            onChange={(e) => {
                setNewMessage(e.target.value);
                setTyping(e.target.value.length > 0);
            }}
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;