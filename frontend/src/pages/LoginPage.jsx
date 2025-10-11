import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";

// .env로 부터 백엔드 URL 받아오기
const BACKEND_API_BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_URL;

function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (username === "" || password === "") {
      setError("아이디와 비밀번호를 입력하세요.");
      return;
    }

    try {
      const res = await fetch(`${BACKEND_API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) throw new Error("로그인 실패");

      const data = await res.json();
      localStorage.setItem("accessToken", data.accessToken);

      navigate("/main");
    } catch (err) {
      console.error("로그인 실패:", err);
      setError("아이디 또는 비밀번호가 틀렸습니다.");
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      display: 'flex',
      flexDirection: 'column',
      padding: '16px'
    }}>
      {/* 헤더 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '20px'
      }}>
        <button 
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            display: 'flex',
            alignItems: 'center'
          }}
          onClick={() => navigate("/auth/loginchoice")}
        >
          <ChevronLeft size={20} color="#9ca3af" />
        </button>
        <span style={{
          fontSize: '13px',
          color: '#9ca3af'
        }}>로그인 화면</span>
      </div>

      {/* 메인 콘텐츠 */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '24px 20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <h1 style={{
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#000',
          marginBottom: '4px',
          marginTop: '0'
        }}>환영합니다!</h1>
        
        <h2 style={{
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#000',
          marginBottom: '24px',
          marginTop: '0'
        }}>만나서 반가워요!</h2>

        <form onSubmit={handleLogin} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {/* 아이디 입력 */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}>
            <label style={{
              fontSize: '13px',
              color: '#374151',
              fontWeight: '500'
            }}>아이디</label>
            <input
              type="text"
              placeholder="ID"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#10b981'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              required
            />
          </div>

          {/* 비밀번호 입력 */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}>
            <label style={{
              fontSize: '13px',
              color: '#374151',
              fontWeight: '500'
            }}>비밀번호</label>
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="PW"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  paddingRight: '44px',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  fontSize: '14px',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#10b981'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                required
              />
              <button
                type="button"
                style={{
                  position: 'absolute',
                  right: '10px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  color: '#9ca3af'
                }}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* 비밀번호 찾기 */}
          <div style={{
            fontSize: '11px',
            color: '#6b7280',
            textAlign: 'right',
            marginTop: '-8px'
          }}>
            비밀번호를 잊으셨나요?
          </div>

          {/* 에러 메시지 */}
          {error && (
            <p style={{
              fontSize: '13px',
              color: '#ef4444',
              textAlign: 'center',
              padding: '10px',
              backgroundColor: '#fee2e2',
              borderRadius: '6px',
              margin: '0'
            }}>{error}</p>
          )}

          {/* 로그인 버튼 */}
          <button
            type="submit"
            style={{
              width: '100%',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '12px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              marginTop: '8px'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#059669'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#10b981'}
          >
            로그인
          </button>
        </form>

        {/* 회원가입 링크 */}
        <div style={{
          fontSize: '13px',
          color: '#6b7280',
          textAlign: 'center',
          marginTop: '20px'
        }}>
          계정이 없으신가요?{' '}
          <span
            style={{
              color: '#10b981',
              fontWeight: '600',
              cursor: 'pointer',
              textDecoration: 'none'
            }}
            onClick={() => navigate("/auth/signup")}
          >
            지금 등록해 주세요
          </span>
        </div>

        {/* 뒤로가기 */}
        <div
          className="back"
          style={{
            fontSize: '13px',
            color: '#6b7280',
            textAlign: 'center',
            marginTop: '12px',
            cursor: 'pointer'
          }}
          onClick={() => navigate("/auth/loginchoice")}
        >
          ← 로그인선택화면으로
        </div>
      </div>
    </div>
  );
}

export default LoginPage;