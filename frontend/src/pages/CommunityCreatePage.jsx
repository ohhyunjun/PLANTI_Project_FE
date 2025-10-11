import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePosts } from "../context/PostContext";

function CommunityCreatePage() {
    const navigate = useNavigate();
    const { addPost } = usePosts(); 
    const [content, setContent] = useState("");
    const [image, setImage] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (image) URL.revokeObjectURL(image);
            setImage(URL.createObjectURL(file));
        }
    };
    
    // 컴포넌트 언마운트 시 URL 해제 (클린업)
    // useEffect(() => {
    //     return () => {
    //         if (image) URL.revokeObjectURL(image);
    //     };
    // }, [image]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!content.trim() && !image) return;

        const newPost = { 
            author: "나", 
            content: content || "(사진)", 
            image: image,
            createdAt: new Date().toISOString()
        };
        addPost(newPost);
        
        setContent("");
        if (image) URL.revokeObjectURL(image);
        setImage(null);
        
        navigate("/main/community/following");
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
                    disabled={!content.trim() && !image}
                >
                    게시
                </button>
            </header>

            {/* 작성 영역 */}
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col p-4 space-y-5">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="무슨 생각을 하고 있나요?"
                    className="w-full h-40 bg-gray-800 text-gray-200 placeholder-gray-500 border border-gray-700 rounded-lg p-3 resize-none focus:outline-none focus:ring-1 focus:ring-green-500"
                />
                
                {/* 🌟 이미지 미리보기 (크기 400x400 고정, 비율 무시) */}
                {image && (
                    <div className="flex justify-center p-2 bg-gray-800 rounded-xl shadow-lg border border-gray-700">
                        <img 
                            src={image} 
                            alt="미리보기" 
                            style={{ 
                                width: "302.47px", 
                                height: "px", 
                                objectFit: "fill" // 👈 변경된 부분: 비율 무시하고 400x400 채우기
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
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
            </form>
        </div>
    );
}

export default CommunityCreatePage;