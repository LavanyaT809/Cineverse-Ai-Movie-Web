import React, { useState } from 'react';
import './css/MovieChatBot.css';

//  TMDB actor search endpoint and API key
const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const TMDB_SEARCH_ACTOR_URL = 'https://api.themoviedb.org/3/search/person';

function MovieChatBot({ onExtractedQuery }) {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false); // 📍 Controls chatbot popup

  //  Convert actor name → TMDB actor ID
  const getActorIdFromName = async (name) => {
    try {
      const url = `${TMDB_SEARCH_ACTOR_URL}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(name)}`;
      const res = await fetch(url);
      const data = await res.json();
      return data.results?.[0]?.id || null;
    } catch (err) {
      console.error("Failed to get actor ID:", err);
      return null;
    }
  };

  //  Handles sending message + extracting info
  //  Triggered when user clicks "Send" or presses Enter
  const handleSend = async () => {
    if (!prompt.trim()) return;
    setMessages((prev) => [...prev, { sender: 'user', text: prompt }]);
    setPrompt('');
    setLoading(true);

    try {
      const response = await fetch(
        'https://api-inference.huggingface.co/models/dbmdz/bert-large-cased-finetuned-conll03-english',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_HUGGINGFACE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ inputs: prompt }),
        }
      );
      const data = await response.json();
      if (data.error) throw new Error(data.error);

      const nerEntities = data || [];

      //  Information extracted from input
      let extracted = {
        actorName: '',
        actorId: null,
        year: '',
        genre: '',
        rating: '',
        organization: '',
        location: '',
      };

      //Temporary array for multi-word names like "Salman Khan"
      let nameTokens = [];

      //  Parse NER output
      nerEntities.forEach((item) => {
        let word = item.word;
        const type = item.entity_group;

        // Join subwords like "##man"   
         //  Actor name detection
        if (word.startsWith('##')) {
          word = word.replace('##', '');
          if (nameTokens.length > 0) {
            nameTokens[nameTokens.length - 1] += word;
          }
        } else {
          if (type === 'PER') nameTokens.push(word);
        }

        // Detect year
        if (type === 'DATE') {
          const match = word.match(/\d{4}/);
          if (match) extracted.year = match[0];
        }

        if (type === 'ORG') extracted.organization += word + ' ';
        if (type === 'LOC') extracted.location += word + ' ';
      });

      //  Join tokens to form actor name string
      if (nameTokens.length > 0) {
        extracted.actorName = nameTokens.join(' ').trim();
      }

      //  Detect Genre
      const genres = ['comedy', 'action', 'romance', 'thriller', 'drama', 'horror', 'sci-fi'];
      const promptLower = prompt.toLowerCase();
      genres.forEach((g) => {
        if (promptLower.includes(g)) {
          extracted.genre = g.charAt(0).toUpperCase() + g.slice(1);
        }
      });

      //  Detect Rating
      const ratingMatch = prompt.match(/(?:rating|above)\s*(\d(?:\.\d+)?)/i);
      if (ratingMatch) extracted.rating = ratingMatch[1];

      //  Fallback Year
      if (!extracted.year) {
        const fallbackMatch = prompt.match(/\b(19|20)\d{2}\b/);
        if (fallbackMatch) extracted.year = fallbackMatch[0];
      }

      //  Cleanup whitespace
      Object.keys(extracted).forEach((key) => {
        if (typeof extracted[key] === 'string') extracted[key] = extracted[key].trim();
      });

       //  Get actor ID if name was found
      if (extracted.actorName) {
        const id = await getActorIdFromName(extracted.actorName);
        if (id) extracted.actorId = id;
      }

      //  Summary to display
      const summary = Object.entries(extracted)
        .filter(([key, val]) => val && key !== 'actorId')
        .map(([key, val]) => `${key}: ${val}`)
        .join(', ');

      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: summary ? `🎯 Detected → ${summary}` : "❌ Couldn't extract information.",
        },
      ]);

       //  Send extracted structured info to parent
      if (onExtractedQuery) {
        onExtractedQuery({
          actor: extracted.actorId,
          genre: extracted.genre,
          year: extracted.year,
          rating: extracted.rating,
        });
      }
    } catch (err) {
      setMessages((prev) => [...prev, { sender: 'bot', text: `❌ Error: ${err.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  //  On "Enter" key
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  //  Clear all chat messages
  const handleClear = () => {
    setMessages([]);
  };

  return (
    <div className="chatbot-wrapper">
      {/*  Toggle button (FAB) */}
      <div className="chatbot-toggle-container">
        <button className="chatbot-toggle" onClick={() => setOpen(!open)}>Ask Me</button>
        <div className="chatbot-tooltip">Click to talk to SINEVERSE AI</div>
      </div>

      {open && (
        <div className="chatbot-popup">
          <div className="chatbot-header">🤖 SINEVERSE AI</div>

          {/*  Chat History */}
          <div className="chatbot-messages">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`chatbot-message ${msg.sender === 'user' ? 'user-msg' : 'bot-msg'}`}
              >
                {msg.text}
              </div>
            ))}
            {loading && <div className="bot-msg">⏳ Thinking...</div>}
          </div>

          {/* ✍️ Input + Buttons */}
          <div className="chatbot-input">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask: horror movies from 2023 with Shahrukh Khan"
            />
            <div className="chatbot-buttons">
              <button onClick={handleSend}>Send</button>
              <button onClick={handleClear} className="clear-btn">Clear</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MovieChatBot;



























     



