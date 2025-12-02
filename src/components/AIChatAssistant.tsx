import { FormEvent, useEffect, useMemo, useRef, useState, useCallback } from 'react';
import { ArrowRight, Loader2, Sparkles, AlertCircle, RefreshCw, Settings, Trash2 } from 'lucide-react';

type ChatRole = 'user' | 'model';
type MessageStatus = 'sent' | 'error' | 'pending';

interface ChatMessage {
  id: string;
  role: ChatRole;
  text: string;
  timestamp: string;
  status?: MessageStatus;
}

interface ApiResponse {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
  error?: {
    message?: string;
    code?: string;
  };
}

const BACKEND_API_URL = 'http://localhost:3001';
const CHAT_ENDPOINT = `${BACKEND_API_URL}/api/chat`;
const HEALTH_ENDPOINT = `${BACKEND_API_URL}/health`;
const OPENAI_MODEL = 'gpt-4o-mini';
// Session-based storage: Auto-clears on browser tab close (privacy-first design)
const STORAGE_KEY = 'healthsync_session_chat';
const PREFERENCES_KEY = 'healthsync_preferences'; // CHANGED: Added preferences storage
const LEGACY_STORAGE_KEY = 'healthsync_ai_chat_history_v2'; // CHANGED: Legacy data migration

// CHANGED: Enhanced Storage Manager with fallback and error handling
const StorageManager = {
  // CHANGED: Check if storage is available
  isAvailable: (storage: Storage): boolean => {
    if (typeof window === 'undefined') return false;
    try {
      const testKey = '__storage_test__';
      storage.setItem(testKey, 'test');
      storage.removeItem(testKey);
      return true;
    } catch (err) {
      console.warn('[STORAGE] Storage unavailable (private/incognito mode?):', err);
      return false;
    }
  },

  // CHANGED: Get chat with fallback handling
  getChat: () => {
    if (typeof window === 'undefined') return null;
    try {
      if (!StorageManager.isAvailable(sessionStorage)) {
        console.warn('[STORAGE] sessionStorage unavailable, using in-memory only');
        return null;
      }
      const data = sessionStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (err) {
      console.error('[STORAGE] Failed to parse:', err);
      return null;
    }
  },

  // CHANGED: Save chat with quota handling
  saveChat: (messages: ChatMessage[]) => {
    if (typeof window === 'undefined') return;
    try {
      if (!StorageManager.isAvailable(sessionStorage)) return;
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-20)));
    } catch (err) {
      if (err instanceof DOMException && err.name === 'QuotaExceededError') {
        console.warn('[STORAGE] Quota exceeded, clearing old data');
        sessionStorage.clear();
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-5)));
      } else {
        console.error('[STORAGE] Failed to save:', err);
      }
    }
  },

  // CHANGED: Clear chat history
  clear: () => {
    if (typeof window === 'undefined') return;
    try {
      if (!StorageManager.isAvailable(sessionStorage)) return;
      sessionStorage.removeItem(STORAGE_KEY);
      console.log('[STORAGE] Chat history cleared');
    } catch (err) {
      console.error('[STORAGE] Failed to clear:', err);
    }
  },

  // CHANGED: Migrate legacy data
  migrateLegacy: () => {
    if (typeof window === 'undefined') return null;
    try {
      if (!StorageManager.isAvailable(localStorage)) return null;
      const legacyData = localStorage.getItem(LEGACY_STORAGE_KEY);
      if (legacyData) {
        console.log('[STORAGE] Found legacy data, migrating to session storage');
        // Clear legacy data (privacy)
        localStorage.removeItem(LEGACY_STORAGE_KEY);
        return JSON.parse(legacyData);
      }
    } catch (err) {
      console.error('[STORAGE] Migration failed:', err);
    }
    return null;
  },

  // CHANGED: Get/Set preferences
  getPreferences: () => {
    if (typeof window === 'undefined') return { rememberConversation: false };
    try {
      if (!StorageManager.isAvailable(localStorage)) {
        return { rememberConversation: false };
      }
      const prefs = localStorage.getItem(PREFERENCES_KEY);
      return prefs ? JSON.parse(prefs) : { rememberConversation: false };
    } catch (err) {
      console.error('[STORAGE] Failed to get preferences:', err);
      return { rememberConversation: false };
    }
  },

  savePreferences: (prefs: any) => {
    if (typeof window === 'undefined') return;
    try {
      if (!StorageManager.isAvailable(localStorage)) return;
      localStorage.setItem(PREFERENCES_KEY, JSON.stringify(prefs));
    } catch (err) {
      console.error('[STORAGE] Failed to save preferences:', err);
    }
  }
};

