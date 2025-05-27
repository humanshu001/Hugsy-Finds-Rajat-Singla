import React, { useState } from 'react'
import { Search, Filter, ChevronLeft, ChevronRight, Eye, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function OrdersPage() {
  // Static data for orders
  const staticOrders = [
    { 
      id: 'ORD-1234', 
      customerInfo: { name: 'John Smith', email: 'john@example.com', phone: '555-123-4567' },
      items: [
        { product: { name: 'Vintage Teddy Bear', price: 29.99, images: ['teddy1.jpg'] }, quantity: 2, price: 29.99 },
        { product: { name: 'Handcrafted Wooden Bowl', price: 45.99, images: ['bowl1.jpg'] }, quantity: 1, price: 45.99 }
      ],
      totalAmount: 105.97,
      shippingAddress: { street: '123 Main St', city: 'Anytown', state: 'CA', zipCode: '12345' },
      paymentMethod: 'credit_card',
      orderStatus: 'delivered',
      createdAt: '2023-09-15T10:30:00',
      notes: 'Please gift wrap'
    },
    { 
      id: 'ORD-1235', 
      customerInfo: { name: 'Emily Johnson', email: 'emily@example.com', phone: '555-987-6543' },
      items: [
        { product: { name: 'Vintage Ceramic Vase', price: 65.50, images: ['vase1.jpg'] }, quantity: 1, price: 65.50 },
        { product: { name: 'Artisan Coffee Mug', price: 22.99, images: ['mug1.jpg'] }, quantity: 2, price: 22.99 }
      ],
      totalAmount: 111.48,
      shippingAddress: { street: '456 Oak Ave', city: 'Somewhere', state: 'NY', zipCode: '67890' },
      paymentMethod: 'paypal',
      orderStatus: 'processing',
      createdAt: '2023-09-14T14:45:00',
      notes: ''
    },
    { 
      id: 'ORD-1236', 
      customerInfo: { name: 'Michael Brown', email: 'michael@example.com', phone: '555-456-7890' },
      items: [
        { product: { name: 'Handcrafted Wooden Bowl', price: 45.99, images: ['bowl1.jpg'] }, quantity: 1, price: 45.99 }
      ],
      totalAmount: 45.99,
      shippingAddress: { street: '789 Pine St', city: 'Elsewhere', state: 'TX', zipCode: '54321' },
      paymentMethod: 'cash_on_delivery',
      orderStatus: 'completed',
      createdAt: '2023-09-14T09:15:00',
      notes: 'Leave at the door'
    },
    { 
      id: 'ORD-1237', 
      customerInfo: { name: 'Sarah Wilson', email: 'sarah@example.com', phone: '555-789-0123' },
      items: [
        { product: { name: 'Woven Wall Hanging', price: 89.99, images: ['wallhanging1.jpg'] }, quantity: 1, price: 89.99 },
        { product: { name: 'Macrame Plant Hanger', price: 34.50, images: ['planthanger1.jpg'] }, quantity: 2, price: 34.50 },
        { product: { name: 'Artisan Coffee Mug', price: 22.99, images: ['mug1.jpg'] }, quantity: 1, price: 22.99 }
      ],
      totalAmount: 181.98,
      shippingAddress: { street: '321 Elm St', city: 'Nowhere', state: 'FL', zipCode: '13579' },
      paymentMethod: 'credit_card',
      orderStatus: 'pending',
      createdAt: '2023-09-13T16:20:00',
      notes: ''
    },
    { 
      id: 'ORD-1238', 
      customerInfo: { name: 'David Lee', email: 'david@example.com', phone: '555-321-6547' },
      items: [
        { product: { name: 'Vintage Ceramic Vase', price: 65.50, images: ['vase1.jpg'] }, quantity: 1, price: 65.50 }
      ],
      totalAmount: 65.50,
      shippingAddress: { street: '654 Maple Ave', city: 'Somewhere', state: 'WA', zipCode: '97531' },
      paymentMethod: 'paypal',
      orderStatus: 'shipped',
      createdAt: '2023-09-12T11:05:00',
      notes: 'Call before delivery'
    }
  ];

  const [orders, setOrders] = useState(staticOrders)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  
  // Modal states
  const [showOrderDetails, setShowOrderDetails] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState(null)
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  // Handle pagination
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }
  
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }
  
  // Handle search
  const handleSearch = (e) => {
    e.preventDefault()
    
    if (searchTerm.trim() === '') {
      filterOrders(statusFilter)
      return
    }
    
    // Filter orders based on search term
    const filtered = staticOrders.filter(order => 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerInfo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerInfo.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    
    // Apply status filter if needed
    if (statusFilter !== 'all') {
      const statusFiltered = filtered.filter(order => order.orderStatus === statusFilter)
      setOrders(statusFiltered)
    } else {
      setOrders(filtered)
    }
    
    setCurrentPage(1)
  }
  
  // Handle status filter change
  const filterOrders = (status) => {
    setStatusFilter(status)
    
    if (status === 'all') {
      setOrders(staticOrders)
    } else {
      const filtered = staticOrders.filter(order => order.orderStatus === status)
      setOrders(filtered)
    }
    
    setCurrentPage(1)
  }
  
  // View order details
  const viewOrderDetails = (order) => {
    setSelectedOrder(order)
    setShowOrderDetails(true)
  }
  
  // Open delete dialog
  const openDeleteDialog = (order) => {
    setSelectedOrder(order)
    setShowDeleteDialog(true)
  }
  
  // Handle delete order
  const handleDeleteOrder = () => {
    if (!selectedOrder) return
    
    // Filter out the deleted order
    const updatedOrders = orders.filter(order => order.id !== selectedOrder.id)
    
    setOrders(updatedOrders)
    setShowDeleteDialog(false)
    
    // Show success message
    alert('Order deleted successfully!')
  }
  
  // Update order status
  const updateOrderStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        return { ...order, orderStatus: newStatus }
      }
      return order
    })
    
    setOrders(updatedOrders)
    setShowOrderDetails(false)
    
    // Show success message
    alert(`Order status updated to ${newStatus}!`)
  }
  
  // Get status badge color
  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'shipped':
        return 'bg-purple-100 text-purple-800'
      case 'delivered':
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }
  
  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-semibold">Orders</h1>
        
        <div className="mt-4 flex flex-col sm:flex-row sm:space-x-4 md:mt-0">
          <form onSubmit={handleSearch} className="flex mb-4 sm:mb-0 h-10">
            <input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-l-md border border-gray-300 px-4 py-2 focus:border-5 focus:outline-none"
            />
            <Button type="submit" className="rounded-l-none h-full">
              <Search size={20} />
            </Button>
          </form>
          
          <Select value={statusFilter} onValueChange={filterOrders}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-5 border-t-transparent"></div>
        </div>
      ) : error ? (
        <div className="rounded-md bg-red-50 p-4 text-red-600">
          {error}
        </div>
      ) : (
        <>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{order.customerInfo.name}</div>
                          <div className="text-sm text-gray-500">{order.customerInfo.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(order.createdAt)}</TableCell>
                      <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeColor(order.orderStatus)}>
                          {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => viewOrderDetails(order)}
                          className="mr-2 text-indigo-600 hover:text-indigo-900"
                        >
                          <Eye size={18} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => openDeleteDialog(order)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 size={18} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      No orders found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing page {currentPage} of {totalPages}
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft size={18} />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight size={18} />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
      
      {/* Order Details Dialog */}
      <Dialog open={showOrderDetails} onOpenChange={setShowOrderDetails}>
        <DialogContent className="sm:max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              Complete information about the order
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="mt-4 space-y-6">
              <div className="flex flex-col md:flex-row md:justify-between">
                <div>
                  <h3 className="text-lg font-medium">Order #{selectedOrder.id}</h3>
                  <p className="text-sm text-gray-500">
                    Placed on {formatDate(selectedOrder.createdAt)}
                  </p>
                </div>
                <div className="mt-2 md:mt-0">
                  <Select 
                    defaultValue={selectedOrder.orderStatus}
                    onValueChange={(value) => updateOrderStatus(selectedOrder.id, value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Update status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Customer Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p><span className="font-medium">Name:</span> {selectedOrder.customerInfo.name}</p>
                      <p><span className="font-medium">Email:</span> {selectedOrder.customerInfo.email}</p>
                      <p><span className="font-medium">Phone:</span> {selectedOrder.customerInfo.phone}</p>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Shipping Address</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p>{selectedOrder.shippingAddress.street}</p>
                      <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Order Items</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Product</th>
                          <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Price</th>
                                                    <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Quantity</th>
                          <th className="px-4 py-2 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {selectedOrder.items.map((item, index) => (
                          <tr key={index}>
                            <td className="whitespace-nowrap px-4 py-4">
                              <div className="flex items-center">
                                <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
                                  {/* Placeholder image */}
                                  <div className="h-full w-full bg-gray-200"></div>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{item.product.name}</div>
                                </div>
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500">
                              ${item.price.toFixed(2)}
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500">
                              {item.quantity}
                            </td>
                            <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500">
                              ${(item.price * item.quantity).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan="3" className="px-4 py-4 text-right text-sm font-medium text-gray-900">
                            Subtotal:
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-900">
                            ${selectedOrder.totalAmount.toFixed(2)}
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </CardContent>
              </Card>
              
              {selectedOrder.notes && (
                <Card>
                  <CardHeader>
                    <CardTitle>Order Notes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{selectedOrder.notes}</p>
                  </CardContent>
                </Card>
              )}
              
              <div className="flex justify-end space-x-4">
                <Button variant="outline" onClick={() => setShowOrderDetails(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this order? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 flex space-x-2">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteOrder}>
              Delete Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

