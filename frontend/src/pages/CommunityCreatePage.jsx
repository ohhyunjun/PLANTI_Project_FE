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
    if (file) setImage(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    addPost({ author: "나", content, image });
    navigate("/main/community/following");
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* 상단 헤더 */}
      <header className="flex items-center justify-between px-4 py-2 shadow-md bg-white">
        <button onClick={() => navigate(-1)} className="text-xl">←</button>
        <h2 className="text-lg font-semibold">새 글 작성</h2>
        <button onClick={handleSubmit} className="text-blue-600 font-bold">게시</button>
      </header>

      {/* 작성 영역 */}
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col p-4 space-y-4">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="무슨 생각을 하고 있나요?"
          className="w-full h-40 border rounded p-2 resize-none"
        />
        {image && <img src={image} alt="미리보기" className="rounded w-full" />}
        <label className="cursor-pointer text-blue-500">
          📷 사진 추가
          <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
        </label>
      </form>
    </div>
  );
}

export default CommunityCreatePage;
