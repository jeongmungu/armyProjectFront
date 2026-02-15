import React from 'react';
import { useNavigate } from 'react-router-dom';
import hogukiIcon from './assets/hoguki_icon.png';
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();

    const handleMenuClick = (title) => {
        if (title === '사망자 관리 명부') {
            navigate('/situation-report');
        } else if (title === '실시간 상황 요약') {
            navigate('/situation-summary');
        } else if (title === '사망자 발생 신고') {
            navigate('/casualty-report');
        } else if (title === '알림 및 전송 관리') {
            navigate('/notification-manager');
        }
    };

    const menuItems = [
        {
            id: 1,
            title: '실시간 상황 요약',
            description: '현재 전시 사망자에 대한 실시간 정보를 확인합니다.',
            icon: '📊'
        },
        {
            id: 2,
            title: '사망자 발생 신고',
            description: '신규 사망자 발생 사실을 신속하게 접수하고 보고합니다.',
            icon: '🚨'
        },
        {
            id: 3,
            title: '사망자 관리 명부',
            description: '등록된 사망자의 상세 정보를 조회하고 관리합니다.',
            icon: '📋'
        },
        {
            id: 4,
            title: '알림 및 전송 관리',
            description: '부서간 알림 발송 및 데이터 전송 현황을 관리합니다.',
            icon: '📡'
        }
    ];

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="header-content">
                    {/* <img src={hogukiIcon} alt="Hoguk-i" className="header-mascot" /> */}
                    <h1 className="dashboard-title">전사망자 관리체계</h1>
                </div>
                <div className="roka-badge-small">ROKA</div>
            </header>

            <main className="dashboard-content">
                <div className="welcome-banner">
                    <h2 className="welcome-text">정예 육군, 호국이와 함께!</h2>
                    <p className="welcome-subtext">오늘도 임무 수행에 수고가 많으십니다.</p>
                </div>
                <div className="menu-grid">
                    {menuItems.map((item) => (
                        <div
                            key={item.id}
                            className="menu-card"
                            role="button"
                            tabIndex={0}
                            onClick={() => handleMenuClick(item.title)}
                        >
                            <div className="menu-icon">{item.icon}</div>
                            <div className="menu-text">
                                <h2 className="menu-title">{item.title}</h2>
                                <p className="menu-desc">{item.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="logout-btn-container">
                    <button className="logout-btn" onClick={() => navigate('/')}>로그아웃</button>
                </div>
            </main>

            <footer className="dashboard-footer">
                <p className="footer-text">© 2026 대한민국 육군 전사망자 관리체계. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default Dashboard;
