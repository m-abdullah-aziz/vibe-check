import { useState, useEffect, useRef, useCallback } from "react";

const MOODS = {
  happy: {
    emoji: "☀️",
    gradient: ["#FFD700", "#FF6B35", "#FF1493"],
    genre: "feel-good pop",
    quotes: [
      "Joy is not in things; it is in us. — Richard Wagner",
      "Happiness is a warm puppy. — Charles M. Schulz",
      "The sun himself is weak when he first rises. — Charles Dickens",
    ],
    keywords: ["happy", "joy", "excited", "great", "amazing", "wonderful", "fantastic", "awesome", "love", "blessed", "grateful", "elated", "thrilled", "euphoric", "cheerful", "delighted"],
    spotifyQuery: "happy+feel+good+vibes",
    bg: "#1a0a00",
  },
  chill: {
    emoji: "🌊",
    gradient: ["#00C9FF", "#92FE9D", "#00B4DB"],
    genre: "lo-fi chill beats",
    quotes: [
      "Almost everything will work again if you unplug it for a while. — Anne Lamott",
      "Calm mind brings inner strength. — Dalai Lama",
      "In the middle of difficulty lies opportunity. — Albert Einstein",
    ],
    keywords: ["chill", "relax", "calm", "peaceful", "serene", "mellow", "easy", "laid back", "content", "comfortable", "cozy", "zen", "tranquil", "soothing"],
    spotifyQuery: "lofi+chill+beats+relax",
    bg: "#000a0f",
  },
  sad: {
    emoji: "🌧️",
    gradient: ["#4B6CB7", "#182848", "#2C3E50"],
    genre: "melancholic indie",
    quotes: [
      "The wound is the place where the light enters you. — Rumi",
      "Even the darkest night will end and the sun will rise. — Victor Hugo",
      "Stars can't shine without darkness. — D.H. Sidebottom",
    ],
    keywords: ["sad", "down", "depressed", "blue", "lonely", "heartbroken", "miss", "cry", "tears", "gloomy", "melancholy", "grief", "sorrow", "hurt", "lost", "empty"],
    spotifyQuery: "sad+indie+melancholy+rainy",
    bg: "#050810",
  },
  angry: {
    emoji: "🔥",
    gradient: ["#FF0000", "#DC143C", "#8B0000"],
    genre: "aggressive rock & metal",
    quotes: [
      "Speak when you are angry and you'll make the best speech you'll ever regret. — Ambrose Bierce",
      "Fire that's closest kept burns most of all. — Shakespeare",
      "Anger is an acid that does more harm to the vessel. — Mark Twain",
    ],
    keywords: ["angry", "mad", "furious", "rage", "frustrated", "annoyed", "irritated", "pissed", "hate", "livid", "fuming", "outraged", "bitter", "hostile"],
    spotifyQuery: "angry+rock+metal+intense",
    bg: "#0f0000",
  },
  energetic: {
    emoji: "⚡",
    gradient: ["#F7971E", "#FFD200", "#FF6B6B"],
    genre: "high-energy EDM & dance",
    quotes: [
      "Energy and persistence conquer all things. — Benjamin Franklin",
      "The higher your energy level, the more efficient your body. — Tony Robbins",
      "Life is either a daring adventure or nothing at all. — Helen Keller",
    ],
    keywords: ["energetic", "hyped", "pumped", "motivated", "alive", "wired", "fire", "lets go", "unstoppable", "powerful", "driven", "charged", "electric"],
    spotifyQuery: "edm+dance+energy+workout",
    bg: "#0f0800",
  },
  dreamy: {
    emoji: "🌙",
    gradient: ["#A18CD1", "#FBC2EB", "#667eea"],
    genre: "dream pop & ambient",
    quotes: [
      "All that we see or seem is but a dream within a dream. — Edgar Allan Poe",
      "We are such stuff as dreams are made on. — Shakespeare",
      "Those who dream by day are cognizant of many things. — Edgar Allan Poe",
    ],
    keywords: ["dreamy", "sleepy", "tired", "floating", "hazy", "ethereal", "spacey", "drifting", "nostalgic", "wistful", "pensive", "wonder", "imagine", "fantasy"],
    spotifyQuery: "dream+pop+ambient+ethereal",
    bg: "#0a0515",
  },
  focused: {
    emoji: "🎯",
    gradient: ["#2C3E50", "#3498DB", "#1ABC9C"],
    genre: "deep focus & instrumental",
    quotes: [
      "Concentrate all your thoughts upon the work at hand. — Alexander Graham Bell",
      "Where focus goes, energy flows. — Tony Robbins",
      "The successful warrior is the average man, with laser-like focus. — Bruce Lee",
    ],
    keywords: ["focused", "productive", "working", "studying", "grind", "hustle", "determined", "locked in", "flow", "concentration", "discipline", "sharp"],
    spotifyQuery: "deep+focus+study+instrumental+concentration",
    bg: "#020a0f",
  },
  romantic: {
    emoji: "🌹",
    gradient: ["#ee9ca7", "#ffdde1", "#E8CBC0"],
    genre: "romantic R&B & soul",
    quotes: [
      "Whatever our souls are made of, his and mine are the same. — Emily Brontë",
      "I have waited for this opportunity for more than half a century. — Gabriel García Márquez",
      "Love is composed of a single soul inhabiting two bodies. — Aristotle",
    ],
    keywords: ["romantic", "love", "crush", "butterflies", "date", "heart", "passion", "desire", "smitten", "infatuated", "tender", "affection", "intimate"],
    spotifyQuery: "romantic+rnb+soul+love+songs",
    bg: "#0f0508",
  },
};

