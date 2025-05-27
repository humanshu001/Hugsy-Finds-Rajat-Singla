import React, { useState } from 'react'
import { BarChart3, ShoppingBag, Users, DollarSign, TrendingUp, Package, Tag, ArrowUpRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')

  // Colors for charts
  const COLORS = ['var(--chart-1)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)', 'var(--chart-5)']

  // Static dashboard data
  const dashboardData = {
    counts: {
      products: 48,
      categories: 12,
      orders: 156
    },
    recent_orders: [
      { id: 'ORD-1234', name: 'John Smith', order_datetime: '2023-09-15T10:30:00', order_mode: 'online', status: 'completed', total: 129.99 },
      { id: 'ORD-1235', name: 'Emily Johnson', order_datetime: '2023-09-14T14:45:00', order_mode: 'online', status: 'processing', total: 79.50 },
      { id: 'ORD-1236', name: 'Michael Brown', order_datetime: '2023-09-14T09:15:00', order_mode: 'in-store', status: 'completed', total: 45.99 },
      { id: 'ORD-1237', name: 'Sarah Wilson', order_datetime: '2023-09-13T16:20:00', order_mode: 'online', status: 'pending', total: 189.75 },
      { id: 'ORD-1238', name: 'David Lee', order_datetime: '2023-09-12T11:05:00', order_mode: 'online', status: 'completed', total: 65.25 }
    ],
    order_stats: {
      total_sales: 12345.67,
      avg_order_value: 79.14,
      completed_orders: 132,
      pending_orders: 24,
      conversion_rate: 3.2
    },
    top_products: [
      { id: 1, name: 'Handcrafted Wooden Bowl', price: 45.99, sales_count: 28 },
      { id: 2, name: 'Vintage Ceramic Vase', price: 65.50, sales_count: 24 },
      { id: 3, name: 'Artisan Coffee Mug', price: 22.99, sales_count: 19 },
      { id: 4, name: 'Woven Wall Hanging', price: 89.99, sales_count: 15 },
      { id: 5, name: 'Macrame Plant Hanger', price: 34.50, sales_count: 12 }
    ]
  }

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  // Get status color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'text-green-600 bg-green-50'
      case 'processing':
        return 'text-blue-600 bg-blue-50'
      case 'pending':
        return 'text-amber-600 bg-amber-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  // Prepare data for sales by category chart
  const salesByCategoryData = [
    { name: 'Home Decor', value: 35 },
    { name: 'Kitchen', value: 25 },
    { name: 'Textiles', value: 20 },
    { name: 'Accessories', value: 15 },
    { name: 'Art', value: 5 }
  ]

  // Prepare data for monthly sales chart
  const monthlySalesData = [
    { name: 'Jan', sales: 4000 },
    { name: 'Feb', sales: 3000 },
    { name: 'Mar', sales: 5000 },
    { name: 'Apr', sales: 4500 },
    { name: 'May', sales: 6000 },
    { name: 'Jun', sales: 5500 },
    { name: 'Jul', sales: 7000 },
    { name: 'Aug', sales: 8000 },
    { name: 'Sep', sales: 7500 },
    { name: 'Oct', sales: 9000 },
    { name: 'Nov', sales: 10000 },
    { name: 'Dec', sales: 12000 }
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome to your admin dashboard</p>
      </div>
      
      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          {/* Stats cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-500">Total Sales</h3>
                  <DollarSign size={24} className="text-green-500" />
                </div>
                <div className="mt-2">
                  <p className="text-3xl font-semibold">${dashboardData.order_stats.total_sales?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  <p className="mt-2 flex items-center text-sm font-medium text-green-600">
                    +12%
                    <ArrowUpRight size={16} className="ml-1" />
                    <span className="ml-1">from last month</span>
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-500">Orders</h3>
                  <ShoppingBag size={24} className="text-blue-500" />
                </div>
                <div className="mt-2">
                  <p className="text-3xl font-semibold">{dashboardData.counts.orders}</p>
                  <p className="mt-2 flex items-center text-sm font-medium text-green-600">
                    +8%
                    <ArrowUpRight size={16} className="ml-1" />
                    <span className="ml-1">from last month</span>
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-500">Products</h3>
                  <Package size={24} className="text-purple-500" />
                </div>
                <div className="mt-2">
                  <p className="text-3xl font-semibold">{dashboardData.counts.products}</p>
                  <div className="mt-2 flex items-center text-sm font-medium">
                    <span className="text-gray-500">In {dashboardData.counts.categories} categories</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-500">Conversion Rate</h3>
                  <TrendingUp size={24} className="text-amber-500" />
                </div>
                <div className="mt-2">
                  <p className="text-3xl font-semibold">{dashboardData.order_stats.conversion_rate}%</p>
                  <p className="mt-2 flex items-center text-sm font-medium text-green-600">
                    +0.5%
                    <ArrowUpRight size={16} className="ml-1" />
                    <span className="ml-1">from last month</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Recent orders */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest customer orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Order ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Customer
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Type
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {dashboardData.recent_orders.map((order, index) => (
                      <tr key={index}>
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                          {order.id}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          {order.name}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          {formatDate(order.order_datetime)}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 capitalize">
                          {order.order_mode}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm">
                          <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="sales" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Monthly Sales Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Monthly Sales</CardTitle>
                <CardDescription>Sales performance over the past year</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlySalesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip formatter={(value) => [`$${value}`, 'Sales']} />
                      <Bar dataKey="sales" fill="var(--chart-1)" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Sales by Category Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Sales by Category</CardTitle>
                <CardDescription>Distribution of sales across product categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={salesByCategoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {salesByCategoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value}%`, 'Percentage']} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            {/* Order Statistics */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Order Statistics</CardTitle>
                <CardDescription>Key metrics about your orders</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-lg bg-gray-50 p-4">
                    <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
                    <p className="mt-2 text-2xl font-semibold">{dashboardData.counts.orders}</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-4">
                    <h3 className="text-sm font-medium text-gray-500">Completed Orders</h3>
                    <p className="mt-2 text-2xl font-semibold">{dashboardData.order_stats.completed_orders}</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-4">
                    <h3 className="text-sm font-medium text-gray-500">Pending Orders</h3>
                    <p className="mt-2 text-2xl font-semibold">{dashboardData.order_stats.pending_orders}</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-4">
                    <h3 className="text-sm font-medium text-gray-500">Avg. Order Value</h3>
                    <p className="mt-2 text-2xl font-semibold">${dashboardData.order_stats.avg_order_value.toFixed(2)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="products" className="space-y-6">
          {/* Top Selling Products */}
          <Card>
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
              <CardDescription>Your best performing products</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Product
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Price
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Sales
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Revenue
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {dashboardData.top_products.map((product, index) => (
                      <tr key={index}>
                        <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                          {product.name}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          ${product?.price}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          {product.sales_count} units
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                          ${(product.price * product.sales_count).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex justify-center">
                <Button variant="outline" size="sm">View All Products</Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Product Statistics */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-500">Total Products</h3>
                  <Package size={24} className="text-purple-500" />
                </div>
                <div className="mt-2">
                  <p className="text-3xl font-semibold">{dashboardData.counts.products}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-500">Categories</h3>
                  <Tag size={24} className="text-blue-500" />
                </div>
                <div className="mt-2">
                  <p className="text-3xl font-semibold">{dashboardData.counts.categories}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-500">Avg. Product Price</h3>
                  <DollarSign size={24} className="text-green-500" />
                </div>
                <div className="mt-2">
                  <p className="text-3xl font-semibold">$45.99</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}