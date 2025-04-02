import { useState, useEffect, useRef, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Cloud, CloudRain, Send, Sun, Wind } from 'lucide-react';
import { useUser } from '../contexts/UserContext';

interface Message {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: 'welcome',
    sender: 'assistant',
    text: 'Bonjour ! Je suis votre assistant vestimentaire WeatherWear. Comment puis-je vous aider aujourd\'hui ? Je peux vous donner des conseils vestimentaires, parler de la météo, ou suggérer des tenues pour différentes occasions.',
    timestamp: new Date()
  }
];

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { userData } = useUser();
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load chat history from localStorage on component mount
  useEffect(() => {
    const savedMessages = localStorage.getItem('weatherWearChat');
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages) as Message[];
        // Convert string timestamps back to Date objects
        const formattedMessages = parsedMessages.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(formattedMessages);
      } catch (error) {
        console.error('Error parsing saved messages:', error);
        setMessages(INITIAL_MESSAGES);
      }
    } else {
      // Add personalized welcome message for returning users
      const initialMessage = userData?.name ? {
        id: 'welcome',
        sender: 'assistant',
        text: `Bonjour ${userData.name} ! Ravi de vous revoir. Comment puis-je vous aider aujourd'hui ?`,
        timestamp: new Date()
      } : INITIAL_MESSAGES[0];
      
      setMessages([initialMessage]);
    }
  }, [userData]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('weatherWearChat', JSON.stringify(messages));
    }
  }, [messages]);

  const handleBack = () => {
    navigate('/');
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const botResponse = generateBotResponse(inputMessage.trim(), userData?.name || 'utilisateur');
      setMessages(prevMessages => [...prevMessages, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateBotResponse = (message: string, userName: string): Message => {
    const lowerMessage = message.toLowerCase();
    let responseText = '';

    // Simple response logic based on keywords
    if (lowerMessage.includes('bonjour') || lowerMessage.includes('salut') || lowerMessage.includes('hello')) {
      responseText = `Bonjour ${userName} ! Comment puis-je vous aider aujourd'hui ?`;
    } 
    else if (lowerMessage.includes('merci')) {
      responseText = 'Je vous en prie ! N\'hésitez pas si vous avez d\'autres questions.';
    }
    else if (lowerMessage.includes('météo')) {
      responseText = 'Pour connaître la météo et obtenir des recommandations vestimentaires, vous pouvez retourner à l\'accueil et entrer le nom de votre ville.';
    }
    else if (lowerMessage.includes('style') || lowerMessage.includes('mode')) {
      const styles = userData?.style?.style || 'casual';
      responseText = `D'après vos préférences, votre style est plutôt ${styles}. Je peux vous aider à trouver des tenues qui correspondent à ce style tout en étant adaptées à la météo actuelle.`;
    }
    else if (lowerMessage.includes('pluie') || lowerMessage.includes('pluvieux')) {
      responseText = 'Par temps pluvieux, je recommande de porter un imperméable ou un parapluie, ainsi que des chaussures imperméables. Évitez les tissus comme le daim qui se tachent facilement avec l\'eau.';
    }
    else if (lowerMessage.includes('chaud') || lowerMessage.includes('chaleur')) {
      responseText = 'Par temps chaud, privilégiez les vêtements légers en coton ou en lin qui laissent respirer la peau. Les couleurs claires reflètent mieux la chaleur. N\'oubliez pas votre chapeau et votre crème solaire!';
    }
    else if (lowerMessage.includes('froid')) {
      responseText = 'Par temps froid, la technique des couches est votre meilleure alliée : une couche de base thermique, une couche intermédiaire isolante, et une couche extérieure coupe-vent. N\'oubliez pas les accessoires comme bonnet, gants et écharpe!';
    }
    else if (lowerMessage.includes('travail') || lowerMessage.includes('bureau')) {
      responseText = 'Pour le bureau, optez pour des tenues professionnelles mais confortables. Un pantalon bien coupé ou une jupe avec un chemisier ou un pull fin fonctionnent bien. Adaptez en fonction de la formalité de votre lieu de travail.';
    }
    else if (lowerMessage.includes('soirée') || lowerMessage.includes('fête')) {
      responseText = 'Pour une soirée, tout dépend du type d\'événement! Pour une soirée chic, une robe ou un costume sont appropriés. Pour une soirée plus décontractée, un jean avec une belle chemise ou un haut élégant peuvent convenir.';
    }
    else {
      responseText = `Merci pour votre message, ${userName}. Pour obtenir des recommandations précises basées sur la météo, vous pouvez retourner à l'accueil et entrer le nom de votre ville. Je peux aussi vous conseiller sur différents styles vestimentaires ou tenues pour des occasions spécifiques.`;
    }

    return {
      id: (Date.now() + 1).toString(),
      sender: 'assistant',
      text: responseText,
      timestamp: new Date()
    };
  };

  const getWeatherIcon = (message: string) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('pluie') || lowerMessage.includes('pluvieux')) {
      return <CloudRain className="text-blue-500" size={16} />;
    } else if (lowerMessage.includes('nuage') || lowerMessage.includes('couvert')) {
      return <Cloud className="text-gray-500" size={16} />;
    } else if (lowerMessage.includes('vent') || lowerMessage.includes('venteux')) {
      return <Wind className="text-gray-600" size={16} />;
    } else if (lowerMessage.includes('soleil') || lowerMessage.includes('chaud') || lowerMessage.includes('chaleur')) {
      return <Sun className="text-yellow-500" size={16} />;
    }
    
    return null;
  };

  return (
    <div className="flex flex-col h-screen max-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm flex items-center">
        <button 
          onClick={handleBack}
          className="flex items-center text-indigo-600 font-medium"
        >
          <ArrowLeft size={20} className="mr-2" />
          Retour
        </button>
        <h1 className="text-lg font-semibold text-gray-800 ml-4">Discussion avec WeatherWear</h1>
      </div>
      
      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div 
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-xs md:max-w-md rounded-lg p-3 ${
                message.sender === 'user' 
                  ? 'bg-indigo-600 text-white rounded-br-none' 
                  : 'bg-white shadow text-gray-800 rounded-bl-none'
              }`}
            >
              <div className="flex items-start">
                {message.sender === 'assistant' && getWeatherIcon(message.text) && (
                  <div className="mr-2 mt-1">{getWeatherIcon(message.text)}</div>
                )}
                <div>
                  <p>{message.text}</p>
                  <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-indigo-200' : 'text-gray-500'}`}>
                    {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white shadow rounded-lg p-3 rounded-bl-none">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Message input */}
      <div className="bg-white border-t border-gray-200 p-4">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <input
            type="text"
            className="flex-1 rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Posez une question sur la météo ou la mode..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={isTyping}
          />
          <button
            type="submit"
            className={`bg-indigo-600 text-white rounded-full p-2 ${
              !inputMessage.trim() || isTyping ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'
            }`}
            disabled={!inputMessage.trim() || isTyping}
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
