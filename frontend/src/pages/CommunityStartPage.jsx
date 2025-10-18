import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import strawberryImage from "../assets/strawberry.jpg"; 
import { getPosts } from "../api/community";

const Icon = ({ name, className = "" }) => {
  const icons = {
    back: "←", bell: "🔔", menu: "☰", search: "🔍",
    comment: "💬", repost: "🔁", like: "❤", share: "↗",
    home: "🏠", create: "✍", activity: "❤️", mypage: "👤",
    recommend: "⭐", friend: "👥", more: "..."
  };
  return <span className={`text-xl ${className}`}>{icons[name] || name}</span>;
};

const PostCard = ({ post, nav }) => (
    <article className="post-card bg-gray-900 text-gray-200 p-3 border-b border-gray-800">
        <div className="flex justify-between items-start mb-2">
            <div 
                className="flex items-center flex-grow cursor-pointer"
                onClick={() => nav(`/main/community/post/${post.id}`)}
            >
                <img
                    className="w-8 h-8 rounded-full object-cover mr-2 border border-green-500"
                    src="/default-avatar-dark.png"
                    alt={`${post.authorUsername}님의 아바타`}
                />
                <div className="flex items-center space-x-1">
                    <span className="text-sm font-semibold text-white hover:text-green-400">
                        @{post.authorUsername || "알 수 없는 사용자"}
                    </span>
                    <span className="text-xs text-gray-500">·</span>
                    <span className="text-xs text-gray-500">
                        {new Date(post.createdAt).toLocaleDateString('ko-KR')}
                    </span>
                </div>
            </div>
        </div>

        <div 
            className="cursor-pointer"
            onClick={() => nav(`/main/community/post/${post.id}`)}
        >
            {post.title && (
                <h3 className="text-lg font-bold text-gray-200 mb-2">
                    {post.title}
                </h3>
            )}
            
            <div className="text-gray-300 mb-2 whitespace-pre-wrap text-sm">
                {post.content}
            </div>
            
            {post.files && post.files.length > 0 && (
                <div className="post-media mb-3 rounded-lg overflow-hidden border border-gray-700">
                    <img 
                        src={post.files[0].fileUrl}
                        alt="게시물 이미지" 
                        style={{ width: "100%", height: "200px", objectFit: "cover" }} 
                        onError={(e) => {
                            console.error("이미지 로드 실패:", post.files[0].fileUrl);
                            e.target.style.display = 'none';
                        }}
                    />
                </div>
            )}
        </div>

        <div className="flex space-x-4 text-gray-400">
            <button className="flex items-center space-x-1 hover:text-blue-400 transition-colors">
                <Icon name="comment" className="text-lg"/>
                <span className="text-xs">{post.comments?.length ?? 0}</span>
            </button>
            <button className="flex items-center space-x-1 hover:text-green-400 transition-colors">
                <Icon name="repost" className="text-lg"/>
                <span className="text-xs">{post.repostCount ?? 0}</span>
            </button>
            <button className="flex items-center space-x-1 hover:text-red-400 transition-colors">
                <Icon name="like" className="text-lg"/>
                <span className="text-xs">{post.likeCount ?? 0}</span>
            </button>
            <button className="flex items-center space-x-1 hover:text-gray-200 transition-colors">
                <Icon name="share" className="text-lg"/>
                <span className="text-xs">공유</span>
            </button>
        </div>
    </article>
);

