import React from "react";
import { useNavigate } from "react-router-dom";


// Pretendard 폰트 추가
const fontStyles = `
@font-face {
    font-family: 'Pretendard';
    src: url('https://cdn.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff') format('woff');
    font-weight: 400;
    font-display: swap;
}

@font-face {
    font-family: 'Pretendard';
    src: url('https://cdn.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-SemiBold.woff') format('woff');
    font-weight: 600;
    font-display: swap;
}

@font-face {
    font-family: 'Pretendard';
    src: url('https://cdn.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Bold.woff') format('woff');
    font-weight: 700;
    font-display: swap;
}

* {
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif;
}
`;

function IndexPage() {
  const navigate = useNavigate();

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f0f9f4',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px'
    },
    content: {
      maxWidth: '1200px',
      width: '100%',
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '60px',
      alignItems: 'center'
    },
    leftSection: {
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '20px'
    },
    logoIcon: {
      width: '50px',
      height: '50px',
      backgroundColor: '#1a5c42',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '28px'
    },
    logoText: {
      fontSize: '36px',
      fontWeight: 'bold',
      color: '#1a5c42',
      letterSpacing: '2px'
    },
    title: {
      fontSize: '32px',
      fontWeight: '600',
      color: '#2563eb',
      marginBottom: '12px'
    },
    description: {
      fontSize: '16px',
      color: '#4b5563',
      lineHeight: '1.6',
      marginBottom: '20px'
    },
    loginButton: {
      backgroundColor: '#10b981',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      padding: '14px 32px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      marginBottom: '24px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
    },
    storeButtons: {
      display: 'flex',
      gap: '12px',
      flexWrap: 'wrap'
    },
    storeButton: {
      backgroundColor: '#000',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '12px 24px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      cursor: 'not-allowed',
      opacity: 0.9
    },
    rightSection: {
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'center',
      gap: '20px',
      position: 'relative'
    },
    plantImage1: {
      width: '200px',
      height: '240px',
      backgroundColor: '#e5e7eb',
      borderRadius: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '80px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      overflow: 'hidden'
    },
    plantImage2: {
      width: '220px',
      height: '280px',
      backgroundColor: '#e5e7eb',
      borderRadius: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '100px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      overflow: 'hidden'
    },
    plantImg: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  };

  return (
    <div className="landing" style={styles.container}>
      <style>{fontStyles}</style>
      <div style={styles.content}>
        {/* 왼쪽 섹션 */}
        <div style={styles.leftSection}>
          {/* 로고 */}
          <div style={styles.logo}>
            <div style={styles.logoIcon}>🌱</div>
            <span style={styles.logoText}>PLANTI</span>
          </div>

          {/* 제목 */}
          <h1 style={styles.title}>Plant Care Application</h1>

          {/* 설명 */}
          <p style={styles.description}>
            Monitor soil moisture, temperature, and light. Automate watering and
            lighting schedules. Connect your custom device in seconds.
          </p>

          {/* 로그인 버튼 */}
          <button 
            className="goto-loginchoicepage"
            style={styles.loginButton}
            onClick={() => navigate("/auth/loginchoice")}
            onMouseEnter={e => e.target.style.backgroundColor = '#059669'}
            onMouseLeave={e => e.target.style.backgroundColor = '#10b981'}
          >
            로그인 / 회원가입으로 이동
          </button>

          {/* 스토어 버튼들 */}
          <div className="store-btns" style={styles.storeButtons}>
            <button style={styles.storeButton}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09997 22C7.78997 22.05 6.79997 20.68 5.95997 19.47C4.24997 17 2.93997 12.45 4.69997 9.39C5.56997 7.87 7.12997 6.91 8.81997 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z"/>
              </svg>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '10px' }}>Download on the</span>
                <span style={{ fontSize: '16px', fontWeight: 'bold' }}>App Store</span>
              </div>
            </button>

            <button style={styles.storeButton}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.206 12l2.492-2.491zM5.864 2.658L16.802 8.99l-2.303 2.303-8.635-8.635z"/>
              </svg>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '10px' }}>GET IT ON</span>
                <span style={{ fontSize: '16px', fontWeight: 'bold' }}>Google Play</span>
              </div>
            </button>
          </div>
        </div>

        {/* 오른쪽 섹션 - 식물 이미지 */}
        <div style={styles.rightSection}>
          <div style={styles.plantImage1}>
            <img 
              src="https://via.placeholder.com/200x240?text=Plant+1" 
              alt="Plant 1"
              style={styles.plantImg}
            />
          </div>
          <div style={styles.plantImage2}>
            <img 
              src="https://via.placeholder.com/220x280?text=Plant+2" 
              alt="Plant 2"
              style={styles.plantImg}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default IndexPage;