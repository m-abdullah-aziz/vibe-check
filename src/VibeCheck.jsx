import { useState, useEffect, useRef, useCallback } from "react";

const MOODS = {
  happy: {
    emoji: "😊",
    gradient: ["#FFD700", "#FF6B35", "#FF1493"],
    genre: "comedy & feel-good stories",
    quotes: [
      "Joy is not in things; it is in us. — Richard Wagner",
      "Happiness is a warm puppy. — Charles M. Schulz",
      "The sun himself is weak when he first rises. — Charles Dickens",
    ],
    keywords: ["happy", "joy", "excited", "great", "amazing", "wonderful", "fantastic", "awesome", "love", "blessed", "grateful", "elated", "thrilled", "euphoric", "cheerful", "delighted"],
    podcastQuery: "comedy+feel+good+happiness",
    girlieQuery: "comedy+happiness+fun+girls+bffs+besties",
    bg: "#1a0a00",
  },
  chill: {
    emoji: "🌊",
    gradient: ["#00C9FF", "#92FE9D", "#00B4DB"],
    genre: "mindfulness & meditation",
    quotes: [
      "Almost everything will work again if you unplug it for a while. — Anne Lamott",
      "Calm mind brings inner strength. — Dalai Lama",
      "In the middle of difficulty lies opportunity. — Albert Einstein",
    ],
    keywords: ["chill", "relax", "calm", "peaceful", "serene", "mellow", "easy", "laid back", "content", "comfortable", "cozy", "zen", "tranquil", "soothing"],
    podcastQuery: "mindfulness+meditation+calm+relaxation",
    girlieQuery: "self+care+wellness+cozy+girls+soft+life",
    bg: "#000a0f",
  },
  sad: {
    emoji: "🌧️",
    gradient: ["#4B6CB7", "#182848", "#2C3E50"],
    genre: "mental health & comfort",
    quotes: [
      "The wound is the place where the light enters you. — Rumi",
      "Even the darkest night will end and the sun will rise. — Victor Hugo",
      "Stars can't shine without darkness. — D.H. Sidebottom",
    ],
    keywords: ["sad", "down", "depressed", "blue", "lonely", "heartbroken", "miss", "cry", "tears", "gloomy", "melancholy", "grief", "sorrow", "hurt", "lost", "empty"],
    podcastQuery: "mental+health+healing+comfort+grief",
    girlieQuery: "healing+heartbreak+comfort+women+sisterhood+therapy",
    bg: "#050810",
  },
  angry: {
    emoji: "🔥",
    gradient: ["#FF0000", "#DC143C", "#8B0000"],
    genre: "motivation & empowerment",
    quotes: [
      "Speak when you are angry and you'll make the best speech you'll ever regret. — Ambrose Bierce",
      "Fire that's closest kept burns most of all. — Shakespeare",
      "Anger is an acid that does more harm to the vessel. — Mark Twain",
    ],
    keywords: ["angry", "mad", "furious", "rage", "frustrated", "annoyed", "irritated", "pissed", "hate", "livid", "fuming", "outraged", "bitter", "hostile"],
    podcastQuery: "motivation+empowerment+mindset+anger+management",
    girlieQuery: "female+empowerment+women+motivation+slay+boss",
    bg: "#0f0000",
  },
  energetic: {
    emoji: "⚡",
    gradient: ["#F7971E", "#FFD200", "#FF6B6B"],
    genre: "sports & fitness",
    quotes: [
      "Energy and persistence conquer all things. — Benjamin Franklin",
      "The higher your energy level, the more efficient your body. — Tony Robbins",
      "Life is either a daring adventure or nothing at all. — Helen Keller",
    ],
    keywords: ["energetic", "hyped", "pumped", "motivated", "alive", "wired", "fire", "lets go", "unstoppable", "powerful", "driven", "charged", "electric"],
    podcastQuery: "fitness+sports+high+energy+workout+motivation",
    girlieQuery: "girls+fitness+workout+energy+slay+glow+up+hot+girl+walk",
    bg: "#0f0800",
  },
  dreamy: {
    emoji: "🌙",
    gradient: ["#A18CD1", "#FBC2EB", "#667eea"],
    genre: "storytelling & fiction",
    quotes: [
      "All that we see or seem is but a dream within a dream. — Edgar Allan Poe",
      "We are such stuff as dreams are made on. — Shakespeare",
      "Those who dream by day are cognizant of many things. — Edgar Allan Poe",
    ],
    keywords: ["dreamy", "sleepy", "tired", "floating", "hazy", "ethereal", "spacey", "drifting", "nostalgic", "wistful", "pensive", "wonder", "imagine", "fantasy"],
    podcastQuery: "storytelling+fiction+fantasy+narrative+dreams",
    girlieQuery: "aesthetic+cozy+romance+women+storytelling+cottagecore",
    bg: "#0a0515",
  },
  focused: {
    emoji: "🎯",
    gradient: ["#2C3E50", "#3498DB", "#1ABC9C"],
    genre: "educational & productivity",
    quotes: [
      "Concentrate all your thoughts upon the work at hand. — Alexander Graham Bell",
      "Where focus goes, energy flows. — Tony Robbins",
      "The successful warrior is the average man, with laser-like focus. — Bruce Lee",
    ],
    keywords: ["focused", "productive", "working", "studying", "grind", "hustle", "determined", "locked in", "flow", "concentration", "discipline", "sharp"],
    podcastQuery: "productivity+education+learning+deep+work",
    girlieQuery: "girlboss+productivity+success+women+career+that+girl",
    bg: "#020a0f",
  },
  romantic: {
    emoji: "💗",
    gradient: ["#ee9ca7", "#ffdde1", "#E8CBC0"],
    genre: "love & relationships",
    quotes: [
      "Whatever our souls are made of, his and mine are the same. — Emily Brontë",
      "I have waited for this opportunity for more than half a century. — Gabriel García Márquez",
      "Love is composed of a single soul inhabiting two bodies. — Aristotle",
    ],
    keywords: ["romantic", "love", "crush", "butterflies", "date", "heart", "passion", "desire", "smitten", "infatuated", "tender", "affection", "intimate"],
    podcastQuery: "love+relationships+romance+dating",
    girlieQuery: "dating+love+romance+relationships+women+red+flags",
    bg: "#0f0508",
  },
};

