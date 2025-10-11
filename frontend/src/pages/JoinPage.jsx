import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Eye, EyeOff } from "lucide-react";

// .env로 부터 백엔드 URL 받아오기
const BACKEND_API_BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_URL;

function JoinPage() {
  const navigate = useNavigate();

  // 회원가입 변수
  const [username, setUsername] = useState("");
  const [isUsernameValid, setIsUsernameValid] = useState(null);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  // username 입력창 변경 이벤트
  useEffect(() => {
    // username 중복 확인
    const checkUsername = async () => {
      if (username.length < 4) {
        setIsUsernameValid(null);
        return;
      }

      try {
        const res = await fetch(`${BACKEND_API_BASE_URL}/api/auth/check-username`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username }),
        });

        const data = await res.json();
        setIsUsernameValid(!data.isTaken);
      } catch {
        setIsUsernameValid(null);
      }
    };

    const delay = setTimeout(checkUsername, 300);
    return () => clearTimeout(delay);
  }, [username]);

  // 회원 가입 이벤트
  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");

    // 아이디 중복 체크
    if (isUsernameValid !== true) {
      setError("사용할 수 없는 아이디입니다.");
      return;
    }

    // 비밀번호 확인 체크
    if (password !== passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (
      username.length < 4 || username.length > 20 ||
      password.length < 8 || password.length > 20 ||
      email.trim() === ""
    ) {
      setError("입력값을 다시 확인해주세요. (모든 항목은 필수이며, ID는 4자 이상, 비밀번호는 8자 이상)");
      return;
    }

    try {
      const res = await fetch(`${BACKEND_API_BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, email }),
      });

      if (res.ok) {
        const successMessage = await res.text();
        console.log("서버 응답:", successMessage);
        navigate("/auth/login");
      } else {
        const errorMessage = await res.text();
        throw new Error(errorMessage || "회원가입 실패");
      }
    } catch {
      setError("회원가입 중 오류가 발생했습니다.");
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
        }}>등록 화면</span>
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
        }}>안녕하세요!</h1>
        
        <h2 style={{
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#000',
          marginBottom: '24px',
          marginTop: '0'
        }}>시작하려면 등록해 주세요!</h2>

        <form onSubmit={handleSignUp} style={{
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
              placeholder="ID (4자 이상 20자 이하)"
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
              minLength={4}
              maxLength={20}
            />
            {username.length >= 4 && isUsernameValid === false && (
              <p style={{
                fontSize: '12px',
                color: '#ef4444',
                margin: '0'
              }}>이미 사용 중인 아이디입니다.</p>
            )}
            {username.length >= 4 && isUsernameValid === true && (
              <p style={{
                fontSize: '12px',
                color: '#10b981',
                margin: '0'
              }}>사용 가능한 아이디입니다.</p>
            )}
          </div>

          {/* 이메일 입력 */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}>
            <label style={{
              fontSize: '13px',
              color: '#374151',
              fontWeight: '500'
            }}>이메일</label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
                placeholder="PW (8자 이상 20자 이하)"
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
                minLength={8}
                maxLength={20}
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

          {/* 비밀번호 확인 입력 */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '6px'
          }}>
            <label style={{
              fontSize: '13px',
              color: '#374151',
              fontWeight: '500'
            }}>비밀번호 확인</label>
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center'
            }}>
              <input
                type={showPasswordConfirm ? "text" : "password"}
                placeholder="PW 확인"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
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
                onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
              >
                {showPasswordConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
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

          {/* 회원가입 버튼 */}
          <button
            type="submit"
            disabled={isUsernameValid !== true}
            style={{
              width: '100%',
              backgroundColor: isUsernameValid === true ? '#10b981' : '#d1d5db',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              padding: '12px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: isUsernameValid === true ? 'pointer' : 'not-allowed',
              transition: 'background-color 0.2s',
              marginTop: '8px'
            }}
            onMouseEnter={(e) => {
              if (isUsernameValid === true) {
                e.target.style.backgroundColor = '#059669';
              }
            }}
            onMouseLeave={(e) => {
              if (isUsernameValid === true) {
                e.target.style.backgroundColor = '#10b981';
              }
            }}
          >
            회원가입
          </button>
        </form>

        {/* 로그인 링크 */}
        <div style={{
          fontSize: '13px',
          color: '#6b7280',
          textAlign: 'center',
          marginTop: '20px'
        }}>
          이미 계정이 있으신가요?{' '}
          <span
            style={{
              color: '#10b981',
              fontWeight: '600',
              cursor: 'pointer',
              textDecoration: 'none'
            }}
            onClick={() => navigate("/auth/login")}
          >
            로그인
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

export default JoinPage;