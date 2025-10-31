// src/pages/NogrowPage1.jsx
import React, { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Home, Search, Users, Heart, Bell, ChevronLeft } from "lucide-react";
import Layout from "../components/Layout";
import { createPlant } from "../api/plant";

// 식물 카테고리 데이터
const plantCategories = [
  { id: "flower", name: "꽃식물", icon: "🌺", color: "#ffffff" },
  { id: "fruit", name: "열매식물", icon: "🍋", color: "#ffffff" },
  { id: "succulent", name: "다육 선인장 식물", icon: "🌵", color: "#ffffff" },
  { id: "foliage", name: "일식물", icon: "🌿", color: "#ffffff" }
];

// 카테고리별 식물 데이터
const plantsByCategory = {
  flower: [
    { id: "rose", name: "Rose", koreanName: "장미", icon: "🌹" },
    { id: "geranium", name: "Geranium", koreanName: "제라늄", icon: "🌺" },
    { id: "tulip", name: "Tulip", koreanName: "튤립", icon: "🌷" },
    { id: "sunflower", name: "Sunflower", koreanName: "해바라기", icon: "🌻" },
    { id: "orchid", name: "Orchid", koreanName: "난초", icon: "🌸" },
    { id: "lily", name: "Lily", koreanName: "백합", icon: "💮" }
  ],
  fruit: [
    { id: "strawberry", name: "Strawberry", koreanName: "딸기", icon: "🍓" },
    { id: "orange", name: "Orange", koreanName: "오렌지", icon: "🍊" },
    { id: "lemon", name: "Lemon", koreanName: "레몬", icon: "🍋" },
    { id: 1, name: "Tomato", koreanName: "토마토", icon: "🍅" },
    { id: "blueberry", name: "Blueberry", koreanName: "블루베리", icon: "🫐" },
    { id: "apple", name: "Apple", koreanName: "사과", icon: "🍎" }
  ],
  succulent: [
    { id: "cactus", name: "Cactus", koreanName: "선인장", icon: "🌵" },
    { id: "aloe", name: "Aloe", koreanName: "알로에", icon: "🪴" },
    { id: "echeveria", name: "Echeveria", koreanName: "에케베리아", icon: "🌿" },
    { id: "jade", name: "Jade Plant", koreanName: "염좌", icon: "🌱" },
    { id: "succulent", name: "Succulent", koreanName: "다육이", icon: "🍀" }
  ],
  foliage: [
    { id: 2, name: "Lettuce", koreanName: "상추", icon: "🥬" },
    { id: "monstera", name: "Monstera", koreanName: "몬스테라", icon: "🌿" },
    { id: "pothos", name: "Pothos", koreanName: "스킨답서스", icon: "🍃" },
    { id: "fern", name: "Fern", koreanName: "고사리", icon: "🌾" },
    { id: "snake", name: "Snake Plant", koreanName: "산세베리아", icon: "🌱" },
    { id: "philodendron", name: "Philodendron", koreanName: "필로덴드론", icon: "🪴" }
  ]
};

// 모든 식물을 하나의 배열로
const allPlants = Object.values(plantsByCategory).flat();

