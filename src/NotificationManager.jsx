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

    // Mock Data for History
    const [historyData, setHistoryData] = useState([
        { id: 1, date: '2026-02-08 09:00', type: '사망자 보고', recipient: '상급부대(작전처)', status: 'Success' },
        { id: 2, date: '2026-02-08 08:30', type: '기상 악화 알림', recipient: '예하부대 전체', status: 'Success' },
        { id: 3, date: '2026-02-07 18:00', type: '일일 결산', recipient: '지휘통제실', status: 'Success' },
        { id: 4, date: '2026-02-07 14:45', type: '긴급 후송 요청', recipient: '의무대', status: 'Failed' },
    ]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNotificationForm({ ...notificationForm, [name]: value });
    };

    const handleSendNotification = (e) => {
        e.preventDefault();
        alert(`알림이 발송되었습니다.\n유형: ${notificationForm.type}\n수신: ${notificationForm.recipient}\n내용: ${notificationForm.title}`);
        // Add to history (Mock)
        const newHistory = {
            id: historyData.length + 1,
            date: new Date().toLocaleString(),
            type: notificationForm.type,
            recipient: notificationForm.recipient,
            status: 'Pending'
        };
        setHistoryData([newHistory, ...historyData]);
        setNotificationForm({ title: '', content: '', recipient: '', type: '일반 알림' });
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

            <main className="dashboard-content">
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
                                            <th>수신처</th>
                                            <th>상태</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {historyData.map((item) => (
                                            <tr key={item.id}>
                                                <td>{item.date}</td>
                                                <td>{item.type}</td>
                                                <td>{item.recipient}</td>
                                                <td>
                                                    <span className={`status-badge ${item.status.toLowerCase()}`}>
                                                        {item.status === 'Success' && '전송 완료'}
                                                        {item.status === 'Failed' && '전송 실패'}
                                                        {item.status === 'Pending' && '전송 중'}
                                                    </span>
                                                </td>
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
