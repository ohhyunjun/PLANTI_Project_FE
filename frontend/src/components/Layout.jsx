import React from "react";
import Header from "./Header";

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* 상단 고정 헤더 */}
      <Header />

      {/* 헤더 높이만큼 패딩 줘서 컨텐츠가 가려지지 않게 함 */}
      <main className="flex-1 pt-14 px-4">{children}</main>
    </div>
  );
}

export default Layout;
