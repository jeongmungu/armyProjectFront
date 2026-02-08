import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import './SituationSummary.css'; // Import the new CSS

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const SituationSummary = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [rankChartData, setRankChartData] = useState(null);
    const [unitChartData, setUnitChartData] = useState(null);
    const [stackedChartData, setStackedChartData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://armyprojectbackend.onrender.com/casualties');
                if (response.ok) {
                    const data = await response.json();
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
                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
                },
            ],
        });

        // 2. Casualties by Unit
        const unitCounts = {};
        data.forEach(item => {
            unitCounts[item.uc] = (unitCounts[item.uc] || 0) + 1;
        });
        const unitLabels = Object.keys(unitCounts).sort();

        setUnitChartData({
            labels: unitLabels,
            datasets: [
                {
                    label: '부대별 사망자 수',
                    data: unitLabels.map(label => unitCounts[label]),
                    backgroundColor: 'rgba(255, 99, 132, 0.6)',
                },
            ],
        });

        // 3. Unit x Rank (Stacked)
        // Ensure consistent ranks for stacking
        const allRanks = Array.from(new Set(data.map(item => item.rank))).sort();
        const datasets = allRanks.map((rank, index) => {
            // Generate a color for each rank
            const color = `hsl(${(index * 360) / allRanks.length}, 70%, 50%)`;

            return {
                label: rank,
                data: unitLabels.map(unit => {
                    return data.filter(item => item.uc === unit && item.rank === rank).length;
                }),
                backgroundColor: color,
            };
        });

        setStackedChartData({
            labels: unitLabels,
            datasets: datasets,
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
                        {/* Rank Chart Skeleton */}
                        <div className="summary-card">
                            <h2>계급별 사망 현황</h2>
                            <div className="skeleton-box skeleton-medium"></div>
                        </div>

                        {/* Unit Chart Skeleton */}
                        <div className="summary-card">
                            <h2>부대별 사망 현황</h2>
                            <div className="skeleton-box skeleton-medium"></div>
                        </div>

                        {/* Stacked Analysis Skeleton */}
                        <div className="summary-card">
                            <h2>부대별 계급 종합 분석</h2>
                            <div className="skeleton-box skeleton-large"></div>
                        </div>
                    </>
                ) : (
                    <>
                        {/* Rank Chart */}
                        <div className="summary-card">
                            <h2>계급별 사망 현황</h2>
                            {rankChartData && <div className="chart-container-medium">
                                <Bar
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: { legend: { position: 'top' } }
                                    }}
                                    data={rankChartData}
                                />
                            </div>}
                        </div>

                        {/* Unit Chart */}
                        <div className="summary-card">
                            <h2>부대별 사망 현황</h2>
                            {unitChartData && <div className="chart-container-medium">
                                <Bar
                                    options={{
                                        indexAxis: 'y',
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        plugins: { legend: { position: 'top' } }
                                    }}
                                    data={unitChartData}
                                />
                            </div>}
                        </div>

                        {/* Stacked Analysis */}
                        <div className="summary-card">
                            <h2>부대별 계급 종합 분석</h2>
                            {stackedChartData && <div className="chart-container-large">
                                <Bar
                                    options={{
                                        responsive: true,
                                        maintainAspectRatio: false,
                                        scales: { x: { stacked: true }, y: { stacked: true } },
                                        plugins: { legend: { position: 'bottom' } }
                                    }}
                                    data={stackedChartData}
                                />
                            </div>}
                        </div>
                    </>
                )}
            </main>
        </div >
    );
};

export default SituationSummary;
