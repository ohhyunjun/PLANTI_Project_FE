import React from "react";
import { Bell, Menu } from "lucide-react"; 
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-md flex items-center justify-between px-4 py-2 z-50">
      {/* 로고 */}
      <button
        onClick={() => navigate("/main")}
        className="text-xl font-bold focus:outline-none"
      >
        Planti
      </button>

      {/* 오른쪽 아이콘들 */}
      <div className="flex items-center space-x-4">
        <button aria-label="알림">
          <Bell size={24} />
        </button>
        <button
          aria-label="메뉴"
          onClick={() => navigate("/main/setting")}
        >
          <Menu size={24} />
        </button>
      </div>
    </header>
  );
}

export default Header;
