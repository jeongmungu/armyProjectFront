import React from 'react';
import { useNavigate } from 'react-router-dom';
import hogukiIcon from './assets/hoguki_icon.png';
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();

    const handleMenuClick = (title, searchQuery = null) => {
        if (title === '사망자 관리') {
            navigate('/situation-report', { state: { searchQuery } });
        } else if (title === '상황 요약') {
            navigate('/situation-summary');
        } else if (title === '사망자 발생 신고') {
            navigate('/casualty-report');
        } else if (title === '알림 관리') {
            navigate('/notification-manager');
        }
    };

    const menuItems = [
        {
            id: 1,
            title: '상황 요약',
            // description: '현재 전시 사망자에 대한 실시간 정보를 확인합니다.',
            icon: '📊'
        },
        {
            id: 2,
            title: '사망자 관리',
            // description: '등록된 사망자의 상세 정보를 조회하고 관리합니다.',
            icon: '📋'
        },
        {
            id: 3,
            title: '알림 관리',
            // description: '부서간 알림 발송 및 데이터 전송 현황을 관리합니다.',
            icon: '📡'
        }
    ];

    const menuItems2 = [
        {
            id: 1,
            title: '사망자 발생 신고',
            description: '신규 사망자 발생 사실을 신속하게 접수하고 보고합니다.',
            icon: '🚨'
        }
    ];

    const [menuItems3, setMenuItems3] = React.useState([]);

    React.useEffect(() => {
        const fetchUnitStats = async () => {
            try {
                const response = await fetch('https://armyprojectbackend.onrender.com/dashboard/unit-stats');
                if (response.ok) {
                    const data = await response.json();
                    const items = data.map((item, index) => ({
                        id: index,
                        title: item.unit,
                        description: `사망자수 : ${item.count}`,
                        // icon: '🚨'
                    }));
                    setMenuItems3(items);
                }
            } catch (error) {
                console.error("Failed to fetch unit stats:", error);
            }
        };
        fetchUnitStats();
    }, []);


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

                <div className="menu-grid2">
                    {menuItems2.map((item) => (
                        <div
                            key={item.id}
                            className="menu-card2"
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

                <div className="welcome-banner">
                    <h2 className="welcome-text">국가를 위한 고귀한 희생, 대한민국이 영원히 기억하겠습니다.</h2>
                    <p className="welcome-subtext">대한민국 육
                        군</p>
                </div>

                {menuItems3.length > 0 && (
                    <>
                        <div className="menu-grid3">
                            {menuItems3.map((item) => (
                                <div
                                    key={item.id}
                                    className="menu-card3" // Reuse horizontal card style
                                    role="button"
                                    tabIndex={0}
                                    style={{ minHeight: '80px', padding: '1rem' }} // Slight adjustment
                                    onClick={() => handleMenuClick('사망자 관리', item.title)}
                                >
                                    {/* <div className="menu-icon" style={{ fontSize: '1.5rem', width: '40px', height: '40px', marginBottom: 0, marginRight: '1rem' }}>{item.icon}</div> */}
                                    <div className="menu-text" style={{ textAlign: 'left' }}>
                                        <h2 className="menu-title" style={{ fontSize: '1rem', marginBottom: '0.2rem' }}>{item.title}</h2>
                                        <p className="menu-desc" style={{ display: 'block', fontSize: '0.8rem' }}>{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
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
