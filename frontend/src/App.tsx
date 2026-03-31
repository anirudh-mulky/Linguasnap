import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import Layout from './components/Layout'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import LearnPage     from './pages/LearnPage'
import QuizPage      from './pages/QuizPage'
import DashboardPage from './pages/DashboardPage'

function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <Layout>{children}</Layout>
    </ProtectedRoute>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login"    element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/learn"     element={<ProtectedLayout><LearnPage /></ProtectedLayout>} />
          <Route path="/quiz"      element={<ProtectedLayout><QuizPage /></ProtectedLayout>} />
          <Route path="/dashboard" element={<ProtectedLayout><DashboardPage /></ProtectedLayout>} />
          <Route path="*" element={<Navigate to="/learn" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}