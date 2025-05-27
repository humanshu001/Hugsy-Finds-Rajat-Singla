import React, { useState, useEffect } from 'react'
import { Outlet, Link, useLocation, Navigate } from 'react-router-dom'
import { 
  Package, 
  Tag, 
  ShoppingBag, 
  Users, 
  Settings, 
  Menu, 
  X, 
  LogOut,
  BarChart3,
  Bell,
  BadgePercent,
  TicketPercent
} from 'lucide-react'

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const handleLogout = () => {
    window.location.href = '/admin/login'
  }

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen)
  
  const isActive = (path) => {
    return location.pathname === path ? 'bg-5 text-white' : 'text-gray-600 hover:bg-gray-100'
  }
  
  // If not authenticated, redirect to login  
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
      
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center justify-between px-6 border-b">
          <h2 className="text-xl font-semibold text-5 playwrite">Hugsy Finds</h2>
          <button onClick={toggleSidebar} className="lg:hidden">
            <X size={20} />
          </button>
        </div>
        
        <nav className="mt-6 px-4">
          <div className="space-y-2">
            <Link 
              to="/admin/dashboard" 
              className={`flex items-center px-4 py-3 rounded-lg ${isActive('/admin/dashboard')}`}
            >
              <BarChart3 size={20} className="mr-3" />
              <span>Dashboard</span>
            </Link>
            
            <Link 
              to="/admin/products" 
              className={`flex items-center px-4 py-3 rounded-lg ${isActive('/admin/products')}`}
            >
              <Package size={20} className="mr-3" />
              <span>Products</span>
            </Link>
            
            <Link 
              to="/admin/categories" 
              className={`flex items-center px-4 py-3 rounded-lg ${isActive('/admin/categories')}`}
            >
              <Tag size={20} className="mr-3" />
              <span>Categories</span>
            </Link>
            
            <Link 
              to="/admin/orders" 
              className={`flex items-center px-4 py-3 rounded-lg ${isActive('/admin/orders')}`}
            >
              <ShoppingBag size={20} className="mr-3" />
              <span>Orders</span>
            </Link>
            
            <Link 
              to="/admin/coupons" 
              className={`flex items-center px-4 py-3 rounded-lg ${isActive('/admin/coupons')}`}
            >
              <BadgePercent size={20} className="mr-3" />
              <span>Coupons</span>
            </Link>

            <Link 
              to="/admin/feedbacks" 
              className={`flex items-center px-4 py-3 rounded-lg ${isActive('/admin/feedbacks')}`}
            >
              <Users size={20} className="mr-3" />
              <span>Feedbacks</span>
            </Link>

            <Link 
              to="/admin/offers" 
              className={`flex items-center px-4 py-3 rounded-lg ${isActive('/admin/offers')}`}
            >
              <TicketPercent size={20} className="mr-3" />
              <span>Offers</span>
            </Link>
            
            <Link 
              to="/admin/settings" 
              className={`flex items-center px-4 py-3 rounded-lg ${isActive('/admin/settings')}`}
            >
              <Settings size={20} className="mr-3" />
              <span>Settings</span>
            </Link>
          </div>
          
          <div className="mt-10 pt-6 border-t">
            <button 
              onClick={handleLogout}
              className="flex w-full items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg"
            >
              <LogOut size={20} className="mr-3" />
              <span>Logout</span>
            </button>
          </div>
        </nav>
      </aside>
      
      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top header */}
        <header className="flex h-16 items-center justify-between border-b bg-white px-6">
          <button onClick={toggleSidebar} className="lg:hidden">
            <Menu size={24} />
          </button>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <button className="relative p-1 text-gray-400 hover:text-gray-500">
                <Bell size={20} />
                <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
              </button>
            </div>
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-5 flex items-center justify-center text-white font-medium">
                A
              </div>
              <span className="ml-2 text-sm font-medium">Admin User</span>
            </div>
          </div>
        </header>
        
        {/* Main content area */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
