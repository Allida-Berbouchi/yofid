"use client"
import { useState, useRef } from 'react';
import AppLayout from "@/components/AppLayout";
import Topbar from "@/components/Topbar";
import React from 'react';
export default function WatchPage() {
  const [videoId, setVideoId] = useState('CgkZ7MvWUAA');
  const [inputUrl, setInputUrl] = useState('https://www.youtube.com/watch?v=CgkZ7MvWUAA&t=582s');
  const iframeRef = useRef(null);

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

  // YouTube Player API functions
  const sendCommandToPlayer = (command) => {
    const iframe = iframeRef.current;
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage(
        JSON.stringify({
          event: 'command',
          func: command,
          args: []
        }),
        '*'
      );
    }
  };

  const pauseVideo = () => {
    sendCommandToPlayer('pauseVideo');
  };

  const seekBySeconds = (seconds) => {
    const iframe = iframeRef.current;
    if (iframe && iframe.contentWindow) {
      // Get current time and add/subtract seconds
      iframe.contentWindow.postMessage(
        JSON.stringify({
          event: 'command',
          func: 'getCurrentTime',
          args: []
        }),
        '*'
      );
      
      // Listen for response (simplified approach - use YouTube Iframe API for production)
      const handleMessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.event === 'infoDelivery' && data.info && data.info.currentTime !== undefined) {
            const newTime = data.info.currentTime + seconds;
            iframe.contentWindow.postMessage(
              JSON.stringify({
                event: 'command',
                func: 'seekTo',
                args: [newTime, true]
              }),
              '*'
            );
            window.removeEventListener('message', handleMessage);
          }
        } catch (e) {
          // Ignore parse errors
        }
      };
      
      window.addEventListener('message', handleMessage);
    }
  };

  const seekForward = () => seekBySeconds(10);
  const seekBackward = () => seekBySeconds(-10);

  // Alternative: Load YouTube Iframe API (more reliable)
  React.useEffect(() => {
    // This will load the YouTube API properly
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      new window.YT.Player(iframeRef.current, {
        events: {
          onReady: (event) => {
            window.player = event.target;
          }
        }
      });
    };
  }, []);

  // Simpler working solution using YouTube Iframe API
  const [player, setPlayer] = useState(null);

  React.useEffect(() => {
    if (videoId && window.YT) {
      const newPlayer = new window.YT.Player(iframeRef.current, {
        events: {
          onReady: (event) => {
            setPlayer(event.target);
          }
        }
      });
    }
  }, [videoId]);

  const handlePause = () => {
    if (player) {
      player.pauseVideo();
    }
  };

  const handleSeekForward = () => {
    if (player) {
      const currentTime = player.getCurrentTime();
      player.seekTo(currentTime + 10, true);
    }
  };

  const handleSeekBackward = () => {
    if (player) {
      const currentTime = player.getCurrentTime();
      player.seekTo(currentTime - 10, true);
    }
  };

  return (
    <AppLayout>
      <Topbar/>
      <div style={{ padding: '20px' }}>
        
        
       
        
        {videoId && (
          <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
            <iframe 
              ref={iframeRef}
              src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1`}
              title="YouTube Video"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%'
              }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}
      </div>
    </AppLayout>
  );
}
