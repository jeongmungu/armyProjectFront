import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';
import SituationReport from './SituationReport';
import SituationSummary from './SituationSummary';
import CasualtyReport from './CasualtyReport';
import NotificationManager from './NotificationManager';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/situation-report" element={<SituationReport />} />
        <Route path="/situation-summary" element={<SituationSummary />} />
        <Route path="/casualty-report" element={<CasualtyReport />} />
        <Route path="/notification-manager" element={<NotificationManager />} />
      </Routes>
    </Router>
  );
}

export default App;
