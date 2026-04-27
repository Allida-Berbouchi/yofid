'use client';
import { useState } from 'react';
import "./Resourceinteraction"
export default function ResourceInteraction({ resourceId }) {
  const [likes, setLikes] = useState(128);
  const [interaction, setInteraction] = useState(null); // 'like', 'dislike', or null
  const [hasCommented, setHasCommented] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [copied, setCopied] = useState(false);
  
  const [comments, setComments] = useState([
    { id: 0, user: "System", text: "Discussion is open.", isAdmin: false }
  ]);

  const handleInteraction = (type) => {
    if (interaction) return; // Locked once you choose one
    if (type === 'like') setLikes(prev => prev + 1);
    setInteraction(type);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePostComment = (e) => {
    e.preventDefault();
    if (!commentText.trim() || hasCommented) return;
    
    setComments([{ 
      id: Date.now(), 
      user: "mohamed", 
      text: commentText, 
      isAdmin: true 
    }, ...comments]);
    
    setHasCommented(true);
    setCommentText("");
  };

  return (
    <div className="yt-interaction-wrapper">
      {/* 1. ACTION BAR */}
      <div className="yt-action-row">
        <div className="yt-pill-group">
          <button 
            className={`yt-pill-item ${interaction === 'like' ? 'active-like' : ''}`}
            onClick={() => handleInteraction('like')}
            disabled={!!interaction}
          >
            {interaction === 'like' ? '👍' : '👍'} {likes}
          </button>
          <div className="yt-divider" />
          <button 
            className={`yt-pill-item ${interaction === 'dislike' ? 'active-dislike' : ''}`}
            onClick={() => handleInteraction('dislike')}
            disabled={!!interaction}
          >
            {interaction === 'dislike' ? '👎' : '👎'}
          </button>
        </div>

        <button className="yt-copy-link" onClick={copyToClipboard}>
          🔗 {copied ? "Copied!" : "Copy Link"}
        </button>
      </div>

      {/* 2. COMMENT AREA */}
      <div className="yt-comment-input-area">
        <div className="yt-avatar">M</div>
        {hasCommented ? (
          <div style={{ padding: '8px 0', color: '#606060', fontSize: '14px' }}>
            ✅ Your comment has been added. (One-time limit reached)
          </div>
        ) : (
          <form style={{ flexGrow: 1 }} onSubmit={handlePostComment}>
            <input 
              className="yt-input-field"
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
              <button 
                type="submit" 
                className="btn-primary" 
                style={{ borderRadius: '20px', padding: '6px 16px' }}
                disabled={!commentText.trim()}
              >
                Comment
              </button>
            </div>
          </form>
        )}
      </div>

      {/* 3. COMMENTS LIST */}
      <div className="yt-comment-list">
        {comments.map(c => (
          <div key={c.id} style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
            <div className="yt-avatar" style={{ width: 32, height: 32, fontSize: '12px' }}>
              {c.user[0].toUpperCase()}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2px' }}>
                <span style={{ fontSize: '13px', fontWeight: '700' }}>@{c.user}</span>
                {c.isAdmin && <span className="yt-admin-badge">Owner</span>}
                <span style={{ fontSize: '12px', color: '#606060', marginLeft: '8px' }}>Just now</span>
              </div>
              <p style={{ fontSize: '14px', color: '#0f0f0f', margin: 0 }}>{c.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}