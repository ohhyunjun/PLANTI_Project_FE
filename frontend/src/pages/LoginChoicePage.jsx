import React from "react";
import { useNavigate } from "react-router-dom";
import logoImage from "../assets/logo.png"; // 로고 이미지 import 추가
import plantsImage from "../assets/plants.png"; // 식물 이미지 import 추가

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


function LoginChoicePage() {
  const navigate = useNavigate();

  const styles = {
    container: {
      minHeight: '100vh',
      maxWidth: '412px',
      margin: '0 auto',
      backgroundColor: '#f8f9fa',
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
      position: 'relative'
    },
    imageSection: {
      position: 'relative',
      width: '100%',
      height: '45vh',
      minHeight: '300px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden'
    },
    plantsImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      objectPosition: 'center'
    },
    gradientOverlayOnImage: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: '100%',
      height: '40%',
      background: 'linear-gradient(to top, rgba(248, 249, 250, 1) 0%, rgba(248, 249, 250, 0.9) 30%, rgba(248, 249, 250, 0) 100%)',
      pointerEvents: 'none'
    },
    contentSection: {
      flex: 1,
      padding: '40px 30px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      backgroundColor: '#f8f9fa'
    },
    logo: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: '40px'
    },
    logoImage: {
      width: '80px',
      height: '80px',
      objectFit: 'contain',
      marginBottom: '4px'
    },
    logoText: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#000',
      letterSpacing: '2px'
    },
    buttonContainer: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      maxWidth: '350px'
    },
    loginButton: {
      width: '100%',
      backgroundColor: '#10b981',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      padding: '14px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    },
    signupButton: {
      width: '100%',
      backgroundColor: 'white',
      color: '#000',
      border: '2px solid #e5e7eb',
      borderRadius: '8px',
      padding: '14px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'border-color 0.2s, background-color 0.2s'
    },
    notice: {
      fontSize: '12px',
      color: '#6b7280',
      textAlign: 'center',
      lineHeight: '1.5',
      marginTop: '20px',
      padding: '0 10px',
      maxWidth: '350px'
    },
    backLink: {
      fontSize: '14px',
      color: '#6b7280',
      textAlign: 'center',
      marginTop: '16px',
      cursor: 'pointer',
      textDecoration: 'none'
    }
  };

  return (
    <div className="login" style={styles.container}>
      <style>{fontStyles}</style>
      {/* 상단 식물 이미지 섹션 */}
      <div className="login-top" style={styles.imageSection}>
        <img 
          src={plantsImage} 
          alt="Plants"
          style={styles.plantsImage}
        />
        {/* 이미지 위에 그라데이션 오버레이 */}
        <div style={styles.gradientOverlayOnImage}></div>
      </div>

      {/* 메인 콘텐츠 섹션 */}
      <div className="login-main" style={styles.contentSection}>
        {/* 로고 */}
        <div style={styles.logo}>
          <img 
            src={logoImage} 
            alt="PLANTI Logo"
            style={styles.logoImage}
          />
          <h2 style={styles.logoText}>PLANTI</h2>
        </div>

        {/* 버튼 컨테이너 */}
        <div style={styles.buttonContainer}>
          <button 
            className="btn-login" 
            style={styles.loginButton}
            onClick={() => navigate("/auth/login")}
            onMouseEnter={e => e.target.style.backgroundColor = '#059669'}
            onMouseLeave={e => e.target.style.backgroundColor = '#10b981'}
          >
            로그인
          </button>
          
          <button 
            className="btn-register" 
            style={styles.signupButton}
            onClick={() => navigate("/auth/signup")}
            onMouseEnter={e => {
              e.target.style.borderColor = '#10b981';
              e.target.style.backgroundColor = '#f0fdf4';
            }}
            onMouseLeave={e => {
              e.target.style.borderColor = '#e5e7eb';
              e.target.style.backgroundColor = 'white';
            }}
          >
            회원가입
          </button>
        </div>

        {/* 안내 문구 */}
        <div className="notice" style={styles.notice}>
          계속 진행하면 이용약관과 개인정보 처리방침에 동의하는 것으로 간주됩니다.
        </div>

        {/* 뒤로가기 */}
        <div 
          className="back" 
          style={styles.backLink}
          onClick={() => navigate("/")}
        >
          ← 처음 화면으로
        </div>
      </div>
    </div>
  );
}

export default LoginChoicePage;