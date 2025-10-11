import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { usePosts } from "../context/PostContext"; // 로컬 Context 대신 API 통신으로 변경
import { createPost } from "../api/community"; // 👈 API 함수 임포트

function CommunityCreatePage() {
    const navigate = useNavigate();
    // const { addPost } = usePosts(); // 👈 로컬 Context 사용하지 않음
    const [title, setTitle] = useState(""); // 👈 DTO에 'title' 필드가 있으므로 추가
    const [content, setContent] = useState("");
    const [imageFile, setImageFile] = useState(null); // 👈 File 객체를 저장할 상태 추가
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null); // 👈 이미지 미리보기 URL 상태 변경

    // 이미지 선택 시 File 객체와 미리보기 URL 저장
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // 이전 미리보기 URL 해제
            if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
            
            setImageFile(file); // File 객체 저장
            setImagePreviewUrl(URL.createObjectURL(file)); // 미리보기 URL 생성 및 저장
        } else {
            // 파일 선택 취소 시 초기화
            setImageFile(null);
            if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
            setImagePreviewUrl(null);
        }
    };
    
    // 게시글 작성 처리 (백엔드 연동)
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // title, content, imageFile 중 하나라도 있어야 함
        if (!title.trim() && !content.trim() && !imageFile) {
             alert("제목, 내용 또는 이미지를 하나 이상 입력해주세요.");
             return;
        }

        // 1. FormData 객체 생성 (백엔드가 multipart/form-data를 요구함)
        const formData = new FormData();
        
        // 2. PostRequestDto 객체를 JSON 문자열로 변환하여 'postData' 키로 추가
        // 백엔드 PostController.java의 @RequestPart("postData")에 대응
        const postData = {
            title: title.trim(),
            content: content.trim(),
        };
        // Blob 타입으로 변환하여 추가해야 Spring Boot가 JSON으로 정확히 파싱함
        formData.append(
            "postData", 
            new Blob([JSON.stringify(postData)], { type: "application/json" })
        );

        // 3. 이미지 파일이 있으면 'file' 키로 추가
        // 백엔드 PostController.java의 @RequestPart(value = "file")에 대응
        if (imageFile) {
            formData.append("file", imageFile);
        }

        try {
            // 4. API 호출
            const response = await createPost(formData);
            console.log("게시글 생성 성공:", response.data);

            // 5. 성공 후 상태 초기화 및 페이지 이동
            setTitle("");
            setContent("");
            if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
            setImageFile(null);
            setImagePreviewUrl(null);
            
            // 성공적으로 글을 작성한 후 전체 커뮤니티 페이지로 이동하거나,
            // 백엔드에서 받은 새 게시글 ID를 사용하여 상세 페이지로 이동할 수 있습니다.
            navigate("/main/community/following"); 
            // 또는 navigate(`/main/community/posts/${response.data.id}`);
            
        } catch (error) {
            console.error("게시글 생성 실패:", error.response ? error.response.data : error.message);
            alert("게시글 작성에 실패했습니다. 다시 시도해 주세요.");
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-900 max-w-sm mx-auto shadow-2xl">
            {/* 상단 헤더 */}
            <header className="sticky top-0 flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-gray-900 z-10">
                <button 
                    onClick={() => navigate(-1)} 
                    className="text-2xl font-bold text-white hover:text-gray-400 transition-colors"
                >
                    ←
                </button>
                <h2 className="text-xl font-bold text-white">새 글 작성</h2>
                <button 
                    onClick={handleSubmit} 
                    className="text-lg font-bold px-3 py-1 rounded text-green-400 hover:text-green-300 transition-colors disabled:opacity-50"
                    disabled={!title.trim() && !content.trim() && !imageFile} // 👈 title.trim() 조건 추가
                >
                    게시
                </button>
            </header>

            {/* 작성 영역 */}
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col p-4 space-y-5">
                {/* 제목 입력 필드 추가 */}
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="제목을 입력하세요 (선택 사항)"
                    className="w-full bg-gray-800 text-gray-200 placeholder-gray-500 border border-gray-700 rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-green-500"
                />

                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="무슨 생각을 하고 있나요?"
                    className="w-full h-40 bg-gray-800 text-gray-200 placeholder-gray-500 border border-gray-700 rounded-lg p-3 resize-none focus:outline-none focus:ring-1 focus:ring-green-500"
                />
                
                {/* 🌟 이미지 미리보기 */}
                {imagePreviewUrl && (
                    <div className="flex justify-center p-2 bg-gray-800 rounded-xl shadow-lg border border-gray-700">
                        <img 
                            src={imagePreviewUrl} 
                            alt="미리보기" 
                            style={{ 
                                width: "302.47px", 
                                height: "256.5px", 
                                objectFit: "cover" // 👈 fill 대신 cover를 추천합니다 (이미지 비율 유지)
                            }} 
                            className="rounded-lg max-w-full" 
                        />
                    </div>
                )}
                
                {/* 사진 추가 버튼 */}
                <label className="cursor-pointer text-center py-2 text-red-400 font-semibold border-t border-gray-800 hover:bg-gray-800 transition-colors">
                    <span className="flex items-center justify-center space-x-2">
                        <span className="text-xl">📷</span>
                        <span>사진 추가</span>
                    </span>
                    <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleImageChange} 
                        // 이미지가 등록된 경우 다시 눌러도 파일 선택 창이 뜨도록 value를 clear하지 않음
                    />
                </label>
            </form>
        </div>
    );
}

export default CommunityCreatePage;