"use client";
import { useState, useRef, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import Topbar from "@/components/Topbar";

export default function WatchPage() {
  const [videoId, setVideoId] = useState("CgkZ7MvWUAA");
  const [inputUrl, setInputUrl] = useState(
    "https://www.youtube.com/watch?v=CgkZ7MvWUAA&t=582s"
  );
  const [player, setPlayer] = useState(null);
  const [showSkipButtons, setShowSkipButtons] = useState(false);
  const containerRef = useRef(null);
  let hideTimeout;

  const extractVideoId = (url) => {
    const regex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const handleUrlChange = (e) => {
    const newUrl = e.target.value;
    setInputUrl(newUrl);
    const id = extractVideoId(newUrl);
    if (id) setVideoId(id);
  };

  useEffect(() => {
    let isMounted = true;

    const initPlayer = () => {
      if (!isMounted) return;
      
      if (window.YT && window.YT.Player && containerRef.current) {
        const newPlayer = new window.YT.Player(containerRef.current, {
          videoId: videoId,
          playerVars: {
            enablejsapi: 1,
            controls: 1,
          },
          events: {
            onReady: (event) => {
              if (isMounted) {
                setPlayer(event.target);
              }
            },
          }
        });
        return;
      }
      
      setTimeout(initPlayer, 100);
    };

    if (!window.YT) {
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.onload = () => {
        initPlayer();
      };
      document.body.appendChild(script);
    } else {
      initPlayer();
    }

    return () => {
      isMounted = false;
      if (player && player.destroy) {
        player.destroy();
      }
    };
  }, [videoId]);

  const skipForward = () => {
    if (player) {
      const currentTime = player.getCurrentTime();
      player.seekTo(currentTime + 10, true);
      // Visual feedback
      showToast("+10 seconds");
    }
  };

  const skipBackward = () => {
    if (player) {
      const currentTime = player.getCurrentTime();
      player.seekTo(currentTime - 10, true);
      // Visual feedback
      showToast("-10 seconds");
    }
  };

  const showToast = (message) => {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.position = 'fixed';
    toast.style.bottom = '20%';
    toast.style.left = '50%';
    toast.style.transform = 'translateX(-50%)';
    toast.style.backgroundColor = 'rgba(0,0,0,0.8)';
    toast.style.color = 'white';
    toast.style.padding = '8px 16px';
    toast.style.borderRadius = '20px';
    toast.style.fontSize = '14px';
    toast.style.zIndex = '1000';
    toast.style.pointerEvents = 'none';
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 800);
  };

  const handleMouseEnter = () => {
    setShowSkipButtons(true);
    clearTimeout(hideTimeout);
  };

  const handleMouseLeave = () => {
    hideTimeout = setTimeout(() => setShowSkipButtons(false), 300);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!player) return;
      
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        skipBackward();
        showToast("-10 seconds");
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        skipForward();
        showToast("+10 seconds");
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [player]);

  return (
    <AppLayout>
      <Topbar />
      <div style={{ padding: "20px" }}>
        <div style={{ marginBottom: "20px" }}>
          <input
            type="text"
            value={inputUrl}
            onChange={handleUrlChange}
            placeholder="Enter YouTube URL"
            style={{
              width: "100%",
              padding: "8px",
              fontSize: "16px",
              border: "1px solid #ccc",
              borderRadius: "4px"
            }}
          />
        </div>

        {/* Video Player with Hover Skip Buttons */}
        <div 
          style={{ position: "relative", paddingBottom: "56.25%", height: 0, backgroundColor: "#000" }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div
            ref={containerRef}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%"
            }}
            id="youtube-player-container"
          />
          
          {/* Custom Skip Buttons - Appear on hover */}
          {showSkipButtons && (
            <>
              {/* Left side -10 button */}
              <button
                onClick={skipBackward}
                style={{
                  position: "absolute",
                  left: "20px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  backgroundColor: "rgba(0, 0, 0, 0.7)",
                  backdropFilter: "blur(4px)",
                  color: "white",
                  border: "none",
                  borderRadius: "40px",
                  padding: "12px 20px",
                  fontSize: "18px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  transition: "all 0.2s ease",
                  zIndex: 100,
                  fontFamily: "sans-serif"
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
                  e.target.style.transform = "translateY(-50%) scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
                  e.target.style.transform = "translateY(-50%) scale(1)";
                }}
              >
                ◀ 10
              </button>

              {/* Right side +10 button */}
              <button
                onClick={skipForward}
                style={{
                  position: "absolute",
                  right: "20px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  backgroundColor: "rgba(0, 0, 0, 0.7)",
                  backdropFilter: "blur(4px)",
                  color: "white",
                  border: "none",
                  borderRadius: "40px",
                  padding: "12px 20px",
                  fontSize: "18px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  transition: "all 0.2s ease",
                  zIndex: 100,
                  fontFamily: "sans-serif"
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "rgba(0, 0, 0, 0.9)";
                  e.target.style.transform = "translateY(-50%) scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
                  e.target.style.transform = "translateY(-50%) scale(1)";
                }}
              >
                10 ▶
              </button>

              {/* Center hint */}
              <div
                style={{
                  position: "absolute",
                  bottom: "20px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  backgroundColor: "rgba(0, 0, 0, 0.6)",
                  backdropFilter: "blur(4px)",
                  color: "white",
                  padding: "6px 12px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  zIndex: 100,
                  pointerEvents: "none",
                  whiteSpace: "nowrap"
                }}
              >
                ← 10s  |  Arrow keys  |  10s →
              </div>
            </>
          )}
        </div>
      </div>
    </AppLayout>
  );
}