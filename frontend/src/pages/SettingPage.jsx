import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Home, Users, Heart, Sprout, Droplet, ThermometerSnowflake, Apple, MessageCircle, ThumbsUp } from 'lucide-react';

function SettingPage() {
  const navigate = useNavigate();
  
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      plantName: '바질',
      message: '새싹이 생겼어요.',
      time: '30분 전',
      isRead: false,
      type: 'growth'
    },
    {
      id: 2,
      userName: '김민수',
      message: '님이 회원님의 게시물에 댓글을 남겼습니다.',
      time: '45분 전',
      isRead: false,
      type: 'comment'
    },
    {
      id: 3,
      plantName: '토마토',
      message: '물을 채워 넣으셔야 할 것 같아요.',
      time: '1시간 전',
      isRead: false,
      type: 'water'
    },
    {
      id: 4,
      userName: '이지은',
      message: '님이 회원님의 게시물을 좋아합니다.',
      time: '2시간 전',
      isRead: false,
      type: 'like'
    },
    {
      id: 5,
      plantName: '상추',
      message: '줄기가 자랐어요.',
      time: '3시간 전',
      isRead: true,
      type: 'growth'
    },
    {
      id: 6,
      userName: '박서준',
      message: '님이 회원님의 댓글에 답글을 남겼습니다.',
      time: '4시간 전',
      isRead: true,
      type: 'comment'
    },
    {
      id: 7,
      plantName: '방울토마토',
      message: '꽃이 피었습니다!',
      time: '5시간 전',
      isRead: true,
      type: 'growth'
    },
    {
      id: 8,
      userName: '최유진',
      message: '님이 회원님의 게시물을 좋아합니다.',
      time: '6시간 전',
      isRead: true,
      type: 'like'
    },
    {
      id: 9,
      plantName: '바질',
      message: '식물이 추워해요.',
      time: '1일 전',
      isRead: true,
      type: 'temperature'
    },
    {
      id: 10,
      plantName: '딸기',
      message: '열매가 열렸어요.',
      time: '2일 전',
      isRead: true,
      type: 'growth'
    },
    {
      id: 11,
      plantName: '상추',
      message: '수확하셔야 할 것 같아요.',
      time: '2일 전',
      isRead: true,
      type: 'harvest'
    },
    {
      id: 12,
      plantName: '고추',
      message: '식물이 더워해요.',
      time: '3일 전',
      isRead: true,
      type: 'temperature'
    }
  ]);

  const getNotificationIcon = (type) => {
    const iconProps = { size: 20, className: "text-green-600" };
    switch(type) {
      case 'growth':
        return <Sprout {...iconProps} />;
      case 'water':
        return <Droplet {...iconProps} />;
      case 'temperature':
        return <ThermometerSnowflake {...iconProps} />;
      case 'harvest':
        return <Apple {...iconProps} />;
      case 'comment':
        return <MessageCircle {...iconProps} />;
      case 'like':
        return <ThumbsUp {...iconProps} />;
      default:
        return <Sprout {...iconProps} />;
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleNotificationClick = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, isRead: true } : n
    ));
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', display: 'flex', flexDirection: 'column' }}>
      {/* 헤더 */}
      <div style={{ backgroundColor: 'white', borderBottom: '1px solid #e5e7eb', padding: '1rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>알림</h1>
          {unreadCount > 0 && (
            <div style={{ 
              backgroundColor: '#10b981', 
              color: 'white', 
              fontSize: '0.875rem', 
              fontWeight: '600',
              padding: '0.25rem 0.75rem', 
              borderRadius: '9999px' 
            }}>
              {unreadCount}개의 새 알림
            </div>
          )}
        </div>
      </div>

      {/* 알림 리스트 */}
      <div style={{ flex: 1, overflowY: 'auto', paddingBottom: '6rem' }}>
        {notifications.map((notification) => (
          <div
            key={notification.id}
            onClick={() => handleNotificationClick(notification.id)}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
              padding: '1rem 1.5rem',
              borderBottom: '1px solid #f3f4f6',
              cursor: 'pointer',
              backgroundColor: notification.isRead ? 'white' : '#ecfdf5',
              transition: 'background-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = notification.isRead ? 'white' : '#ecfdf5'}
          >
            {/* 읽음/안읽음 표시 */}
            <div style={{ flexShrink: 0, marginTop: '0.25rem' }}>
              {!notification.isRead && (
                <div style={{ 
                  width: '0.75rem', 
                  height: '0.75rem', 
                  backgroundColor: '#10b981', 
                  borderRadius: '9999px' 
                }}></div>
              )}
              {notification.isRead && (
                <div style={{ width: '0.75rem', height: '0.75rem' }}></div>
              )}
            </div>

            {/* 아이콘 */}
            <div style={{ flexShrink: 0, marginTop: '0.125rem' }}>
              {getNotificationIcon(notification.type)}
            </div>

            {/* 알림 내용 */}
            <div style={{ flex: 1 }}>
              {notification.plantName && (
                <p style={{ 
                  fontSize: '0.75rem',
                  color: notification.isRead ? '#6b7280' : '#059669',
                  fontWeight: notification.isRead ? 'normal' : '600'
                }}>
                  {notification.plantName}
                </p>
              )}
              {notification.userName && (
                <p style={{ 
                  fontSize: '0.75rem',
                  color: notification.isRead ? '#6b7280' : '#059669',
                  fontWeight: notification.isRead ? 'normal' : '600'
                }}>
                  {notification.userName}
                </p>
              )}
              <p style={{ 
                fontSize: '0.875rem',
                marginTop: '0.125rem',
                color: notification.isRead ? '#6b7280' : '#1f2937',
                fontWeight: notification.isRead ? 'normal' : '500'
              }}>
                {notification.message}
              </p>
              <p style={{ fontSize: '0.75rem', color: '#9ca3af', marginTop: '0.25rem' }}>
                {notification.time}
              </p>
            </div>
          </div>
        ))}
      </div>

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
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: '0.25rem',
              color: '#10b981',
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

export default SettingPage;