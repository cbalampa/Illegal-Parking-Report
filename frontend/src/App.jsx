import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import LoginPage from './pages/LoginPage'
import CitizenPage from './pages/CitizenPage'
import AdminPage from './pages/AdminPage'
import RegisterPage from './pages/RegisterPage'

function ProtectedRoute({ children, requiredRole }) {
  const { user } = useAuth()

  if (!user) return <Navigate to="/login" replace />
    if (requiredRole && user.role !== requiredRole) return <Navigate to="/login" replace />

      return children
}

function App() {
  return (
    <AuthProvider>
    <BrowserRouter>
    <Routes>
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route
    path="/citizen"
    element={
      <ProtectedRoute requiredRole="CITIZEN">
      <CitizenPage />
      </ProtectedRoute>
    }
    />
    <Route
    path="/admin"
    element={
      <ProtectedRoute requiredRole="ADMIN">
      <AdminPage />
      </ProtectedRoute>
    }
    />
    <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
    </BrowserRouter>
    </AuthProvider>
  )
}

export default App
