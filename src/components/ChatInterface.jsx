import { useState, useRef, useEffect, useMemo } from 'react';
import { Send, Terminal, Globe, Twitter } from 'lucide-react';
import { getChatResponse } from '../services/openai';

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const [snowflakes, setSnowflakes] = useState([]);
  const MAX_SNOWFLAKES = 100;  // Increased from 50
  const SPAWN_INTERVAL = 100;  // Decreased from 200 for more frequent spawns
  const [memes] = useState([
    '/meme1.jpeg',
    '/meme2.jpeg',
    '/meme3.jpeg'
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const createHeart = (x, y) => {
      const heart = document.createElement('div');
      heart.innerHTML = '❤️'; // You can also use '♥' for a simpler heart
      heart.className = 'heart-cursor';
      heart.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        pointer-events: none;
        z-index: 9999;
        font-size: 14px;
        color: #ff0000;
        text-shadow: 0 0 5px rgba(255, 0, 0, 0.5);
        animation: float-away 1s forwards;
      `;
      
      document.body.appendChild(heart);

      setTimeout(() => {
        heart.remove();
      }, 1000);
    };

    const handleMouseMove = (e) => {
      createHeart(e.clientX, e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
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
    let animationFrameId;
    
    const animate = () => {
      setDrops(prev => prev.map(drop => ({
        ...drop,
        y: drop.y + drop.speed,
        opacity: drop.y > window.innerHeight ? 0 : drop.opacity
      })));
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  useEffect(() => {
    const createSnowflake = () => ({
      id: Math.random(),
      x: Math.random() * window.innerWidth,
      y: -10,
      size: Math.random() * 6 + 2,
      speed: Math.random() * 3 + 1,
      wobble: Math.random() * 5 - 2.5
    });

    // Create initial snowflakes
    setSnowflakes(Array.from({ length: MAX_SNOWFLAKES }, createSnowflake));

    // Animation loop
    let animationFrameId;
    const animate = () => {
      setSnowflakes(prevFlakes => 
        prevFlakes
          .map(flake => ({
            ...flake,
            y: flake.y + flake.speed,
            x: flake.x + Math.sin(flake.y * 0.02) * flake.wobble
          }))
          .filter(flake => flake.y < window.innerHeight)
      );

      // Add new snowflakes to replace ones that fell off screen
      setSnowflakes(prevFlakes => {
        const needed = MAX_SNOWFLAKES - prevFlakes.length;
        return needed > 0 
          ? [...prevFlakes, ...Array.from({ length: needed }, createSnowflake)]
          : prevFlakes;
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    // Start animation
    animationFrameId = requestAnimationFrame(animate);

    // Cleanup
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage = { user: 'User', text: inputMessage };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await getChatResponse(inputMessage);
      setMessages(prev => [...prev, {
        user: 'Frosty',
        text: response
      }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        user: 'System', 
        text: error.message 
      }]);
    }

    setInputMessage('');
    setIsLoading(false);
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* First page with chat - Make it fixed height instead of min-h-screen */}
      <div className="h-screen w-full flex flex-col items-center relative">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src="/chri.jpg"
            alt="Background"
            className="w-full h-full object-cover"
            style={{ 
              opacity: 1,
              objectFit: 'cover',
              objectPosition: 'center',
              filter: 'brightness(0.8) contrast(1.2) saturate(1.2)',
              mixBlendMode: 'normal'
            }}
          />
        </div>

        {/* Navbar - Moved to top */}
        <div className="w-full px-6 py-4 flex justify-between items-center z-20">
          <h1 className="text-5xl font-bold text-white tracking-wider"
              style={{ 
                fontFamily: "'Mountains of Christmas', cursive",
                textShadow: '0 0 10px rgba(255, 0, 0, 0.5)',
                color: '#ff0000'
              }}>
            Frosty
          </h1>

          <div className="flex gap-4 items-center">
            <a href="https://twitter.com" 
               target="_blank" 
               rel="noopener noreferrer"
               className="text-red-500 hover:text-red-400 transition-colors">
              <Twitter className="w-6 h-6" />
            </a>
            <a href="https://t.me" 
               target="_blank" 
               rel="noopener noreferrer"
               className="text-red-500 hover:text-red-400 transition-colors">
              <Send className="w-6 h-6" />
            </a>
            <a href="https://pump.fun" 
               target="_blank" 
               rel="noopener noreferrer">
              <img 
                src="/pump.PNG"
                alt="pump fun"
                className="w-6 h-6 hover:opacity-80 transition-opacity"
                style={{ 
                  filter: 'sepia(100%) hue-rotate(-50deg) saturate(200%) brightness(0.8)',
                  boxShadow: '0 0 10px rgba(255, 0, 0, 0.5)'
                }}
              />
            </a>
          </div>
        </div>

        {/* Chat Container */}
        <div className="relative w-[90%] max-w-2xl h-[75vh] bg-black/90 rounded-lg border border-red-500 
                      shadow-lg shadow-red-500/20 overflow-hidden backdrop-blur-sm z-20">
          <div className="absolute top-0 left-0 right-0 bg-red-900/20 p-2 border-b border-red-500 flex items-center">
            <Terminal className="w-5 h-5 text-red-500 mr-2" />
            <span className="text-red-500 font-mono text-sm">CA: </span>
          </div>

          <div className="h-full pt-12 pb-16 flex flex-col">
            <div 
              className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-red-500 scrollbar-track-gray-900 relative"
              style={{
                position: 'relative',
              }}
            >
              <div
                className="absolute inset-0 -z-10"
                style={{
                  backgroundImage: 'url(/santa.jpg)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  backgroundBlendMode: 'overlay',
                  filter: 'blur(1px)',
                  opacity: 0.6
                }}
              />
              
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
                    {message.user === 'User' ? '> User' : '$ Frosty'}
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
                  placeholder="Talk with Frosty..."
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

        {/* Snowfall Effect */}
        <div className="fixed inset-0 pointer-events-none z-10">
          {snowflakes.map(flake => (
            <div
              key={flake.id}
              className="absolute rounded-full bg-white"
              style={{
                width: `${flake.size}px`,
                height: `${flake.size}px`,
                opacity: Math.random() * 0.4 + 0.6, // Increased opacity range (0.6-1.0)
                transform: `translate(${flake.x}px, ${flake.y}px)`,
                transition: 'transform 0.1s linear',
                willChange: 'transform',
                filter: 'blur(0.5px)', // Slight blur for softer look
                boxShadow: '0 0 2px rgba(255, 255, 255, 0.8)' // Added glow
              }}
            />
          ))}
        </div>
      </div>

      {/* Second page with meme slider - Now it won't interfere with chat */}
      <div className="h-screen w-full flex flex-col items-center justify-center relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img
            src="/chri.jpg"
            alt="Background"
            className="w-full h-full object-cover"
            style={{ 
              opacity: 1,
              objectFit: 'cover',
              objectPosition: 'center',
              filter: 'brightness(0.8) contrast(1.2) saturate(1.2)',
              mixBlendMode: 'normal'
            }}
          />
        </div>

        {/* Icy Title */}
        <h2 className="text-6xl mb-12 font-bold tracking-widest relative"
            style={{ 
              fontFamily: "'Mountains of Christmas', cursive",
              color: '#ff0000',
              textShadow: `
                0 0 10px rgba(255, 0, 0, 0.8),
                0 0 20px rgba(255, 0, 0, 0.8),
                0 0 30px rgba(255, 0, 0, 0.6),
                0 0 40px rgba(255, 0, 0, 0.4)
              `,
              animation: 'pulse 2s infinite'
            }}>
          FROSTY THOUGHTS
        </h2>

        {/* Meme slider container */}
        <div className="w-full max-w-[95%] mx-auto overflow-hidden pointer-events-none" style={{ zIndex: 5 }}>
          <div className="flex gap-12 animate-slide">
            {[...memes, ...memes, ...memes].map((meme, index) => (
              <img
                key={index}
                src={meme}
                alt="meme"
                className="w-[500px] h-[350px] object-contain rounded-lg border-2 border-red-500/50"
                style={{
                  boxShadow: '0 0 30px rgba(255, 0, 0, 0.4)',
                  filter: 'contrast(1.1) brightness(1.1)',
                  backgroundColor: 'rgba(0, 0, 0, 0.5)'
                }}
              />
            ))}
          </div>
        </div>

        {/* Snowfall Effect - Same as first page */}
        <div className="fixed inset-0 pointer-events-none z-10">
          {snowflakes.map(flake => (
            <div
              key={flake.id}
              className="absolute rounded-full bg-white"
              style={{
                width: `${flake.size}px`,
                height: `${flake.size}px`,
                opacity: Math.random() * 0.4 + 0.6, // Increased opacity range (0.6-1.0)
                transform: `translate(${flake.x}px, ${flake.y}px)`,
                transition: 'transform 0.1s linear',
                willChange: 'transform',
                filter: 'blur(0.5px)', // Slight blur for softer look
                boxShadow: '0 0 2px rgba(255, 255, 255, 0.8)' // Added glow
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;