const lightBgMap = {
  happy: "#fff8e7",
  chill: "#e8f7ff",
  sad: "#edf0f7",
  angry: "#fff0f0",
  energetic: "#fff9e8",
  dreamy: "#f5f0ff",
  focused: "#e8f4f7",
  romantic: "#fff0f3",
};

const girlieBgMap = {
  happy: "#fff0e8",
  chill: "#f8eeff",
  sad: "#eeeaff",
  angry: "#ffe8ee",
  energetic: "#fff0e0",
  dreamy: "#f8e8ff",
  focused: "#e8f8f0",
  romantic: "#ffe0ee",
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


function MoodStreak({ streak, theme, getMood }) {
  const today = new Date().getDay();
  return (
    <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 20, flexWrap: "wrap" }}>
      {Array.from({ length: 7 }).map((_, i) => {
        const dayIndex = (today - 6 + i + 7) % 7;
        const entry = streak[i];
        const moodData = entry ? getMood(entry) : null;
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
                  : theme.surface06,
                border: isToday ? `2px solid ${theme.border50}` : "2px solid transparent",
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
                color: isToday ? theme.text80 : theme.text30,
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

function ResultCard({ mood, onReset, theme, getMood }) {
  const data = getMood(mood);
  const [quote] = useState(() => data.quotes[Math.floor(Math.random() * data.quotes.length)]);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const query = theme.isGirlie && data.girlieQuery ? data.girlieQuery : data.podcastQuery;
  const youtubeUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(query + " podcast")}`;
  const applePodcastsUrl = `https://podcasts.apple.com/search?term=${encodeURIComponent(query)}`;

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
            color: theme.text35,
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
          color: theme.text55,
          textAlign: "center",
          fontStyle: "italic",
          maxWidth: 380,
          padding: "16px 0",
          borderTop: `1px solid ${theme.border06}`,
          borderBottom: `1px solid ${theme.border06}`,
        }}
      >
        "{quote}"
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
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
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
          </svg>
          YouTube
        </a>
        <a
          href={applePodcastsUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "12px 24px",
            borderRadius: 50,
            background: theme.surface04,
            border: `1px solid ${theme.border10}`,
            color: theme.text60,
            textDecoration: "none",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            letterSpacing: 1,
            textTransform: "uppercase",
            transition: "all 0.3s ease",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = theme.border08;
            e.currentTarget.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = theme.surface04;
            e.currentTarget.style.transform = "scale(1)";
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M5.34 0A5.328 5.328 0 0 0 0 5.34v13.32A5.328 5.328 0 0 0 5.34 24h13.32A5.328 5.328 0 0 0 24 18.66V5.34A5.328 5.328 0 0 0 18.66 0zm6.007 3.12c2.838 0 5.13 2.292 5.13 5.13a5.135 5.135 0 0 1-3.04 4.664c.028.13.054.261.074.395.122.84.088 1.74-.104 2.583-.193.844-.534 1.605-1.007 2.25-.398.543-.867.982-1.39 1.304-.284.175-.575.311-.873.405l-.01.003c-.234.072-.472.107-.71.107-.237 0-.474-.035-.707-.107l-.01-.003c-.3-.094-.59-.23-.876-.406a4.86 4.86 0 0 1-1.386-1.302c-.474-.645-.816-1.407-1.01-2.252-.192-.842-.225-1.742-.103-2.583.02-.134.046-.265.074-.395A5.135 5.135 0 0 1 6.218 8.25c0-2.838 2.291-5.13 5.13-5.13zm0 1.44a3.69 3.69 0 0 0-3.69 3.69 3.69 3.69 0 0 0 2.4 3.465c.15-.29.336-.56.555-.8a2.117 2.117 0 0 1-.497-1.365 2.12 2.12 0 0 1 2.12-2.12 2.12 2.12 0 0 1 2.12 2.12c0 .508-.18.976-.48 1.343.22.24.407.512.558.803a3.69 3.69 0 0 0 2.404-3.446 3.69 3.69 0 0 0-3.49-3.69zm.13 5.43c-.504 0-.908.405-.908.91a.91.91 0 0 0 .908.909.91.91 0 0 0 .91-.91.91.91 0 0 0-.91-.908zm-.02 2.43c-.24 0-.48.03-.713.085-.43.102-.82.3-1.143.575-.456.386-.782.924-.927 1.528-.145.604-.12 1.26.075 1.87.193.61.558 1.15 1.034 1.524.4.315.865.5 1.35.514h.006c.484-.014.948-.2 1.348-.514.476-.374.84-.915 1.033-1.525.196-.61.22-1.265.076-1.87-.145-.603-.47-1.14-.927-1.527a2.652 2.652 0 0 0-1.21-.576 2.72 2.72 0 0 0-.001 0z" />
          </svg>
          Apple Podcasts
        </a>
      </div>

      <button
        onClick={onReset}
        style={{
          marginTop: 8,
          padding: "10px 20px",
          borderRadius: 50,
          background: "transparent",
          border: `1px solid ${theme.border10}`,
          color: theme.text30,
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11,
          letterSpacing: 2,
          textTransform: "uppercase",
          cursor: "pointer",
          transition: "all 0.3s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = theme.border30;
          e.currentTarget.style.color = theme.text60;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = theme.border10;
          e.currentTarget.style.color = theme.text30;
        }}
      >
        Check again
      </button>
    </div>
  );
}

function EmojiPicker({ onPick, theme, getMood }) {
  const emojis = Object.keys(MOODS).map((key) => ({
    mood: key,
    emoji: getMood(key).emoji,
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
            border: `1px solid ${theme.border08}`,
            background: theme.surface03,
            fontSize: 22,
            cursor: "pointer",
            transition: "all 0.3s ease",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = theme.surface10;
            e.currentTarget.style.transform = "scale(1.2)";
            e.currentTarget.style.borderColor = theme.border20;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = theme.surface03;
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.borderColor = theme.border08;
          }}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}

function SettingsPanel({ open, onClose, theme, customMoods, setCustomMoods, accentColor, setAccentColor }) {
  const [editingEmojiFor, setEditingEmojiFor] = useState(null);

  const updateEmoji = (moodKey, emoji) => {
    setCustomMoods((prev) => ({
      ...prev,
      [moodKey]: { ...prev[moodKey], emoji: emoji || MOODS[moodKey].emoji },
    }));
  };

  const updateGradient = (moodKey, index, color) => {
    setCustomMoods((prev) => {
      const gradient = [...prev[moodKey].gradient];
      gradient[index] = color;
      return { ...prev, [moodKey]: { ...prev[moodKey], gradient } };
    });
  };

  const resetMood = (moodKey) => {
    setCustomMoods((prev) => ({
      ...prev,
      [moodKey]: { emoji: MOODS[moodKey].emoji, gradient: [...MOODS[moodKey].gradient] },
    }));
  };

  const resetAll = () => {
    setCustomMoods(
      Object.fromEntries(
        Object.entries(MOODS).map(([k, v]) => [k, { emoji: v.emoji, gradient: [...v.gradient] }])
      )
    );
    setAccentColor("#ffffff");
  };

  return (
    <>
      {open && (
        <div
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            zIndex: 19,
          }}
        />
      )}

      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "100vh",
          width: "min(360px, 90vw)",
          background: theme.panelBg,
          borderLeft: `1px solid ${theme.border10}`,
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.4s cubic-bezier(0.22, 1, 0.36, 1)",
          zIndex: 20,
          overflowY: "auto",
          padding: "24px 20px",
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          gap: 28,
          fontFamily: "'JetBrains Mono', monospace",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13, letterSpacing: 3, textTransform: "uppercase", color: theme.text60 }}>
            Settings
          </span>
          <button
            onClick={onClose}
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              border: `1px solid ${theme.border10}`,
              background: "transparent",
              color: theme.text60,
              cursor: "pointer",
              fontSize: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ✕
          </button>
        </div>

        {/* Global accent */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <span style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: theme.text35 }}>
            Global Accent
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <input
              type="color"
              value={accentColor}
              onChange={(e) => setAccentColor(e.target.value)}
              style={{ width: 40, height: 40, border: "none", borderRadius: 8, cursor: "pointer", padding: 2, background: "none" }}
            />
            <span style={{ fontSize: 11, color: theme.text30 }}>{accentColor}</span>
          </div>
        </div>

        {/* Per-mood rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <span style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: theme.text35 }}>
            Mood Customization
          </span>
          {Object.keys(MOODS).map((moodKey) => (
            <div
              key={moodKey}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 10,
                padding: "12px 14px",
                borderRadius: 12,
                border: `1px solid ${theme.border08}`,
                background: theme.surface03,
              }}
            >
              {/* Row: emoji + name + reset */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  {editingEmojiFor === moodKey ? (
                    <input
                      type="text"
                      maxLength={2}
                      defaultValue={customMoods[moodKey].emoji}
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          updateEmoji(moodKey, e.target.value);
                          setEditingEmojiFor(null);
                        }
                        if (e.key === "Escape") setEditingEmojiFor(null);
                      }}
                      onBlur={(e) => {
                        updateEmoji(moodKey, e.target.value);
                        setEditingEmojiFor(null);
                      }}
                      style={{
                        width: 40,
                        height: 40,
                        textAlign: "center",
                        fontSize: 18,
                        borderRadius: 8,
                        border: `1px solid ${theme.border20}`,
                        background: theme.surface10,
                        color: theme.text85,
                        outline: "none",
                      }}
                    />
                  ) : (
                    <button
                      onClick={() => setEditingEmojiFor(moodKey)}
                      title="Click to change emoji"
                      style={{
                        width: 40,
                        height: 40,
                        fontSize: 20,
                        borderRadius: 8,
                        border: `1px solid ${theme.border08}`,
                        background: theme.surface05,
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {customMoods[moodKey].emoji}
                    </button>
                  )}
                  <span style={{ fontSize: 11, letterSpacing: 1, textTransform: "capitalize", color: theme.text60 }}>
                    {moodKey}
                  </span>
                </div>
                <button
                  onClick={() => resetMood(moodKey)}
                  title="Reset to default"
                  style={{
                    fontSize: 14,
                    background: "transparent",
                    border: "none",
                    color: theme.text30,
                    cursor: "pointer",
                    padding: "4px 6px",
                    borderRadius: 4,
                  }}
                >
                  ↺
                </button>
              </div>

              {/* Gradient row */}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 9, letterSpacing: 1, textTransform: "uppercase", color: theme.text25, flexShrink: 0 }}>
                  Gradient
                </span>
                {customMoods[moodKey].gradient.map((color, i) => (
                  <input
                    key={i}
                    type="color"
                    value={color}
                    onChange={(e) => updateGradient(moodKey, i, e.target.value)}
                    style={{ width: 32, height: 32, border: "none", borderRadius: 6, cursor: "pointer", padding: 2, background: "none" }}
                  />
                ))}
                <div
                  style={{
                    flex: 1,
                    height: 8,
                    borderRadius: 4,
                    marginLeft: 4,
                    background: `linear-gradient(90deg, ${customMoods[moodKey].gradient[0]}, ${customMoods[moodKey].gradient[1]}, ${customMoods[moodKey].gradient[2]})`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Reset all */}
        <button
          onClick={resetAll}
          style={{
            padding: "12px 0",
            borderRadius: 10,
            border: `1px solid ${theme.border10}`,
            background: "transparent",
            color: theme.text30,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            letterSpacing: 2,
            textTransform: "uppercase",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = theme.border30;
            e.currentTarget.style.color = theme.text60;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = theme.border10;
            e.currentTarget.style.color = theme.text30;
          }}
        >
          Reset all to defaults
        </button>
      </div>
    </>
  );
}

