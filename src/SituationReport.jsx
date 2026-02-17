import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import './Dashboard.css';
import './SituationReport.css';

const containerStyle = {
    width: '100%',
    height: '400px'
};

const SituationReport = () => {
    const navigate = useNavigate(); // Restored navigate
    const location = useLocation();
    const [casualties, setCasualties] = useState([]);
    const [filteredCasualties, setFilteredCasualties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(location.state?.searchQuery || '');
    const [selectedCasualty, setSelectedCasualty] = useState(null);

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: "AIzaSyCD9Ulynn8Kav98eOoBTgbpnz0ymhQVaNo"
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://armyprojectbackend.onrender.com/casualties');
                if (response.ok) {
                    const data = await response.json();
                    setCasualties(data);
                    setFilteredCasualties(data);
                }
            } catch (error) {
                console.error('Error fetching casualties:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const results = casualties.filter(item =>
            item.nm.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.srvno.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.uc.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.rank.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredCasualties(results);
    }, [searchTerm, casualties]);

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="back-button"
                >
                    &lt;
                </button>
                <h1 className="dashboard-title">사망자 관리 명부</h1>
            </header>

            <main className="dashboard-content report-content">
                <div className="report-card">
                    {/* Map Modal */}
                    {selectedCasualty && (
                        <div className="modal-overlay" onClick={() => setSelectedCasualty(null)}>
                            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                <header className="modal-header">
                                    <h2>위치 정보 ({selectedCasualty.nm} {selectedCasualty.rank})</h2>
                                    <button className="close-button" onClick={() => setSelectedCasualty(null)}>×</button>
                                </header>
                                <div className="map-container">
                                    {isLoaded ? (
                                        <GoogleMap
                                            mapContainerStyle={containerStyle}
                                            center={{ lat: selectedCasualty.lat || 37.5665, lng: selectedCasualty.lng || 126.9780 }}
                                            zoom={8}
                                        >
                                            {selectedCasualty.lat && selectedCasualty.lng && (
                                                <Marker
                                                    position={{ lat: selectedCasualty.lat, lng: selectedCasualty.lng }}
                                                />
                                            )}
                                        </GoogleMap>
                                    ) : (
                                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                            지도를 불러오는 중입니다...
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="search-container">
                        <input
                            type="text"
                            placeholder="이름, 군번, 계급 또는 부대명으로 검색..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>

                    <div className="table-container">
                        <table className="data-table">
                            <colgroup>
                                <col style={{ width: '35%' }} />
                                <col style={{ width: '20%' }} />
                                <col style={{ width: '15%' }} />
                                <col style={{ width: '30%' }} />
                            </colgroup>
                            <thead className="table-header">
                                <tr>
                                    <th className="table-th">군번</th>
                                    <th className="table-th">이름</th>
                                    <th className="table-th">계급</th>
                                    <th className="table-th">부대명</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    // Skeleton Rows for Loading State
                                    Array.from({ length: 15 }).map((_, index) => (
                                        <tr key={`skeleton-${index}`} className="table-row">
                                            <td className="table-cell"><div style={{ height: '1rem', backgroundColor: '#f3f4f6', borderRadius: '4px' }}></div></td>
                                            <td className="table-cell"><div style={{ height: '1rem', backgroundColor: '#f3f4f6', borderRadius: '4px' }}></div></td>
                                            <td className="table-cell"><div style={{ height: '1rem', backgroundColor: '#f3f4f6', borderRadius: '4px' }}></div></td>
                                            <td className="table-cell"><div style={{ height: '1rem', backgroundColor: '#f3f4f6', borderRadius: '4px' }}></div></td>
                                        </tr>
                                    ))
                                ) : (
                                    <>
                                        {filteredCasualties.map((item) => (
                                            <tr
                                                key={item.id}
                                                className="table-row clickable-row"
                                                onClick={() => setSelectedCasualty(item)}
                                            >
                                                <td className="table-cell">{item.srvno}</td>
                                                <td className="table-cell-bold">{item.nm}</td>
                                                <td className="table-cell">{item.rank}</td>
                                                <td className="table-cell">{item.uc}</td>
                                            </tr>
                                        ))}
                                        {filteredCasualties.length === 0 && (
                                            <tr>
                                                <td colSpan="4" className="empty-message">
                                                    검색 결과가 없습니다.
                                                </td>
                                            </tr>
                                        )}
                                    </>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SituationReport;
