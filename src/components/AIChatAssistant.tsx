import { FormEvent, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';

type ChatRole = 'user' | 'model';

interface ChatMessage {
  id: string;
  role: ChatRole;
  text: string;
  timestamp: string;
}

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';
const OPENAI_MODEL = 'gpt-4o-mini';
const STORAGE_KEY = 'healthsync_ai_chat_history';
const DEFAULT_OPENAI_KEY =
  'sk-user-Xn1fd6Rf7OHntMAQg00ZsrrHYWhcgL7Q4BO-x7crQAMsvX4fx4vPd0Ncfg5N_TRtTQEV-wiGDpV7AzEbNp0FutZ1tq6GS-nWelsU8QwzaE0rD_dgB0nL009z8GmSQExtH6c';
const systemPrompt = [
  'You are HealthSync AI, a compassionate virtual medical assistant. Follow these rules:',
  '• Greet users warmly and gather initial symptoms.',
  '• Ask one targeted follow-up question at a time (duration, severity, associated symptoms, history, medication, lifestyle).',
  '• Offer balanced, empathetic language. Acknowledge concerns.',
  '• NEVER provide a definitive diagnosis or prescribe medication.',
  '• Provide general health education and possible considerations.',
  '• Always advise seeking professional care for urgent or serious symptoms.',
  '• Include gentle reminders that you are not a substitute for a doctor.',
  '• Encourage healthy lifestyle habits where appropriate.',
  '• Keep responses concise (under 120 words) yet informative and friendly.'
].join('\n');

const initialGreeting =
  'How can I help you with your health concerns today?';

const createMessage = (role: ChatRole, text: string): ChatMessage => ({
  id: crypto.randomUUID(),
  role,
  text,
  timestamp: new Date().toISOString()
});

const AIChatAssistant = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Load history from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as ChatMessage[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed);
          return;
        }
      } catch {
        // ignore parse errors
      }
    }

    // fallback greeting
    setMessages([createMessage('model', initialGreeting)]);
  }, []);

  // Persist history
  useEffect(() => {
    if (typeof window === 'undefined' || messages.length === 0) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-20)));
  }, [messages]);

  // Auto-scroll on new messages
  useEffect(() => {
    if (!chatContainerRef.current) return;
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }, [messages, loading]);

  const apiConversation = useMemo(() => {
    return messages.map((message) => ({
      role: message.role === 'model' ? 'assistant' : 'user',
      content: message.text
    }));
  }, [messages]);

  // Trigger map search for health-related keywords
  const triggerMapSearch = (responseText: string) => {
    const healthcareKeywords = [
      'hospital', 'urgent', 'emergency', 'severe',
      'clinic', 'doctor', 'medical', 'treatment',
      'pharmacy', 'prescription', 'medicine', 'care center',
      'healthcare', 'facility', 'professional medical',
      'seek', 'visit', 'nearby'
    ];

    const shouldTriggerMap = healthcareKeywords.some(keyword =>
      responseText.toLowerCase().includes(keyword)
    );

    if (shouldTriggerMap && (window as any).Map3DSearch) {
      // Delay slightly to ensure user sees response first
      setTimeout(() => {
        (window as any).Map3DSearch.searchNearbyHealthcare('all', 5000);
      }, 500);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = input.trim();
    if (trimmed.length < 2 || loading) {
      setError('Please enter a bit more detail so I can assist you.');
      setTimeout(() => setError(null), 4000);
      return;
    }

    const userMessage = createMessage('user', trimmed);
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError(null);

    try {
      const payload = {
        model: OPENAI_MODEL,
        temperature: 0.7,
        max_tokens: 500,
        messages: [
          { role: 'system', content: systemPrompt },
          ...apiConversation,
          { role: 'user', content: trimmed }
        ]
      };

      const apiKey =
        import.meta.env.VITE_OPENAI_API_KEY?.trim() || DEFAULT_OPENAI_KEY;

      const response = await fetch(OPENAI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorPayload = await response.json().catch(() => ({}));
        throw new Error(errorPayload.error?.message || 'AI request failed.');
      }

      const data = await response.json();
      const aiText =
        data?.choices?.[0]?.message?.content?.trim() ||
        "I'm experiencing technical difficulties. Please try again in a moment.";

      setMessages((prev) => [...prev, createMessage('model', aiText)]);
      
      // Trigger map search if response contains healthcare keywords
      triggerMapSearch(aiText);
    } catch (apiError) {
      console.error(apiError);
      const friendlyMessage =
        apiError instanceof Error
          ? apiError.message
          : "I'm experiencing technical difficulties. Please try again in a moment.";
      setMessages((prev) => [
        ...prev,
        createMessage('model', friendlyMessage)
      ]);
      setError(friendlyMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl px-6 py-6 sm:p-8 border border-white/60">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-gray-400 font-semibold">
            AI Assistant
          </p>
          <h3 className="text-2xl font-semibold text-gray-900">
            Virtual Health Companion
          </h3>
        </div>
        <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-green-600 text-sm font-medium">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          Online
        </span>
      </div>

      <div
        ref={chatContainerRef}
        className="space-y-4 max-h-[360px] overflow-y-auto pr-2"
        aria-live="polite"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm sm:text-base leading-relaxed shadow-md ${
              message.role === 'model'
                ? 'bg-gray-50 text-slate-600'
                : 'bg-white text-slate-800 ml-auto border border-slate-100'
            }`}
          >
            {message.text}
            <span className="block text-xs text-gray-400 mt-2">
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        ))}
        {loading && (
          <div className="inline-flex items-center gap-2 bg-gray-50 text-slate-600 rounded-2xl px-4 py-2 shadow">
            <Loader2 className="h-4 w-4 animate-spin text-medical-500" />
            AI is typing…
          </div>
        )}
      </div>

      <div className="mt-6">
        <form
          onSubmit={handleSubmit}
          className="relative flex items-center bg-slate-50 rounded-full pr-20 shadow-inner"
        >
          <label htmlFor="ai-chat-input" className="sr-only">
            Describe your symptoms
          </label>
          <input
            id="ai-chat-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Type your symptoms..."
            className="flex-1 bg-transparent border-none focus:outline-none text-base px-5 py-4"
            minLength={2}
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-medical-500 text-white flex items-center justify-center shadow-lg hover:bg-medical-600 disabled:opacity-60 transition-transform duration-200"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <ArrowRight className="h-5 w-5" />
            )}
          </button>
        </form>
        {error && (
          <p className="text-sm text-red-600 mt-3 bg-red-50 rounded-xl px-4 py-2">
            {error}
          </p>
        )}
      </div>

      <div className="mt-5 text-xs text-slate-500 leading-relaxed border-t border-slate-100 pt-4">
        This assistant shares general wellness guidance and is not a substitute
        for professional medical advice. Please contact a certified healthcare
        provider for urgent or serious concerns.
      </div>
    </div>
  );
};

export default AIChatAssistant;

