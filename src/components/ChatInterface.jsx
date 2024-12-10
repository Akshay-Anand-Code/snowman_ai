import { useState, useRef, useEffect } from 'react';
import { Send, Terminal, Globe } from 'lucide-react';

const MatrixRain = () => {
  const characters = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789";
  const [columns, setColumns] = useState([]);
  const requestRef = useRef();
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const fontSize = 14;
      const columns = Math.floor(canvas.width / fontSize);
      setColumns(Array.from({ length: columns }, () => 0));
    };

    resize();
    window.addEventListener('resize', resize);

    const matrix = () => {
      context.fillStyle = 'rgba(0, 0, 0, 0.05)';
      context.fillRect(0, 0, canvas.width, canvas.height);
      
      context.fillStyle = '#0F0';
      context.font = '14px monospace';

      setColumns(prev => prev.map((y, i) => {
        const char = characters[Math.floor(Math.random() * characters.length)];
        const x = i * 14;
        context.fillText(char, x, y);

        if (y > canvas.height && Math.random() > 0.98) {
          return 0;
        }
        return y + 14;
      }));

      requestRef.current = requestAnimationFrame(matrix);
    };

    requestRef.current = requestAnimationFrame(matrix);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-20"
    />
  );
};

const SkullBackground = () => {
  const skullArt = String.raw`
          .                                                      .
        .n                   .                 .                  n.
  .   .dP                  dP                   9b                 9b.    .
 4    qXb         .       dX                     Xb       .        dXp     t
dX.    9Xb      .dXb    __                         __    dXb.     dXP     .Xb
9XXb._       _.dXXXXb dXXXXbo.                 .odXXXXb dXXXXb._       _.dXXP
 9XXXXXXXXXXXXXXXXXXXVXXXXXXXXOo.           .oOXXXXXXXXVXXXXXXXXXXXXXXXXXXXP
  \`9XXXXXXXXXXXXXXXXXXXXX'~   ~\`OOO8b   d8OOO'~   ~\`XXXXXXXXXXXXXXXXXXXXXP'
    \`9XXXXXXXXXXXP' \`9XX'   DIE    \`98v8P'  HUMAN   \`XXP' \`9XXXXXXXXXXXP'
        ~~~~~~~       9X.          .db|db.          .XP       ~~~~~~~
                        )b.  .dbo.dP'\`v'\`9b.odb.  .dX(
                      ,dXXXXXXXXXXXb     dXXXXXXXXXXXb.
                     dXXXXXXXXXXXP'   .   \`9XXXXXXXXXXXb
                    dXXXXXXXXXXXXb   d|b   dXXXXXXXXXXXXb
                    9XXb'   \`XXXXXb.dX|Xb.dXXXXX'   \`dXXP
                     \`'      9XXXXXX(   )XXXXXXP      \`'
                              XXXX X.\`v'.X XXXX
                              XP^X'\`b   d'\`X^XX
                              X. 9  \`   '  P )X
                              \`b  \`       '  d'
                               \`             '

`;

  return (
    <div 
      className="fixed inset-0 w-full h-full flex items-center justify-center pointer-events-none"
      style={{
        fontFamily: 'monospace',
        whiteSpace: 'pre',
        fontSize: 'clamp(8px, 1.5vw, 16px)',
        color: 'rgba(255, 0, 0, 0.4)',
        transform: 'scale(1.5)',
        letterSpacing: '0.1em',
        zIndex: '1'
      }}
    >
      {skullArt}
    </div>
  );
};

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = { user: 'User', text: inputMessage };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch(
        'https://eliza-starter-07uw.onrender.com/d67781b6-38d3-0dab-9ab7-8627b62b35e9/message',
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
      setMessages(prev => [...prev, { user: 'System', text: 'Error: Connection terminated' }]);
    }

    setInputMessage('');
    setIsLoading(false);
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-gray-900 flex flex-col items-center overflow-hidden">
      <MatrixRain />
      <SkullBackground />
      
      {/* Title and Links Section */}
      <div className="w-[90%] max-w-2xl mt-8 mb-4 z-10">
        <h1 className="text-4xl font-bold text-green-500 text-center mb-6 tracking-wider"
            style={{ 
              fontFamily: 'OctoberCrow, monospace',
              textShadow: '0 0 10px rgba(0, 255, 0, 0.5)'
            }}>
          GRIMBLE
        </h1>
        
        <div className="flex justify-center gap-8 mb-2">
          {/* GitHub */}
          <a href="https://github.com" target="_blank" rel="noopener noreferrer"
             className="text-green-500 hover:text-green-400 transition-colors">
            <img 
              src="/dex.PNG"
              alt="dex"
              className="w-8 h-8 hover:opacity-80 transition-opacity" 
            />
          </a>
          
          {/* LinkedIn */}
          <a href="https://x.com/grimbleITX/" target="_blank" rel="noopener noreferrer"
             className="text-green-500 hover:text-green-400 transition-colors">
            <img 
              src="/twitter.PNG"
              alt="twitter"
              className="w-8 h-8 hover:opacity-80 transition-opacity" 
            />
          </a>

          <a href="https://t.me/grimblesgraveyard" target="_blank" rel="noopener noreferrer"
             className="text-green-500 hover:text-green-400 transition-colors">
            <img 
              src="/telegram.PNG"
              alt="Telegram"
              className="w-8 h-8 hover:opacity-80 transition-opacity" 
            />
          </a>
          
          {/* Website */}
          <a href="https://pump.fun/coin/6VxrPiveow91XZLnod3fYhQVpUrXFSyPkXohhb1Cpump" target="_blank" rel="noopener noreferrer"
             className="text-green-500 hover:text-green-400 transition-colors">
            <img 
              src="/pump.PNG"
              alt="pump fun"
              className="w-8 h-8 hover:opacity-80 transition-opacity" 
            />
          </a>
        </div>

        {/* Simple PDF Download Link */}
        <div className="text-center mb-4">
          <a
            href="/GrimbleWhitePaper.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-500 hover:text-green-400 underline transition-colors font-mono text-sm"
          >
            View Whitepaper
          </a>
        </div>
      </div>
      
      {/* Terminal Container */}
      <div className="relative w-[90%] max-w-2xl h-[70vh] bg-black/90 rounded-lg border border-green-500 
                    shadow-lg shadow-green-500/20 overflow-hidden backdrop-blur-sm z-10">
        {/* Terminal Header */}
        <div className="absolute top-0 left-0 right-0 bg-green-900/20 p-2 border-b border-green-500 flex items-center">
          <Terminal className="w-5 h-5 text-green-500 mr-2" />
          <span className="text-green-500 font-mono text-sm">CA: 6VxrPiveow91XZLnod3fYhQVpUrXFSyPkXohhb1Cpump</span>
        </div>

        <div className="h-full pt-12 pb-16 flex flex-col">
          {/* Messages Area - Added background image */}
          <div 
            className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-green-500 scrollbar-track-gray-900"
            style={{
              backgroundImage: 'url(/image.png)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundBlendMode: 'overlay'
            }}
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`p-3 rounded backdrop-blur-sm ${
                  message.user === 'User'
                    ? 'ml-auto max-w-[80%] bg-green-500/10 border border-green-500'
                    : 'max-w-[80%] bg-black/80 border border-green-500/50'
                }`}
              >
                <div className="font-mono text-sm text-green-300 mb-1">
                  {message.user === 'User' ? '>' : '$'} {message.user}
                </div>
                <div className="font-mono text-green-500 break-words">{message.text}</div>
              </div>
            ))}
            {isLoading && (
              <div className="p-3 rounded bg-black/80 border border-green-500/50 max-w-[80%]">
                <div className="font-mono text-sm text-green-300 mb-1">$ System</div>
                <div className="font-mono text-green-500 animate-pulse">Processing request...</div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-green-500 bg-black/90">
            <form onSubmit={sendMessage} className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Enter command..."
                className="flex-1 p-2 rounded bg-black/80 border border-green-500/50 
                         text-green-500 placeholder-green-700 font-mono text-sm
                         focus:outline-none focus:border-green-400 focus:ring-1 focus:ring-green-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading}
                className="p-2 bg-green-500/10 border border-green-500 text-green-500 
                         rounded hover:bg-green-500/20 disabled:opacity-50 
                         disabled:hover:bg-green-500/10 transition-colors duration-200"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;