function NogrowPage1() {
  const { id: serialNumber } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState("category"); // "category" 또는 "plants"
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // 검색 필터링 - 카테고리 화면에서도 작동
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return plantCategories;
    
    const query = searchQuery.toLowerCase();
    return plantCategories.filter(cat => 
      cat.name.toLowerCase().includes(query) ||
      plantsByCategory[cat.id].some(plant => 
        plant.koreanName.toLowerCase().includes(query) ||
        plant.name.toLowerCase().includes(query)
      )
    );
  }, [searchQuery]);

  // 식물 리스트 필터링
  const filteredPlants = useMemo(() => {
    const plants = selectedCategory ? plantsByCategory[selectedCategory] : allPlants;
    
    if (!searchQuery.trim()) return plants;
    
    const query = searchQuery.toLowerCase();
    return plants.filter(p => 
      p.koreanName.toLowerCase().includes(query) || 
      p.name.toLowerCase().includes(query)
    );
  }, [searchQuery, selectedCategory]);

  // 식물 등록 처리 함수 (백엔드 API 연동)
  const handleRegister = async () => {
    if (!selectedPlant) {
      alert("먼저 등록할 식물을 선택해주세요.");
      return;
    }

    const plantName = prompt(`'${selectedPlant.koreanName}'의 애칭을 지어주세요:`);
    if (!plantName || !plantName.trim()) {
      alert("식물의 애칭을 입력해야 합니다.");
      return;
    }

    const plantData = {
      name: plantName,
      speciesId: selectedPlant.id,
      plantedAt: new Date().toISOString(),
      stage: 'SEED',
      serialNumber: serialNumber
    };

    try {
      await createPlant(plantData);
      alert(`'${plantName}'이(가) 성공적으로 등록되었습니다!`);
      navigate(`/main`);
    } catch (error) {
      console.error("식물 등록 실패:", error);
      alert(error.response?.data || "식물 등록에 실패했습니다.");
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      maxWidth: '412px',
      margin: '0 auto',
      paddingBottom: '80px',
      display: 'flex',
      flexDirection: 'column'
    },
    header: {
      backgroundColor: '#10b981',
      padding: '16px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderRadius: '0 0 20px 20px',
      marginBottom: '0'
    },
    backButton: {
      color: 'white',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '4px',
      display: 'flex',
      alignItems: 'center'
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      color: 'white',
      fontSize: '20px',
      fontWeight: 'bold'
    },
    content: {
      padding: '16px',
      flex: 1,
      display: 'flex',
      flexDirection: 'column'
    },
    title: {
      color: '#4b5563',
      fontSize: '15px',
      marginBottom: '16px',
      marginTop: '4px',
      textAlign: 'center'
    },
    searchContainer: {
      position: 'relative',
      marginBottom: '16px',
      width: '100%'
    },
    searchInput: {
      width: '100%',
      padding: '12px 16px',
      paddingRight: '48px',
      border: '1px solid #d1d5db',
      borderRadius: '12px',
      fontSize: '15px',
      outline: 'none',
      boxSizing: 'border-box'
    },
    searchIcon: {
      position: 'absolute',
      right: '16px',
      top: '12px',
      color: '#9ca3af'
    },
    categoryGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: '8px',
      width: '100%'
    },
    categoryCard: {
      padding: '40px 24px',
      borderRadius: '16px',
      border: 'none',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '12px',
      cursor: 'pointer',
      transition: 'transform 0.2s',
      height: '180px',
      justifyContent: 'center',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      width: '100%'
    },
    categoryIcon: {
      fontSize: '72px'
    },
    categoryName: {
      fontSize: '15px',
      fontWeight: '600',
      color: '#1f2937',
      textAlign: 'center',
      lineHeight: '1.3'
    },
    plantList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      marginBottom: '16px',
      width: '100%'
    },
    plantCard: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px',
      borderRadius: '12px',
      border: '2px solid',
      transition: 'all 0.2s',
      backgroundColor: 'white',
      width: '100%',
      boxSizing: 'border-box'
    },
    plantCardSelected: {
      borderColor: '#10b981',
      backgroundColor: '#d1fae5'
    },
    plantCardDefault: {
      borderColor: '#e5e7eb',
      backgroundColor: 'white'
    },
    plantInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      flex: 1
    },
    plantIcon: {
      width: '80px',
      height: '80px',
      backgroundColor: '#fef3c7',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '48px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      flexShrink: 0
    },
    plantDetails: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
      flex: 1
    },
    plantKoreanName: {
      fontWeight: '600',
      fontSize: '17px',
      color: '#1f2937'
    },
    plantEnglishName: {
      fontSize: '13px',
      color: '#10b981'
    },
    selectButton: {
      width: '56px',
      height: '56px',
      borderRadius: '50%',
      border: '2px solid',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '32px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      fontWeight: '300',
      flexShrink: 0,
      marginLeft: '8px'
    },
    selectButtonSelected: {
      backgroundColor: '#10b981',
      borderColor: '#10b981',
      color: 'white',
      boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
    },
    selectButtonDefault: {
      backgroundColor: 'white',
      borderColor: '#d1d5db',
      color: '#d1d5db'
    },
    confirmButton: {
      width: '100%',
      padding: '16px',
      borderRadius: '12px',
      border: 'none',
      fontSize: '17px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s',
      color: 'white',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      marginTop: 'auto',
      boxSizing: 'border-box'
    },
    confirmButtonActive: {
      backgroundColor: '#10b981'
    },
    confirmButtonDisabled: {
      backgroundColor: '#d1d5db',
      cursor: 'not-allowed'
    },
    emptyState: {
      textAlign: 'center',
      padding: '48px 0',
      color: '#9ca3af',
      fontSize: '15px'
    },
    navbar: {
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'white',
      borderTop: '1px solid #e5e7eb',
      boxShadow: '0 -1px 3px rgba(0,0,0,0.1)'
    },
    navContainer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      padding: '12px 16px',
      maxWidth: '412px',
      margin: '0 auto'
    },
    navButton: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '4px',
      minWidth: '60px',
      border: 'none',
      background: 'none',
      cursor: 'pointer'
    }
  };

  // 카테고리 선택 화면
  if (step === "category") {
    return (
      <>
        <div style={styles.container}>
          {/* 헤더 */}
          <div style={styles.header}>
            <button onClick={() => navigate(-1)} style={styles.backButton}>
              <ChevronLeft size={24} />
            </button>
            <div style={styles.logo}>
              <span>🌱</span>
              <span>PLANTI</span>
            </div>
            <div style={{ width: '24px' }}></div>
          </div>

          {/* 메인 컨텐츠 */}
          <div style={styles.content}>
            {/* 안내 문구 */}
            <p style={styles.title}>키우실 식물을 선택해주세요.</p>

            {/* 검색바 */}
            <div style={styles.searchContainer}>
              <input
                type="text"
                placeholder="식물의 이름을 검색하시오."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={styles.searchInput}
              />
              <Search style={styles.searchIcon} size={20} />
            </div>

            {/* 카테고리 그리드 */}
            <div style={styles.categoryGrid}>
              {filteredCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setSelectedCategory(category.id);
                    setStep("plants");
                    setSearchQuery("");
                  }}
                  style={{
                    ...styles.categoryCard,
                    backgroundColor: category.color
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.02)';
                    e.currentTarget.style.backgroundColor = '#d1fae5';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.backgroundColor = '#ffffff';
                  }}
                >
                  <div style={styles.categoryIcon}>{category.icon}</div>
                  <span style={styles.categoryName}>{category.name}</span>
                </button>
              ))}
            </div>

            {/* 검색 결과가 없을 때 */}
            {searchQuery && filteredCategories.length === 0 && (
              <div style={styles.emptyState}>
                검색 결과가 없습니다.
              </div>
            )}
          </div>
        </div>

        {/* 하단 네비게이션 바 */}
        <div style={styles.navbar}>
          <div style={styles.navContainer}>
            <button
              onClick={() => navigate('/main')}
              style={{ ...styles.navButton, color: '#6b7280' }}
            >
              <Home size={24} strokeWidth={2} />
              <span style={{ fontSize: '12px', fontWeight: '500' }}>홈</span>
            </button>

            <button
              onClick={() => navigate('/main/community')}
              style={{ ...styles.navButton, color: '#6b7280' }}
            >
              <Users size={24} strokeWidth={2} />
              <span style={{ fontSize: '12px', fontWeight: '500' }}>커뮤니티</span>
            </button>

            <button
              onClick={() => navigate('/community/mypage')}
              style={{ ...styles.navButton, color: '#6b7280' }}
            >
              <Heart size={24} strokeWidth={2} />
              <span style={{ fontSize: '12px', fontWeight: '500' }}>My Page</span>
            </button>

            <button
              onClick={() => navigate('/main/setting')}
              style={{ ...styles.navButton, color: '#10b981' }}
            >
              <Bell size={24} strokeWidth={2} />
              <span style={{ fontSize: '12px', fontWeight: '500' }}>알림</span>
            </button>
          </div>
        </div>
      </>
    );
  }

  // 식물 선택 화면
  return (
    <>
      <div style={styles.container}>
        {/* 헤더 */}
        <div style={styles.header}>
          <button 
            onClick={() => {
              setStep("category");
              setSelectedPlant(null);
              setSearchQuery("");
            }}
            style={styles.backButton}
          >
            <ChevronLeft size={24} />
          </button>
          <div style={styles.logo}>
            <span>🌱</span>
            <span>PLANTI</span>
          </div>
          <div style={{ width: '24px' }}></div>
        </div>

        {/* 메인 컨텐츠 */}
        <div style={styles.content}>
          {/* 안내 문구 */}
          <p style={styles.title}>키우실 식물을 선택해주세요.</p>

          {/* 검색바 */}
          <div style={styles.searchContainer}>
            <input
              type="text"
              placeholder="식물의 이름을 검색하시오."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={styles.searchInput}
            />
            <Search style={styles.searchIcon} size={20} />
          </div>

          {/* 식물 리스트 */}
          <div style={styles.plantList}>
            {filteredPlants.map((plant) => {
              const isSelected = selectedPlant?.id === plant.id;
              return (
                <div
                  key={plant.id}
                  style={{
                    ...styles.plantCard,
                    ...(isSelected ? styles.plantCardSelected : styles.plantCardDefault)
                  }}
                >
                  <div style={styles.plantInfo}>
                    {/* 식물 아이콘 */}
                    <div style={styles.plantIcon}>
                      {plant.icon}
                    </div>
                    {/* 식물 정보 */}
                    <div style={styles.plantDetails}>
                      <div style={styles.plantKoreanName}>
                        {plant.koreanName}
                      </div>
                      <div style={styles.plantEnglishName}>
                        {plant.name}
                      </div>
                    </div>
                  </div>
                  {/* 선택 버튼 */}
                  <button
                    onClick={() => setSelectedPlant(isSelected ? null : plant)}
                    style={{
                      ...styles.selectButton,
                      ...(isSelected ? styles.selectButtonSelected : styles.selectButtonDefault)
                    }}
                  >
                    +
                  </button>
                </div>
              );
            })}
          </div>

          {/* 검색 결과가 없을 때 */}
          {searchQuery && filteredPlants.length === 0 && (
            <div style={styles.emptyState}>
              검색 결과가 없습니다.
            </div>
          )}

          {/* 확인 버튼 */}
          <button
            onClick={handleRegister}
            disabled={!selectedPlant}
            style={{
              ...styles.confirmButton,
              ...(selectedPlant ? styles.confirmButtonActive : styles.confirmButtonDisabled)
            }}
          >
            확인
          </button>
        </div>
      </div>

      {/* 하단 네비게이션 바 */}
      <div style={styles.navbar}>
        <div style={styles.navContainer}>
          <button
            onClick={() => navigate('/main')}
            style={{ ...styles.navButton, color: '#6b7280' }}
          >
            <Home size={24} strokeWidth={2} />
            <span style={{ fontSize: '12px', fontWeight: '500' }}>홈</span>
          </button>

          <button
            onClick={() => navigate('/main/community')}
            style={{ ...styles.navButton, color: '#6b7280' }}
          >
            <Users size={24} strokeWidth={2} />
            <span style={{ fontSize: '12px', fontWeight: '500' }}>커뮤니티</span>
          </button>

          <button
            onClick={() => navigate('/community/mypage')}
            style={{ ...styles.navButton, color: '#6b7280' }}
          >
            <Heart size={24} strokeWidth={2} />
            <span style={{ fontSize: '12px', fontWeight: '500' }}>My Page</span>
          </button>

          <button
            onClick={() => navigate('/main/setting')}
            style={{ ...styles.navButton, color: '#10b981' }}
          >
            <Bell size={24} strokeWidth={2} />
            <span style={{ fontSize: '12px', fontWeight: '500' }}>알림</span>
          </button>
        </div>
      </div>
    </>
  );
}

export default NogrowPage1;