import { useState, useRef, useEffect, useMemo } from 'react';
import { Send, Terminal, Globe } from 'lucide-react';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const audioRef = useRef(null);
  const [drops, setDrops] = useState([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const createBat = (x, y) => {
      const bat = document.createElement('div');
      bat.className = 'glitter-bat';
      bat.style.left = `${x}px`;
      bat.style.top = `${y}px`;
      document.body.appendChild(bat);

      setTimeout(() => {
        bat.remove();
      }, 1000);
    };

    const handleMouseMove = (e) => {
      createBat(e.clientX, e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    const initAudio = async () => {
      if (!audioRef.current) return;

      audioRef.current.volume = 0.3;
      audioRef.current.loop = true;

      const playAudio = async () => {
        try {
          await audioRef.current.play();
        } catch (err) {
          setTimeout(playAudio, 1000);
        }
      };

      playAudio();

      return () => {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
      };
    };

    initAudio();
  }, []);

  useEffect(() => {
    const createDrop = () => {
      const positions = [
        { x: window.innerWidth * 0.05 },  // Keep only far left
        { x: window.innerWidth * 0.95 }   // Keep only far right
      ];
      
      const newDrops = positions.flatMap(position => {
        const count = 1 + Math.random() * 2; // 1-3 drops per position
        return Array.from({ length: count }, () => ({
          id: Math.random(),
          x: position.x + (Math.random() * 10 - 5),
          y: 0,
          speed: 2 + Math.random() * 2,
          opacity: 0.8 + Math.random() * 0.2,
          width: 1 + Math.random() * 2
        }));
      });
      
      setDrops(prev => [...prev, ...newDrops]);
      
      // Remove drops when they reach bottom
      setTimeout(() => {
        newDrops.forEach(drop => {
          setDrops(prev => prev.filter(d => d.id !== drop.id));
        });
      }, 8000); // Longer duration for full screen travel
    };
    
    const interval = setInterval(createDrop, 100);
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    const animate = () => {
      setDrops(prev => prev.map(drop => ({
        ...drop,
        y: drop.y + drop.speed,
        opacity: drop.y > window.innerHeight ? 0 : drop.opacity
      })));
      requestAnimationFrame(animate);
    };
    
    const animation = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animation);
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = { user: 'User', text: inputMessage };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch(
        'https://eliza-starter-07uw.onrender.com/ce5d1752-cd9c-0bc7-b5c8-119d95e47844/message',
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
      <BloodTears />
      <audio
        ref={audioRef}
        loop
        autoPlay
        preload="auto"
        playsInline
        className="hidden"
      >
        <source src="/whisper.mp3" type="audio/mpeg" />
      </audio>

      {/* Background Video Container */}
      <div className="absolute inset-0 flex">
        {/* Left Video */}
        <div className="w-1/2 h-full overflow-hidden">
          <video
            autoPlay
            loop
            muted
            className="w-full h-full object-cover"
            style={{ 
              transform: 'scaleX(-1)', // Mirror the left video
              filter: 'grayscale(100%)' // Black and white filter
            }}
          >
            <source src="/ascii.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        
        {/* Right Video */}
        <div className="w-1/2 h-full overflow-hidden">
          <video
            autoPlay
            loop
            muted
            className="w-full h-full object-cover"
            style={{ 
              filter: 'grayscale(100%)' // Black and white filter
            }}
          >
            <source src="/ascii.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
      
      {/* Rest of your UI */}
      <div className="w-[90%] max-w-2xl mt-8 mb-4 z-10">
        <h1 className="text-4xl font-bold text-red-500 text-center mb-6 tracking-wider"
            style={{ 
              fontFamily: 'OctoberCrow, monospace',
              textShadow: '0 0 10px rgba(255, 0, 0, 0.5)'
            }}>
          Varn
        </h1>
        
        <div className="flex justify-center gap-8 mb-2">
          <a href="https://dexscreener.com/solana/gthyxioptpqnhyvz4utqzhtanrp25gqavixg5kystnkk" 
             target="_blank" 
             rel="noopener noreferrer"
             className="text-green-500 hover:text-green-400 transition-colors">
            <img 
              src="/dex.PNG"
              alt="dex"
              className="w-8 h-8 hover:opacity-80 transition-opacity" 
              style={{ 
                filter: 'sepia(100%) hue-rotate(-50deg) saturate(200%) brightness(0.8)',
                boxShadow: '0 0 10px rgba(255, 0, 0, 0.5)'
              }}
            />
          </a>
          
          <a href="https://x.com/grimbleITX/" 
             target="_blank" 
             rel="noopener noreferrer"
             className="text-green-500 hover:text-green-400 transition-colors">
            <img 
              src="/twitter.PNG"
              alt="twitter"
              className="w-8 h-8 hover:opacity-80 transition-opacity"
              style={{ 
                filter: 'sepia(100%) hue-rotate(-50deg) saturate(200%) brightness(0.8)',
                boxShadow: '0 0 10px rgba(255, 0, 0, 0.5)'
              }}
            />
          </a>

          <a href="https://t.me/grimblesgraveyard" 
             target="_blank" 
             rel="noopener noreferrer"
             className="text-green-500 hover:text-green-400 transition-colors">
            <img 
              src="/telegram.PNG"
              alt="Telegram"
              className="w-8 h-8 hover:opacity-80 transition-opacity"
              style={{ 
                filter: 'sepia(100%) hue-rotate(-50deg) saturate(200%) brightness(0.8)',
                boxShadow: '0 0 10px rgba(255, 0, 0, 0.5)'
              }}
            />
          </a>
          
          <a href="https://pump.fun/coin/6VxrPiveow91XZLnod3fYhQVpUrXFSyPkXohhb1Cpump" 
             target="_blank" 
             rel="noopener noreferrer"
             className="text-green-500 hover:text-green-400 transition-colors">
            <img 
              src="/pump.PNG"
              alt="pump fun"
              className="w-8 h-8 hover:opacity-80 transition-opacity"
              style={{ 
                filter: 'sepia(100%) hue-rotate(-50deg) saturate(200%) brightness(0.8)',
                boxShadow: '0 0 10px rgba(255, 0, 0, 0.5)'
              }}
            />
          </a>
        </div>

        <div className="text-center mb-4">
          <a
            href="/Varn_Whitepaper.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-500 hover:text-red-400 underline transition-colors font-mono text-sm"
          >
            View Whitepaper
          </a>
        </div>
      </div>
      
      <div className="relative w-[90%] max-w-2xl h-[70vh] bg-black/90 rounded-lg border border-red-500 
                    shadow-lg shadow-red-500/20 overflow-hidden backdrop-blur-sm z-10">
        <div className="absolute top-0 left-0 right-0 bg-red-900/20 p-2 border-b border-red-500 flex items-center">
          <Terminal className="w-5 h-5 text-red-500 mr-2" />
          <span className="text-red-500 font-mono text-sm">CA: COMING SOON</span>
        </div>

        <div className="h-full pt-12 pb-16 flex flex-col">
          <div 
            className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-red-500 scrollbar-track-gray-900"
            style={{
              backgroundImage: 'url(/IMG_4117.JPEG)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundBlendMode: 'overlay'
            }}
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`p-3 rounded backdrop-blur-sm w-full ${
                  message.user === 'User'
                    ? 'bg-red-500/10 border border-red-500 text-right'
                    : 'bg-black/80 border border-red-500/50 text-left'
                }`}
              >
                <div className={`font-mono text-sm mb-1 ${
                  message.user === 'User' ? 'text-gray-200' : 'text-red-300'
                }`}>
                  {message.user === 'User' ? '> User' : '$ Varn'}
                </div>
                <div className={`font-mono break-words ${
                  message.user === 'User' ? 'text-white' : 'text-red-500'
                }`}>
                  {message.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="p-3 rounded bg-black/80 border border-red-500/50 max-w-[80%]">
                <div className="font-mono text-sm text-red-300 mb-1">$ System</div>
                <div className="font-mono text-red-500 animate-pulse">Processing request...</div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-red-500 bg-black/90">
            <form onSubmit={sendMessage} className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Talk with Varn..."
                className="flex-1 p-2 rounded bg-black/80 border border-red-500/50 
                         text-red-500 placeholder-red-700 font-mono text-sm
                         focus:outline-none focus:border-red-400 focus:ring-1 focus:ring-red-500"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading}
                className="p-2 bg-red-500/10 border border-red-500 text-red-500 
                         rounded hover:bg-red-500/20 disabled:opacity-50 
                         disabled:hover:bg-red-500/10 transition-colors duration-200"
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

const BloodTears = () => {
  const [drops, setDrops] = useState([]);
  const animationFrameRef = useRef();
  const dropsRef = useRef(drops);
  
  // Update ref when drops change
  useEffect(() => {
    dropsRef.current = drops;
  }, [drops]);
  
  useEffect(() => {
    const createDrop = () => {
      const positions = [
        { x: window.innerWidth * 0.05 },
        { x: window.innerWidth * 0.95 }
      ];
      
      const newDrops = positions.flatMap(position => {
        const count = 1 + Math.random(); // 1-2 drops per position
        return Array.from({ length: count }, () => ({
          id: Math.random(),
          x: position.x + (Math.random() * 10 - 5),
          y: 0,
          speed: 2 + Math.random() * 2,
          opacity: 0.8 + Math.random() * 0.2,
          width: 1 + Math.random() * 2
        }));
      });
      
      setDrops(prev => [...prev, ...newDrops]);
      
      // Batch remove drops
      setTimeout(() => {
        setDrops(prev => prev.filter(d => !newDrops.includes(d)));
      }, 8000);
    };
    
    const dropInterval = setInterval(createDrop, 150); // Reduced frequency
    
    const animate = () => {
      setDrops(prev => 
        prev.map(drop => ({
          ...drop,
          y: drop.y + drop.speed,
          opacity: drop.y > window.innerHeight ? 0 : drop.opacity
        })).filter(drop => drop.opacity > 0) // Remove invisible drops
      );
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    
    animationFrameRef.current = requestAnimationFrame(animate);
    
    return () => {
      clearInterval(dropInterval);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);
  
  // Memoize the drops rendering
  const renderedDrops = useMemo(() => (
    drops.map(drop => (
      <div
        key={drop.id}
        className="absolute"
        style={{
          left: `${drop.x}px`,
          top: `${drop.y}px`,
          width: `${drop.width}px`,
          height: '15px',
          opacity: drop.opacity,
          background: 'linear-gradient(180deg, #ff0000, #660000)',
          boxShadow: '0 0 8px #ff0000, 0 0 15px #ff0000',
          transform: 'scaleY(2)',
          filter: 'blur(1px) brightness(1.3)',
          transition: 'opacity 0.1s ease-out'
        }}
      />
    ))
  ), [drops]);
  
  return (
    <div className="fixed inset-0 pointer-events-none z-20">
      {renderedDrops}
    </div>
  );
};

export default ChatInterface;