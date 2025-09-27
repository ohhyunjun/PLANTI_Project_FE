import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { usePosts } from "../context/PostContext";
import downloadedImage from "../assets/strawberry.jpg";


function CommunityFollowingPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const { posts } = usePosts();

  const onSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/main/community/search?keyword=${query}`);
  };

  return (
    <div className="community min-h-screen flex flex-col bg-gray-50">
      {/* 상단 헤더 */}
      <header className="flex items-center justify-between px-4 py-2 shadow-md bg-white">
        <button onClick={() => navigate("/main/community")} className="text-xl font-bold">
          ←
        </button>
        <h2 className="text-lg font-semibold">팔로잉</h2>
        <div className="flex items-center space-x-3">
          <button title="알림">🔔</button>
          <button onClick={() => navigate("/main/setting")} title="메뉴">☰</button>
        </div>
      </header>

      {/* 검색창 */}
      <form className="flex items-center border-b px-4 py-2 bg-white" onSubmit={onSearch}>
        <input
          type="text"
          placeholder="아이디 검색"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 border rounded px-2 py-1 mr-2"
        />
        <button className="px-3 py-1 bg-blue-500 text-white rounded" type="submit">
          🔍
        </button>
      </form>

      {/* 배너 */}
      <div className="flex justify-center items-center py-4">
        <img
          src={downloadedImage}
          alt="배너 이미지"
          style={{ width: "400px", height: "400px", objectFit: "cover", borderRadius: "12px" }}
          className="shadow-md"
        />
      </div>

      {/* 게시글 */}
      <div className="flex-1 px-4 py-2 space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-white p-4 rounded shadow">
            <p className="font-bold">{post.author}</p>
            <p className="mt-1">{post.content}</p>
            {post.image && (
              <img src={post.image} alt="게시글 이미지" className="mt-2 w-full rounded" />
            )}
            <p className="text-xs text-gray-500 mt-2">
              {new Date(post.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* 하단 고정 버튼 */}
      <footer className="fixed bottom-0 left-0 w-full flex justify-around items-center bg-white shadow-inner py-2">
        <Link className="px-4 py-2 text-blue-600 font-medium" to="/main/community">
          Home
        </Link>
        <Link className="px-4 py-2 text-green-600 font-bold text-2xl" to="/community/create">
          +
        </Link>
        <Link className="px-4 py-2 text-red-500 font-medium" to="/community/activity">
          하트
        </Link>
        <Link className="px-4 py-2 text-red-500 font-medium" to="/community/mypage">
          my page
        </Link>
      </footer>
    </div>
  );
}

export default CommunityFollowingPage;
