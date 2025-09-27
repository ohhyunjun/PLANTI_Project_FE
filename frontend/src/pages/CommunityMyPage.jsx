import { useState } from "react";
import { Link } from "react-router-dom";

function CommunityMyPage() {
  const [activeTab, setActiveTab] = useState("planti");

  // 샘플 데이터 (실제 연결시 백엔드 API에서 가져오기)
  const planti = [
    { id: 1, content: "오늘 토마토가 처음 열매를 맺었어요!", media: "/assets/tomato.png" },
    { id: 2, content: "상추가 하루가 다르게 자라네요 🌱" },
  ];
  const replies = [
    { id: 1, content: "와 대단해요!", planti: "오늘 토마토가 처음 열매를..." },
    { id: 2, content: "저도 따라 키워봐야겠네요!" },
  ];
  const media = [
    { id: 1, type: "image", url: "/assets/lettuce.png" },
    { id: 2, type: "video", url: "/assets/farm.mp4" },
  ];
  const reposts = [
    { id: 1, originalUser: "오현준", content: "AI 추천 덕분에 바질이 잘 자랐어요!" },
    { id: 2, originalUser: "정도영", content: "세종시 스마트팜 정책 너무 멋지다" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "planti":
        return (
          <div className="space-y-4">
            {planti.map((t) => (
              <div key={t.id} className="p-4 bg-white rounded-xl shadow">
                <p className="text-gray-800">{t.content}</p>
                {t.media && <img src={t.media} alt="" className="mt-2 rounded-lg" />}
              </div>
            ))}
          </div>
        );
      case "replies":
        return (
          <div className="space-y-4">
            {replies.map((r) => (
              <div key={r.id} className="p-4 bg-white rounded-xl shadow">
                <p className="text-gray-800">{r.content}</p>
                <p className="text-sm text-gray-500">↪ {r.thread}</p>
              </div>
            ))}
          </div>
        );
      case "media":
        return (
          <div className="grid grid-cols-2 gap-4">
            {media.map((m) => (
              <div key={m.id} className="bg-white rounded-xl shadow overflow-hidden">
                {m.type === "image" ? (
                  <img src={m.url} alt="" className="w-full h-32 object-cover" />
                ) : (
                  <video src={m.url} controls className="w-full h-32 object-cover" />
                )}
              </div>
            ))}
          </div>
        );
      case "reposts":
        return (
          <div className="space-y-4">
            {reposts.map((rp) => (
              <div key={rp.id} className="p-4 bg-white rounded-xl shadow">
                <p className="text-sm text-gray-500">🔁 {rp.originalUser} 님의 글</p>
                <p className="text-gray-800">{rp.content}</p>
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20"> {/* footer 공간 확보 위해 pb-20 */}
      {/* 상단 프로필 영역 */}
      <div className="flex items-center mb-6 p-6">
        <img
          src="/assets/profile.png"
          alt="프로필"
          className="w-16 h-16 rounded-full border mr-4"
        />
        <div>
          <h2 className="text-xl font-bold text-gray-800">내 활동 기록</h2>
          <p className="text-gray-500">@myusername</p>
        </div>
      </div>

      {/* 탭 메뉴 */}
      <div className="flex justify-around mb-6 border-b px-6">
        {["planti", "replies", "media", "reposts"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-2 px-4 font-medium ${
              activeTab === tab
                ? "text-green-600 border-b-2 border-green-600"
                : "text-gray-500"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* 콘텐츠 렌더링 */}
      <div className="px-6">{renderContent()}</div>

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

export default CommunityMyPage;