export default function CommunityStartPage() {
  const nav = useNavigate();
  const location = useLocation();

  const [explore, setExplore] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");

  const loadExplore = async () => {
    try {
      setLoading(true);
      const response = await getPosts();
      setExplore(Array.isArray(response.data) ? response.data : []);
      console.log("게시글 로드:", response.data);
    } catch (e) {
      console.error("피드 불러오기 실패:", e);
      setExplore([]); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExplore();
  }, []);

  const onSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    nav(`/main/community/search?keyword=${query}`);
  };

  return (
    <div className="community min-h-screen bg-gray-900 max-w-sm mx-auto shadow-2xl pb-16">
      <header className="sticky top-0 bg-gray-900 p-3 border-b border-gray-800 z-20">
        <div className="flex justify-center mb-3">
          <h1 className="text-2xl font-bold text-white tracking-wider">Community</h1>
        </div>
        
        <div className="flex justify-center space-x-5 mb-3">
          <button className="text-xl text-yellow-300 hover:text-yellow-400 transition-colors">
            <Icon name="bell"/>
          </button>
          <button
            className="text-xl text-white hover:text-green-500 transition-colors"
            onClick={() => nav("/main/setting")}
          >
            <Icon name="menu"/>
          </button>
        </div>

        <form className="flex items-center space-x-2" onSubmit={onSearch}>
          <input
            type="text"
            placeholder="아이디 검색"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 p-2 text-sm bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500"
          />
          <button 
            className="p-2 bg-gray-800 border border-gray-700 rounded-lg text-green-400 hover:bg-gray-700 transition-colors" 
            type="submit"
          >
            <Icon name="search" className="text-xl"/>
          </button>
        </form>
      </header>

      {/* ✅ 수정: sticky 제거 - 스크롤 시 같이 움직이도록 */}
      <nav className="flex justify-around text-center py-2 border-b border-gray-800 bg-gray-900">
        <Link
            className={`flex flex-col items-center px-3 py-1 text-sm font-medium transition-colors ${
                location.pathname === "/main/community"
                    ? "text-green-400 border-b-2 border-green-400"
                    : "text-gray-500 hover:text-gray-300"
            }`}
            to="/main/community"
        >
            <Icon name="recommend" className="text-base mb-0.5" />
            추천
        </Link>
        
        <Link
            className={`flex flex-col items-center px-3 py-1 text-sm font-medium transition-colors ${
                location.pathname.includes("/following")
                    ? "text-green-400 border-b-2 border-green-400"
                    : "text-gray-500 hover:text-gray-300"
            }`}
            to="/main/community/following"
        >
            <Icon name="friend" className="text-base mb-0.5"/>
            팔로잉
        </Link>
      </nav>

      <section className="comm-banner flex flex-col items-center py-5 bg-gray-900 border-b border-gray-800">
        <div className="w-11/12 overflow-hidden rounded-xl shadow-xl border border-gray-700">
          <img
            src={strawberryImage}
            alt="Strawberry Event"
            style={{ width: "100%", height: "200px", objectFit: "cover" }} 
          />
        </div>
        <div className="banner-caption text-center mt-3">
          <div className="banner-title text-lg font-bold text-red-400">
            Whose strawberry is the best?
          </div>
          <div className="banner-sub text-sm text-gray-300 mt-1">
            딸기 재배 챌린지에 참여해보세요!
          </div>
        </div>
      </section>

      <main className="comm-feed pt-3 pb-12">
        {loading && (
          <p className="text-center py-6 text-green-500 animate-pulse text-sm">
             🌱 피드를 불러오는 중...
          </p>
        )}
        {!loading && explore.length === 0 && (
          <p className="text-center py-6 text-gray-500 text-sm">
            게시물이 없습니다.
          </p>
        )}
        
        {!loading && explore.map((post) => (
            <PostCard key={post.id} post={post} nav={nav} />
        ))}
      </main>

      <footer className="sticky bottom-0 left-0 right-0 max-w-sm mx-auto bg-gray-900 border-t border-gray-800 flex justify-around items-center h-12 z-20 text-xs">
        <Link 
          className={`flex flex-col items-center px-2 py-1 font-medium transition-colors ${
            location.pathname === "/main/community" ? "text-green-400" : "text-gray-400 hover:text-green-500"
          }`} 
          to="/main/community"
        >
          <Icon name="home" className="text-lg"/>
          Home
        </Link>
        <Link 
          className="flex flex-col items-center px-2 py-1 text-gray-400 font-medium hover:text-white transition-colors" 
          to="/community/create"
        >
          <Icon name="create" className="text-lg"/>
          작성
        </Link>
        <Link 
          className="flex flex-col items-center px-2 py-1 text-gray-400 font-medium hover:text-red-400 transition-colors" 
          to="/community/activity"
        >
          <Icon name="activity" className="text-lg"/>
          활동
        </Link>
        <Link 
          className="flex flex-col items-center px-2 py-1 text-gray-400 font-medium hover:text-red-500" 
          to="/community/mypage"
        >
          <Icon name="mypage" className="text-lg"/>
          My Page
        </Link>
      </footer>
    </div>
  );
}