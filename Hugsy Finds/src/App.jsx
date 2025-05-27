import React from 'react'
import './App.css'
import { 
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom'
import Home from './pages/Home'
import Categories from './pages/Categories'
import Special from './pages/Special'
import Contact from './pages/Contact'
import About from './pages/About'
import Cart from './pages/Cart'
import { CartProvider } from './context/CartContext'
import AdminLogin from './admin/pages/AdminLogin'
import AdminLayout from './admin/AdminLayout'
import AdminDashboard from './admin/pages/AdminDashboard'
import OrdersPage from './admin/pages/OrdersPage'
import ProductsPage from './admin/pages/ProductsPage'
import CategoriesPage from './admin/pages/CategoriesPage'
import CouponsPage from './admin/pages/CouponsPage'
import FeedbacksPage from './admin/pages/FeedbacksPage'
import OffersPage from './admin/pages/OffersPage'
import SettingsPage from './admin/pages/SettingsPage'

// Static data provider instead of AdminAuthProvider
function StaticDataProvider({ children }) {
  return children;
}

export default function App() {
  return (
    <StaticDataProvider>
      <CartProvider>
        <Router>
          <Routes>
            {/* Customer routes */}
            <Route path="/" element={<Home />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/special" element={<Special />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/cart" element={<Cart />} />
            
            {/* Admin routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            
            {/* Admin protected routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="categories" element={<CategoriesPage />} />
              <Route path="orders" element={<OrdersPage />} />
              <Route path="coupons" element={<CouponsPage />} />   
              <Route path="feedbacks" element={<FeedbacksPage />} />   
              <Route path="offers" element={<OffersPage />} />   
              <Route path="settings" element={<SettingsPage />} />   
            </Route>
            
            {/* Catch all route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </CartProvider>
    </StaticDataProvider>
  )
}
