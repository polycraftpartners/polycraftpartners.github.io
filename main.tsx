import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import AssessmentPage from './pages/AssessmentPage'
import ThankYouPage from './pages/ThankYouPage'

const AdminPage = lazy(() => import('./pages/AdminPage'))
const PrivacyPage = lazy(() => import('./pages/PrivacyPage'))

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <span className="text-textMuted text-sm">Loading...</span>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/assessment" element={<AssessmentPage />} />
        <Route path="/thank-you" element={<ThankYouPage />} />
        <Route
          path="/privacy"
          element={
            <Suspense fallback={<PageLoader />}>
              <PrivacyPage />
            </Suspense>
          }
        />
        <Route
          path="/admin"
          element={
            <Suspense fallback={<PageLoader />}>
              <AdminPage />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