function detectMood(text) {
  const lower = text.toLowerCase();
  let bestMood = null;
  let bestScore = 0;
  for (const [mood, data] of Object.entries(MOODS)) {
    let score = 0;
    for (const kw of data.keywords) {
      if (lower.includes(kw)) score += kw.length;
    }
    if (score > bestScore) {
      bestScore = score;
      bestMood = mood;
    }
  }
  return bestMood || "chill";
}

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function MoodStreak({ streak }) {
  const today = new Date().getDay();
  return (
    <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 20, flexWrap: "wrap" }}>
      {Array.from({ length: 7 }).map((_, i) => {
        const dayIndex = (today - 6 + i + 7) % 7;
        const entry = streak[i];
        const moodData = entry ? MOODS[entry] : null;
        const isToday = i === 6;
        return (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: moodData
                  ? `linear-gradient(135deg, ${moodData.gradient[0]}, ${moodData.gradient[2]})`
                  : "rgba(255,255,255,0.06)",
                border: isToday ? "2px solid rgba(255,255,255,0.5)" : "2px solid transparent",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
                transition: "all 0.5s ease",
              }}
            >
              {moodData ? moodData.emoji : ""}
            </div>
            <span
              style={{
                fontSize: 10,
                fontFamily: "'JetBrains Mono', monospace",
                color: isToday ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.3)",
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              {WEEK_DAYS[dayIndex]}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function GlowOrb({ gradient, active }) {
  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: active ? "140vmax" : "0vmax",
        height: active ? "140vmax" : "0vmax",
        borderRadius: "50%",
        background: `radial-gradient(circle, ${gradient[0]}33 0%, ${gradient[1]}22 40%, ${gradient[2]}11 70%, transparent 100%)`,
        transition: "all 1.8s cubic-bezier(0.22, 1, 0.36, 1)",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}

function FloatingParticles({ gradient, active }) {
  if (!active) return null;
  return (
    <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1, overflow: "hidden" }}>
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: 4 + Math.random() * 6,
            height: 4 + Math.random() * 6,
            borderRadius: "50%",
            background: gradient[i % gradient.length],
            opacity: 0.15 + Math.random() * 0.2,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `floatParticle ${6 + Math.random() * 8}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}
    </div>
  );
}

function ResultCard({ mood, onReset }) {
  const data = MOODS[mood];
  const [quote] = useState(() => data.quotes[Math.floor(Math.random() * data.quotes.length)]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const spotifyUrl = `https://open.spotify.com/search/${encodeURIComponent(data.spotifyQuery)}`;
  const youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(data.genre + " playlist")}`;

  return (
    <div
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(30px)",
        transition: "all 0.9s cubic-bezier(0.22, 1, 0.36, 1)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 28,
        maxWidth: 480,
        width: "100%",
        padding: "0 20px",
      }}
    >
      <div style={{ fontSize: 64, lineHeight: 1, filter: "drop-shadow(0 0 30px rgba(255,255,255,0.2))" }}>
        {data.emoji}
      </div>

      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(28px, 5vw, 42px)",
            fontWeight: 700,
            background: `linear-gradient(135deg, ${data.gradient[0]}, ${data.gradient[2]})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: 8,
            textTransform: "capitalize",
          }}
        >
          {mood}
        </div>
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.35)",
          }}
        >
          {data.genre}
        </div>
      </div>

      <div
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "clamp(14px, 2.5vw, 17px)",
          lineHeight: 1.7,
          color: "rgba(255,255,255,0.55)",
          textAlign: "center",
          fontStyle: "italic",
          maxWidth: 380,
          padding: "16px 0",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        "{quote}"
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        <a
          href={spotifyUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "12px 24px",
            borderRadius: 50,
            background: `linear-gradient(135deg, ${data.gradient[0]}22, ${data.gradient[2]}22)`,
            border: `1px solid ${data.gradient[0]}44`,
            color: data.gradient[0],
            textDecoration: "none",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            letterSpacing: 1,
            textTransform: "uppercase",
            transition: "all 0.3s ease",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = `linear-gradient(135deg, ${data.gradient[0]}44, ${data.gradient[2]}44)`;
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = `linear-gradient(135deg, ${data.gradient[0]}22, ${data.gradient[2]}22)`;
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
          </svg>
          Spotify
        </a>
        <a
          href={youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "12px 24px",
            borderRadius: 50,
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.6)",
            textDecoration: "none",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            letterSpacing: 1,
            textTransform: "uppercase",
            transition: "all 0.3s ease",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.08)";
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.04)";
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
          YouTube
        </a>
      </div>

      <button
        onClick={onReset}
        style={{
          marginTop: 8,
          padding: "10px 20px",
          borderRadius: 50,
          background: "transparent",
          border: "1px solid rgba(255,255,255,0.1)",
          color: "rgba(255,255,255,0.3)",
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11,
          letterSpacing: 2,
          textTransform: "uppercase",
          cursor: "pointer",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
          e.currentTarget.style.color = "rgba(255,255,255,0.6)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
          e.currentTarget.style.color = "rgba(255,255,255,0.3)";
        }}
      >
        Check again
      </button>
    </div>
  );
}

