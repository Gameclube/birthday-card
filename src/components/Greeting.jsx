import React from 'react';

export default function Greeting({ onNext }) {
  return (
    <div className="content-box">
      <h1 className="title-text">HAPPY BIRTHDAY</h1>
      <div className="card-envelope" onClick={onNext}>
        <p className="card-message">✨ Нажми, чтобы открыть подарок ✨</p>
        <div style={{ fontSize: '3rem' }}>💖</div>
      </div>
    </div>
  );
}