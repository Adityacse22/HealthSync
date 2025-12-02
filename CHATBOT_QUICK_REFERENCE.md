# HealthSync AI Chatbot - Quick Reference Card

## 🚀 Quick Start (60 seconds)

### Terminal 1: Start Backend
```bash
cd "/Users/adityakarn/Desktop/7th sem Project/HealthSync-main/server"
node server.js
```

### Terminal 2: Start Frontend
```bash
cd "/Users/adityakarn/Desktop/7th sem Project/HealthSync-main"
npm run dev
```

### Browser
Visit: `http://localhost:8080`

---

## ✅ Verification Checklist

- [ ] Backend shows: `✓ HealthSync Backend Server Started Successfully`
- [ ] Frontend shows: `➜ Local: http://localhost:8080/`
- [ ] Browser loads without errors
- [ ] Server indicator shows "Online" (green dot)
- [ ] Type message in chatbot → AI responds

---

## 🐛 Common Issues & Quick Fixes

| Problem | Fix |
|---------|-----|
| "localhost refused to connect" | Start both servers: `node server.js` & `npm run dev` |
| Server shows "Offline" | Check backend: `curl http://localhost:3001/health` |
| "Cannot connect to server" | Verify `VITE_BACKEND_URL=http://localhost:3001` in `.env.local` |
| "Authentication failed" | Check API key: `cat server/.env \| grep OPENAI_API_KEY` |
| "Too many requests" | Wait 60s, click "Retry" (automatic backoff works) |
| Chat not appearing | Check browser console (F12) for errors, check `/health` endpoint |

---

## 📊 Architecture at a Glance

```
Browser (8080) → Backend (3001) → OpenAI API
     ↓               ↓                 ↓
  React UI      Express.js         GPT-4o-mini
  Components    Proxy Server       Model
  
Error Handling ✓ | Retry Logic ✓ | Health Check ✓
```

---

## 🔍 Debugging Commands

```bash
# Test backend health
curl http://localhost:3001/health

# Test chat endpoint
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Hello"}]}'

# Check open ports
lsof -i :3001,8080

# View API key
cat server/.env | grep OPENAI_API_KEY

# Clear chat history
# (In browser console:)
# localStorage.removeItem('healthsync_ai_chat_history_v2')
```

---

## 💡 Key Features Implemented

✅ **Error Classification** - 6 error types with smart retry decisions
✅ **Exponential Backoff** - Automatic retry with 1s, 2s, 4s delays
✅ **Server Health Monitoring** - Checks every 30 seconds
✅ **Input Validation** - Length checks, prevents duplicates
✅ **Comprehensive Logging** - [PHASE] tagged console output
✅ **Storage Persistence** - Chat history saved locally (20 messages)
✅ **Responsive UI** - Works on mobile and desktop
✅ **Security** - API key never exposed in browser
✅ **Accessibility** - ARIA labels and semantic HTML
✅ **User Feedback** - Status indicators, retry buttons, clear errors

---

## 📝 Log Format Reference

```
✓ [HEALTH CHECK] Backend server is connected
✗ [HEALTH CHECK] Failed: Connection timeout
⏳ [RETRY] Waiting 2000ms before retry...
[SUBMIT] User message: I have a headache
[API CALL] Attempt 1/3: Sending message
[API RESPONSE] Status: 200
✓ [API SUCCESS] Response received: Your symptoms suggest...
[STORAGE] Loaded 5 messages from cache
[SUBMIT] Already loading, ignoring duplicate submission
```

---

## 🔐 Security Notes

⚠️ **Never**:
- Share your OpenAI API key
- Commit `.env` files to Git
- Make direct API calls from browser
- Use wildcard CORS origins

✓ **Always**:
- Use backend proxy for API calls
- Store secrets in `.env` files
- Enable HTTPS in production
- Monitor API usage and costs

---

## 📚 Full Documentation

For detailed implementation, troubleshooting, and production setup:
→ See: `CHATBOT_IMPLEMENTATION.md`

---

## 🎯 Success Criteria

**Chatbot is working correctly when:**

1. ✅ Browser loads without connection errors
2. ✅ Server indicator shows green "Online" status
3. ✅ Type symptom → AI responds within 5 seconds
4. ✅ Console shows `✓ [API SUCCESS]` messages
5. ✅ Refresh page → Chat history persists
6. ✅ Restart backend → Auto-reconnects with retry
7. ✅ Rate limit → Automatic exponential backoff
8. ✅ Invalid input → Clear error message (no crash)

---

**Status**: ✅ Production Ready
**Last Tested**: December 2, 2025
**Version**: 2.0
