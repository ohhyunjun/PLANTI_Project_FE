import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Plus, Trash2, Edit, Image, Film, FileText, X, Bell, Home, Users, Heart } from "lucide-react";

function DiaryPage() {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date(2025, 0, 1));
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

  const plants = [
    { name: "Rose", color: "rgb(248 113 113)" },
    { name: "Lily", color: "rgb(250 204 21)" },
    { name: "Cactus", color: "rgb(34 197 94)" },
    { name: "Tulip", color: "rgb(244 114 182)" },
  ];

  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

  const calendarWeeks = [];
  const days = getCalendarDays();
  for (let i = 0; i < days.length; i += 7) {
    calendarWeeks.push(days.slice(i, i + 7));
  }

  const styles = {
    container: {
      padding: '24px',
      maxWidth: '1280px',
      margin: '0 auto',
      backgroundColor: 'white',
      minHeight: '100vh',
      paddingBottom: '100px'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px'
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold'
    },
    navButton: {
      padding: '8px',
      cursor: 'pointer',
      border: 'none',
      backgroundColor: 'transparent',
      borderRadius: '8px',
      transition: 'background-color 0.2s'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      backgroundColor: 'white',
      borderRadius: '8px',
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
      backgroundColor: '#34d399',
      borderRadius: '50%',
      margin: '2px'
    },
    fab: {
      position: 'fixed',
      bottom: '90px',
      right: '24px',
      width: '56px',
      height: '56px',
      backgroundColor: '#10b981',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '50%',
      boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
      cursor: 'pointer',
      border: 'none',
      transition: 'transform 0.2s, background-color 0.2s'
    },
    addButton: {
      marginTop: '16px',
      width: '56px',
      height: '56px',
      backgroundColor: '#10b981',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '50%',
      boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
      cursor: 'pointer',
      border: 'none',
      transition: 'transform 0.2s, background-color 0.2s',
      margin: '16px auto 0'
    },
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    },
    modalContent: {
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '24px',
      maxWidth: '600px',
      width: '90%',
      maxHeight: '90vh',
      overflowY: 'auto'
    },
    card: {
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      padding: '16px',
      backgroundColor: 'white'
    }
  };

  const hasEvents = selectedDate && events[formatDate(selectedDate)]?.length > 0;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button 
          onClick={() => handleMonthChange(-1)}
          style={styles.navButton}
          onMouseEnter={e => e.target.style.backgroundColor = '#f3f4f6'}
          onMouseLeave={e => e.target.style.backgroundColor = 'transparent'}
        >
          <ChevronLeft size={24} />
        </button>
        <h2 style={styles.title}>
          {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
        </h2>
        <button 
          onClick={() => handleMonthChange(1)}
          style={styles.navButton}
          onMouseEnter={e => e.target.style.backgroundColor = '#f3f4f6'}
          onMouseLeave={e => e.target.style.backgroundColor = 'transparent'}
        >
          <ChevronRight size={24} />
        </button>
      </div>

      <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <table style={styles.table}>
          <thead>
            <tr style={{ backgroundColor: '#f9fafb' }}>
              {weekDays.map((day, idx) => (
                <th 
                  key={day} 
                  style={{
                    ...styles.th,
                    color: idx === 0 ? '#ef4444' : idx === 6 ? '#3b82f6' : '#374151'
                  }}
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {calendarWeeks.map((week, weekIdx) => (
              <tr key={weekIdx}>
                {week.map((day, dayIdx) => {
                  const isToday = day && new Date().toDateString() === 
                    new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();
                  
                  const isSelected = selectedDate && day &&
                    formatDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day)) === 
                    formatDate(selectedDate);
                  
                  const dateKey = day ? formatDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day)) : null;
                  const hasDateEvents = dateKey && events[dateKey]?.length > 0;

                  return (
                    <td 
                      key={dayIdx}
                      style={styles.td}
                      onClick={() => day && setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
                      onMouseEnter={e => e.target.style.backgroundColor = '#f9fafb'}
                      onMouseLeave={e => e.target.style.backgroundColor = 'transparent'}
                    >
                      {day && (
                        <div style={{ position: 'relative', height: '100%' }}>
                          <div style={{
                            ...styles.dayNumber,
                            color: isSelected ? 'white' : (dayIdx === 0 ? '#ef4444' : dayIdx === 6 ? '#3b82f6' : '#1f2937'),
                            backgroundColor: isSelected ? '#10b981' : 'transparent',
                            border: isToday ? '2px solid #10b981' : 'none',
                            fontWeight: isToday ? 'bold' : 'normal'
                          }}>
                            {day}
                          </div>
                          {hasDateEvents && (
                            <div style={{ marginTop: '4px', display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                              {events[dateKey].slice(0, 3).map((_, idx) => (
                                <div key={idx} style={styles.eventDot} />
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedDate && (
        <div style={{ marginTop: '32px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
            {selectedDate.getFullYear()}년 {selectedDate.getMonth() + 1}월 {selectedDate.getDate()}일 기록
          </h3>
          {hasEvents ? (
            <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
              {events[formatDate(selectedDate)].map((event, idx) => (
                <div key={idx} style={styles.card}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <h4 style={{ fontWeight: '600', fontSize: '16px' }}>{event.name}</h4>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button 
                        onClick={() => handleEdit(idx)} 
                        style={{ padding: '4px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(formatDate(selectedDate), idx)} 
                        style={{ padding: '4px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}
                      >
                        <Trash2 size={16} color="#ef4444" />
                      </button>
                    </div>
                  </div>
                  
                  <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>{event.content}</p>
                  
                  {event.media && event.media.length > 0 && (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
                      {event.media.slice(0, 3).map((media, mIdx) => (
                        <div key={mIdx} style={{ position: 'relative', paddingBottom: '100%', backgroundColor: '#f3f4f6', borderRadius: '8px', overflow: 'hidden' }}>
                          {media.type === 'image' ? (
                            <img src={media.url} alt="" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                              <Film size={24} color="#9ca3af" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    {event.plant && (
                      <span style={{ fontSize: '12px', backgroundColor: '#dcfce7', padding: '4px 8px', borderRadius: '12px' }}>
                        🌱 {event.plant}
                      </span>
                    )}
                    <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                      {new Date(event.timestamp).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '48px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
              <FileText size={48} color="#d1d5db" style={{ margin: '0 auto 12px' }} />
              <p style={{ color: '#6b7280' }}>아직 기록이 없습니다.</p>
              <p style={{ fontSize: '14px', color: '#9ca3af', marginTop: '4px' }}>+ 버튼을 눌러 첫 기록을 추가해보세요!</p>
              
              <button
                onClick={openAddModal}
                style={styles.addButton}
                onMouseEnter={e => e.target.style.backgroundColor = '#059669'}
                onMouseLeave={e => e.target.style.backgroundColor = '#10b981'}
              >
                <Plus size={28} />
              </button>
            </div>
          )}
        </div>
      )}

      {selectedDate && hasEvents && (
        <button
          onClick={openAddModal}
          style={styles.fab}
          onMouseEnter={e => e.target.style.backgroundColor = '#059669'}
          onMouseLeave={e => e.target.style.backgroundColor = '#10b981'}
        >
          <Plus size={28} />
        </button>
      )}

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
                style={{ width: '100%', border: '1px solid #d1d5db', padding: '12px', borderRadius: '8px', fontSize: '14px' }}
              />
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>내용</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                placeholder="오늘 있었던 일을 기록해보세요"
                style={{ width: '100%', border: '1px solid #d1d5db', padding: '12px', borderRadius: '8px', height: '128px', resize: 'none', fontSize: '14px' }}
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
              <div style={{ display: 'flex', gap: '16px' }}>
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
                    <span style={{ fontSize: '12px', marginTop: '8px' }}>{p.name}</span>
                  </label>
                ))}
              </div>
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
      <div style={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        backgroundColor: 'white', 
        borderTop: '1px solid #e5e7eb',
        boxShadow: '0 -1px 3px 0 rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-around', 
          padding: '0.75rem 1rem',
          maxWidth: '28rem',
          margin: '0 auto'
        }}>
          <button
            onClick={() => navigate('/main')}
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: '0.25rem',
              color: '#6b7280',
              minWidth: '60px',
              border: 'none',
              background: 'none',
              cursor: 'pointer'
            }}
          >
            <Home size={24} strokeWidth={2} />
            <span style={{ fontSize: '0.75rem', fontWeight: '500' }}>홈</span>
          </button>
          
          <button
            onClick={() => navigate('/main/community')}
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: '0.25rem',
              color: '#6b7280',
              minWidth: '60px',
              border: 'none',
              background: 'none',
              cursor: 'pointer'
            }}
          >
            <Users size={24} strokeWidth={2} />
            <span style={{ fontSize: '0.75rem', fontWeight: '500' }}>커뮤니티</span>
          </button>
          
          <button
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: '0.25rem',
              color: '#6b7280',
              minWidth: '60px',
              border: 'none',
              background: 'none',
              cursor: 'pointer'
            }}
          >
            <Heart size={24} strokeWidth={2} />
            <span style={{ fontSize: '0.75rem', fontWeight: '500' }}>좋아요</span>
          </button>
          
          <button
            onClick={() => navigate('/main/setting')}
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: '0.25rem',
              color: '#6b7280',
              minWidth: '60px',
              border: 'none',
              background: 'none',
              cursor: 'pointer'
            }}
          >
            <Bell size={24} strokeWidth={2} />
            <span style={{ fontSize: '0.75rem', fontWeight: '500' }}>알림</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default DiaryPage;