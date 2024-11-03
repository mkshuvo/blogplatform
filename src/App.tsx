import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { CreatePost } from './pages/CreatePost';
import { PostDetail } from './pages/PostDetail';
import { AllPosts } from './pages/AllPosts';
import { MyPosts } from './pages/MyPosts';
import { PrivateRoute } from './components/PrivateRoute';
import { ErrorBoundary } from './components/ErrorBoundary';

function AuthenticatedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/" replace /> : children;
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/posts" element={<AllPosts />} />
              <Route
                path="/my-posts"
                element={
                  <PrivateRoute>
                    <MyPosts />
                  </PrivateRoute>
                }
              />
              <Route
                path="/login"
                element={
                  <AuthenticatedRoute>
                    <Login />
                  </AuthenticatedRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <AuthenticatedRoute>
                    <Register />
                  </AuthenticatedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <Profile />
                  </PrivateRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <PrivateRoute>
                    <Settings />
                  </PrivateRoute>
                }
              />
              <Route
                path="/new-post"
                element={
                  <PrivateRoute>
                    <CreatePost />
                  </PrivateRoute>
                }
              />
              <Route path="/posts/:id" element={<PostDetail />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;