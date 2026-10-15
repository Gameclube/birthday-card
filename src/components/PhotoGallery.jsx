import React from 'react';

export default function PhotoGallery() {
  return (
    <div className="content-box" style={{ maxWidth: '700px' }}>
      <p className="card-message">"As long as you're smiling. I'm happy. Stay happy, my love."</p>
      
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '12px', 
        justifyContent: 'center', 
        maxHeight: '60vh', 
        overflowY: 'auto', 
        padding: '10px' 
      }}>
        <img src="/photos/1.jpg" alt="Memory 1" className="photo-card" />
        <img src="/photos/2.jpg" alt="Memory 2" className="photo-card" />
        <img src="/photos/3.jpg" alt="Memory 3" className="photo-card" />
        <img src="/photos/4.jpg" alt="Memory 4" className="photo-card" />
        
        <video 
          src="/photos/5.mp4" 
          className="photo-card" 
          autoPlay 
          loop 
          muted 
          playsInline 
        />
        <video 
          src="/photos/6.mp4" 
          className="photo-card" 
          autoPlay 
          loop 
          muted 
          playsInline 
        />
      </div>

      <button className="btn-primary" onClick={() => window.location.reload()}>
        Пройти сначала ↺
      </button>
    </div>
  );
}