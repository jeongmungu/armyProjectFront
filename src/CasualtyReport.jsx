import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';
import './CasualtyReport.css';

const CasualtyReport = () => {
    const navigate = useNavigate();
    const [srvno, setSrvno] = useState('');
    const [soldier, setSoldier] = useState(null);
    const [loading, setLoading] = useState(false);
    const [report, setReport] = useState(null);
    const [error, setError] = useState(null);
    const [step, setStep] = useState(1); // 1: Input, 2: Confirm, 3: Result
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (date) => {
        if (!date || isNaN(date.getTime())) return '';
        return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
    };

    const handleSearch = async () => {
        if (!srvno) return;
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`https://armyprojectbackend.onrender.com/insa/${srvno}`);
            if (response.ok) {
                const data = await response.json();
                setSoldier(data);
                setStep(2);
            } else {
                setError("해당 군번의 인원을 찾을 수 없습니다.");
            }
        } catch (err) {
            setError("서버 통신 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const submitReport = async (lat, lng) => {
        try {
            const now = new Date();
            const formattedTime = `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일 ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')} 경`;

            const payload = {
                srvno: soldier.srvno,
                lat: lat,
                lng: lng,
                timestamp: formattedTime
            };

            const response = await fetch('https://armyprojectbackend.onrender.com/generate-report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const data = await response.json();
                setReport(data);
                setStep(3);
            } else {
                setError("보고서 생성 중 오류가 발생했습니다.");
            }
        } catch (err) {
            setError("서버 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateReport = () => {
        setLoading(true);
        setError(null);

        if (!navigator.geolocation) {
            alert("이 브라우저에서는 위치 정보를 지원하지 않아 기본 위치로 진행합니다.");
            submitReport(38.00, 127.00);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                submitReport(position.coords.latitude, position.coords.longitude);
            },
            (err) => {
                alert("위치 정보를 가져올 수 없어 기본 위치로 진행합니다.\n(" + err.message + ")");
                submitReport(38.00, 127.00);
            }
        );
    };

    const handleSendReport = async () => {
        if (!report || !soldier) return;
        setLoading(true);

        try {
            // Parse location string "lat, lng"
            const [latStr, lngStr] = report.location.split(', ');
            const lat = parseFloat(latStr);
            const lng = parseFloat(lngStr);

            // Remove °C from weather string
            const cleanedWeather = report.weather.replace('°C', '');

            const payload = {
                srvno: soldier.srvno,
                lat: lat,
                lng: lng,
                report_content: report.report,
                weather: cleanedWeather,
                location: report.location
            };

            const response = await fetch('https://armyprojectbackend.onrender.com/submit-report', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                alert("보고서가 전송되었습니다.");
                // Optional: Navigate back or reset
                setStep(1);
                setSrvno('');
                setReport(null);
                setSoldier(null);
            } else {
                alert("보고서 전송에 실패했습니다.");
            }
        } catch (error) {
            console.error("Error sending report:", error);
            alert("전송 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="dashboard-back-btn"
                >
                    &lt;
                </button>
                <h1 className="dashboard-title">사망자 발생 신고</h1>
            </header>

            <main className="dashboard-content casualty-report-content">

                {/* Step 1: Input Service Number */}
                {step === 1 && (
                    <div className="casualty-step-card">
                        <h2>대상자 조회</h2>
                        <div className="search-box">
                            <input
                                type="text"
                                placeholder="군번 입력 (예: 24-100001)"
                                value={srvno}
                                onChange={(e) => setSrvno(e.target.value)}
                                className="search-input"
                            />
                            <button
                                onClick={handleSearch}
                                disabled={loading}
                                className="search-btn"
                            >
                                {loading ? '조회중...' : '조회'}
                            </button>
                        </div>
                        {error && <p className="error-msg">{error}</p>}
                        <p className="helper-text">
                            * 사망자의 군번을 입력하여 인적사항을 불러옵니다.
                        </p>
                    </div>
                )}

                {/* Step 2: Confirm & Generate */}
                {step === 2 && soldier && (
                    <div className="casualty-step-card">
                        <h2 className="step2-header">인적사항 확인</h2>
                        <div className="info-grid">
                            <div className="info-item">
                                <span className="info-label">이름</span>
                                <span className="info-value">{soldier.nm}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">계급</span>
                                <span className="info-value">{soldier.rank}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">군번</span>
                                <span className="info-value">{soldier.srvno}</span>
                            </div>
                            <div className="info-item">
                                <span className="info-label">소속</span>
                                <span className="info-value">{soldier.uc}</span>
                            </div>
                        </div>

                        <div className="notice-box">
                            <p className="notice-text">
                                📍 <strong>현재 위치</strong>와 🌩️ <strong>기상 정보</strong>를 자동으로 수집하여<br />
                                초기 사망 보고서를 생성합니다.
                            </p>
                            <div className="realtime-clock">
                                🕒 현재 보고 일시: <strong>{currentTime ? formatTime(currentTime) : ''}</strong>
                            </div>
                        </div>

                        <button
                            onClick={handleGenerateReport}
                            disabled={loading}
                            className="generate-btn"
                        >
                            {loading ? 'AI 문서 생성중...' : '📄 사먕자 보고서 생성 (AI)'}
                        </button>
                        {error && <p className="error-msg">{error}</p>}
                    </div>
                )}

                {/* Step 3: Result */}
                {step === 3 && report && (
                    <div className="casualty-step-card">
                        <div className="step3-header">
                            <h2>생성된 보고서</h2>
                            <p className="result-meta">
                                위치: {report.location} | 날씨: {report.weather}
                            </p>
                        </div>
                        <div className="result-body">
                            <textarea
                                value={report.report}
                                onChange={(e) => setReport({ ...report, report: e.target.value })}
                                className="report-textarea"
                            />
                            <div className="action-buttons">
                                <button
                                    onClick={handleSendReport}
                                    className="send-btn"
                                    disabled={loading}
                                >
                                    {loading ? '전송중...' : <>보고서<br />전송</>}
                                </button>
                                <button
                                    onClick={() => setStep(1)}
                                    className="reset-btn"
                                >
                                    처음<br />으로
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default CasualtyReport;
