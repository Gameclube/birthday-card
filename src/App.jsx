import React, { useState, useEffect, useMemo, useRef } from 'react';

export default function App() {
  const [step, setStep] = useState(0); 
  const [realCount, setRealCount] = useState(3);
  const [textIndex, setTextIndex] = useState(0);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  const audioRef = useRef(null);
  
  const textSteps = [
    { text: "HAPPY BIRTHDAY!", duration: 2000 },
    { text: "С днем рождения!", duration: 2000 },
    { text: "Пусть все мечты сбываются ✨", duration: 2200 },
    { text: "Улыбайся каждый день ❤️", duration: 2200 }
  ];

  const mediaList = [
    { type: 'img', src: '/photos/1.jpg', caption: "Самые яркие моменты ✨", duration: 3000 },
    { type: 'img', src: '/photos/2.jpg', caption: "Твоя улыбка бесценна ❤️", duration: 3000 },
    { type: 'img', src: '/photos/3.jpg', caption: "Прекрасный момент 💫", duration: 2900 },
    { type: 'img', src: '/photos/4.jpg', caption: "Пусть счастье окружает всюду 🌟", duration: 3000 },
    { type: 'img', src: '/photos/5.jpg', caption: "Лучшие воспоминания 💫", duration: 4000 },
    { type: 'img', src: '/photos/6.jpg', caption: "С твоим днем! 🥳", duration: 4000 },
  ];

  const handleStartExperience = () => {
    if (audioRef.current) {
      const audio = audioRef.current;
      audio.currentTime = 0;
      audio.volume = 0.25; 
      audio.play().catch((err) => console.log("Ошибка аудио:", err));
    }
    setStep(1);
  };

  useEffect(() => {
    if (step === 1) {
      if (realCount > 0) {
        const timer = setTimeout(() => setRealCount(realCount - 1), 1000);
        return () => clearTimeout(timer);
      } else {
        setStep(2);
      }
    }
  }, [realCount, step]);

  useEffect(() => {
    if (step === 2) {
      const currentTextObj = textSteps[textIndex];
      if (textIndex < textSteps.length - 1) {
        const timer = setTimeout(() => {
          setTextIndex(textIndex + 1);
        }, currentTextObj.duration);
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => {
          setStep(3);
        }, currentTextObj.duration);
        return () => clearTimeout(timer);
      }
    }
  }, [step, textIndex]);

  useEffect(() => {
    if (step === 4) {
      const currentItem = mediaList[currentMediaIndex];
      const timer = setTimeout(() => {
        if (currentMediaIndex < mediaList.length - 1) {
          setCurrentMediaIndex(currentMediaIndex + 1);
        } else {
          if (audioRef.current) {
            const audio = audioRef.current;
            let v = audio.volume;
            const fadeOut = setInterval(() => {
              v = Math.max(0, v - 0.03);
              audio.volume = v;
              if (v <= 0) {
                clearInterval(fadeOut);
                audio.pause();
              }
            }, 50);
          }
          setStep(5);
        }
      }, currentItem.duration);

      return () => clearTimeout(timer);
    }
  }, [step, currentMediaIndex]);

  // Надежный контроль петли: для интро используем встроенный loop до 9 секунды, 
  // а на шаге 4 крутим фрагмент через onTimeUpdate
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const audio = audioRef.current;
      
      if (audio.volume !== 0.25) {
        audio.volume = 0.25;
      }

      // Если мы дошли до 9 секунды в интро, но loop по какой-то причине не сработал — принудительно возвращаем в начало
      if (step < 4 && audio.currentTime >= 9.0) {
        audio.currentTime = 0;
      } 
      // После открытия конверта (шаг 4): зацикливаем фрагмент 1:17 - 1:39
      else if (step === 4 && audio.currentTime >= 99) {
        audio.currentTime = 77;
      }
    }
  };

  const matrixLines = useMemo(() => {
    return Array.from({ length: 75 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      duration: `${1.5 + Math.random() * 2.5}s`,
      delay: `${Math.random() * 2}s`,
      text: Math.random() > 0.3 ? '❤️' : Math.floor(Math.random() * 10)
    }));
  }, []);

  const handleOpenEnvelope = () => {
    if (audioRef.current) {
      const audio = audioRef.current;
      audio.currentTime = 77; 
      audio.volume = 0.25; 
    }
    setStep(4);
    setCurrentMediaIndex(0);
  };

  const handleRestart = () => {
    setCurrentMediaIndex(0);
    setStep(4);
    if (audioRef.current) {
      const audio = audioRef.current;
      audio.currentTime = 77;
      audio.volume = 0.25;
      audio.play().catch(() => {});
    }
  };

  const currentItem = mediaList[currentMediaIndex];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: '#050508',
      color: '#fff',
      fontFamily: 'Montserrat, sans-serif',
      overflow: 'hidden',
      margin: 0,
      boxSizing: 'border-box'
    }}>
      
      {/* Добавляем встроенный атрибут loop для безупречной работы интро на хостинге */}
      <audio 
        ref={audioRef} 
        src="/music.mp3" 
        preload="auto" 
        loop={step < 4}
        onTimeUpdate={handleTimeUpdate} 
      />

      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 1, overflow: 'hidden' }}>
        {matrixLines.map(line => (
          <span key={line.id} style={{
            position: 'absolute',
            top: '-50px',
            left: line.left,
            color: '#ff3385',
            fontSize: '22px',
            fontWeight: 'bold',
            opacity: 0.7,
            animation: `fall ${line.duration} linear infinite`,
            animationDelay: line.delay
          }}>
            {line.text}
          </span>
        ))}
      </div>

      <style>{`
        @keyframes fall {
          0% { transform: translateY(-50px); opacity: 0.9; }
          100% { transform: translateY(105vh); opacity: 0.1; }
        }
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.08); }
          100% { transform: scale(1); }
        }
        @keyframes textFadeIn {
          0% { opacity: 0; transform: scale(0.8) translateY(20px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes captionFade {
          0% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes popUp {
          0% { opacity: 0; transform: scale(0.3) translateY(50px) rotate(-10deg); }
          70% { transform: scale(1.05) translateY(-10px) rotate(3deg); }
          100% { opacity: 1; transform: scale(1) translateY(0) rotate(0deg); }
        }
      `}</style>

      {step === 0 && (
        <div style={{ zIndex: 10, textAlign: 'center', animation: 'popUp 0.6s ease-out' }}>
          <div 
            onClick={handleStartExperience}
            style={{
              background: '#ff3385',
              color: '#fff',
              padding: '20px 45px',
              borderRadius: '40px',
              fontSize: '1.6rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 0 35px rgba(255, 51, 133, 0.8)',
              animation: 'pulse 1.5s infinite',
              display: 'inline-block'
            }}
          >
            Начать ✨
          </div>
        </div>
      )}

      {step === 1 && (
        <div style={{ 
          zIndex: 20,
          fontSize: '13rem', 
          fontWeight: 'bold', 
          color: '#ff3385', 
          textShadow: '0 0 50px rgba(255, 51, 133, 0.9)', 
          animation: 'pulse 1s infinite',
          fontFamily: "'Courier New', Courier, monospace",
          textAlign: 'center',
          lineHeight: '1',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          {realCount}
        </div>
      )}

      {step === 2 && (
        <div style={{ zIndex: 10, textAlign: 'center', width: '90%', maxWidth: '800px' }}>
          <h1 
            key={textIndex} 
            style={{ 
              fontSize: '4rem', 
              letterSpacing: '2px', 
              color: '#ff3385', 
              textShadow: '0 0 35px rgba(255, 51, 133, 0.8)', 
              animation: 'textFadeIn 0.8s ease-out forwards', 
              margin: 0,
              lineHeight: '1.3'
            }}
          >
            {textSteps[textIndex].text}
          </h1>
          <p style={{ fontSize: '1.4rem', color: '#ffccd5', marginTop: '30px', opacity: 0.8 }}>Наслаждайся моментом ✨</p>
        </div>
      )}

      {step === 3 && (
        <div 
          onClick={handleOpenEnvelope} 
          style={{ zIndex: 10, textAlign: 'center', cursor: 'pointer', animation: 'popUp 0.6s ease-out' }}
        >
          <div style={{
            width: '320px',
            height: '210px',
            background: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 20px 45px rgba(255, 51, 133, 0.6)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            margin: '0 auto',
            animation: 'pulse 1.5s infinite'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '0',
              height: '0',
              borderLeft: '160px solid transparent',
              borderRight: '160px solid transparent',
              borderTop: '120px solid #f0f0f0',
              borderTopLeftRadius: '16px',
              borderTopRightRadius: '16px'
            }} />
            <div style={{ zIndex: 5, fontSize: '5rem', filter: 'drop-shadow(0 6px 12px rgba(255, 51, 133, 0.5))' }}>
              ❤️
            </div>
          </div>
          <div style={{
            marginTop: '35px',
            background: '#ff3385',
            color: '#fff',
            padding: '16px 32px',
            borderRadius: '35px',
            fontSize: '1.3rem',
            fontWeight: 'bold',
            boxShadow: '0 0 25px rgba(255, 51, 133, 0.7)',
            display: 'inline-block'
          }}>
            Открыть с музыкой 🎵
          </div>
        </div>
      )}

      {step === 4 && (
        <div style={{ zIndex: 10, textAlign: 'center', maxWidth: '600px', padding: '20px' }}>
          
          <div style={{ height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '15px' }}>
            <p 
              key={currentMediaIndex} 
              style={{ 
                fontSize: '1.5rem', 
                color: '#ffccd5', 
                fontWeight: '600',
                margin: 0,
                textShadow: '0 0 20px rgba(255,51,133,0.6)',
                animation: 'captionFade 0.6s ease-out forwards' 
              }}
            >
              {currentItem.caption || "Прекрасный момент ✨"}
            </p>
          </div>

          <div key={`media-${currentMediaIndex}`} style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            border: '3px solid #ff3385',
            borderRadius: '24px',
            padding: '16px',
            boxShadow: '0 15px 40px rgba(255, 51, 133, 0.5)',
            display: 'inline-block',
            animation: 'popUp 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards'
          }}>
            {currentItem.type === 'img' ? (
              <img 
                src={currentItem.src} 
                alt="Memory" 
                style={{ width: '320px', height: '420px', objectFit: 'cover', borderRadius: '16px', display: 'block' }} 
              />
            ) : (
              <video 
                src={currentItem.src} 
                autoPlay 
                loop 
                muted 
                playsInline 
                preload="auto"
                style={{ width: '320px', height: '420px', objectFit: 'cover', borderRadius: '16px', display: 'block' }} 
              />
            )}
          </div>

          <p style={{ fontSize: '1.0rem', color: '#aaa', marginTop: '15px' }}>
            Воспоминание ({currentMediaIndex + 1} / {mediaList.length}) ✨
          </p>
        </div>
      )}

      {step === 5 && (
        <div style={{ zIndex: 10, textAlign: 'center', animation: 'popUp 0.6s ease-out' }}>
          <h2 style={{ fontSize: '2.5rem', color: '#ff3385', marginBottom: '25px', textShadow: '0 0 30px rgba(255,51,133,0.7)' }}>
            Надеюсь, тебе понравилось! ❤️
          </h2>
          <div 
            onClick={handleRestart}
            style={{
              background: '#ff3385',
              color: '#fff',
              padding: '18px 40px',
              borderRadius: '40px',
              fontSize: '1.4rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 0 35px rgba(255, 51, 133, 0.8)',
              animation: 'pulse 1.5s infinite',
              display: 'inline-block'
            }}
          >
            Повторить 🔄
          </div>
        </div>
      )}

    </div>
  );
}