function EmojiPicker({ onPick }) {
  const emojis = Object.entries(MOODS).map(([key, val]) => ({
    mood: key,
    emoji: val.emoji,
    label: key,
  }));

  return (
    <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center" }}>
      {emojis.map(({ mood, emoji, label }) => (
        <button
          key={mood}
          onClick={() => onPick(mood)}
          title={label}
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.03)",
            fontSize: 22,
            cursor: "pointer",
            transition: "all 0.3s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.1)";
            e.currentTarget.style.transform = "scale(1.2)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "rgba(255,255,255,0.03)";
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
          }}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}

export default function VibeCheck() {
  const [inputText, setInputText] = useState("");
  const [currentMood, setCurrentMood] = useState(null);
  const [streak, setStreak] = useState(() => Array(7).fill(null));
  const [phase, setPhase] = useState("input"); // input | analyzing | result
  const inputRef = useRef(null);

  const activeGradient = currentMood
    ? MOODS[currentMood].gradient
    : ["#333", "#222", "#111"];

  const handleSubmit = useCallback(
    (moodOverride) => {
      const mood = moodOverride || detectMood(inputText);
      setCurrentMood(mood);
      setPhase("analyzing");

      setStreak((prev) => {
        const next = [...prev];
        next[6] = mood;
        return next;
      });

      setTimeout(() => setPhase("result"), 1400);
    },
    [inputText]
  );

  const handleReset = () => {
    setPhase("input");
    setCurrentMood(null);
    setInputText("");
    setTimeout(() => inputRef.current?.focus(), 300);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputText.trim()) {
      handleSubmit();
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: currentMood ? MOODS[currentMood].bg : "#060608",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        transition: "background 1.5s ease",
        padding: 20,
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=JetBrains+Mono:wght@300;400;500&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }

        @keyframes floatParticle {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.15; }
          25% { transform: translate(30px, -40px) scale(1.3); opacity: 0.3; }
          50% { transform: translate(-20px, -80px) scale(0.8); opacity: 0.1; }
          75% { transform: translate(40px, -30px) scale(1.1); opacity: 0.25; }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.15); opacity: 1; }
        }

        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes analyzeDot {
          0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1.2); }
        }

        ::selection {
          background: rgba(255,255,255,0.15);
        }

        input::placeholder {
          color: rgba(255,255,255,0.2);
        }
      `}</style>

      <GlowOrb gradient={activeGradient} active={!!currentMood} />
      <FloatingParticles gradient={activeGradient} active={phase === "result"} />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 32,
          width: "100%",
          maxWidth: 520,
        }}
      >
        {/* Header */}
        <div
          style={{
            textAlign: "center",
            animation: "slideUp 0.8s ease-out",
          }}
        >
          <h1
            style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(36px, 7vw, 56px)",
              fontWeight: 700,
              color: "rgba(255,255,255,0.9)",
              letterSpacing: -1,
              marginBottom: 8,
              lineHeight: 1.1,
            }}
          >
            Vibe Check
          </h1>
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.25)",
            }}
          >
            mood → music
          </p>
        </div>

        {/* Input Phase */}
        {phase === "input" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 24,
              width: "100%",
              animation: "slideUp 0.6s ease-out 0.2s both",
            }}
          >
            <div
              style={{
                width: "100%",
                position: "relative",
              }}
            >
              <input
                ref={inputRef}
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="how are you feeling right now?"
                autoFocus
                style={{
                  width: "100%",
                  padding: "18px 24px",
                  borderRadius: 16,
                  border: "1px solid rgba(255,255,255,0.08)",
                  background: "rgba(255,255,255,0.03)",
                  color: "rgba(255,255,255,0.85)",
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: 17,
                  outline: "none",
                  transition: "all 0.3s ease",
                  backdropFilter: "blur(20px)",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "rgba(255,255,255,0.2)";
                  e.target.style.background = "rgba(255,255,255,0.05)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "rgba(255,255,255,0.08)";
                  e.target.style.background = "rgba(255,255,255,0.03)";
                }}
              />
              {inputText.trim() && (
                <button
                  onClick={() => handleSubmit()}
                  style={{
                    position: "absolute",
                    right: 8,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    border: "none",
                    background: "rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.7)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s ease",
                    fontSize: 16,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                  }}
                >
                  →
                </button>
              )}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 16, width: "100%" }}>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10,
                  letterSpacing: 3,
                  color: "rgba(255,255,255,0.2)",
                  textTransform: "uppercase",
                }}
              >
                or pick a vibe
              </span>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
            </div>

            <EmojiPicker onPick={(mood) => handleSubmit(mood)} />
          </div>
        )}

        {/* Analyzing Phase */}
        {phase === "analyzing" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 20,
              animation: "slideUp 0.5s ease-out",
            }}
          >
            <div style={{ display: "flex", gap: 8 }}>
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: "50%",
                    background: activeGradient[i] || activeGradient[0],
                    animation: `analyzeDot 1.2s ease-in-out infinite`,
                    animationDelay: `${i * 0.2}s`,
                  }}
                />
              ))}
            </div>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12,
                letterSpacing: 3,
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.3)",
              }}
            >
              reading your vibe
            </span>
          </div>
        )}

        {/* Result Phase */}
        {phase === "result" && currentMood && (
          <ResultCard mood={currentMood} onReset={handleReset} />
        )}

        {/* Streak */}
        <div
          style={{
            marginTop: 20,
            opacity: 0.7,
            animation: "slideUp 0.8s ease-out 0.4s both",
          }}
        >
          <MoodStreak streak={streak} />
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 9,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.15)",
              textAlign: "center",
              marginTop: 10,
            }}
          >
            your week in vibes
          </p>
        </div>

        {/* Footer */}
        <div
          style={{
            marginTop: 32,
            animation: "slideUp 0.8s ease-out 0.6s both",
            textAlign: "center",
          }}
        >
          <a
            href="https://m-abdullah-aziz.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "rgba(255,255,255,0.18)",
              textDecoration: "none",
              transition: "color 0.3s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.18)")}
          >
            built by m. abdullah aziz
          </a>
        </div>
      </div>
    </div>
  );
}
