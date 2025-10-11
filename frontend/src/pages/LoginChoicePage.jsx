import React from "react";
import { useNavigate } from "react-router-dom";

function LoginChoicePage() {
  const navigate = useNavigate();

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    },
    card: {
      backgroundColor: 'white',
      borderRadius: '16px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      width: '100%',
      maxWidth: '400px',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    },
    imageSection: {
      backgroundColor: '#e8f4f8',
      padding: '40px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '280px'
    },
    plantImages: {
      display: 'flex',
      gap: '20px',
      alignItems: 'flex-end'
    },
    plantContainer1: {
      width: '120px',
      height: '160px',
      backgroundColor: '#fff',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    },
    plantContainer2: {
      width: '100px',
      height: '140px',
      backgroundColor: '#fff',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    },
    plantImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      borderRadius: '12px'
    },
    contentSection: {
      padding: '40px 30px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
    logo: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: '40px'
    },
    logoIcon: {
      width: '50px',
      height: '50px',
      backgroundColor: '#000',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '28px',
      marginBottom: '12px'
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
      gap: '12px'
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
      padding: '0 10px'
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
      <div style={styles.card}>
        {/* 상단 이미지 섹션 */}
        <div className="login-top" style={styles.imageSection}>
          <div style={styles.plantImages}>
            <div style={styles.plantContainer1}>
              <img 
                src="https://via.placeholder.com/120x160?text=Plant+1" 
                alt="Plant 1"
                style={styles.plantImage}
              />
            </div>
            <div style={styles.plantContainer2}>
              <img 
                src="https://via.placeholder.com/100x140?text=Plant+2" 
                alt="Plant 2"
                style={styles.plantImage}
              />
            </div>
          </div>
        </div>

        {/* 메인 콘텐츠 섹션 */}
        <div className="login-main" style={styles.contentSection}>
          {/* 로고 */}
          <div style={styles.logo}>
            <div style={styles.logoIcon}>🌱</div>
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
    </div>
  );
}

export default LoginChoicePage;