// Enhanced system prompt with strict rules
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
  'Hello! I\'m Vayu Ai, your health companion. Describe your symptoms and I\'ll provide helpful health information. Ask about: headache, fever, cold, cough, sore throat, flu, fatigue, anxiety, and more.';

// ============================================================================
// ERROR HANDLING & LOGGING UTILITIES
// ============================================================================

enum ErrorType {
  NETWORK = 'NETWORK',
  API_KEY = 'API_KEY',
  RATE_LIMIT = 'RATE_LIMIT',
  BAD_REQUEST = 'BAD_REQUEST',
  SERVER_ERROR = 'SERVER_ERROR',
  UNKNOWN = 'UNKNOWN'
}

interface AppError {
  type: ErrorType;
  message: string;
  statusCode?: number;
  retryable: boolean;
  details?: string;
}

// Parse error response and determine error type
const parseErrorResponse = (error: unknown, statusCode?: number): AppError => {
  console.error('[ERROR PARSE]', { error, statusCode });

  if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
    return {
      type: ErrorType.NETWORK,
      message: 'Cannot connect to server. Please check your internet connection.',
      retryable: true,
      details: `Backend server not reachable at ${BACKEND_API_URL}`
    };
  }

  if (statusCode === 401 || statusCode === 403) {
    return {
      type: ErrorType.API_KEY,
      message: 'Authentication failed. Please check your API configuration.',
      statusCode,
      retryable: false,
      details: 'Invalid or expired API key'
    };
  }

  if (statusCode === 429) {
    return {
      type: ErrorType.RATE_LIMIT,
      message: 'Too many requests. Please wait a moment before trying again.',
      statusCode,
      retryable: true,
      details: 'Rate limit exceeded - implement exponential backoff'
    };
  }

  if (statusCode === 400) {
    return {
      type: ErrorType.BAD_REQUEST,
      message: 'Invalid request format. Please try again with different wording.',
      statusCode,
      retryable: false,
      details: 'Request payload does not match API specifications'
    };
  }

  if (statusCode && statusCode >= 500) {
    return {
      type: ErrorType.SERVER_ERROR,
      message: 'Server error. Please try again in a moment.',
      statusCode,
      retryable: true,
      details: `HTTP ${statusCode} error from backend`
    };
  }

  return {
    type: ErrorType.UNKNOWN,
    message: error instanceof Error ? error.message : 'An unexpected error occurred.',
    retryable: true,
    details: String(error)
  };
};

const createMessage = (role: ChatRole, text: string, status: MessageStatus = 'sent'): ChatMessage => ({
  id: crypto.randomUUID(),
  role,
  text,
  timestamp: new Date().toISOString(),
  status
});

