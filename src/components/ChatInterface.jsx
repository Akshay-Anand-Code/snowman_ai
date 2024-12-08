import { useState } from 'react';
import { Send } from 'lucide-react';

export default function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    // Add user message to chat
    const userMessage = { user: 'User', text: inputMessage };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch(
        'https://eliza-starter-2.onrender.com/b850bc30-45f8-0041-a00a-83df46d8555d/message',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: inputMessage,
            userId: 'user',
            userName: 'User',
          }),
        }
      );

      const data = await response.json();
      setMessages(prev => [...prev, ...data]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { user: 'System', text: 'Error sending message' }]);
    }

    setInputMessage('');
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto p-4">
      <div className="flex-1 overflow-auto mb-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg max-w-[80%] ${
              message.user === 'User'
                ? 'ml-auto bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-800'
            }`}
          >
            <div className="font-bold mb-1">{message.user}</div>
            <div>{message.text}</div>
          </div>
        ))}
        {isLoading && (
          <div className="p-3 rounded-lg bg-gray-200 text-gray-800 max-w-[80%]">
            <div className="font-bold mb-1">Eliza</div>
            <div>Typing...</div>
          </div>
        )}
      </div>

      <form onSubmit={sendMessage} className="flex gap-2">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}