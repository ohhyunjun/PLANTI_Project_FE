import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus, Trash2, Edit, Image, Film, FileText, X, Bell, Home, Users, Heart } from "lucide-react";
import apiClient from "../api/apiClient";

function DiaryPage() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [events, setEvents] = useState({});
  const [editingEvent, setEditingEvent] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    content: '',
    plant: ''
  });
  const [plants, setPlants] = useState([]);

  // 식물 목록 가져오기
  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const response = await apiClient.get('/api/devices');
        const devices = response.data;
        
        // 색상 팔레트
        const colors = [
          "rgb(248 113 113)", // 빨강
          "rgb(251 146 60)",  // 주황
          "rgb(250 204 21)",  // 노랑
          "rgb(34 197 94)",   // 녹색
          "rgb(59 130 246)",  // 파랑
          "rgb(168 85 247)",  // 보라
          "rgb(244 114 182)", // 분홍
          "rgb(156 163 175)"  // 회색
        ];
        
        // 식물이 등록된 기기만 필터링하고 색상 배정
        const plantList = devices
          .filter(device => device.plant)
          .map((device, index) => ({
            name: device.plant.name,
            species: device.plant.species,
            color: colors[index % colors.length],
            deviceNickname: device.deviceNickname
          }));
        
        setPlants(plantList);
      } catch (error) {
        console.error("식물 목록을 불러오는 데 실패했습니다.", error);
        setPlants([]);
      }
    };
    
    fetchPlants();
  }, []);

  const handleMonthChange = (dir) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + dir);
    setCurrentDate(newDate);
  };

  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    while (days.length < 42) days.push(null);
    return days;
  };

  const formatDate = (date) => date.toISOString().split("T")[0];

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newUrls = [];
    
    files.forEach(file => {
      const url = URL.createObjectURL(file);
      newUrls.push({
        url,
        type: file.type.startsWith('image/') ? 'image' : 'video',
        name: file.name
      });
    });
    
    setPreviewUrls([...previewUrls, ...newUrls]);
    setUploadedFiles([...uploadedFiles, ...files]);
  };

  const removeFile = (index) => {
    const newUrls = previewUrls.filter((_, i) => i !== index);
    const newFiles = uploadedFiles.filter((_, i) => i !== index);
    setPreviewUrls(newUrls);
    setUploadedFiles(newFiles);
  };

  const handleSave = () => {
    if (!formData.name || !formData.content) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    const newEvent = {
      name: formData.name,
      content: formData.content,
      plant: formData.plant,
      media: previewUrls,
      timestamp: new Date().toISOString()
    };

    const dateKey = selectedDate.toISOString().split("T")[0];
    if (editingEvent !== null) {
      const updated = [...events[dateKey]];
      updated[editingEvent] = newEvent;
      setEvents({ ...events, [dateKey]: updated });
      setEditingEvent(null);
    } else {
      setEvents({
        ...events,
        [dateKey]: [...(events[dateKey] || []), newEvent],
      });
    }
    
    setShowModal(false);
    setUploadedFiles([]);
    setPreviewUrls([]);
    setFormData({ name: '', content: '', plant: '' });
  };

  const handleDelete = (dateKey, idx) => {
    const updated = events[dateKey].filter((_, i) => i !== idx);
    setEvents({ ...events, [dateKey]: updated });
  };

  const handleEdit = (idx) => {
    const dateKey = formatDate(selectedDate);
    const event = events[dateKey][idx];
    setEditingEvent(idx);
    setPreviewUrls(event.media || []);
    setFormData({
      name: event.name,
      content: event.content,
      plant: event.plant || ''
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setUploadedFiles([]);
    setPreviewUrls([]);
    setFormData({ name: '', content: '', plant: '' });
    setEditingEvent(null);
  };

  const openAddModal = () => {
    setEditingEvent(null);
    setPreviewUrls([]);
    setUploadedFiles([]);
    setFormData({ name: '', content: '', plant: '' });
    setShowModal(true);
  };

  // 식물 이름으로 색상 찾기
  const getPlantColor = (plantName) => {
    const plant = plants.find(p => p.name === plantName);
    return plant ? plant.color : "rgb(156 163 175)"; // 기본 회색
  };

  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

  const calendarWeeks = [];
  const days = getCalendarDays();
  for (let i = 0; i < days.length; i += 7) {
    calendarWeeks.push(days.slice(i, i + 7));
  }

  const styles = {
    container: {
      maxWidth: '412px',
      margin: '0 auto',
      backgroundColor: '#f9fafb',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      paddingBottom: '80px'
    },
    header: {
      backgroundColor: 'white',
      padding: '16px',
      borderBottomLeftRadius: '20px',
      borderBottomRightRadius: '20px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      alignItems: 'center',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      height: '42px'
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#374151'
    },
    contentWrapper: {
      padding: '16px',
      flex: 1
    },
    monthHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '16px'
    },
    monthTitle: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#111827'
    },
    navButton: {
      padding: '8px',
      cursor: 'pointer',
      border: 'none',
      backgroundColor: 'transparent',
      borderRadius: '8px',
      transition: 'background-color 0.2s',
      display: 'flex',
      alignItems: 'center'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      backgroundColor: 'white',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    },
    th: {
      padding: '12px',
      fontSize: '14px',
      fontWeight: '500',
      backgroundColor: '#f9fafb',
      borderBottom: '1px solid #e5e7eb'
    },
    td: {
      height: '80px',
      padding: '8px',
      border: '1px solid #e5e7eb',
      verticalAlign: 'top',
      cursor: 'pointer',
      position: 'relative',
      transition: 'background-color 0.2s'
    },
    dayNumber: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      fontSize: '14px'
    },
    eventDot: {
      width: '6px',
      height: '6px',
      borderRadius: '50%',
      margin: '2px'
    },
    fab: {
      position: 'fixed',
      bottom: '100px',
      right: 'calc(50% - 206px + 16px)',
      width: '56px',
      height: '56px',
      backgroundColor: '#10b981',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '50%',
      boxShadow: '0 4px 6px rgba(0,0,0,0.3)',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s',
      zIndex: 50
    },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    },
    modalContent: {
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '24px',
      width: '90%',
      maxWidth: '380px',
      maxHeight: '90vh',
      overflowY: 'auto'
    },
    navbar: {
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      maxWidth: '412px',
      width: '100%',
      height: '80px',
      backgroundColor: 'white',
      boxShadow: '0 -4px 6px rgba(0,0,0,0.1)',
      zIndex: 100
    },
    navContainer: {
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      height: '100%',
      padding: '0'
    },
    navButton2: {
      backgroundColor: 'transparent',
      border: 'none',
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '4px',
      padding: '8px 16px',
      transition: 'color 0.2s'
    }
  };

  return (
    <div style={styles.container}>
      {/* 상단바 */}
      <div style={styles.header}>
        <div style={styles.logo}>
          <button 
            onClick={() => navigate('/main')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <ChevronLeft size={24} />
          </button>
          <span>다이어리</span>
        </div>
      </div>

      {/* 메인 컨텐츠 */}
      <div style={styles.contentWrapper}>
        {/* 월 네비게이션 */}
        <div style={styles.monthHeader}>
          <button 
            style={styles.navButton} 
            onClick={() => handleMonthChange(-1)} 
            onMouseEnter={e => e.target.style.backgroundColor = '#f3f4f6'} 
            onMouseLeave={e => e.target.style.backgroundColor = 'transparent'}
          >
            <ChevronLeft size={24} />
          </button>
          <h2 style={styles.monthTitle}>
            {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
          </h2>
          <button 
            style={styles.navButton} 
            onClick={() => handleMonthChange(1)} 
            onMouseEnter={e => e.target.style.backgroundColor = '#f3f4f6'} 
            onMouseLeave={e => e.target.style.backgroundColor = 'transparent'}
          >
            <ChevronRight size={24} />
          </button>
        </div>

        {/* 달력 테이블 */}
        <table style={styles.table}>
          <thead>
            <tr>
              {weekDays.map((day, i) => (
                <th key={i} style={styles.th}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {calendarWeeks.map((week, weekIndex) => (
              <tr key={weekIndex}>
                {week.map((day, dayIndex) => {
                  if (!day) return <td key={dayIndex} style={styles.td}></td>;

                  const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                  const dateKey = formatDate(date);
                  const dayEvents = events[dateKey] || [];
                  const isToday = new Date().toDateString() === date.toDateString();

                  return (
                    <td
                      key={dayIndex}
                      style={styles.td}
                      onClick={() => setSelectedDate(date)}
                      onMouseEnter={e => e.target.style.backgroundColor = '#f9fafb'}
                      onMouseLeave={e => e.target.style.backgroundColor = 'white'}
                    >
                      <span style={{
                        ...styles.dayNumber,
                        backgroundColor: isToday ? '#10b981' : 'transparent',
                        color: isToday ? 'white' : 'inherit'
                      }}>
                        {day}
                      </span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '4px', gap: '2px' }}>
                        {dayEvents.map((event, i) => (
                          <div
                            key={i}
                            style={{
                              ...styles.eventDot,
                              backgroundColor: getPlantColor(event.plant)
                            }}
                          />
                        ))}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

        {/* 선택된 날짜의 이벤트 */}
        {selectedDate && (
          <div style={{ marginTop: '24px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
              {selectedDate.getMonth() + 1}월 {selectedDate.getDate()}일
            </h3>
            {(() => {
              const dateKey = formatDate(selectedDate);
              const dayEvents = events[dateKey] || [];
              const hasEvents = dayEvents.length > 0;

              return hasEvents ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {dayEvents.map((event, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      style={{
                        backgroundColor: 'white',
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        padding: '16px',
                        position: 'relative'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            backgroundColor: getPlantColor(event.plant)
                          }}></span>
                          <h4 style={{ fontSize: '16px', fontWeight: '600' }}>{event.name}</h4>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => handleEdit(idx)}
                            style={{
                              padding: '6px',
                              backgroundColor: '#f3f4f6',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                            onMouseEnter={e => e.target.style.backgroundColor = '#e5e7eb'}
                            onMouseLeave={e => e.target.style.backgroundColor = '#f3f4f6'}
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(dateKey, idx)}
                            style={{
                              padding: '6px',
                              backgroundColor: '#fee2e2',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                            onMouseEnter={e => e.target.style.backgroundColor = '#fecaca'}
                            onMouseLeave={e => e.target.style.backgroundColor = '#fee2e2'}
                          >
                            <Trash2 size={16} color="#ef4444" />
                          </button>
                        </div>
                      </div>
                      {event.plant && (
                        <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '8px' }}>
                          식물: {event.plant}
                        </p>
                      )}
                      <p style={{ color: '#374151', fontSize: '14px', marginBottom: '12px' }}>{event.content}</p>
                      {event.media && event.media.length > 0 && (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                          {event.media.map((media, i) => (
                            <div key={i} style={{ position: 'relative', paddingBottom: '100%', backgroundColor: '#f3f4f6', borderRadius: '8px', overflow: 'hidden' }}>
                              {media.type === 'image' ? (
                                <img src={media.url} alt="" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                              ) : (
                                <video src={media.url} controls style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '40px 20px', backgroundColor: 'white', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                  <FileText size={48} color="#d1d5db" style={{ margin: '0 auto 16px' }} />
                  <p style={{ color: '#6b7280', marginBottom: '16px' }}>이 날에는 기록이 없습니다</p>
                  <button
                    onClick={openAddModal}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '14px'
                    }}
                    onMouseEnter={e => e.target.style.backgroundColor = '#059669'}
                    onMouseLeave={e => e.target.style.backgroundColor = '#10b981'}
                  >
                    <Plus size={20} />
                    <span>메모 추가</span>
                  </button>
                </div>
              );
            })()}
          </div>
        )}
      </div>

      {/* FAB 버튼 */}
      {selectedDate && (() => {
        const dateKey = formatDate(selectedDate);
        const dayEvents = events[dateKey] || [];
        const hasEvents = dayEvents.length > 0;
        return hasEvents ? (
          <button
            onClick={openAddModal}
            style={styles.fab}
            onMouseEnter={e => {
              e.target.style.backgroundColor = '#059669';
              e.target.style.transform = 'scale(1.1)';
            }}
            onMouseLeave={e => {
              e.target.style.backgroundColor = '#10b981';
              e.target.style.transform = 'scale(1)';
            }}
          >
            <Plus size={28} />
          </button>
        ) : null;
      })()}

      {/* 모달 */}
      {showModal && (
        <div style={styles.modalOverlay} onClick={closeModal}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>
              {editingEvent !== null ? "메모 수정" : "새 메모 추가"}
            </h2>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>제목</label>
              <input
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder="오늘의 제목을 입력하세요"
                style={{ width: '100%', border: '1px solid #d1d5db', padding: '12px', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>내용</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                placeholder="오늘 있었던 일을 기록해보세요"
                style={{ width: '100%', border: '1px solid #d1d5db', padding: '12px', borderRadius: '8px', height: '128px', resize: 'none', fontSize: '14px', boxSizing: 'border-box' }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>사진 / 영상 추가</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: '#f3f4f6', borderRadius: '8px', cursor: 'pointer' }}>
                  <Image size={20} />
                  <span style={{ fontSize: '14px' }}>사진</span>
                  <input type="file" accept="image/*" multiple onChange={handleFileUpload} style={{ display: 'none' }} />
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: '#f3f4f6', borderRadius: '8px', cursor: 'pointer' }}>
                  <Film size={20} />
                  <span style={{ fontSize: '14px' }}>영상</span>
                  <input type="file" accept="video/*" multiple onChange={handleFileUpload} style={{ display: 'none' }} />
                </label>
              </div>
              
              {previewUrls.length > 0 && (
                <div style={{ marginTop: '12px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {previewUrls.map((media, idx) => (
                    <div key={idx} style={{ position: 'relative', paddingBottom: '100%', backgroundColor: '#f3f4f6', borderRadius: '8px', overflow: 'hidden' }}>
                      {media.type === 'image' ? (
                        <img src={media.url} alt="" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <video src={media.url} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                      )}
                      <button
                        type="button"
                        onClick={() => removeFile(idx)}
                        style={{ position: 'absolute', top: '4px', right: '4px', backgroundColor: '#ef4444', color: 'white', borderRadius: '50%', padding: '4px', border: 'none', cursor: 'pointer' }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' }}>오늘의 식물</label>
              {plants.length === 0 ? (
                <p style={{ fontSize: '14px', color: '#6b7280', textAlign: 'center', padding: '20px' }}>
                  등록된 식물이 없습니다. 먼저 식물을 등록해주세요.
                </p>
              ) : (
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  {plants.map((p) => (
                    <label key={p.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}>
                      <input
                        type="radio"
                        name="plant"
                        value={p.name}
                        checked={formData.plant === p.name}
                        onChange={(e) => setFormData({...formData, plant: e.target.value})}
                        style={{ display: 'none' }}
                      />
                      <span style={{ 
                        width: '48px', 
                        height: '48px', 
                        borderRadius: '50%', 
                        backgroundColor: p.color,
                        border: formData.plant === p.name ? '4px solid #34d399' : 'none',
                        transition: 'all 0.2s'
                      }}></span>
                      <span style={{ fontSize: '12px', marginTop: '8px', fontWeight: '500' }}>{p.name}</span>
                      <span style={{ fontSize: '10px', color: '#6b7280' }}>({p.species})</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '12px', paddingTop: '16px' }}>
              <button
                onClick={closeModal}
                style={{ flex: 1, padding: '12px', border: '1px solid #d1d5db', backgroundColor: 'white', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}
              >
                취소
              </button>
              <button
                onClick={handleSave}
                style={{ flex: 1, padding: '12px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' }}
              >
                {editingEvent !== null ? "수정 완료" : "저장"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 하단 네비게이션 바 */}
      <div style={styles.navbar}>
        <div style={styles.navContainer}>
          <button
            onClick={() => navigate('/main')}
            style={{ ...styles.navButton2, color: '#6b7280' }}
          >
            <Home size={24} strokeWidth={2} />
            <span style={{ fontSize: '12px', fontWeight: '500' }}>홈</span>
          </button>
          
          <button
            onClick={() => navigate('/main/community')}
            style={{ ...styles.navButton2, color: '#6b7280' }}
          >
            <Users size={24} strokeWidth={2} />
            <span style={{ fontSize: '12px', fontWeight: '500' }}>커뮤니티</span>
          </button>
          
          <button 
            onClick={() => navigate('/community/mypage')}
            style={{ ...styles.navButton2, color: '#6b7280' }}
          >
            <Heart size={24} strokeWidth={2} />
            <span style={{ fontSize: '12px', fontWeight: '500' }}>마이페이지</span>
          </button>
          
          <button
            onClick={() => navigate('/main/setting')}
            style={{ ...styles.navButton2, color: '#6b7280' }}
          >
            <Bell size={24} strokeWidth={2} />
            <span style={{ fontSize: '12px', fontWeight: '500' }}>알림</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default DiaryPage;