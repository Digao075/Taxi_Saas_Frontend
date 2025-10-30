import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import DriversPage from './pages/DriversPage';
import ProtectedRoute from './components/ProtectedRoute';
import DriverDetailPage from './pages/DriverDetailPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        

        <Route path="/dashboard" element={ <ProtectedRoute> <DashboardPage/> </ProtectedRoute>} />
        
        <Route
          path="/drivers"
          element={<ProtectedRoute><DriversPage /></ProtectedRoute>}
        />
        
        <Route
          path="/drivers/:driverId"
          element={<ProtectedRoute><DriverDetailPage /></ProtectedRoute>}
        />
        
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;