export default function VibeCheck() {
  const [inputText, setInputText] = useState("");
  const [currentMood, setCurrentMood] = useState(null);
  const [streak, setStreak] = useState(() => Array(7).fill(null));
  const [phase, setPhase] = useState("input");
  const inputRef = useRef(null);

  const [isDark, setIsDark] = useState(true);
  const [isGirlie, setIsGirlie] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [accentColor, setAccentColor] = useState("#ffffff");

  const mode = isGirlie ? "girlie" : isDark ? "dark" : "light";
  const [customMoods, setCustomMoods] = useState(() =>
    Object.fromEntries(
      Object.entries(MOODS).map(([k, v]) => [k, { emoji: v.emoji, gradient: [...v.gradient] }])
    )
  );

  const getMood = useCallback(
    (key) => ({ ...MOODS[key], emoji: customMoods[key].emoji, gradient: customMoods[key].gradient }),
    [customMoods]
  );

  const t = (dark, light, girlie) => mode === "dark" ? dark : mode === "light" ? light : girlie;
  const theme = {
    isDark,
    isGirlie,
    mode,
    text90: t("rgba(255,255,255,0.90)", "rgba(0,0,0,0.90)",     "rgba(80,0,40,0.90)"),
    text85: t("rgba(255,255,255,0.85)", "rgba(0,0,0,0.85)",     "rgba(80,0,40,0.85)"),
    text80: t("rgba(255,255,255,0.80)", "rgba(0,0,0,0.80)",     "rgba(80,0,40,0.80)"),
    text70: t("rgba(255,255,255,0.70)", "rgba(0,0,0,0.70)",     "rgba(100,0,50,0.70)"),
    text60: t("rgba(255,255,255,0.60)", "rgba(0,0,0,0.60)",     "rgba(120,20,60,0.60)"),
    text55: t("rgba(255,255,255,0.55)", "rgba(0,0,0,0.55)",     "rgba(120,20,60,0.55)"),
    text50: t("rgba(255,255,255,0.50)", "rgba(0,0,0,0.50)",     "rgba(140,30,70,0.50)"),
    text35: t("rgba(255,255,255,0.35)", "rgba(0,0,0,0.35)",     "rgba(160,40,80,0.35)"),
    text30: t("rgba(255,255,255,0.30)", "rgba(0,0,0,0.30)",     "rgba(160,40,80,0.30)"),
    text25: t("rgba(255,255,255,0.25)", "rgba(0,0,0,0.25)",     "rgba(180,60,100,0.25)"),
    text20: t("rgba(255,255,255,0.20)", "rgba(0,0,0,0.20)",     "rgba(180,60,100,0.20)"),
    text18: t("rgba(255,255,255,0.18)", "rgba(0,0,0,0.18)",     "rgba(180,60,100,0.18)"),
    text15: t("rgba(255,255,255,0.15)", "rgba(0,0,0,0.15)",     "rgba(200,80,120,0.15)"),
    surface03: t("rgba(255,255,255,0.03)", "rgba(0,0,0,0.03)", "rgba(255,150,180,0.06)"),
    surface04: t("rgba(255,255,255,0.04)", "rgba(0,0,0,0.04)", "rgba(255,150,180,0.09)"),
    surface05: t("rgba(255,255,255,0.05)", "rgba(0,0,0,0.05)", "rgba(255,150,180,0.12)"),
    surface06: t("rgba(255,255,255,0.06)", "rgba(0,0,0,0.06)", "rgba(255,150,180,0.15)"),
    surface10: t("rgba(255,255,255,0.10)", "rgba(0,0,0,0.10)", "rgba(255,105,160,0.15)"),
    surface20: t("rgba(255,255,255,0.20)", "rgba(0,0,0,0.20)", "rgba(255,105,160,0.25)"),
    border06: t("rgba(255,255,255,0.06)", "rgba(0,0,0,0.06)",  "rgba(220,80,130,0.12)"),
    border08: t("rgba(255,255,255,0.08)", "rgba(0,0,0,0.08)",  "rgba(220,80,130,0.18)"),
    border10: t("rgba(255,255,255,0.10)", "rgba(0,0,0,0.10)",  "rgba(220,80,130,0.22)"),
    border20: t("rgba(255,255,255,0.20)", "rgba(0,0,0,0.20)",  "rgba(220,80,130,0.35)"),
    border30: t("rgba(255,255,255,0.30)", "rgba(0,0,0,0.30)",  "rgba(220,80,130,0.50)"),
    border50: t("rgba(255,255,255,0.50)", "rgba(0,0,0,0.50)",  "rgba(220,80,130,0.70)"),
    panelBg: t("#0e0e10", "#fafafa", "#fff0f5"),
    pageBg: (moodKey) => {
      if (!moodKey) return t("#060608", "#f5f5f7", "#fce4ec");
      if (mode === "dark") return MOODS[moodKey].bg;
      if (mode === "light") return lightBgMap[moodKey];
      return girlieBgMap[moodKey];
    },
    selection: t("rgba(255,255,255,0.15)", "rgba(0,0,0,0.15)", "rgba(255,105,160,0.20)"),
    placeholder: t("rgba(255,255,255,0.70)", "rgba(0,0,0,0.65)", "rgba(160,20,70,0.75)"),
    accent: accentColor,
  };

  const activeGradient = currentMood
    ? getMood(currentMood).gradient
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
        background: theme.pageBg(currentMood),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        transition: "background 1.5s ease",
        padding: 20,
        "--selection-bg": theme.selection,
        "--placeholder-color": theme.placeholder,
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
          background: var(--selection-bg);
        }

        input::placeholder {
          color: var(--placeholder-color);
        }
      `}</style>

      {/* Top-right controls */}
      <div
        style={{
          position: "fixed",
          top: 20,
          right: 20,
          zIndex: 10,
          display: "flex",
          gap: 10,
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            borderRadius: 50,
            border: `1px solid ${theme.border20}`,
            background: theme.surface05,
            overflow: "hidden",
          }}
        >
          {[
            { key: "dark",   icon: "🦇", label: "Dark"   },
            { key: "light",  icon: "☀️",  label: "Light"  },
            { key: "girlie", icon: "🎀", label: "Girlie" },
          ].map(({ key, icon, label }, i, arr) => {
            const active = mode === key;
            return (
              <button
                key={key}
                onClick={() => {
                  if (key === "girlie") { setIsGirlie(true); }
                  else { setIsGirlie(false); setIsDark(key === "dark"); }
                }}
                title={label + " mode"}
                style={{
                  padding: "8px 14px",
                  border: "none",
                  borderRight: i < arr.length - 1 ? `1px solid ${theme.border10}` : "none",
                  background: active
                    ? key === "girlie" ? "rgba(255,133,162,0.28)" : theme.surface20
                    : "transparent",
                  color: active
                    ? key === "girlie" ? "#FF85A2" : theme.text80
                    : theme.text60,
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  transition: "all 0.2s ease",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                }}
              >
                <span style={{ fontSize: 14 }}>{icon}</span>
                <span>{label}</span>
              </button>
            );
          })}
        </div>
        <button
          onClick={() => setSettingsOpen((o) => !o)}
          title="Customize"
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            border: `1px solid ${theme.border20}`,
            background: theme.surface10,
            color: theme.text70,
            cursor: "pointer",
            fontSize: 18,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.3s ease",
          }}
        >
          ⚙️
        </button>
      </div>

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
              color: theme.text90,
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
              color: theme.text25,
            }}
          >
            mood → podcasts
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
                  border: `1px solid ${theme.border08}`,
                  background: theme.surface03,
                  color: theme.text85,
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: 17,
                  outline: "none",
                  transition: "all 0.3s ease",
                  backdropFilter: "blur(20px)",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = theme.border20;
                  e.target.style.background = theme.surface05;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = theme.border08;
                  e.target.style.background = theme.surface03;
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
                    background: theme.surface10,
                    color: theme.text70,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "all 0.2s ease",
                    fontSize: 16,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = theme.surface20;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = theme.surface10;
                  }}
                >
                  →
                </button>
              )}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 16, width: "100%" }}>
              <div style={{ flex: 1, height: 1, background: theme.border06 }} />
              <span
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10,
                  letterSpacing: 3,
                  color: theme.text20,
                  textTransform: "uppercase",
                }}
              >
                or pick a vibe
              </span>
              <div style={{ flex: 1, height: 1, background: theme.border06 }} />
            </div>

            <EmojiPicker onPick={(mood) => handleSubmit(mood)} theme={theme} getMood={getMood} />
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
                color: theme.text30,
              }}
            >
              reading your vibe
            </span>
          </div>
        )}

        {/* Result Phase */}
        {phase === "result" && currentMood && (
          <ResultCard mood={currentMood} onReset={handleReset} theme={theme} getMood={getMood} />
        )}

        {/* Streak */}
        <div
          style={{
            marginTop: 20,
            opacity: 0.7,
            animation: "slideUp 0.8s ease-out 0.4s both",
          }}
        >
          <MoodStreak streak={streak} theme={theme} getMood={getMood} />
          <p
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "clamp(10px, 2vw, 14px)",
              letterSpacing: 2,
              textTransform: "uppercase",
              color: theme.text15,
              textAlign: "center",
              marginTop: 10,
              fontWeight: 300,
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
              fontSize: 12,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: theme.text50,
              textDecoration: "none",
              transition: "color 0.3s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = theme.text90)}
            onMouseLeave={(e) => (e.currentTarget.style.color = theme.text50)}
          >
            built by m. abdullah aziz
          </a>
        </div>
      </div>

      <SettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        theme={theme}
        customMoods={customMoods}
        setCustomMoods={setCustomMoods}
        accentColor={accentColor}
        setAccentColor={setAccentColor}
      />
    </div>
  );
}
