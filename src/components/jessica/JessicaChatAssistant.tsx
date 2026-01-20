// Jessica's Futuristic Chat Assistant - Three Zoom Levels with Floating Transparent UI

import React, { useEffect, useRef, useState } from 'react';
import { FaRobot, FaTimes, FaPaperPlane, FaExpand, FaCompress, FaWhatsapp, FaRedo, FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';
import { Input } from '../ui/Input';
import { API_BASE_URL, DEFAULT_HEADERS } from '../../config';
import { useTranslation } from 'react-i18next';
import { jessicaDataService } from '../../services/jessicaDataService';

interface ChatMessage {
  id: string;
  message: string;
  isBot: boolean;
  timestamp: Date;
}

type ZoomLevel = 'hidden' | 'compact' | 'fullscreen';

export const JessicaChatAssistant: React.FC = () => {
  const { i18n } = useTranslation();
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>('hidden');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      message: "Hi! I'm Jessica's AI assistant 🤖 Ask me about our blog stories, impact work, or donations to explore the site!",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-scroll to bottom whenever messages change
  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      requestAnimationFrame(() => {
        el.scrollTop = el.scrollHeight;
      });
    }
  }, [messages, zoomLevel]);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setSpeechSupported(true);
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = i18n.language.includes('fr') ? 'fr-FR' : 'en-US';
      
      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };
      
      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };
    }
  }, [i18n.language]);

  const toggleListening = () => {
    if (!speechSupported || !recognitionRef.current) return;
    
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const refreshChat = () => {
    setMessages([
      {
        id: '1',
        message: "Hi! I'm Jessica's AI assistant 🤖 Ask me about our blog stories, impact work, or donations to explore the site!",
        isBot: true,
        timestamp: new Date()
      }
    ]);
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      message: inputMessage,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setSending(true);
    setIsTyping(true);

    // Simulate AI thinking delay for better UX
    await new Promise(resolve => setTimeout(resolve, 1200));

    // Try server chatbot first; fallback to local responses
    try {
      // Get blog context for enriched chat experience
      const blogContext = await jessicaDataService.getBlogContextForChat();
      
      const response = await fetch(`${API_BASE_URL}/api/public/chat`, {
        method: 'POST',
        headers: DEFAULT_HEADERS,
        body: JSON.stringify({
          message: inputMessage,
          history: messages.slice(-4),
          lang: i18n.language,
          pagePath: window.location.pathname,
          blogContext: blogContext // Add blog context for smarter responses
        })
      });

      if (response.ok) {
        const data = await response.json();
        const botMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          message: data.message,
          isBot: true,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error('Server response not ok');
      }
    } catch (error) {
      console.warn('Chatbot server error, using local responses:', error);
      const localResponse = generateLocalResponse(inputMessage);
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: localResponse,
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }

    setSending(false);
    setIsTyping(false);
    setInputMessage('');
  };

  const generateLocalResponse = (message: string): string => {
    const lowerMsg = message.toLowerCase();
    const includes = (keywords: string[]) => keywords.some(k => lowerMsg.includes(k));

    // Jessica-specific AI responses with emojis and personality
    if (includes(['jessica', 'who', 'founder', 'about'])) {
      return "🌟 I'm Jessica's AI assistant! Jessica founded this transformative project in 2023 to break menstrual health taboos through education and reusable kit distribution. She's personally trained 500+ girls in Burundi and distributed 500 reusable kits designed to last 5 years each! 💪 Would you like to explore her inspiring journey or connect via WhatsApp for personal support?";
    }
    
    if (includes(['whatsapp', 'chat', 'support', 'help', 'guidance', 'personal'])) {
      return "💬 For personal support and verified menstrual health information, Jessica is available on WhatsApp! You can get confidential guidance about menstrual health, education resources, and community support. This is especially valuable for young women seeking trusted, private information. 🤗";
    }
    
    if (includes(['menstrual', 'period', 'health', 'hygiene', 'education'])) {
      return "🩺 Jessica provides comprehensive menstrual health education covering hygiene practices, reusable kit usage, and breaking cultural taboos. Our approach combines science with empathy and cultural sensitivity. For detailed personal guidance, Jessica offers WhatsApp consultations with verified health information! 📚";
    }
    
    if (includes(['kits', 'pads', 'reusable', 'distribution'])) {
      return "🎯 We distribute eco-friendly reusable menstrual kits designed to last 5+ years! Each kit contains sustainable pads and educational materials. 500 kits have been distributed to girls in Burundi, and each girl receives personal training sessions with Jessica. 🌱";
    }
    
    if (includes(['impact', 'results', 'statistics', 'numbers', 'data'])) {
      return "📊 Jessica's incredible impact: 500+ girls trained directly, 500 reusable kits distributed, 300+ miles traveled to reach remote communities! Each kit keeps a girl in school for 5 years, transforming educational outcomes and breaking poverty cycles. The ripple effect is amazing! ⭐";
    }
    
    if (includes(['donate', 'support', 'fund', 'contribute', 'help'])) {
      return "❤️ You can support Jessica's life-changing work through our donation page! Just $25 funds a complete kit plus training for one girl for 5 years. Every donation directly supports local kit production and Jessica's educational programs in rural Burundi. 🎁";
    }
    
    if (includes(['burundi', 'africa', 'location', 'where', 'community'])) {
      return "🌍 Jessica's work is primarily in Burundi, especially in rural communities around Bujumbura and Mugerere. The project addresses specific cultural challenges around menstruation while building local production capacity and empowering communities! 🏘️";
    }
    
    if (includes(['contact', 'reach', 'connect', 'talk'])) {
      return "📞 You can reach Jessica through this website's contact page, or for personal menstrual health support, connect via WhatsApp where she provides verified information and guidance to young women confidentially. I'm also here 24/7! 🤖";
    }

    if (includes(['ai', 'robot', 'assistant', 'bot'])) {
      return "🤖 I'm Jessica's AI-powered assistant, designed to help you navigate menstrual health resources, project information, and support options! I'm here 24/7 and can connect you with Jessica's WhatsApp for personal guidance. How can I assist you today? ✨";
    }

    return "✨ I'm here to help with information about Jessica's menstrual health project, impact statistics, support options, and WhatsApp guidance. What would you like to know about breaking menstrual health barriers and creating positive change? 🌟";
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };



  const closeChat = () => {
    setZoomLevel('hidden');
  };

  // Level 1: Hidden -> Floating AI button
  if (zoomLevel === 'hidden') {
    return (
      <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
        <div 
          onClick={() => setZoomLevel('compact')}
          className="group relative cursor-pointer"
        >
          {/* Glowing ring animation */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#f4a6a9] via-[#e8b4b8] to-[#f4a6a9] animate-spin opacity-75 blur-sm"></div>
          
          {/* Main button */}
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-[#f4a6a9] to-[#e8b4b8] shadow-xl flex items-center justify-center text-white transition-all duration-300 hover:scale-110 hover:shadow-2xl">
            <FaRobot className="w-6 h-6 sm:w-8 sm:h-8 animate-pulse" />
          </div>
          
          {/* WhatsApp indicator */}
          <div className="absolute -top-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
            <FaWhatsapp className="w-2 h-2 sm:w-3 sm:h-3 text-white" />
          </div>
          
          {/* Floating particles */}
          <div className="absolute inset-0 opacity-60">
            {[...Array(3)].map((_, i) => (
              <div 
                key={i}
                className="absolute w-1 h-1 bg-[#f4a6a9] rounded-full animate-ping"
                style={{
                  top: `${20 + i * 20}%`,
                  left: `${15 + i * 25}%`,
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: '2s'
                }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Level 2: Compact -> Mini format floating chat
  if (zoomLevel === 'compact') {
    return (
      <div className="fixed bottom-4 right-4 z-50 w-80 max-w-[calc(100vw-2rem)] sm:w-96 sm:bottom-6 sm:right-6">
        <div className="relative">
          {/* Transparent gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-white/20 to-white/30 backdrop-blur-xl rounded-3xl"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-[#f4a6a9]/5 to-[#e8b4b8]/10 rounded-3xl"></div>
          
          {/* Content */}
          <div className="relative h-[400px] sm:h-[500px] flex flex-col border border-white/30 rounded-3xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#f4a6a9]/80 to-[#e8b4b8]/80 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <FaRobot className="w-4 h-4 text-white animate-pulse" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">Jessica's AI Assistant</div>
                  <div className="flex items-center gap-1 text-xs text-white/80">
                    <FaWhatsapp className="w-3 h-3" />
                    <span>WhatsApp Available</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={refreshChat}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white hover:scale-110 transition-all duration-200"
                  title="Refresh chat"
                >
                  <FaRedo className="w-3 h-3" />
                </button>
                <button
                  onClick={() => setZoomLevel('fullscreen')}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white hover:scale-110 transition-all duration-200"
                >
                  <FaExpand className="w-4 h-4" />
                </button>
                <button
                  onClick={closeChat}
                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-red-400/30 flex items-center justify-center text-white hover:scale-110 transition-all duration-200"
                >
                  <FaTimes className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* Messages */}
            <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto space-y-3">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`max-w-[85%] ${msg.isBot ? 'self-start' : 'self-end ml-auto'}`}
                >
                  <div className={`p-3 rounded-2xl text-sm ${
                    msg.isBot
                      ? 'bg-white/60 text-[#5a4a47] backdrop-blur-sm border border-white/30'
                      : 'bg-gradient-to-br from-[#f4a6a9] to-[#e8b4b8] text-white shadow-lg'
                  }`}>
                    {msg.message}
                  </div>
                </div>
              ))}
              
              {(sending || isTyping) && (
                <div className="flex items-center gap-2 p-3 bg-white/60 backdrop-blur-sm border border-white/30 rounded-2xl w-fit">
                  <div className="flex space-x-1">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="w-2 h-2 bg-[#f4a6a9] rounded-full animate-bounce"
                        style={{animationDelay: `${i * 0.1}s`}}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-[#7a6a67] ml-1">AI thinking...</span>
                </div>
              )}
            </div>
            
            {/* Input */}
            <div className="p-3 sm:p-4 bg-white/10 backdrop-blur-sm border-t border-white/20">
              <div className="flex gap-2">
                <Input
                  value={inputMessage}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Explore our content..."
                  disabled={sending}
                  className="flex-1 bg-white/60 border-white/30 text-[#5a4a47] placeholder:text-[#7a6a67] backdrop-blur-sm rounded-xl"
                />
                {speechSupported && (
                  <button
                    onClick={toggleListening}
                    disabled={sending}
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
                      isListening 
                        ? 'bg-red-500 text-white animate-pulse' 
                        : 'bg-white/60 text-[#5a4a47] hover:bg-white/80'
                    }`}
                    title={isListening ? 'Stop listening' : 'Start voice input'}
                  >
                    {isListening ? <FaMicrophoneSlash className="w-3 h-3 sm:w-4 sm:h-4" /> : <FaMicrophone className="w-3 h-3 sm:w-4 sm:h-4" />}
                  </button>
                )}
                <button
                  onClick={sendMessage}
                  disabled={sending || !inputMessage.trim()}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-[#f4a6a9] to-[#e8b4b8] text-white flex items-center justify-center hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100"
                >
                  <FaPaperPlane className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }



  // Level 3: Fullscreen -> Effet glass transparent sans en-tête
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop transparent pour voir la page derrière */}
      <div 
        className="absolute inset-0 bg-black/5 backdrop-blur-sm"
        onClick={() => setZoomLevel('compact')}
      />
      
      <div className="relative w-[800px] max-w-[90vw] h-[700px] max-h-[90vh]">
        {/* Glass effect - très transparent pour voir la page derrière */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/15 via-white/10 to-white/15 backdrop-blur-md rounded-3xl"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-[#f4a6a9]/5 to-[#e8b4b8]/8 rounded-3xl"></div>
        
        {/* Content sans en-tête */}
        <div className="relative h-full flex flex-col border border-white/20 rounded-3xl shadow-xl overflow-hidden">
          
          {/* Bouton fermer discret en haut à droite */}
          <button
            onClick={closeChat}
            className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/20 hover:bg-red-400/30 flex items-center justify-center text-[#5a4a47] hover:text-red-500 hover:scale-110 transition-all duration-200"
          >
            <FaTimes className="w-5 h-5" />
          </button>

          {/* Boutons de contrôle en haut à droite */}
          <button
            onClick={refreshChat}
            className="absolute top-4 right-28 z-10 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-[#5a4a47] hover:text-[#f4a6a9] hover:scale-110 transition-all duration-200"
            title="Refresh chat"
          >
            <FaRedo className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel('compact')}
            className="absolute top-4 right-16 z-10 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-[#5a4a47] hover:text-[#f4a6a9] hover:scale-110 transition-all duration-200"
          >
            <FaCompress className="w-5 h-5" />
          </button>
          
          {/* Messages avec effet glass */}
          <div ref={scrollRef} className="flex-1 p-8 pt-20 overflow-y-auto space-y-6">
            {/* Indicateur AI visible */}
            <div className="flex items-center justify-center mb-6">
              <div className="flex items-center gap-3 px-6 py-3 bg-white/60 backdrop-blur-lg border border-white/50 rounded-full shadow-lg">
                <FaRobot className="w-5 h-5 text-[#f4a6a9] animate-pulse" />
                <span className="text-sm font-semibold text-[#5a4a47]">Jessica's AI Assistant</span>
                <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
                  <FaWhatsapp className="w-3 h-3" />
                  <span>WhatsApp</span>
                </div>
              </div>
            </div>

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`max-w-[75%] ${msg.isBot ? 'self-start' : 'self-end ml-auto'}`}
              >
                <div className={`p-5 rounded-2xl text-base ${
                  msg.isBot
                    ? 'bg-white/70 text-[#5a4a47] backdrop-blur-lg border border-white/50 shadow-lg'
                    : 'bg-gradient-to-br from-[#f4a6a9] to-[#e8b4b8] text-white shadow-xl backdrop-blur-sm'
                }`}>
                  {msg.message}
                </div>
              </div>
            ))}
            
            {(sending || isTyping) && (
              <div className="flex items-center gap-4 p-5 bg-white/70 backdrop-blur-lg border border-white/50 rounded-2xl w-fit shadow-lg">
                <div className="flex space-x-1">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="w-3 h-3 bg-[#f4a6a9] rounded-full animate-bounce"
                      style={{animationDelay: `${i * 0.1}s`}}
                    />
                  ))}
                </div>
                <span className="text-sm text-[#7a6a67] ml-2 font-medium">AI processing your request...</span>
              </div>
            )}
          </div>
          
          {/* Input dynamique avec effet glass renforcé */}
          <div className="p-6 bg-white/25 backdrop-blur-lg border-t border-white/40">
            <div className="flex gap-3 items-end">
              <div className="flex-1 relative">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                  placeholder="Explore Jessica's impact stories, blog content, and donation options..."
                  disabled={sending}
                  rows={inputMessage.split('\n').length || 1}
                  className="w-full bg-white/60 border-2 border-white/50 text-[#5a4a47] placeholder:text-[#7a6a67] backdrop-blur-md rounded-2xl text-base p-4 resize-none focus:outline-none focus:border-[#f4a6a9]/60 focus:bg-white/70 transition-all duration-200 min-h-[3.5rem] max-h-32"
                  style={{
                    height: 'auto',
                    minHeight: '3.5rem'
                  }}
                />
              </div>
              {speechSupported && (
                <button
                  onClick={toggleListening}
                  disabled={sending}
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-200 ${
                    isListening 
                      ? 'bg-red-500 text-white animate-pulse shadow-lg' 
                      : 'bg-white/60 text-[#5a4a47] hover:bg-white/80 hover:scale-105'
                  }`}
                  title={isListening ? 'Stop listening' : 'Start voice input'}
                >
                  {isListening ? <FaMicrophoneSlash className="w-5 h-5" /> : <FaMicrophone className="w-5 h-5" />}
                </button>
              )}
              <button
                onClick={sendMessage}
                disabled={sending || !inputMessage.trim()}
                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#f4a6a9] to-[#e8b4b8] text-white flex items-center justify-center hover:scale-105 hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:hover:scale-100 shadow-md backdrop-blur-sm flex-shrink-0"
              >
                <FaPaperPlane className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JessicaChatAssistant;