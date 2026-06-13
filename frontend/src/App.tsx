import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Providers } from './components/Providers';
import ClientLayout from './components/ClientLayout';
import { ErrorBoundary } from './ErrorBoundary';

import LandingPage from './pages/LandingPage';
import CanvasPage from './pages/CanvasPage';
import FavoritesPage from './pages/FavoritesPage';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import OAuthCallbackPage from './pages/OAuthCallbackPage';
import RecentPage from './pages/RecentPage';
import RegisterPage from './pages/RegisterPage';
import TemplatesPage from './pages/TemplatesPage';
import VignetteAIPage from './pages/VignetteAIPage';
import WorkspacesPage from './pages/WorkspacesPage';

function App() {
  return (
    <Router>
      <Providers>
        <ClientLayout>
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/canvas/:id" element={<CanvasPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/oauth-callback" element={<OAuthCallbackPage />} />
              <Route path="/recent" element={<RecentPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/templates" element={<TemplatesPage />} />
              <Route path="/vignette-ai" element={<VignetteAIPage />} />
              <Route path="/workspaces" element={<WorkspacesPage />} />
            </Routes>
          </ErrorBoundary>
        </ClientLayout>
      </Providers>
    </Router>
  );
}

export default App;
