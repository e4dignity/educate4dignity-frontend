import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import './App.css'

// Import pages (simplified for Jessica's approach)
const LandingPage = lazy(() => import('./pages/LandingPage'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const Login = lazy(() => import('./pages/auth/Login'))
const Signup = lazy(() => import('./pages/auth/Signup'))
const BlogArticlePage = lazy(() => import('./pages/public/BlogArticlePage'))
const AboutPage = lazy(() => import('./pages/public/AboutPage'))
const ContactPage = lazy(() => import('./pages/public/ContactPage'))
const DonationPage = lazy(() => import('./pages/public/DonationPage'))
const DirectDonationPage = lazy(() => import('./pages/DirectDonationPage'))
const CheckoutSessionPage = lazy(() => import('./pages/public/CheckoutSessionPage'))
const CheckoutSuccessPage = lazy(() => import('./pages/public/CheckoutSuccessPage'))
const CheckoutCancelPage = lazy(() => import('./pages/public/CheckoutCancelPage'))
const TestPage = lazy(() => import('./pages/TestPage'))
const NotFoundPage = lazy(() => import('./pages/public/NotFoundPage'))
const JessicaHomePage = lazy(() => import('./pages/JessicaHomePage'))
const JessicaGalleryPage = lazy(() => import('./pages/JessicaGalleryPage'));
const JessicaBlogPage = lazy(() => import('./pages/public/JessicaBlogPage'))
const BlogIndexPage = lazy(() => import('./pages/public/BlogIndexPage'));
import { ProtectedRoute } from './components/ProtectedRoute'
import PageSkeleton from './components/feedback/PageSkeleton'
import ScrollToTop from './components/routing/ScrollToTop'

function App() {
  return (
    <Router>
      <div className="App">
        <ScrollToTop />
        <Suspense fallback={<PageSkeleton withHeader lines={10} />}> 
        <Routes>
          {/* Jessica's main site */}
          <Route path="/" element={<JessicaHomePage />} />
          <Route path="/" element={<JessicaHomePage />} />
          <Route path="/gallery" element={<JessicaGalleryPage />} />
          <Route path="/blog" element={<JessicaBlogPage />} />
          <Route path="/blog/:slug" element={<BlogArticlePage />} />
          
          {/* Organization legacy (for donors/admin) */}
          <Route path="/organization" element={<LandingPage />} />
          
          {/* Public pages */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/donate" element={<DonationPage />} />
          <Route path="/support" element={<DirectDonationPage />} />
          <Route path="/checkout-session" element={<CheckoutSessionPage />} />
          <Route path="/checkout/success" element={<CheckoutSuccessPage />} />
          <Route path="/checkout/cancel" element={<CheckoutCancelPage />} />
          
          {/* Auth & Admin */}
          <Route path="/login" element={<Login />} />
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/signup" element={<Signup />} />
          <Route path="/admin/*" element={<ProtectedRoute roles={['admin']} element={<AdminDashboard />} />} />
          
          {/* Dev & 404 */}
          <Route path="/test" element={<TestPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        </Suspense>
      </div>
    </Router>
  )
}

export default App
