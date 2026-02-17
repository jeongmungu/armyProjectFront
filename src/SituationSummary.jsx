import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bar, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels'; // Import the plugin
import './SituationSummary.css';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    ChartDataLabels // Register the plugin
);

const SituationSummary = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [rankChartData, setRankChartData] = useState(null);
    const [unitChartData, setUnitChartData] = useState(null);
    const [stackedChartData, setStackedChartData] = useState(null);
    const [casualtyData, setCasualtyData] = useState([]); // Store raw data for table

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://armyprojectbackend.onrender.com/casualties');
                if (response.ok) {
                    const data = await response.json();
                    setCasualtyData(data); // Save raw data
                    processData(data);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const processData = (data) => {
        // Chart Options Helpers
        const commonOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: '#d1d5db', // Light gray text
                        font: { family: "'Inter', sans-serif" }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(17, 24, 39, 0.9)',
                    titleColor: '#f3f4f6',
                    bodyColor: '#d1d5db',
                    padding: 12,
                    cornerRadius: 8,
                    displayColors: true
                },
                datalabels: {
                    display: false // Disable data labels by default (for Bar charts)
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(75, 85, 99, 0.2)',
                        borderDash: [5, 5]
                    },
                    ticks: { color: '#9ca3af' }
                },
                y: {
                    grid: {
                        color: 'rgba(75, 85, 99, 0.2)',
                        borderDash: [5, 5]
                    },
                    ticks: { color: '#9ca3af' }
                }
            },
            elements: {
                bar: {
                    borderRadius: 4 // Rounded bars
                }
            }
        };

        // 1. Casualties by Rank
        const rankCounts = {};
        data.forEach(item => {
            rankCounts[item.rank] = (rankCounts[item.rank] || 0) + 1;
        });
        const rankLabels = Object.keys(rankCounts).sort();

        setRankChartData({
            labels: rankLabels,
            datasets: [
                {
                    label: '계급별 사망자 수',
                    data: rankLabels.map(label => rankCounts[label]),
                    backgroundColor: 'rgba(14, 165, 233, 0.7)', // Sky blue
                    borderColor: 'rgba(14, 165, 233, 1)',
                    borderWidth: 1,
                    hoverBackgroundColor: 'rgba(14, 165, 233, 0.9)',
                },
            ],
            options: commonOptions
        });

        // 2. Casualties by Unit (Pie Chart)
        const unitCounts = {};
        data.forEach(item => {
            unitCounts[item.uc] = (unitCounts[item.uc] || 0) + 1;
        });
        const unitLabels = Object.keys(unitCounts).sort();

        // Generate distinct colors for Pie slices
        const pieColors = unitLabels.map((_, index) => {
            const hue = (index * 137.508) % 360;
            return `hsla(${hue}, 70%, 60%, 0.7)`;
        });
        const pieBorderColors = unitLabels.map((_, index) => {
            const hue = (index * 137.508) % 360;
            return `hsla(${hue}, 70%, 50%, 1)`;
        });

        setUnitChartData({
            labels: unitLabels,
            datasets: [
                {
                    label: '부대별 사망자 수',
                    data: unitLabels.map(label => unitCounts[label]),
                    backgroundColor: pieColors,
                    borderColor: pieBorderColors,
                    borderWidth: 1,
                    hoverOffset: 4
                },
            ],
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom', // Legend on the bottom for Pie
                        labels: { color: '#d1d5db', font: { family: "'Inter', sans-serif" } }
                    },
                    tooltip: commonOptions.plugins.tooltip,
                    datalabels: {
                        display: true, // Enable for Pie chart
                        color: '#fff',
                        font: {
                            weight: 'bold',
                            size: 14
                        },
                        formatter: (value) => {
                            return value + '명'; // Display count with "명"
                        }
                    }
                }
            }
        });

        // 3. Unit x Rank (Stacked)
        const allRanks = Array.from(new Set(data.map(item => item.rank))).sort();
        const datasets = allRanks.map((rank, index) => {
            // Generate distinct colors
            const hue = (index * 137.508) % 360; // Golden angle approximation for distinct colors
            const color = `hsla(${hue}, 70%, 60%, 0.7)`;
            const borderColor = `hsla(${hue}, 70%, 50%, 1)`;

            return {
                label: rank,
                data: unitLabels.map(unit => {
                    return data.filter(item => item.uc === unit && item.rank === rank).length;
                }),
                backgroundColor: color,
                borderColor: borderColor,
                borderWidth: 1,
            };
        });

        setStackedChartData({
            labels: unitLabels,
            datasets: datasets,
            options: {
                ...commonOptions,
                scales: {
                    x: {
                        stacked: true,
                        grid: { color: 'rgba(75, 85, 99, 0.2)', borderDash: [5, 5] },
                        ticks: { color: '#9ca3af' }
                    },
                    y: {
                        stacked: true,
                        grid: { color: 'rgba(75, 85, 99, 0.2)', borderDash: [5, 5] },
                        ticks: { color: '#9ca3af' }
                    }
                },
                plugins: {
                    ...commonOptions.plugins,
                    legend: { position: 'bottom', labels: { color: '#d1d5db' } }
                }
            }
        });
    };

    return (
        <div className="situation-summary-container">
            <header className="dashboard-header">
                <button
                    onClick={() => navigate('/dashboard')}
                    className="dashboard-back-btn"
                >
                    &lt;
                </button>
                <h1 className="dashboard-title">
                    실시간 상황 요약
                </h1>
            </header>

            <main className="dashboard-content">
                {loading ? (
                    // Skeleton Loading State
                    <>
                        <div className="summary-card">
                            <h2>계급별 사망 현황</h2>
                            <div className="skeleton-box skeleton-medium"></div>
                        </div>
                        <div className="summary-card">
                            <h2>부대별 사망 현황</h2>
                            <div className="skeleton-box skeleton-medium"></div>
                        </div>
                        <div className="summary-card">
                            <h2>부대별 계급 종합 분석</h2>
                            <div className="skeleton-box skeleton-large"></div>
                        </div>
                        <div className="summary-card table-section">
                            <h2>상세 사망 현황</h2>
                            <div className="skeleton-box skeleton-large"></div>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Rank Chart */}
                        <div className="summary-card">
                            <h2>계급별 사망 현황</h2>
                            {rankChartData && <div className="chart-container-medium">
                                <Bar data={rankChartData} options={rankChartData.options} />
                            </div>}
                        </div>

                        {/* Unit Chart */}
                        <div className="summary-card">
                            <h2>부대별 사망 현황</h2>
                            {unitChartData && <div className="chart-container-medium">
                                <Pie data={unitChartData} options={unitChartData.options} />
                            </div>}
                        </div>

                        {/* Stacked Analysis */}
                        <div className="summary-card">
                            <h2>부대별 계급 종합 분석</h2>
                            {stackedChartData && <div className="chart-container-large">
                                <Bar data={stackedChartData} options={stackedChartData.options} />
                            </div>}
                        </div>

                        {/* Data Table */}
                        <div className="summary-card table-section">
                            <h2>계급별 사망 비율</h2>
                            <div className="summary-table-container">
                                <table className="summary-table">
                                    <thead>
                                        <tr>
                                            <th>계급</th>
                                            <th>사망자 수</th>
                                            <th>비율 (%)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.keys(rankChartData?.datasets?.[0]?.data || {}).length > 0 ? (
                                            (() => {
                                                const totalCasualties = casualtyData.length;
                                                const rankCounts = {};
                                                casualtyData.forEach(item => {
                                                    rankCounts[item.rank] = (rankCounts[item.rank] || 0) + 1;
                                                });

                                                // Sort by count descending
                                                const sortedRanks = Object.entries(rankCounts).sort((a, b) => b[1] - a[1]);

                                                return sortedRanks.map(([rank, count]) => {
                                                    const percentage = ((count / totalCasualties) * 100).toFixed(1);
                                                    return (
                                                        <tr key={rank}>
                                                            <td>{rank}</td>
                                                            <td>{count}명</td>
                                                            <td>
                                                                <div className="progress-bar-container">
                                                                    <div
                                                                        className="progress-bar"
                                                                        style={{ width: `${percentage}%` }}
                                                                    ></div>
                                                                    <span className="progress-text">{percentage}%</span>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                });
                                            })()
                                        ) : (
                                            <tr>
                                                <td colSpan="3" className="empty-message">데이터가 없습니다.</td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </main>
        </div >
    );
};

export default SituationSummary;
