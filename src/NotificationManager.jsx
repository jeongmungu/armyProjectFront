import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import './NotificationManager.css';

const NotificationManager = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('notifications');
    const [notificationForm, setNotificationForm] = useState({
        title: '',
        content: '',
        recipient: '',
        type: '일반 알림' // Default type
    });

    const [selectedNotification, setSelectedNotification] = useState(null);
    const [historyData, setHistoryData] = useState([]);

    React.useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await fetch('https://armyprojectbackend.onrender.com/notifications');
                if (response.ok) {
                    const data = await response.json();
                    setHistoryData(data);
                }
            } catch (error) {
                console.error("Failed to fetch notifications:", error);
            }
        };
        fetchHistory();
    }, [activeTab]); // Fetch when tab changes or component mounts

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNotificationForm({ ...notificationForm, [name]: value });
    };

    const handleSendNotification = (e) => {
        e.preventDefault();
        alert(`알림이 발송되었습니다.\n유형: ${notificationForm.type}\n수신: ${notificationForm.recipient}\n내용: ${notificationForm.title}`);
        // Add to history (Mock)
        const newHistory = {
            id: Date.now(),
            date: new Date().toLocaleString(),
            type: notificationForm.type,
            recipient: notificationForm.recipient,
            status: 'Pending',
            srvno: '-',
            nm: '-',
            content: notificationForm.content,
            title: notificationForm.title
        };
        setHistoryData([newHistory, ...historyData]);
        setNotificationForm({ title: '', content: '', recipient: '', type: '일반 알림' });
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        // Assuming format YYYY-MM-DD HH:MM:SS
        const datePart = dateString.substring(2, 10); // "24-02-15"
        const timePart = dateString.substring(11, 16); // "13:30"
        return (
            <>
                {datePart}
                <br />
                {timePart}
            </>
        );
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="back-button"
                >
                    &lt;
                </button>
                <h1 className="dashboard-title">알림 및 전송 관리</h1>
            </header>

            <main className="dashboard-content notification-content">
                {selectedNotification && (
                    <div className="modal-overlay" onClick={() => setSelectedNotification(null)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <header className="modal-header">
                                <h2>알림 상세 정보</h2>
                                <button className="close-button" onClick={() => setSelectedNotification(null)}>×</button>
                            </header>
                            <div className="modal-body">
                                <div className="detail-row">
                                    <span className="detail-label">일시:</span>
                                    <span className="detail-value">{selectedNotification.date}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">유형:</span>
                                    <span className="detail-value">{selectedNotification.type}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">제목:</span>
                                    <span className="detail-value">{selectedNotification.title}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">군번:</span>
                                    <span className="detail-value">{selectedNotification.srvno || '-'}</span>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-label">수신처:</span>
                                    <span className="detail-value">{selectedNotification.recipient || '-'}</span>
                                </div>
                                <div className="detail-row" style={{ borderBottom: 'none', flexDirection: 'column' }}>
                                    {/* <span className="detail-label" style={{ marginBottom: '5px' }}>내용:</span> */}
                                    <div className="detail-value" style={{ background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '6px', minHeight: '100px', maxHeight: '300px', overflowY: 'auto', textAlign: 'left' }}>
                                        {selectedNotification.content}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="tabs">
                    <button
                        className={`tab-button ${activeTab === 'notifications' ? 'active' : ''}`}
                        onClick={() => setActiveTab('notifications')}
                    >
                        알림 발송
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'history' ? 'active' : ''}`}
                        onClick={() => setActiveTab('history')}
                    >
                        전송 이력
                    </button>
                </div>

                <div className="tab-content">
                    {activeTab === 'notifications' && (
                        <div className="notification-form-container">
                            <h2 className="section-title">신규 알림 작성</h2>
                            <form onSubmit={handleSendNotification} className="notification-form">
                                <div className="form-group">
                                    <label>유형</label>
                                    <select
                                        name="type"
                                        value={notificationForm.type}
                                        onChange={handleInputChange}
                                        className="form-input"
                                    >
                                        <option value="일반 알림">일반 알림</option>
                                        <option value="사망자 보고">사망자 보고</option>
                                        <option value="긴급 명령">긴급 명령</option>
                                        <option value="상황 보고">상황 보고</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>수신처</label>
                                    <select
                                        name="recipient"
                                        value={notificationForm.recipient}
                                        onChange={handleInputChange}
                                        required
                                        className="form-input"
                                    >
                                        <option value="">수신처를 선택하세요</option>
                                        <option value="all">전체 예하 부대</option>
                                        <option value="hq">상급 부대 (작전처)</option>
                                        <option value="medical">의무대</option>
                                        <option value="mp">헌병대</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>제목</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={notificationForm.title}
                                        onChange={handleInputChange}
                                        placeholder="알림 제목을 입력하세요"
                                        required
                                        className="form-input"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>내용</label>
                                    <textarea
                                        name="content"
                                        value={notificationForm.content}
                                        onChange={handleInputChange}
                                        placeholder="알림 내용을 입력하세요"
                                        required
                                        className="form-input textarea-input"
                                    />
                                </div>
                                <button type="submit" className="submit-button">발송하기</button>
                            </form>
                        </div>
                    )}

                    {activeTab === 'history' && (
                        <div className="history-container">
                            <h2 className="section-title">전송 및 알림 이력</h2>
                            <div className="table-responsive">
                                <table className="history-table">
                                    <thead>
                                        <tr>
                                            <th>일시</th>
                                            <th>유형</th>
                                            <th>제목</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {historyData.map((item) => (
                                            <tr
                                                key={item.id}
                                                className="clickable-row"
                                                onClick={() => setSelectedNotification(item)}
                                            >
                                                <td>{formatDate(item.date)}</td>
                                                <td>{item.type}</td>
                                                <td className="title-cell">{item.title}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default NotificationManager;
