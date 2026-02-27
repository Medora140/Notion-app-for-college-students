import { useEffect, useState } from "react";

function Avatar({
  type = "cat",
  size = 120,
  url = "",
  isTypingEmail = false,
  isTypingPassword = false,
  expression = "normal",
  showStatus = true,
  status = "online", // online, busy, away
}) {
  const [blink, setBlink] = useState(false);
  const [pupil, setPupil] = useState({ x: 0, y: 0 });

  const statusColors = {
    online: "#10b981",
    busy: "#ef4444",
    away: "#f59e0b",
  };

  const statusColor = statusColors[status] || statusColors.online;

  // Blinking animation
  useEffect(() => {
    const interval = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 150);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Follow mouse
  useEffect(() => {
    if (isTypingPassword) return;

    const move = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 6;
      const y = (e.clientY / window.innerHeight - 0.5) * 6;
      setPupil({ x, y });
    };

    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [isTypingPassword]);

  // Expression logic
  let mouth = "smile";
  let eyebrow = "normal";
  let lookAway = false;
  if (expression === "thinking") {
    mouth = "flat";
    eyebrow = "raised";
  }

  // Login reactions take priority
  if (expression === "success") {
    mouth = "bigSmile";
  } else if (expression === "sad") {
    mouth = "sad";
  } else {
    if (isTypingEmail) {
      mouth = "surprised";
      eyebrow = "raised";
    }

    if (isTypingPassword) {
      mouth = "whistle";
      lookAway = true;
    }
  }

  const eyeX = lookAway ? 5 : pupil.x;
  const eyeY = lookAway ? -5 : pupil.y;

  const colors = {
    cat: "#f59e0b",
    dog: "#d97706",
    robot: "#64748b",
    unicorn: "#f472b6",
  };

  const color = colors[type] || "#6366f1";

  // Animated GIF URLs (Google Noto Emoji)
  const defaultGifs = {
    cat: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f431/512.gif",
    dog: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f415/512.gif",
    robot: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f916/512.gif",
    unicorn: "https://fonts.gstatic.com/s/e/notoemoji/latest/1f984/512.gif",
  };

  const avatarSource = url || defaultGifs[type];

  const containerStyle = {
    width: size,
    height: size,
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const imageStyle = {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    objectFit: "cover",
    backgroundColor: url ? "transparent" : `${color}15`, // Light background for emojis
    transition: "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  };

  return (
    <div className="avatar-container" style={containerStyle}>
      {/* Animated Status Pulse */}
      {showStatus && (
        <div className="status-pulse"></div>
      )}

      {avatarSource ? (
        <img
          src={avatarSource}
          alt={type}
          style={imageStyle}
          className={`avatar-img avatar-float-${type}`}
        />
      ) : (
        /* ... existing SVG fallback ... */
        <svg width={size} height={size} viewBox="0 0 120 120">
          {/* Fallback to SVG if no image source found (though we have defaults) */}
          {/* Head */}
          <circle cx="60" cy="60" r="50" fill={color} />

          {/* Eyes */}
          <g>
            <ellipse cx="40" cy="55" rx="10" ry={blink ? 2 : 10} fill="#fff" />
            {!blink && (
              <circle cx={40 + eyeX} cy={55 + eyeY} r="4" fill="#000" />
            )}

            <ellipse cx="80" cy="55" rx="10" ry={blink ? 2 : 10} fill="#fff" />
            {!blink && (
              <circle cx={80 + eyeX} cy={55 + eyeY} r="4" fill="#000" />
            )}
          </g>

          {/* Eyebrows */}
          {eyebrow === "raised" ? (
            <>
              <path d="M30 40 Q40 30 50 40" stroke="#000" strokeWidth="3" fill="none" />
              <path d="M70 40 Q80 30 90 40" stroke="#000" strokeWidth="3" fill="none" />
            </>
          ) : (
            <>
              <path d="M30 40 Q40 35 50 40" stroke="#000" strokeWidth="3" fill="none" />
              <path d="M70 40 Q80 35 90 40" stroke="#000" strokeWidth="3" fill="none" />
            </>
          )}

          {/* Cheek blush */}
          <circle cx="30" cy="70" r="6" fill="#fca5a5" opacity="0.5" />
          <circle cx="90" cy="70" r="6" fill="#fca5a5" opacity="0.5" />

          {/* Mouth */}
          {mouth === "smile" && (
            <>
              <path
                d="M42 80 Q60 92 78 80"
                stroke="#111"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
              />
              {type === "dog" && (
                <path
                  d="M55 85 Q60 100 65 85"
                  fill="#fb7185"
                  stroke="#e11d48"
                  strokeWidth="1"
                />
              )}
            </>
          )}

          {mouth === "flat" && (
            <line
              x1="45"
              y1="85"
              x2="75"
              y2="85"
              stroke="#111"
              strokeWidth="4"
              strokeLinecap="round"
            />
          )}

          {mouth === "bigSmile" && (
            <>
              <path
                d="M38 75 Q60 100 82 75"
                stroke="#111"
                strokeWidth="5"
                fill="white"
              />
              <line x1="45" y1="80" x2="75" y2="80" stroke="#111" strokeWidth="2" />
            </>
          )}

          {mouth === "sad" && (
            <path
              d="M42 90 Q60 75 78 90"
              stroke="#111"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />
          )}

          {mouth === "surprised" && (
            <circle cx="60" cy="85" r="6" fill="#000" />
          )}

          {mouth === "whistle" && (
            <>
              <circle cx="60" cy="85" r="4" fill="#000" />
              <text x="68" y="78" fontSize="10" fill="#000">
                ♪
              </text>
            </>
          )}

          {/* Unicorn specific additions */}
          {type === "unicorn" && (
            <>
              <polygon points="60,5 55,30 65,30" fill="#facc15" />
            </>
          )}

          {/* Robot specific additions */}
          {type === "robot" && (
            <>
              <rect x="58" y="5" width="4" height="10" fill="#000" />
              <circle cx="60" cy="5" r="4" fill="#000" />
            </>
          )}
        </svg>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        .status-pulse {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          border: 2px solid ${statusColor};
          opacity: 0;
          animation: pulse 2s infinite;
          pointer-events: none;
        }

        @keyframes pulse {
          0% { transform: scale(0.95); opacity: 0.8; }
          70% { transform: scale(1.15); opacity: 0; }
          100% { transform: scale(1.15); opacity: 0; }
        }

        .avatar-img {
          animation: float 3s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }

        .avatar-img:hover {
          transform: scale(1.1) rotate(5deg);
        }
      `}} />
    </div>
  );
}

export default Avatar;