// CHANGED: Helper function to format AI responses as unordered lists
const FormatAIResponse = ({ text }: { text: string }) => {
  // Split text by numbered items or line breaks
  const lines = text.split(/(?=\d+\))|(?=\n)/);
  
  // Check if the response contains numbered items (like "1) item 2) item")
  const hasNumberedItems = /\d+\)/.test(text);
  
  if (hasNumberedItems) {
    // Parse numbered items into list items
    const items = text.match(/\d+\)\s*([^]*?)(?=\d+\)|$)/g) || [];
    const cleanItems = items.map(item => 
      item.replace(/^\d+\)\s*/, '').trim()
    ).filter(item => item.length > 0);
    
    return (
      <ul className="text-sm leading-relaxed space-y-2 list-disc pl-5 text-left">
        {cleanItems.map((item, idx) => (
          <li key={idx} className="text-gray-800 break-words">
            {item}
          </li>
        ))}
      </ul>
    );
  }
  
  // If no numbered items, return as paragraph
  return <p className="text-sm leading-relaxed text-left">{text}</p>;
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const AIChatAssistant = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([createMessage('model', initialGreeting)]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AppError | null>(null);
  const [serverConnected, setServerConnected] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  // CHANGED: Added user preferences state
  const [rememberConversation, setRememberConversation] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  // ============================================================================
  // SERVER CONNECTION CHECK
  // ============================================================================

  const checkServerConnection = useCallback(async () => {
    try {
      const response = await fetch(HEALTH_ENDPOINT, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });

      if (response.ok) {
        setServerConnected(true);
        console.log('✓ [HEALTH CHECK] Backend server is connected');
        setRetryCount(0);
        return true;
      }
    } catch (err) {
      console.error('✗ [HEALTH CHECK] Failed:', err);
      setServerConnected(false);
      setError(parseErrorResponse(err));
    }
    return false;
  }, []);

  // ============================================================================
  // PAGE-LOAD RESET: Initialize with privacy controls (APPROACH 3)
  // ============================================================================
  // CHANGED: Enhanced initialization with preferences and legacy migration
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Load user preferences
    const prefs = StorageManager.getPreferences();
    setRememberConversation(prefs.rememberConversation);
    
    // By default: Clear chat history for privacy (GDPR/HIPAA compliant)
    // Only load if user explicitly enabled "Remember Conversation"
    if (!prefs.rememberConversation) {
      StorageManager.clear();
      console.log('✓ [RESET] Page loaded - chat cleared for privacy (default behavior)');
    } else {
      // Try to migrate legacy data first
      const legacyData = StorageManager.migrateLegacy();
      if (legacyData) {
        setMessages(legacyData);
        console.log('✓ [MIGRATION] Restored from legacy data');
      } else {
        // Otherwise load from session storage
        const stored = StorageManager.getChat();
        if (stored && Array.isArray(stored) && stored.length > 0) {
          setMessages(stored);
          console.log(`✓ [STORAGE] Loaded ${stored.length} messages from session`);
        }
      }
    }
    
    setIsInitialized(true);
  }, []); // CHANGED: Runs once on mount

  // CHANGED: Handle remember conversation toggle
  const handleRememberToggle = (value: boolean) => {
    setRememberConversation(value);
    StorageManager.savePreferences({ rememberConversation: value });
    console.log(`✓ [PREFERENCES] Remember conversation: ${value}`);
    
    if (!value) {
      // If user disables, clear current session for privacy
      StorageManager.clear();
      setMessages([createMessage('model', initialGreeting)]);
      console.log('✓ [PRIVACY] Chat cleared - conversation memory disabled');
    }
  };

  // CHANGED: Handle explicit clear button
  const handleClearHistory = () => {
    StorageManager.clear();
    setMessages([createMessage('model', initialGreeting)]);
    setInput('');
    setError(null);
    console.log('✓ [USER ACTION] Chat history cleared explicitly');
  };

  // CHANGED: Handle start new chat button
  const handleStartNewChat = () => {
    setMessages([createMessage('model', initialGreeting)]);
    setInput('');
    setError(null);
    setRetryCount(0);
    console.log('✓ [USER ACTION] Started new conversation');
  };

  // Check server connection on mount and periodically
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check on mount
    checkServerConnection();

    // Check every 30 seconds
    const interval = setInterval(checkServerConnection, 30000);
    return () => clearInterval(interval);
  }, [checkServerConnection]);

  // Persist to sessionStorage during active session only (respects user preference)
  useEffect(() => {
    if (typeof window === 'undefined' || !isInitialized) return;
    
    // Only persist if user enabled "Remember Conversation"
    if (rememberConversation) {
      StorageManager.saveChat(messages);
    }
  }, [messages, isInitialized, rememberConversation]);

  // Auto-scroll to latest message
  useEffect(() => {
    if (!chatContainerRef.current) return;
    setTimeout(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    }, 0);
  }, [messages, loading]);

  // Build conversation history (filter out error messages)
  const apiConversation = useMemo(() => {
    return messages
      .filter(msg => msg.status !== 'error')
      .map((message) => ({
        role: message.role === 'model' ? 'assistant' : 'user',
        content: message.text
      }));
  }, [messages]);

  // ============================================================================
  // API CALL WITH RETRY LOGIC & ERROR HANDLING
  // ============================================================================

  const sendMessage = async (userMessage: string, attemptNumber = 1): Promise<boolean> => {
    const maxRetries = 3;
    const backoffMs = Math.min(1000 * Math.pow(2, attemptNumber - 1), 10000); // Exponential backoff: 1s, 2s, 4s...

    try {
      console.log(`[API CALL] Attempt ${attemptNumber}/${maxRetries}: Sending message to ${CHAT_ENDPOINT}`);

      const payload = {
        model: OPENAI_MODEL,
        temperature: 0.7,
        max_tokens: 500,
        messages: [
          { role: 'system', content: systemPrompt },
          ...apiConversation,
          { role: 'user', content: userMessage }
        ]
      };

      console.log('[API PAYLOAD] Message count:', payload.messages.length);

      const response = await fetch(CHAT_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(30000) // 30 second timeout for OpenAI
      });

      console.log('[API RESPONSE] Status:', response.status);

      // Handle non-OK responses
      if (!response.ok) {
        let errorData: ApiResponse = {};
        try {
          errorData = await response.json();
        } catch {
          // Ignore JSON parse errors
        }

        const apiError = parseErrorResponse(
          new Error(errorData.error?.message || `HTTP ${response.status}`),
          response.status
        );

        console.error('[API ERROR]', { statusCode: response.status, ...apiError });

        // Retry logic for retriable errors
        if (apiError.retryable && attemptNumber < maxRetries) {
          console.log(`[RETRY] Waiting ${backoffMs}ms before retry...`);
          setMessages((prev) => [
            ...prev,
            createMessage('model', `⏳ Retrying (attempt ${attemptNumber + 1}/${maxRetries})...`, 'pending')
          ]);

          await new Promise(resolve => setTimeout(resolve, backoffMs));
          return sendMessage(userMessage, attemptNumber + 1);
        }

        setError(apiError);
        setMessages((prev) => [
          ...prev,
          createMessage('model', `⚠️ ${apiError.message}`, 'error')
        ]);
        return false;
      }

      // Parse successful response
      const data: ApiResponse = await response.json();
      const aiText = data?.choices?.[0]?.message?.content?.trim();

      if (!aiText) {
        const emptyError: AppError = {
          type: ErrorType.UNKNOWN,
          message: 'Empty response from AI. Please try again.',
          retryable: true
        };
        setError(emptyError);
        setMessages((prev) => [
          ...prev,
          createMessage('model', `⚠️ ${emptyError.message}`, 'error')
        ]);
        return false;
      }

      console.log('[API SUCCESS] Response received:', aiText.substring(0, 50) + '...');
      setMessages((prev) => [...prev, createMessage('model', aiText, 'sent')]);
      setError(null);
      setRetryCount(0);
      return true;

    } catch (err) {
      const appError = parseErrorResponse(err);
      console.error('[EXCEPTION]', appError);

      // Retry for network errors
      if (appError.retryable && attemptNumber < maxRetries) {
        console.log(`[RETRY] Waiting ${backoffMs}ms before retry...`);
        setMessages((prev) => [
          ...prev,
          createMessage('model', `⏳ Reconnecting (attempt ${attemptNumber + 1}/${maxRetries})...`, 'pending')
        ]);

        await new Promise(resolve => setTimeout(resolve, backoffMs));
        return sendMessage(userMessage, attemptNumber + 1);
      }

      setError(appError);
      setMessages((prev) => [
        ...prev,
        createMessage('model', `⚠️ ${appError.message}`, 'error')
      ]);
      return false;
    }
  };

  // ============================================================================
  // FORM SUBMISSION HANDLER
  // ============================================================================

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = input.trim();

    // Input validation
    if (trimmed.length < 2) {
      setError({
        type: ErrorType.BAD_REQUEST,
        message: 'Please enter at least 2 characters.',
        retryable: false
      });
      setTimeout(() => setError(null), 3000);
      return;
    }

    if (trimmed.length > 1000) {
      setError({
        type: ErrorType.BAD_REQUEST,
        message: 'Message is too long (max 1000 characters).',
        retryable: false
      });
      return;
    }

    if (loading) {
      console.warn('[SUBMIT] Already loading, ignoring duplicate submission');
      return;
    }

    // Check server connection
    if (!serverConnected) {
      const connectError: AppError = {
        type: ErrorType.NETWORK,
        message: `Cannot reach backend server at ${BACKEND_API_URL}. Please check if the server is running.`,
        retryable: true
      };
      setError(connectError);
      return;
    }

    // Add user message to chat
    const userMessage = createMessage('user', trimmed, 'sent');
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError(null);

    console.log('[SUBMIT] User message:', trimmed.substring(0, 50) + '...');

    // Send message with retry logic
    const success = await sendMessage(trimmed);
    setLoading(false);
  };

  // ============================================================================
  // RETRY HANDLER
  // ============================================================================

  const handleRetry = async () => {
    if (messages.length === 0) return;

    // Find last user message
    const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
    if (!lastUserMessage) return;

    setRetryCount(prev => prev + 1);
    setMessages((prev) => prev.filter(m => m.status !== 'error'));
    setLoading(true);
    setError(null);

    const success = await sendMessage(lastUserMessage.text);
    setLoading(false);
  };

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="w-full h-full flex flex-col bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="flex-shrink-0 bg-gradient-to-r from-blue-500 to-blue-600 px-6 py-5 border-b border-blue-400">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-bold text-lg">Vayu Ai</h3>
              <p className="text-blue-100 text-xs">
                {serverConnected ? '✓ Connected' : '✗ Offline'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* CHANGED: Added settings button */}
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="bg-white/20 hover:bg-white/30 text-white rounded-lg p-2 transition-all"
              aria-label="Settings"
              title="Privacy & Storage Settings"
            >
              <Settings className="w-5 h-5" />
            </button>
            {/* CHANGED: Added clear history button */}
            <button
              onClick={handleClearHistory}
              className="bg-white/20 hover:bg-white/30 text-white rounded-lg p-2 transition-all"
              aria-label="Clear history"
              title="Clear chat history"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <span className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-white text-xs font-medium backdrop-blur-sm border ${
              serverConnected
                ? 'bg-green-500/20 border-green-400 text-green-100'
                : 'bg-red-500/20 border-red-400 text-red-100'
            }`}>
              <span className={`w-2 h-2 rounded-full ${serverConnected ? 'bg-green-300 animate-pulse' : 'bg-red-300'}`} />
              {serverConnected ? 'Online' : 'Offline'}
            </span>
          </div>
        </div>
      </div>

      {/* CHANGED: Settings Panel */}
      {showSettings && (
        <div className="flex-shrink-0 bg-blue-50 border-b border-blue-200 px-6 py-4 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h4 className="text-sm font-semibold text-gray-800">Privacy & Storage</h4>
              <p className="text-xs text-gray-600 mt-1">📋 Chat history is cleared when you close this tab by default.</p>
            </div>
            <button
              onClick={() => setShowSettings(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>
          
          <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
            <input
              type="checkbox"
              id="remember-toggle"
              checked={rememberConversation}
              onChange={(e) => handleRememberToggle(e.target.checked)}
              className="w-4 h-4 rounded cursor-pointer"
            />
            <label htmlFor="remember-toggle" className="flex-1 cursor-pointer">
              <p className="text-sm font-medium text-gray-800">Remember conversation this session</p>
              <p className="text-xs text-gray-600">Keep chat history while this browser tab is open</p>
            </label>
          </div>
          
          <div className="flex gap-2 pt-2">
            <button
              onClick={handleStartNewChat}
              className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
            >
              ✨ New Chat
            </button>
            <button
              onClick={handleClearHistory}
              className="flex-1 px-3 py-2 bg-red-50 border border-red-200 rounded-lg text-sm font-medium text-red-700 hover:bg-red-100 transition-all"
            >
              🗑️ Clear History
            </button>
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50"
        aria-live="polite"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
          >
            <div
              className={`max-w-xs lg:max-w-sm px-4 py-3 rounded-2xl ${
                message.role === 'model'
                  ? 'bg-white text-gray-800 border border-gray-200 shadow-sm'
                  : 'bg-blue-500 text-white shadow-md'
              } ${message.status === 'error' ? 'border-red-300 bg-red-50' : ''}`}
            >
              {/* CHANGED: Use FormatAIResponse for AI messages, plain text for user */}
              {message.role === 'model' ? (
                <FormatAIResponse text={message.text} />
              ) : (
                <p className="text-sm leading-relaxed">{message.text}</p>
              )}
              <span className={`block text-xs mt-2 ${
                message.role === 'model' ? 'text-gray-500' : 'text-blue-100'
              }`}>
                {new Date(message.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start animate-fade-in">
            <div className="bg-white text-gray-800 border border-gray-200 rounded-2xl px-4 py-3 shadow-sm flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
              <span className="text-sm text-gray-600">AI is thinking...</span>
            </div>
          </div>
        )}
      </div>

      {/* Error Message with Retry */}
      {error && (
        <div className="flex-shrink-0 mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-xl">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-700">{error.message}</p>
              {error.retryable && (
                <button
                  onClick={handleRetry}
                  disabled={loading}
                  className="mt-2 text-xs text-red-600 hover:text-red-700 font-medium flex items-center gap-1 disabled:opacity-50"
                >
                  <RefreshCw className="w-3 h-3" />
                  Retry
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="flex-shrink-0 bg-white border-t border-gray-200 p-4">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            id="ai-chat-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={serverConnected ? 'Describe your symptoms...' : 'Server offline...'}
            className="flex-1 bg-gray-100 border border-gray-300 rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:bg-gray-200 transition-all"
            minLength={2}
            maxLength={1000}
            disabled={loading || !serverConnected}
            aria-label="Chat input"
          />
          <button
            type="submit"
            disabled={loading || !serverConnected || input.trim().length < 2}
            className="flex-shrink-0 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-full p-3 transition-all duration-200 shadow-md hover:shadow-lg disabled:shadow-none flex items-center justify-center"
            aria-label="Send message"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <ArrowRight className="w-5 h-5" />
            )}
          </button>
        </form>
      </div>

      {/* Disclaimer */}
      <div className="flex-shrink-0 bg-blue-50 border-t border-blue-100 px-6 py-4">
        <p className="text-xs text-gray-600 leading-relaxed">
          ⚕️ <span className="font-medium text-gray-700">Medical Disclaimer:</span> This AI assistant provides general health information only and is not a substitute for professional medical advice. Always consult a certified healthcare provider for diagnosis and treatment.
        </p>
      </div>
    </div>
  );
};

export default AIChatAssistant;

