import React, { useState, useRef, useEffect } from 'react';
import './AIChat.css';

const AIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '👋 Hi! I can help you find businesses. Try asking:\n• "Find gyms in Thane"\n• "Show restaurants in Andheri"\n• "List salons near Bandra"'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch('https://businessdiary-api.tejasborade9594.workers.dev/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage })
      });

      const data = await response.json();

      if (data.businesses && data.businesses.length > 0) {
        // Format business listings
        const businessList = data.businesses.map((b, idx) => 
          `${idx + 1}. **${b.business_name}**\n   📍 ${b.address}\n   📱 ${b.contact_phone || 'N/A'}\n   ⭐ ${b.rating || 'N/A'}`
        ).join('\n\n');

        const responseText = `${data.message}\n\n${businessList}`;
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: responseText,
          businesses: data.businesses 
        }]);
      } else {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: data.message || 'Sorry, I couldn\'t find any matching businesses.' 
        }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: '❌ Sorry, something went wrong. Please try again.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const exampleQueries = [
    "Find gyms in Thane",
    "Show restaurants in Andheri",
    "List salons near Bandra"
  ];

  const handleExampleClick = (query) => {
    setInput(query);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button 
        className="ai-chat-button"
        onClick={() => setIsOpen(!isOpen)}
        title="AI Assistant"
      >
        {isOpen ? '✕' : '🤖'}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="ai-chat-window">
          <div className="ai-chat-header">
            <div className="ai-chat-title">
              <span className="ai-icon">🤖</span>
              <div>
                <h3>AI Assistant</h3>
                <p>Ask me to find businesses</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="ai-chat-close">✕</button>
          </div>

          <div className="ai-chat-messages">
            {messages.map((msg, idx) => (
              <div key={idx} className={`ai-message ${msg.role}`}>
                <div className="ai-message-content">
                  {msg.content.split('\n').map((line, i) => (
                    <React.Fragment key={i}>
                      {line.startsWith('**') && line.endsWith('**') ? (
                        <strong>{line.slice(2, -2)}</strong>
                      ) : (
                        line
                      )}
                      <br />
                    </React.Fragment>
                  ))}
                </div>
                {msg.businesses && msg.businesses.length > 0 && (
                  <div className="ai-business-cards">
                    {msg.businesses.map((business) => (
                      <a 
                        key={business.id} 
                        href={`/businesses/${business.id}`}
                        className="ai-business-card"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div className="ai-business-name">{business.business_name}</div>
                        <div className="ai-business-info">📍 {business.address}</div>
                        <div className="ai-business-info">📱 {business.contact_phone || 'N/A'}</div>
                        {business.rating && (
                          <div className="ai-business-info">⭐ {business.rating}</div>
                        )}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="ai-message assistant">
                <div className="ai-typing">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {messages.length === 1 && (
            <div className="ai-examples">
              <p>Try these:</p>
              {exampleQueries.map((query, idx) => (
                <button 
                  key={idx}
                  onClick={() => handleExampleClick(query)}
                  className="ai-example-btn"
                >
                  {query}
                </button>
              ))}
            </div>
          )}

          <form className="ai-chat-input" onSubmit={handleSubmit}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me to find businesses..."
              disabled={loading}
            />
            <button type="submit" disabled={loading || !input.trim()}>
              {loading ? '⏳' : '➤'}
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default AIChat;
