import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { isAuthenticated } from './auth';
import Login from './components/Login';
import Home from './components/Home';
import Reports from './components/Reports';
import Help from './components/Help';
import PerformanceDashboard from './components/PerformanceDashboard';
import { createTheme, ThemeProvider } from '@mui/material';
import { GOOGLE_CLIENT_ID } from './auth';

const theme = createTheme();

function PrivateRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/" />;
}

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <ThemeProvider theme={theme}>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route
              path="/home"
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <PrivateRoute>
                  <Reports />
                </PrivateRoute>
              }
            />
            <Route
              path="/help"
              element={
                <PrivateRoute>
                  <Help />
                </PrivateRoute>
              }
            />
            <Route
              path="/performance"
              element={
                <PrivateRoute>
                  <PerformanceDashboard />
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
