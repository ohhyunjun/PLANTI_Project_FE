import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// 1. 이미지를 import 문으로 불러옵니다.
import strawberryImage from "../assets/strawberry.jpg";

const API_BASE = import.meta.env.VITE_BACKEND_API_BASE_URL;

export default function CommunityStartPage() {
  const nav = useNavigate();

  const [explore, setExplore] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");

  // 추천 피드 불러오기
  const loadExplore = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/community/feed?type=explore`, {
        credentials: "include",
      });
      const data = await res.json();
      setExplore(Array.isArray(data) ? data : []);
    } catch {
      setExplore([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExplore();
  }, []);

  // 아이디 검색
  const onSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    nav(`/main/community/search?keyword=${query}`);
  };

  return (
    <div className="community-page">
      {/* 헤더 */}
      <header className="comm-header">
        <button className="icon-btn" onClick={() => nav("/main")}>←</button>
        <h1 className="comm-title">Community</h1>
        <div className="right-icons">
          <button className="icon-btn" title="알림">🔔</button>
          <button
            className="icon-btn"
            title="메뉴"
            onClick={() => nav("/main/setting")}
          >
            ☰
          </button>
        </div>
      </header>

      {/* 검색 */}
      <form className="comm-search" onSubmit={onSearch}>
        <input
          type="text"
          placeholder="아이디 검색"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button className="search-btn" type="submit" title="검색">
          🔍
        </button>
      </form>

      {/* 탭 */}
      <nav className="comm-tabs">
        <Link
          className={`tab ${location.pathname === "/main/community" ? "active" : ""}`}
          to="/main/community"
        >
          추천
        </Link>
        <Link
          className={`tab ${location.pathname === "/main/community/following" ? "active" : ""}`}
          to="/main/community/following"
        >
          팔로잉
        </Link>
      </nav>

      {/* 배너 (이벤트/광고) */}
      <section className="comm-banner flex flex-col items-center py-4">
        {/* 400x400, cover 적용 */}
        <img
          src={strawberryImage}
          alt="Strawberry Event"
          style={{
            width: "400px",
            height: "400px",
            objectFit: "cover",
            borderRadius: "12px",
          }}
          className="shadow-md"
        />
        <div className="banner-caption text-center mt-2">
          <div className="banner-title font-bold">Whose strawberry is the best?</div>
          <div className="banner-sub text-sm">딸기 재배 챌린지에 참여해보세요!</div>
        </div>
      </section>

      {/* 추천 피드 */}
      <main className="comm-feed">
        {loading && <p>불러오는 중…</p>}
        {!loading && explore.length === 0 && <p>추천 게시물이 없습니다.</p>}
        {explore.map((post) => (
          <article className="post-card" key={post.id}>
            <div className="post-head">
              <img className="avatar" src={post.author?.avatarUrl} alt="" />
              <div className="meta">
                <button
                  className="author"
                  onClick={() => nav(`/community/user/${post.author?.username}`)}
                >
                  @{post.author?.username}
                </button>
                <span className="dot">·</span>
                <span className="time">{post.timeAgo || ""}</span>
              </div>
            </div>
            <div className="post-body">{post.text}</div>
            {post.imageUrl && (
              <div className="post-media">
                <img src={post.imageUrl} alt="" />
              </div>
            )}
            <div className="post-actions">
              <button>💬 {post.replyCount ?? 0}</button>
              <button>🔁 {post.repostCount ?? 0}</button>
              <button>❤ {post.likeCount ?? 0}</button>
              <button>↗ 공유</button>
            </div>
          </article>
        ))}
      </main>

      {/* 하단 버튼 */}
      <footer className="comm-footer">
        <Link className="home-btn" to="/main/community">Home</Link>
        <Link className="create-post-btn" to="/community/create">+</Link>
        <Link className="activity-log-btn" to="/community/activity">하트</Link>
      </footer>
    </div>
  );
}
