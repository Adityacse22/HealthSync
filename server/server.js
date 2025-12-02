import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:8081';

// Middleware
app.use(cors({
  origin: FRONTEND_URL,
  methods: ['POST', 'GET'],
  credentials: true
}));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  console.log('[GET /health]');
  res.json({ status: 'OK', message: 'HealthSync API is running' });
});

// Simple Q&A Knowledge Base
const healthQA = {
  headache: "For a headache, try: 1) Rest in a quiet, dark room 2) Stay hydrated by drinking water 3) Take over-the-counter pain relief (ibuprofen/acetaminophen) if needed 4) Apply a warm or cold compress to your head. Seek medical attention if it's severe or persistent.",
  fever: "For a fever, do: 1) Rest and get plenty of sleep 2) Drink plenty of fluids (water, tea, broth) 3) Use cool, damp cloths on your body 4) Take fever-reducing medication (acetaminophen/ibuprofen) as directed. Consult a doctor if fever exceeds 103°F or lasts more than 3 days.",
  cold: "For a cold: 1) Stay hydrated and rest 2) Use saline nasal drops or spray 3) Gargle with salt water for a sore throat 4) Consume vitamin C-rich foods (oranges, berries) 5) Use humidifier to ease congestion. Most colds resolve in 7-10 days.",
  cough: "For a cough: 1) Stay hydrated - drink water and warm tea with honey 2) Use cough drops or lozenges 3) Avoid irritants like smoke and dry air 4) Get adequate rest 5) Use a humidifier. See a doctor if cough persists beyond 3 weeks.",
  "sore throat": "For a sore throat: 1) Gargle with warm salt water 2) Drink warm liquids (tea, broth, warm lemon water with honey) 3) Use throat lozenges 4) Rest your voice 5) Take pain reliever as needed. Seek care if symptoms worsen or include difficulty swallowing.",
  flu: "For flu symptoms: 1) Stay home and rest 2) Drink fluids to prevent dehydration 3) Take flu medication if prescribed within 48 hours of symptoms 4) Use fever reducers for aches/fever 5) Avoid contact with others. Seek immediate care if experiencing severe symptoms.",
  fatigue: "For fatigue: 1) Ensure 7-9 hours of sleep nightly 2) Stay physically active with light exercise 3) Eat balanced meals with protein, fruits, and vegetables 4) Stay hydrated 5) Manage stress. If persistent, consult a doctor as it may indicate an underlying condition.",
  anxiety: "For anxiety: 1) Practice deep breathing exercises 2) Try meditation or mindfulness apps 3) Limit caffeine intake 4) Exercise regularly - even a 20-minute walk helps 5) Get adequate sleep. Consider speaking with a mental health professional if anxiety interferes with daily life.",
  default: "I'm here to help! Please describe your symptoms in more detail. Common topics I can help with include: headache, fever, cold, cough, sore throat, flu, fatigue, and anxiety. Always consult a healthcare professional for serious or persistent symptoms."
};

// Find relevant answer from knowledge base
function getHealthAdvice(userMessage) {
  const message = userMessage.toLowerCase();
  
  // Check for keywords in knowledge base
  for (const [keyword, answer] of Object.entries(healthQA)) {
    if (keyword !== 'default' && message.includes(keyword)) {
      return answer;
    }
  }
  
  // Return default if no match
  return healthQA.default;
}

// OpenAI Chat Proxy Endpoint (now with Q&A fallback)
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, model = 'gpt-4o-mini', temperature = 0.7, max_tokens = 500 } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ 
        error: { message: 'Invalid request: messages array is required.' }
      });
    }

    const userMessage = messages[messages.length - 1]?.content || '';
    console.log(`[POST /api/chat] User: ${userMessage}`);

    // Use simple Q&A system instead of OpenAI
    const answer = getHealthAdvice(userMessage);
    
    res.json({
      choices: [{
        message: {
          content: answer
        }
      }]
    });

  } catch (error) {
    console.error('[Chat Error]', error instanceof Error ? error.message : error);
    res.status(500).json({ 
      error: { message: 'An error occurred while processing your request.' }
    });
  }
});

// Start server
const server = app.listen(PORT, '127.0.0.1', () => {
  console.log('');
  console.log('╔═══════════════════════════════════════════════════════╗');
  console.log('║   ✓ HealthSync Backend Server Started Successfully    ║');
  console.log('╠═══════════════════════════════════════════════════════╣');
  console.log(`║ Server URL:  http://localhost:${PORT.toString().padEnd(37)} ║`);
  console.log(`║ Chat API:    http://localhost:${PORT}/api/chat${' '.repeat(28)} ║`);
  console.log(`║ Health:      http://localhost:${PORT}/health${' '.repeat(33)} ║`);
  console.log(`║ CORS Origin: ${FRONTEND_URL.padEnd(44)} ║`);
  console.log(`║ API Key:     ${(OPENAI_API_KEY ? '✓ Configured' : '✗ MISSING').padEnd(44)} ║`);
  console.log('╚═══════════════════════════════════════════════════════╝');
  console.log('');
});

server.on('error', (err) => {
  console.error('❌ Server Error:', err.message);
  process.exit(1);
});
