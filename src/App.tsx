import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import './App.css'

import ScrollToTop from './components/routing/ScrollToTop'
import PageSkeleton from './components/feedback/PageSkeleton'
import { ProtectedRoute } from './components/ProtectedRoute'

// Lazy pages
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
const JessicaGalleryPage = lazy(() => import('./pages/JessicaGalleryPage'))
const BlogIndexPage = lazy(() => import('./pages/public/BlogIndexPage'))

function App() {
  return (
    <Router>
      <div className="App">
        <ScrollToTop />

        <Routes>
          {/* ===================== */}
          {/* Jessica main site */}
          {/* ===================== */}

          <Route
            path="/"
            element={
              <Suspense fallback={<PageSkeleton withHeader lines={6} />}>
                <JessicaHomePage />
              </Suspense>
            }
          />

          <Route
            path="/gallery"
            element={
              <Suspense fallback={<PageSkeleton />}>
                <JessicaGalleryPage />
              </Suspense>
            }
          />

          <Route
            path="/blog"
            element={
              <Suspense fallback={<PageSkeleton />}>
                <BlogIndexPage jessicaContext />
              </Suspense>
            }
          />

          <Route
            path="/blog/:slug"
            element={
              <Suspense fallback={<PageSkeleton />}>
                <BlogArticlePage />
              </Suspense>
            }
          />

          {/* ===================== */}
          {/* Organization site */}
          {/* ===================== */}

          <Route
            path="/organization"
            element={
              // IMPORTANT : pas de skeleton ici → le HERO s’affiche direct
              <Suspense fallback={null}>
                <LandingPage />
              </Suspense>
            }
          />

          {/* ===================== */}
          {/* Public pages */}
          {/* ===================== */}

          <Route
            path="/about"
            element={
              <Suspense fallback={<PageSkeleton />}>
                <AboutPage />
              </Suspense>
            }
          />

          <Route
            path="/contact"
            element={
              <Suspense fallback={<PageSkeleton />}>
                <ContactPage />
              </Suspense>
            }
          />

          <Route
            path="/donate"
            element={
              <Suspense fallback={<PageSkeleton />}>
                <DonationPage />
              </Suspense>
            }
          />

          <Route
            path="/support"
            element={
              <Suspense fallback={<PageSkeleton />}>
                <DirectDonationPage />
              </Suspense>
            }
          />

          <Route
            path="/checkout-session"
            element={
              <Suspense fallback={<PageSkeleton />}>
                <CheckoutSessionPage />
              </Suspense>
            }
          />

          <Route
            path="/checkout/success"
            element={
              <Suspense fallback={<PageSkeleton />}>
                <CheckoutSuccessPage />
              </Suspense>
            }
          />

          <Route
            path="/checkout/cancel"
            element={
              <Suspense fallback={<PageSkeleton />}>
                <CheckoutCancelPage />
              </Suspense>
            }
          />

          {/* ===================== */}
          {/* Auth & Admin */}
          {/* ===================== */}

          <Route
            path="/login"
            element={
              <Suspense fallback={<PageSkeleton />}>
                <Login />
              </Suspense>
            }
          />

          <Route
            path="/auth/login"
            element={
              <Suspense fallback={<PageSkeleton />}>
                <Login />
              </Suspense>
            }
          />

          <Route
            path="/auth/signup"
            element={
              <Suspense fallback={<PageSkeleton />}>
                <Signup />
              </Suspense>
            }
          />

          <Route
            path="/admin/*"
            element={
              <ProtectedRoute
                roles={['admin']}
                element={
                  <Suspense fallback={<PageSkeleton />}>
                    <AdminDashboard />
                  </Suspense>
                }
              />
            }
          />

          {/* ===================== */}
          {/* Dev & 404 */}
          {/* ===================== */}

          <Route
            path="/test"
            element={
              <Suspense fallback={<PageSkeleton />}>
                <TestPage />
              </Suspense>
            }
          />

          <Route
            path="*"
            element={
              <Suspense fallback={<PageSkeleton />}>
                <NotFoundPage />
              </Suspense>
            }
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App

