import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../api/community";
import { Home, Users, Heart, Bell } from "lucide-react";
import apiClient from "../api/apiClient";

function CommunityCreatePage() {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
    const [error, setError] = useState("");
    const [showDraftSaved, setShowDraftSaved] = useState(false);
    const [userId, setUserId] = useState("");

    // 사용자 정보 및 임시 저장본 불러오기
    useEffect(() => {
        // 다양한 localStorage 키에서 로그인 아이디 찾기
        let username = null;
        
        // 1. 직접 저장된 userId 확인
        username = localStorage.getItem('userId');
        
        // 2. loginId 확인
        if (!username) {
            username = localStorage.getItem('loginId');
        }
        
        // 3. username 확인
        if (!username) {
            username = localStorage.getItem('username');
        }
        
        // 4. userInfo 객체에서 찾기
        if (!username) {
            const userInfo = localStorage.getItem('userInfo');
            if (userInfo) {
                try {
                    const user = JSON.parse(userInfo);
                    username = user.userId || user.username || user.loginId || user.id || user.email;
                } catch (e) {
                    console.error("userInfo 파싱 실패:", e);
                }
            }
        }
        
        // 5. user 객체에서 찾기
        if (!username) {
            const user = localStorage.getItem('user');
            if (user) {
                try {
                    const userData = JSON.parse(user);
                    username = userData.userId || userData.username || userData.loginId || userData.id;
                } catch (e) {
                    console.error("user 파싱 실패:", e);
                }
            }
        }
        
        // 디버깅: localStorage에 저장된 모든 키 출력
        console.log("=== localStorage 확인 ===");
        console.log("localStorage keys:", Object.keys(localStorage));
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            console.log(`${key}:`, localStorage.getItem(key));
        }
        console.log("최종 username:", username);
        console.log("=======================");
        
        // 최종 설정
        if (username) {
            setUserId(`@${username}`);
        } else {
            setUserId("@사용자");
        }

        // 임시 저장본 불러오기
        const savedDraft = localStorage.getItem('planti_draft');
        if (savedDraft) {
            const draft = JSON.parse(savedDraft);
            setTitle(draft.title || "");
            setContent(draft.content || "");
            if (draft.imageUrl) {
                setImagePreviewUrl(draft.imageUrl);
            }
        }
    }, []);

    // 임시 저장본 저장
    const saveDraft = () => {
        const draft = {
            title: title.trim(),
            content: content.trim(),
            imageUrl: imagePreviewUrl,
            savedAt: new Date().toISOString()
        };
        localStorage.setItem('planti_draft', JSON.stringify(draft));
        setShowDraftSaved(true);
        setTimeout(() => setShowDraftSaved(false), 2000);
    };

    // 임시 저장본 삭제
    const clearDraft = () => {
        localStorage.removeItem('planti_draft');
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (imagePreviewUrl) {
                URL.revokeObjectURL(imagePreviewUrl);
            }
            setImageFile(file);
            setImagePreviewUrl(URL.createObjectURL(file));
        } else {
            setImageFile(null);
            if (imagePreviewUrl) {
                URL.revokeObjectURL(imagePreviewUrl);
            }
            setImagePreviewUrl(null);
        }
    };

    const handleImageRemove = () => {
        if (imagePreviewUrl) {
            URL.revokeObjectURL(imagePreviewUrl);
        }
        setImageFile(null);
        setImagePreviewUrl(null);
        const fileInput = document.getElementById('fileInput');
        if (fileInput) {
            fileInput.value = '';
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        
        if (!title.trim() && !content.trim() && !imageFile) {
            alert("제목, 내용 또는 이미지를 하나 이상 입력해주세요.");
            return;
        }

        try {
            const postData = {
                title: title.trim(),
                content: content.trim(),
                file: imageFile
            };
            
            await createPost(postData);
            
            console.log("게시글 생성 성공");

            // 성공 시 임시 저장본 삭제
            clearDraft();

            setTitle("");
            setContent("");
            if (imagePreviewUrl) {
                URL.revokeObjectURL(imagePreviewUrl);
            }
            setImageFile(null);
            setImagePreviewUrl(null);
            
            navigate("/main/community"); 
            
        } catch (error) {
            console.error("게시글 생성 실패:", error.response ? error.response.data : error.message);
            setError("게시글 작성에 실패했습니다.");
        }
    };

    const handleCancel = () => {
        if (title.trim() || content.trim() || imageFile) {
            if (window.confirm("작성 중인 내용이 있습니다. 임시 저장하시겠습니까?")) {
                saveDraft();
            }
        }
        navigate(-1);
    };

    const styles = {
        container: {
            minHeight: '915px',
            maxWidth: '412px',
            margin: '0 auto',
            backgroundColor: '#f9fafb',
            display: 'flex',
            flexDirection: 'column',
            paddingBottom: '80px'
        },
        navbar: {
            position: 'fixed',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            maxWidth: '412px',
            backgroundColor: 'white',
            borderTop: '1px solid #e5e7eb',
            zIndex: 1000
        },
        navContainer: {
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            padding: '8px 0'
        },
        navButton: {
            backgroundColor: 'transparent',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            padding: '8px 16px',
            transition: 'color 0.2s'
        }
    };

    return (
        <div style={styles.container}>
            {/* 헤더 */}
            <header className="sticky top-0 flex items-center justify-between px-4 py-3 border-b border-green-100 bg-white z-10">
                <button 
                    onClick={handleCancel} 
                    className="text-base font-medium text-gray-700 hover:text-gray-900 transition-colors"
                >
                    취소
                </button>
                <h2 className="text-base font-bold text-gray-900">새로운 planti</h2>
                <button 
                    onClick={saveDraft}
                    className="text-base font-medium text-green-500 hover:text-green-600 transition-colors"
                >
                    임시저장
                </button>
            </header>

            {/* 임시 저장 알림 */}
            {showDraftSaved && (
                <div className="mx-4 mt-3 px-4 py-2 bg-green-50 border border-green-300 rounded-xl text-sm text-green-700 text-center font-medium shadow-sm">
                    ✓ 임시 저장되었습니다
                </div>
            )}

            {/* 알림 배너 */}
            <div className="mx-4 mt-3 mb-2 px-4 py-3 bg-green-50 border border-green-200 rounded-xl flex items-start justify-between shadow-sm">
                <div className="flex-1">
                    <p className="text-sm text-green-700">
                        스토리텔링 경고! 이제 스토리텔링 표시를 선택하여 더 많은 미디어를 스토리텔러로 표시할 수 있습니다.
                    </p>
                </div>
                <button className="ml-2 text-green-400 hover:text-green-600 text-lg font-bold">
                    ✕
                </button>
            </div>

            {/* 메인 컨텐츠 */}
            <div className="flex-1 overflow-y-auto px-4">
                {/* 프로필 및 입력 영역 박스 */}
                <div className="bg-white border border-green-100 rounded-xl p-4 shadow-sm">
                    {/* 프로필 섹션 */}
                    <div className="flex items-start space-x-3 mb-4">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 text-2xl">
                            👤
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-gray-900 text-base mb-1">{userId}</p>
                            
                            {/* 주제 입력 */}
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="주제 추가"
                                className="w-full text-sm text-gray-500 placeholder-gray-400 border-none outline-none mb-3 p-0 bg-transparent focus:ring-0"
                            />
                            
                            {/* 내용 입력 */}
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="새로운 소식이 있나요?"
                                className="w-full text-base text-gray-900 placeholder-gray-400 border-none outline-none resize-none bg-transparent focus:ring-0"
                                rows="6"
                            />

                            {/* 이미지 미리보기 */}
                            {imagePreviewUrl && (
                                <div className="mt-3 relative">
                                    <img 
                                        src={imagePreviewUrl} 
                                        alt="미리보기" 
                                        className="rounded-xl w-full object-cover border-2 border-green-100"
                                        style={{ maxHeight: "300px" }}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleImageRemove}
                                        className="absolute top-2 right-2 bg-red-500 bg-opacity-90 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-red-600 shadow-lg"
                                    >
                                        ✕
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 기능 아이콘 영역 - 별도 박스 */}
                    <div className="flex items-center space-x-5 pt-3 border-t border-green-100">
                        {/* 사진/영상 첨부 */}
                        <label className="cursor-pointer hover:opacity-70 transition-opacity">
                            <span className="text-2xl">📷</span>
                            <input 
                                id="fileInput"
                                type="file" 
                                accept="image/*,video/*" 
                                className="hidden" 
                                onChange={handleImageChange}
                            />
                        </label>

                        {/* GIF */}
                        <button type="button" className="cursor-pointer hover:opacity-70 transition-opacity text-2xl" title="GIF (준비 중)">
                            🎬
                        </button>

                        {/* 이모티콘 */}
                        <button type="button" className="cursor-pointer hover:opacity-70 transition-opacity text-2xl" title="이모티콘 (준비 중)">
                            😊
                        </button>

                        {/* 설문 */}
                        <button type="button" className="cursor-pointer hover:opacity-70 transition-opacity text-2xl" title="설문 (준비 중)">
                            📊
                        </button>

                        {/* 위치 */}
                        <button type="button" className="cursor-pointer hover:opacity-70 transition-opacity text-2xl" title="위치 (준비 중)">
                            📍
                        </button>
                    </div>
                </div>

                
            </div>

            {/* 하단 설정 및 게시 버튼 */}
            <div className="border-t border-green-100 bg-gray-50 px-4 pb-2">
                <div className="bg-white border border-green-100 rounded-xl p-4 shadow-sm mt-3">
                    <p className="text-sm text-gray-500 mb-3">누구에게나 답글 및 인용 허용</p>
                    
                    {error && (
                        <div className="mb-3 text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg border border-red-200">
                            {error}
                        </div>
                    )}

                    <button 
                        onClick={handleSubmit}
                        disabled={!title.trim() && !content.trim() && !imageFile}
                        className="w-full py-3 rounded-full font-semibold text-base transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-green-500 text-white hover:bg-green-600"
                    >
                        게시
                    </button>
                </div>
            </div>

            {/* 하단 네비게이션 바 */}
            <div style={styles.navbar}>
                <div style={styles.navContainer}>
                    <button
                        onClick={() => navigate('/main')}
                        style={{ ...styles.navButton, color: '#6b7280' }}
                    >
                        <Home size={24} strokeWidth={2} />
                        <span style={{ fontSize: '12px', fontWeight: '500' }}>홈</span>
                    </button>
                    
                    <button
                        onClick={() => navigate('/main/community')}
                        style={{ ...styles.navButton, color: '#10b981' }}
                    >
                        <Users size={24} strokeWidth={2} />
                        <span style={{ fontSize: '12px', fontWeight: '500' }}>커뮤니티</span>
                    </button>
                    
                    <button 
                        onClick={() => navigate('/community/mypage')}
                        style={{ ...styles.navButton, color: '#6b7280' }}
                    >
                        <Heart size={24} strokeWidth={2} />
                        <span style={{ fontSize: '12px', fontWeight: '500' }}>My Page</span>
                    </button>
                    
                    <button
                        onClick={() => navigate('/main/setting')}
                        style={{ ...styles.navButton, color: '#6b7280' }}
                    >
                        <Bell size={24} strokeWidth={2} />
                        <span style={{ fontSize: '12px', fontWeight: '500' }}>알림</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CommunityCreatePage;