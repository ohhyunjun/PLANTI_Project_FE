import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// .env로 부터 백엔드 URL 받아오기
const BACKEND_API_BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_URL;

function JoinPage() {

    const navigate = useNavigate();

    // 회원가입 변수
    const [username, setUsername] = useState("");
    const [isUsernameValid, setIsUsernameValid] = useState(null); // null: 검사 전, true: 사용 가능, false: 중복
    const [password, setPassword] = useState("");
    // const [nickname, setNickname] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

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
                    //credentials: "include", 제미나이가 jwt 방식에서는 불필요하다고 해서
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

        if (
            username.length < 4 || username.length > 20 ||
            password.length < 8 || password.length > 20 ||
            //nickname.trim() === "" ||
            email.trim() === ""
        ) {
            setError("입력값을 다시 확인해주세요. (모든 항목은 필수이며, ID/비밀번호는 최소 4자)");
            return;
        }

        try {
            const res = await fetch(`${BACKEND_API_BASE_URL}/api/auth/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                //credentials: "include",
                body: JSON.stringify({ username, password, /*nickname,*/ email }),
            });

            if (res.ok) {
                // 성공했을 때도 서버가 보낸 응답 본문을 완전히 읽어줍니다.
                const successMessage = await res.text();
                console.log("서버 응답:", successMessage); // "회원 가입 성공" 메시지 확인
                navigate("/auth/login");
            } else {
                // 실패했을 때는 서버가 보낸 에러 메시지를 읽어서 표시합니다.
                const errorMessage = await res.text();
                throw new Error(errorMessage || "회원가입 실패");
            }
        } catch {
            setError("회원가입 중 오류가 발생했습니다.");
        }
    };

    // 페이지
    return (
        <div>
            <h1>회원 가입</h1>

            <form onSubmit={handleSignUp}>
                <label>아이디</label>
                <input
                    type="text"
                    placeholder="아이디 (4자 이상 20자 이하)"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    minLength={4}
                    maxLength={20}
                />
                {username.length >= 4 && isUsernameValid === false && (
                    <p>이미 사용 중인 아이디입니다.</p>
                )}
                {username.length >= 4 && isUsernameValid === true && (
                    <p>사용 가능한 아이디입니다.</p>
                )}

                <label>비밀번호</label>
                <input
                    type="password"
                    placeholder="비밀번호 (8자 이상 20자 이하)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    maxLength={20}
                />

                {/* <label>이름</label>
                <input
                    type="text"
                    placeholder="이름"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    required
                /> */}

                <label>이메일</label>
                <input
                    type="email"
                    placeholder="이메일 주소"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                {error && <p>{error}</p>}

                <button type="submit" disabled={isUsernameValid !== true}>회원가입</button>
                <div className="back" onClick={() => navigate("/auth/loginchoice")}>
                ← 로그인선택화면으로
                </div>          
            </form>
        </div>
    );
}

export default JoinPage; 