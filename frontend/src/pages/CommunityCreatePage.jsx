import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost } from "../api/community";

function CommunityCreatePage() {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
    const [error, setError] = useState("");

    // ✅ 수정: 이미지 선택 처리 + input 초기화
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

    // ✅ 추가: 이미지 삭제 핸들러
    const handleImageRemove = () => {
        if (imagePreviewUrl) {
            URL.revokeObjectURL(imagePreviewUrl);
        }
        setImageFile(null);
        setImagePreviewUrl(null);
        // ✅ 핵심: input file 초기화
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

    return (
        <div className="min-h-screen flex flex-col bg-gray-900 max-w-sm mx-auto shadow-2xl">
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
                    disabled={!title.trim() && !content.trim() && !imageFile}
                >
                    게시
                </button>
            </header>

            <form onSubmit={handleSubmit} className="flex-1 flex flex-col p-4 space-y-5">
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
                
                {imagePreviewUrl && (
                    <div className="flex justify-center p-2 bg-gray-800 rounded-xl shadow-lg border border-gray-700 relative">
                        <img 
                            src={imagePreviewUrl} 
                            alt="미리보기" 
                            className="rounded-lg max-w-full"
                            style={{ 
                                width: "302.47px", 
                                height: "256.5px", 
                                objectFit: "cover"
                            }} 
                        />
                        {/* ✅ 수정: onClick에서 handleImageRemove 호출 */}
                        <button
                            type="button"
                            onClick={handleImageRemove}
                            className="absolute top-4 right-4 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600"
                        >
                            ✕
                        </button>
                    </div>
                )}
                
                {/* ✅ 수정: id 추가 */}
                <label className="cursor-pointer text-center py-2 text-red-400 font-semibold border-t border-gray-800 hover:bg-gray-800 transition-colors">
                    <span className="flex items-center justify-center space-x-2">
                        <span className="text-xl">📷</span>
                        <span>사진 추가</span>
                    </span>
                    <input 
                        id="fileInput"
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleImageChange}
                    />
                </label>

                {error && (
                    <div className="text-red-400 text-sm text-center bg-red-900 bg-opacity-30 p-2 rounded">
                        {error}
                    </div>
                )}
            </form>
        </div>
    );
}

export default CommunityCreatePage;