import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// Pretendard 폰트 추가
const fontStyles = `
@font-face {
    font-family: 'Pretendard';
    src: url('https://cdn.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff') format('woff');
    font-weight: 400;
    font-display: swap;
}

@font-face {
    font-family: 'Pretendard';
    src: url('https://cdn.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-SemiBold.woff') format('woff');
    font-weight: 600;
    font-display: swap;
}

@font-face {
    font-family: 'Pretendard';
    src: url('https://cdn.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Bold.woff') format('woff');
    font-weight: 700;
    font-display: swap;
}

* {
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif;
}
`;


const API_BASE = import.meta.env.VITE_BACKEND_API_BASE_URL;

export default function SearchPage() {
  const { username } = useParams();
  const nav = useNavigate();

  const tabs = useMemo(
    () => [
      { key: "planti", label: "플랜티" },
      { key: "replies", label: "답글" },
      { key: "media", label: "미디어" },
      { key: "reposts", label: "리포스트" },
    ],
    []
  );

  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState("planti");
  const [items, setItems] = useState([]);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingList, setLoadingList] = useState(false);

  const loadProfile = async () => {
    try {
      setLoadingProfile(true);
      const res = await fetch(`${API_BASE}/community/user/${encodeURIComponent(username)}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setProfile(data);
    } catch {
      setProfile(null);
    } finally {
      setLoadingProfile(false);
    }
  };

  const loadList = async (type) => {
    try {
      setLoadingList(true);
      const res = await fetch(
        `${API_BASE}/community/user/${encodeURIComponent(username)}/${type}`,
        { credentials: "include" }
      );
      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch {
      setItems([]);
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, [username]);

  useEffect(() => {
    loadList(activeTab);
  }, [activeTab, username]);

  const toggleFollow = async () => {
    if (!profile) return;
    try {
      const url = profile.isFollowing
        ? `${API_BASE}/community/unfollow`
        : `${API_BASE}/community/follow`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ targetUserId: profile.id }),
      });
      if (!res.ok) throw new Error();
      setProfile((p) =>
        p ? { ...p, isFollowing: !p.isFollowing, followers: p.isFollowing ? p.followers - 1 : p.followers + 1 } : p
      );
    } catch {
      // 실패 시 무시 또는 토스트
    }
  };

  const mentionUser = () => {
    // 실제로는 작성 모달/페이지로 이동해서 @username 포함한 글 작성
    alert(`@${username} 언급하기`);
  };

  return (
    <div className="community-page">
      <style>{fontStyles}</style>
      <header className="comm-header">
        <button className="icon-btn" onClick={() => nav("/main")}>←</button>
        <h1 className="comm-title">@{username}</h1>
        <div className="right-icons">
          <button className="icon-btn" title="알림">🔔</button>
          <button className="icon-btn" title="메뉴" onClick={() => nav("/main?menu=5")}>☰</button>
        </div>
      </header>

      {/* 프로필 */}
      <section className="profile-card">
        {loadingProfile && <p>프로필 불러오는 중…</p>}
        {!loadingProfile && profile && (
          <>
            <img className="profile-avatar" src={profile.avatarUrl} alt="" />
            <div className="profile-main">
              <div className="profile-row">
                <div className="profile-username">@{profile.username}</div>
                <div className="profile-followers">팔로워 {profile.followers?.toLocaleString() ?? 0}</div>
              </div>
              <div className="profile-actions">
                <button className="btn" onClick={toggleFollow}>
                  {profile.isFollowing ? "언팔로우" : "팔로우"}
                </button>
                <button className="btn outline" onClick={mentionUser}>@ 언급</button>
              </div>
            </div>
          </>
        )}
        {!loadingProfile && !profile && <p>해당 사용자를 찾을 수 없습니다.</p>}
      </section>

      {/* 탭 */}
      <nav className="comm-tabs sticky">
        {tabs.map((t) => (
          <button
            key={t.key}
            className={`tab ${activeTab === t.key ? "active" : ""}`}
            onClick={() => setActiveTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {/* 리스트 */}
      <main className="comm-feed">
        {loadingList && <p>불러오는 중…</p>}
        {!loadingList && items.length === 0 && <p>표시할 항목이 없습니다.</p>}
        {items.map((post) => (
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

      <footer className="comm-footer">
        <button className="home-btn" onClick={() => nav("/main/community")}>Home</button>
      </footer>
    </div>
  );
}