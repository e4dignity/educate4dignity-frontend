import React, { useEffect, useRef, useState } from 'react';
import { MessageCircle, X, Send, Minus, Maximize2 } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { API_BASE_URL, DEFAULT_HEADERS } from '../../config';
import { useTranslation } from 'react-i18next';

interface ChatMessage {
  id: string;
  message: string;
  isBot: boolean;
  timestamp: Date;
}

export const Chatbot: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      message: t('chatbot.welcome', 'Bonjour ! Comment puis-je vous aider aujourd\'hui ? Posez‑moi des questions sur nos projets, les dons, ou comment vous impliquer.'),
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to bottom whenever messages change
  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      // Use rAF to ensure DOM paints before scrolling
      requestAnimationFrame(() => {
        el.scrollTop = el.scrollHeight;
      });
    }
  }, [messages, isOpen, isMinimized]);

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

    // Try server chatbot first; fallback to local canned responses
    try {
      const res = await fetch(`${API_BASE_URL}/api/public/chat`, {
        method: 'POST',
        headers: DEFAULT_HEADERS,
        body: JSON.stringify({
          message: inputMessage,
          lang: i18n?.language || 'fr',
              pagePath: (typeof window !== 'undefined' ? window.location.pathname : undefined) || '/',
          history: messages.map(m => ({ role: m.isBot ? 'assistant' : 'user', content: m.message }))
        })
      });
      if (res.ok) {
        const data = await res.json();
        const botMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          message: (data.reply && String(data.reply).trim().length>0)
            ? data.reply
            : getBotResponse(inputMessage),
          isBot: true,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error('chat-failed');
      }
    } catch {
      const botResponse = getBotResponse(inputMessage);
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        message: botResponse,
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }

    setInputMessage('');
    setSending(false);
  };

  const getBotResponse = (message: string): string => {
    const lower = message.toLowerCase();
    const includes = (xs: string[]) => xs.some((x) => lower.includes(x));

    if (includes(['projet', 'projets', 'project'])) {
      return t('chatbot.projects', 'Nous avons plusieurs projets actifs (éducation à la santé menstruelle, kits réutilisables, recherche). Vous pouvez les explorer sur la page Projets. Souhaitez‑vous les plus récents ?');
    }
    if (includes(['don', 'dons', 'donner', 'donation', 'donate', 'paiement', 'payer'])) {
      return t('chatbot.donate', 'Merci pour votre envie de donner ! Vous pouvez faire un don sur la page Donner. Nous acceptons les dons uniques et mensuels via Stripe.');
    }
    if (includes(['benevole', 'bénévole', 'aider', 'volunteer', 'help'])) {
      return t('chatbot.volunteer', 'Vous pouvez vous impliquer (fournisseur, distributeur, formateur, équipe). Contactez‑nous via la page Contact.');
    }
    if (includes(['contact', 'email'])) {
      return t('chatbot.contact', 'Écrivez‑nous via la page Contact ou par email. Nous sommes là pour vous aider.');
    }
    return t('chatbot.generic', 'Je peux vous aider sur nos projets, les dons, le bénévolat ou les contacts.');
  };

  // Fermé totalement -> bouton flottant
  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          aria-label="Open chat assistant"
          className="rounded-full w-14 h-14 shadow-lg flex items-center justify-center bg-[var(--rose-600)] hover:bg-[var(--rose-700)] text-white"
        >
          <MessageCircle className="w-7 h-7" strokeWidth={2.2} />
        </Button>
      </div>
    );
  }

  // Ouvert mais minimisé -> barre réduite
  if (isOpen && isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50 w-72">
        <div className="bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl shadow-lg flex items-center justify-between px-4 py-2.5">
          <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
            <MessageCircle className="w-5 h-5 text-rose-600" />
            <span className="text-[13px] font-semibold">Assistant</span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              aria-label="Restore chat"
              onClick={() => setIsMinimized(false)}
              className="h-9 w-9 p-0 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
            >
              <Maximize2 className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              aria-label="Close chat"
              onClick={() => { setIsOpen(false); setIsMinimized(false); }}
              className="h-9 w-9 p-0 text-rose-600 hover:text-white hover:bg-rose-600 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80">
      <Card className="h-96 flex flex-col overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">Educate4Dignity Assistant</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                aria-label="Minimize chat"
                onClick={() => setIsMinimized(true)}
                className="h-9 w-9 p-0 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
              >
                <Minus className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                aria-label="Close chat"
                onClick={() => { setIsOpen(false); setIsMinimized(false); }}
                className="h-9 w-9 p-0 text-rose-600 hover:text-white hover:bg-rose-600 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 min-h-0 flex flex-col p-3">
          <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto space-y-2 mb-3 flex flex-col" aria-live="polite">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`max-w-[85%] p-2 rounded-lg text-sm ${
                  msg.isBot
                    ? 'self-start bg-gray-100 text-gray-800'
                    : 'self-end bg-[var(--rose-600)] text-white'
                }`}
              >
                {msg.message}
              </div>
            ))}
            {sending && (
              <div
                aria-label="Assistant is typing"
                className="max-w-[85%] p-2 rounded-lg text-sm self-start bg-gray-100 text-gray-800"
              >
                <div className="flex items-center gap-1 h-5">
                  <span className="w-2 h-2 bg-gray-400/90 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-2 h-2 bg-gray-400/90 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-2 h-2 bg-gray-400/90 rounded-full animate-bounce"></span>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={t('chatbot.placeholder', 'Écrivez votre message...')}
              className="flex-1"
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              disabled={sending}
            />
            <Button onClick={sendMessage} size="sm" aria-label="Send message" className="flex items-center gap-1" disabled={sending}>
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">{t('chatbot.send', 'Envoyer')}</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
