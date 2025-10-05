import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

// 1. 이미지를 import 문으로 불러옵니다.
import strawberryImage from "../assets/strawberry.jpg"; 

// ⚠️ 참고: API_BASE는 환경 변수에서 가져옵니다.
const API_BASE = import.meta.env.VITE_BACKEND_API_BASE_URL;

// 아이콘을 위한 더미 컴포넌트 (다크 모드에 맞게 색상 조정)
const Icon = ({ name, className = "" }) => {
  const icons = {
    back: "←",
    bell: "🔔",
    menu: "☰",
    search: "🔍",
    comment: "💬",
    repost: "🔁",
    like: "❤",
    share: "↗",
    home: "🏠",
    create: "✍",
    activity: "❤️",
    mypage: "👤",
    recommend: "⭐",
    friend: "👥",
  };
  return <span className={`text-xl ${className}`}>{icons[name] || name}</span>;
};

/**
 * @description 커뮤니티 시작 페이지 컴포넌트
 */
export default function CommunityStartPage() {
  const nav = useNavigate();
  const location = useLocation();

  const [explore, setExplore] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");

  // 추천 피드 불러오기 로직 (기존 유지)
  const loadExplore = async () => {
    try {
      setLoading(true);
      // **실제 API 호출**
      const res = await fetch(`${API_BASE}/community/feed?type=explore`, {
        credentials: "include",
      });
      const data = await res.json();
      setExplore(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("추천 피드 불러오기 실패:", e);
      setExplore([]); 
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExplore();
  }, []);

  // 아이디 검색 (기존 로직 유지)
  const onSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    nav(`/main/community/search?keyword=${query}`);
  };

  /**
   * @description 개별 포스트 카드 컴포넌트 (다크 모드 스타일 및 크기 조정)
   */
  const PostCard = ({ post }) => (
    <article 
      className="post-card bg-gray-900 text-gray-200 p-3 border-b border-gray-800" // padding 감소
      onClick={() => nav(`/main/community/post/${post.id}`)} 
    >
      <div className="flex justify-between items-center mb-2">
        {/* 포스트 헤드 */}
        <div className="flex items-center">
          <img
            className="w-8 h-8 rounded-full object-cover mr-2 border border-green-500" // 아바타 크기 감소
            src={post.author?.avatarUrl || "default-avatar-dark.png"}
            alt={`${post.author?.username}님의 아바타`}
          />
          <div className="flex items-center space-x-1">
            <button
              className="text-sm font-semibold text-white hover:text-green-400 transition-colors" // 폰트 크기 감소
              onClick={(e) => {
                e.stopPropagation(); 
                nav(`/community/user/${post.author?.username}`);
              }}
            >
              @{post.author?.username || "알 수 없는 사용자"}
            </button>
            <span className="text-xs text-gray-500">·</span> {/* 폰트 크기 감소 */}
            <span className="text-xs text-gray-500">{post.timeAgo || "방금 전"}</span>
          </div>
        </div>
        <button className="text-base text-gray-400">...</button> {/* 아이콘 크기 감소 */}
      </div>

      {/* 포스트 본문 */}
      <div className="text-gray-300 mb-2 whitespace-pre-wrap text-sm">{post.text}</div> {/* 폰트 크기 감소 */}

      {/* 포스트 미디어 (이미지) */}
      {post.imageUrl && (
        <div className="post-media mb-3 rounded-lg overflow-hidden border border-gray-700">
          <img
            src={post.imageUrl}
            alt="게시물 이미지"
            style={{ width: "100%", height: "200px", objectFit: "cover" }} // 이미지 높이 고정 (400x400 비율 느낌)
          />
        </div>
      )}

      {/* 액션 버튼들 */}
      <div className="flex space-x-4 text-gray-400"> {/* 간격 감소 */}
        <button className="flex items-center space-x-1 hover:text-blue-400 transition-colors">
          <Icon name="comment" className="text-lg"/> {/* 아이콘 크기 감소 */}
          <span className="text-xs">{post.replyCount ?? 0}</span> {/* 폰트 크기 감소 */}
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

  // JSX 반환
  return (
    // 전체 컨테이너 너비를 max-w-sm (약 384px)으로 축소
    <div className="min-h-screen bg-gray-900 max-w-sm mx-auto shadow-2xl">
      
      {/* 헤더 */}
      <header className="sticky top-0 bg-gray-900 p-3 border-b border-gray-800 z-20"> {/* padding 감소 */}
        <div className="flex justify-center mb-3"> {/* margin 감소 */}
          <h1 className="text-2xl font-bold text-white tracking-wider">Community</h1> {/* 폰트 크기 감소 */}
        </div>
        
        {/* 알림/메뉴 버튼 */}
        <div className="flex justify-center space-x-5 mb-3"> {/* space 및 margin 감소 */}
          <button className="text-xl text-yellow-300 hover:text-yellow-400 transition-colors" title="알림"> {/* 아이콘 크기 감소 */}
            <Icon name="bell"/>
          </button>
          <button
            className="text-xl text-white hover:text-green-500 transition-colors" // 아이콘 크기 감소
            title="메뉴"
            onClick={() => nav("/main/setting")}
          >
            <Icon name="menu"/>
          </button>
        </div>

        {/* 검색 폼 */}
        <form className="flex items-center space-x-2" onSubmit={onSearch}>
          <input
            type="text"
            placeholder="아이디 검색"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 p-2 text-sm bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-green-500" // padding 및 폰트 크기 감소
          />
          <button 
            className="p-2 bg-gray-800 border border-gray-700 rounded-lg text-green-400 hover:bg-gray-700 transition-colors" 
            type="submit" 
            title="검색"
          >
            <Icon name="search" className="text-xl"/> {/* 아이콘 크기 감소 */}
          </button>
        </form>
      </header>

      {/* 탭 네비게이션 */}
      <nav className="flex justify-around text-center py-2 border-b border-gray-800 bg-gray-900 sticky top-[170px] z-10">
    {/* 1. 추천 탭 (recommend: ⭐) - mx-4 제거 */}
    <Link
        className={`flex flex-col items-center px-3 py-1 text-sm font-medium transition-colors 
            ${ 
                location.pathname === "/main/community"
                    ? "text-green-400 border-b-2 border-green-400"
                    : "text-gray-500 hover:text-gray-300"
            }`}
        to="/main/community"
    >
        <Icon name="recommend" className="text-base mb-0.5" />
        추천
    </Link>
    
    {/* 2. 팔로잉 탭 (friend: 👥) - mx-4 제거 */}
    <Link
        className={`flex flex-col items-center px-3 py-1 text-sm font-medium transition-colors 
            ${
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

      {/* 배너 (이벤트/광고) */}
      <section className="comm-banner flex flex-col items-center py-5 bg-gray-900"> {/* padding 감소 */}
        <div className="w-11/12 overflow-hidden rounded-xl shadow-xl border border-gray-700">
          {/* 이미지 높이 고정 (400x400 비율 느낌) */}
          <img
            src={strawberryImage}
            alt="Strawberry Event"
            style={{ width: "100%", height: "200px", objectFit: "cover" }} 
          />
        </div>
        <div className="banner-caption text-center mt-3"> {/* margin 감소 */}
          <div className="banner-title text-lg font-bold text-red-400"> {/* 폰트 크기 감소 */}
            Whose strawberry is the best?
          </div>
          <div className="banner-sub text-sm text-gray-300 mt-1"> {/* 폰트 크기 감소 */}
            딸기 재배 챌린지에 참여해보세요!
          </div>
        </div>
      </section>

      {/* 추천 피드 */}
      <main className="comm-feed pt-3"> {/* padding 감소 */}
        {/* 로딩/결과 없음 */}
        {loading && (
          <p className="text-center py-6 text-green-500 animate-pulse text-sm"> {/* padding 및 폰트 크기 감소 */}
             🌱 피드를 불러오는 중입니다...
          </p>
        )}
        {!loading && explore.length === 0 && (
          <p className="text-center py-6 text-gray-500 text-sm"> {/* padding 및 폰트 크기 감소 */}
            추천 게시물이 없습니다.
          </p>
        )}
        
        {/* 포스트 목록 */}
        {!loading && explore.map((post) => <PostCard key={post.id} post={post} />)}
      </main>

      {/* 하단 네비게이션 바 (Footer) */}
      <footer className="sticky bottom-0 left-0 right-0 max-w-sm mx-auto bg-gray-900 border-t border-gray-800 flex justify-around items-center h-12 z-20 text-xs"> {/* height 및 폰트 크기 감소 */}
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
          className="flex flex-col items-center px-2 py-1 text-red-400 font-medium hover:text-red-500 transition-colors" 
          to="/community/mypage"
        >
          <Icon name="mypage" className="text-lg"/>
          My Page
        </Link>
      </footer>
    </div>
  );
}