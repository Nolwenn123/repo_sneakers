import './index.css'
import { type ReactElement, useCallback, useEffect, useMemo, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import type { Session } from '@supabase/supabase-js'
import Home from "./pages/Home"
import Navbar from './tools/Navbar'
import ProductPage from './pages/Product';
import RegisterPage from './pages/Register';
import ProfilePage from './pages/Profile';
import CartPage from './pages/Cart';
import AdminPage from './pages/Admin';
import CookieBanner from './tools/CookieBanner'
import StocksPage from './pages/Stocks'
import { supabase } from './supabaseClient';
import { CartProvider } from './context/CartContext';
import CartPreview from './tools/CartPreview';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isAuthReady, setIsAuthReady] = useState(false)

  useEffect(() => {
    const applySession = async (session: Session | null) => {
      const loggedIn = !!session
      const email = session?.user?.email ?? null
      const userId = session?.user?.id ?? null
      const metadataIsAdmin = Boolean(session?.user?.user_metadata?.is_admin)

      setIsLoggedIn(loggedIn)
      setUserEmail(email)

      if (loggedIn && email) {
        localStorage.setItem('userEmail', email)
      } else {
        localStorage.removeItem('userEmail')
      }

      let isAdminProfile = metadataIsAdmin

      if (loggedIn && userId) {
        const { data, error } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', userId)
          .maybeSingle()

        if (!error && data) {
          isAdminProfile = Boolean(data.is_admin)
        }
      }

      setIsAdmin(isAdminProfile)

      if (isAdminProfile) {
        localStorage.setItem('isAdmin', 'true')
      } else {
        localStorage.removeItem('isAdmin')
      }

      setIsAuthReady(true)
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      void applySession(session)
    })

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      void applySession(session)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const renderAdminOnly = useCallback(
    (page: ReactElement) => {
      if (!isAuthReady) {
        return <div>Chargement...</div>
      }

      if (!isLoggedIn || !isAdmin) {
        return <Navigate to="/" replace />
      }

      return page
    },
    [isAdmin, isAuthReady, isLoggedIn]
  )

  const adminElement = useMemo(() => renderAdminOnly(<AdminPage />), [renderAdminOnly])
  const stocksElement = useMemo(() => renderAdminOnly(<StocksPage />), [renderAdminOnly])

  return (
    <CartProvider>
      <Router>
        <Navbar userEmail={userEmail} isAdmin={isAdmin} />
        <CartPreview />
        <CookieBanner />

        <main style={{ textAlign: 'center' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:product_id" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/admin" element={adminElement} />
            <Route path="/stocks" element={stocksElement} />
            <Route
              path="/register"
              element={<RegisterPage setIsLoggedIn={setIsLoggedIn} setUserEmail={setUserEmail} />}
            />
            <Route
              path="/profile"
              element={<ProfilePage isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} setUserEmail={setUserEmail} />}
            />
          </Routes>
        </main>
      </Router>
    </CartProvider>
  )
}
