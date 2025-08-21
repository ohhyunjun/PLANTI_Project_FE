import React from "react";
import { useNavigate } from "react-router-dom";

function LoginChoicePage() {
  const navigate = useNavigate();

  return (
    <div className="login">
      <div className="login-top">
        <img
          src="https://via.placeholder.com/120x200?text=Plant"
          alt="Plant"
        />
      </div>
      <div className="login-main">
        <h2>Planti</h2>
        <button className="btn-login" onClick={() => navigate("/auth/login")}>
          Login
        </button>
        <button className="btn-register" onClick={() => navigate("/auth/signup")}>
          회원가입
        </button>
        <div className="notice">
          계속 진행하면 이용약관과 개인정보 처리방침에 동의하는 것으로 간주됩니다.
        </div>
        <div className="back" onClick={() => navigate("/")}>
          ← 처음 화면으로
        </div>

      </div> {/* ✅ login-main div 닫아줌 */}
    </div>
  );
}

export default LoginChoicePage;  {/* ✅ 함수 이름과 export 이름 일치 */}

