import { Navigate, Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AppLayout } from './components/layout/AppLayout'
import { MarketingLayout } from './components/marketing/MarketingLayout'
import LoginPage from './pages/LoginPage'
import PeoplePage from './pages/PeoplePage'
import GivingPage from './pages/GivingPage'
import ReportsPage from './pages/ReportsPage'
import MarketingHomePage from './pages/marketing/HomePage'
import MarketingFeaturesPage from './pages/marketing/FeaturesPage'
import MarketingPricingPage from './pages/marketing/PricingPage'
import MarketingStoryPage from './pages/marketing/StoryPage'
import BillingPage from './pages/BillingPage'

export default function App() {
  return (
    <Routes>
      <Route element={<MarketingLayout />}>
        <Route index element={<MarketingHomePage />} />
        <Route path="features" element={<MarketingFeaturesPage />} />
        <Route path="pricing" element={<MarketingPricingPage />} />
        <Route path="story" element={<MarketingStoryPage />} />
      </Route>
      <Route path="/login" element={<LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/app" element={<Navigate to="/app/people" replace />} />
          <Route path="/app/people" element={<PeoplePage />} />
          <Route path="/app/giving" element={<GivingPage />} />
          <Route path="/app/reports" element={<ReportsPage />} />
          <Route path="/app/billing" element={<BillingPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
