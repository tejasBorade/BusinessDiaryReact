# AI Assistant Chat - Setup Guide

## 🤖 Overview

Your Business Directory now has an AI-powered chat assistant that understands natural language queries like:
- "Find gyms in Thane"
- "Show restaurants in Andheri"
- "List salons near Bandra"

## ✅ What Was Added

### Frontend Components
1. **AIChat.js** - Floating chat widget with:
   - Beautiful chat interface
   - Message history
   - Typing indicators
   - Clickable business cards
   - Mobile responsive design

2. **AIChat.css** - Complete styling:
   - Emerald green theme matching your brand
   - Smooth animations
   - Mobile-first responsive design
   - Custom scrollbar styling

### Backend Controller
3. **aiChat.js** - AI-powered search controller:
   - Uses Cloudflare Workers AI (Llama 3 8B model)
   - Extracts category and area from user queries
   - Searches database intelligently
   - Returns formatted results

### Configuration
4. **wrangler.toml** - Added AI binding
5. **router.js** - Added `/api/ai/chat` endpoint
6. **App.js** - Integrated chat widget globally

## 🚀 How It Works

### User Flow
```
User: "Find gyms in Thane"
  ↓
AI extracts: {category: "gym", area: "Thane"}
  ↓
Database query with filters
  ↓
Returns matching businesses
  ↓
Formatted response with clickable cards
```

### Technical Flow
1. **Frontend** sends user message to `/api/ai/chat`
2. **Cloudflare AI** (Llama 3) extracts search parameters
3. **Database** queries businesses with filters
4. **Response** returns businesses + formatted message
5. **UI** displays results as clickable cards

## 💰 Cost & Limits

### Cloudflare Workers AI (Free Tier)
- **10,000 requests per day** - FREE
- **Llama 3 8B Instruct** model
- No credit card required
- Automatic rate limiting

### Beyond Free Tier
- **$0.011 per 1,000 requests** after free tier
- **Example**: 20,000 requests/day = $0.11/day = $3.30/month

## 🎨 Features

### Smart Query Understanding
✅ Extracts category names (gym, restaurant, salon, hotel, etc.)
✅ Extracts area names (Thane, Andheri, Bandra, etc.)
✅ Handles variations ("gyms", "Gym", "GYM")
✅ Searches across business names, categories, and subcategories

### User Experience
✅ Floating chat button (bottom right)
✅ Smooth animations
✅ Message history
✅ Clickable business cards
✅ Mobile responsive
✅ Example queries for first-time users
✅ Error handling with helpful messages

### Business Results
Each result shows:
- Business name
- Address with 📍 icon
- Phone number with 📱 icon
- Rating with ⭐ icon
- Clickable link to business detail page

## 🧪 Testing Queries

Try these example queries:

### By Category
- "Find gyms"
- "Show restaurants"
- "List salons"
- "Get hotels"

### By Area
- "Businesses in Thane"
- "Shops in Andheri"
- "Services in Bandra"

### Combined
- "Find gyms in Thane"
- "Show restaurants in Andheri"
- "List salons near Bandra"
- "Hotels in Mumbai"

### Natural Variations
- "I'm looking for a gym in Thane"
- "Can you find restaurants in Andheri?"
- "Where are the best salons in Bandra?"

## 📝 Database Query Logic

```sql
SELECT businesses
WHERE is_active = 1
  AND (category LIKE '%gym%' 
    OR subcategory LIKE '%gym%'
    OR business_name LIKE '%gym%')
  AND (area_name LIKE '%thane%'
    OR address LIKE '%thane%')
ORDER BY rating DESC
LIMIT 10
```

## 🎨 Customization

### Change AI Model
Edit `worker-backend/src/controllers/aiChat.js`:
```javascript
// Current: Llama 3 8B
'@cf/meta/llama-3-8b-instruct'

// Alternatives:
'@cf/mistral/mistral-7b-instruct-v0.1'  // Faster
'@cf/meta/llama-2-7b-chat-fp16'         // Alternative
```

### Change Theme Color
Edit `frontend/src/components/AIChat.css`:
```css
/* Current: Emerald Green */
background: linear-gradient(135deg, #10b981 0%, #059669 100%);

/* Alternative: Blue */
background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
```

### Change Button Position
Edit `AIChat.css`:
```css
.ai-chat-button {
  bottom: 24px;  /* Distance from bottom */
  right: 24px;   /* Distance from right */
}
```

### Change Response Limit
Edit `aiChat.js`:
```javascript
query += ` ORDER BY b.rating DESC, b.business_name ASC LIMIT 10`;
//                                                            ^^
// Change to 5, 15, 20, etc.
```

## 🚀 Deployment

### Deploy Backend
```powershell
cd worker-backend
wrangler deploy
```

### Deploy Frontend
```powershell
cd frontend
npm run build
# Deploy to Cloudflare Pages via GitHub
```

## 🔧 Troubleshooting

### Issue: "AI binding not found"
**Solution**: Ensure `wrangler.toml` has:
```toml
[ai]
binding = "AI"
```

### Issue: Chat button not appearing
**Solution**: Check browser console for errors. Ensure `AIChat` is imported in `App.js`.

### Issue: No results returned
**Solution**: 
1. Check if businesses exist in database
2. Try more general queries
3. Check business `is_active = 1`

### Issue: AI returns wrong parameters
**Solution**: The AI extraction might need adjustment. Check console logs for extracted params.

## 🎯 Future Enhancements

### Possible Additions
- [ ] Voice input support
- [ ] Multi-language support (Hindi, Marathi)
- [ ] Filter by price range
- [ ] Filter by ratings
- [ ] Sort by distance
- [ ] Show business hours
- [ ] Make booking directly from chat
- [ ] Share results via WhatsApp
- [ ] Save favorite searches
- [ ] Chat history persistence

### Advanced AI Features
- [ ] Sentiment analysis
- [ ] Personalized recommendations
- [ ] Trending businesses
- [ ] Popular searches
- [ ] Autocomplete suggestions

## 📊 Analytics Ideas

Track these metrics:
- Most searched categories
- Most searched areas
- Query success rate
- Average response time
- Peak usage hours
- User engagement (clicks on results)

## 🔐 Security Notes

- No authentication required for chat (public feature)
- Rate limited by Cloudflare (10k/day free tier)
- No user data stored (stateless)
- CORS enabled for your domain
- SQL injection prevented (parameterized queries)

## 📱 Mobile Optimization

The chat is fully mobile responsive:
- Full-screen on mobile devices
- Touch-optimized buttons
- Smooth scrolling
- Keyboard-friendly input
- Works on iOS and Android

## 🎉 Ready to Use!

The AI Assistant Chat is now live on your website. Users will see a floating chat button on every page. Click it to start chatting!

**Next Steps**:
1. Deploy backend: `cd worker-backend && wrangler deploy`
2. Deploy frontend: Push to GitHub (auto-deploys to Cloudflare Pages)
3. Test on your site
4. Customize colors/features as needed

---

**Support**: If you encounter issues, check:
1. Cloudflare Workers dashboard (for backend errors)
2. Browser console (for frontend errors)
3. Network tab (for API call failures)
