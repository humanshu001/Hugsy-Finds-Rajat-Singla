import React, { useState } from 'react'
import { Search, Plus, Edit, Trash2, ChevronLeft, ChevronRight, Percent, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet'
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
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export default function CouponsPage() {
  // Static data for coupons
  const staticCoupons = [
    {
      id: 'COUPON1',
      code: 'WELCOME20',
      discountType: 'percentage',
      discountValue: 20,
      minOrderAmount: 50,
      maxDiscount: 100,
      usageLimit: 100,
      usedCount: 45,
      validFrom: '2023-08-01T00:00:00',
      validUntil: '2023-12-31T23:59:59',
      isActive: true,
      description: 'Welcome discount for new customers'
    },
    {
      id: 'COUPON2',
      code: 'SUMMER10',
      discountType: 'percentage',
      discountValue: 10,
      minOrderAmount: 0,
      maxDiscount: 0,
      usageLimit: 0,
      usedCount: 120,
      validFrom: '2023-06-01T00:00:00',
      validUntil: '2023-08-31T23:59:59',
      isActive: false,
      description: 'Summer sale discount'
    },
    {
      id: 'COUPON3',
      code: 'FREESHIP',
      discountType: 'fixed',
      discountValue: 15,
      minOrderAmount: 75,
      maxDiscount: 0,
      usageLimit: 200,
      usedCount: 89,
      validFrom: '2023-09-01T00:00:00',
      validUntil: null,
      isActive: true,
      description: 'Free shipping on orders over $75'
    },
    {
      id: 'COUPON4',
      code: 'HOLIDAY25',
      discountType: 'percentage',
      discountValue: 25,
      minOrderAmount: 100,
      maxDiscount: 50,
      usageLimit: 0,
      usedCount: 0,
      validFrom: '2023-11-20T00:00:00',
      validUntil: '2023-12-26T23:59:59',
      isActive: true,
      description: 'Holiday season discount'
    },
    {
      id: 'COUPON5',
      code: 'FLASH50',
      discountType: 'fixed',
      discountValue: 50,
      minOrderAmount: 200,
      maxDiscount: 0,
      usageLimit: 50,
      usedCount: 50,
      validFrom: '2023-10-01T00:00:00',
      validUntil: '2023-10-03T23:59:59',
      isActive: false,
      description: 'Flash sale discount'
    }
  ];

  const [coupons, setCoupons] = useState(staticCoupons)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  
  // Form states
  const [showAddSheet, setShowAddSheet] = useState(false)
  const [showEditSheet, setShowEditSheet] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedCoupon, setSelectedCoupon] = useState(null)
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: 0,
    minOrderAmount: 0,
    maxDiscount: 0,
    usageLimit: 0,
    validFrom: '',
    validUntil: '',
    isActive: true,
    description: ''
  })
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'No expiration'
    
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
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
      filterCoupons(statusFilter)
      return
    }
    
    // Filter coupons based on search term
    const filtered = staticCoupons.filter(coupon => 
      coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coupon.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    
    // Apply status filter if needed
    if (statusFilter !== 'all') {
      const statusFiltered = filtered.filter(coupon => 
        statusFilter === 'active' ? coupon.isActive : !coupon.isActive
      )
      setCoupons(statusFiltered)
    } else {
      setCoupons(filtered)
    }
    
    setCurrentPage(1)
  }
  
  // Handle status filter change
  const filterCoupons = (status) => {
    setStatusFilter(status)
    
    if (status === 'all') {
      setCoupons(staticCoupons)
    } else {
      const filtered = staticCoupons.filter(coupon => 
        status === 'active' ? coupon.isActive : !coupon.isActive
      )
      setCoupons(filtered)
    }
    
    setCurrentPage(1)
  }
  
  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }
  
  // Handle select change
  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    })
  }
  
  // Open add coupon sheet
  const openAddCouponSheet = () => {
    // Reset form data
    setFormData({
      code: '',
      discountType: 'percentage',
      discountValue: 0,
      minOrderAmount: 0,
      maxDiscount: 0,
      usageLimit: 0,
      validFrom: new Date().toISOString().split('T')[0],
      validUntil: '',
      isActive: true,
      description: ''
    })
    setShowAddSheet(true)
  }
  
  // Open edit coupon sheet
  const openEditCouponSheet = (coupon) => {
    setSelectedCoupon(coupon)
    setFormData({
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      minOrderAmount: coupon.minOrderAmount,
      maxDiscount: coupon.maxDiscount,
      usageLimit: coupon.usageLimit,
      validFrom: coupon.validFrom ? new Date(coupon.validFrom).toISOString().split('T')[0] : '',
      validUntil: coupon.validUntil ? new Date(coupon.validUntil).toISOString().split('T')[0] : '',
      isActive: coupon.isActive,
      description: coupon.description
    })
    setShowEditSheet(true)
  }
  
  // Open delete coupon dialog
  const openDeleteDialog = (coupon) => {
    setSelectedCoupon(coupon)
    setShowDeleteDialog(true)
  }
  
  // Handle add coupon
  const handleAddCoupon = (e) => {
    e.preventDefault()
    
    // Create new coupon
    const newCoupon = {
      id: `COUPON${Date.now()}`,
      code: formData.code.toUpperCase(),
      discountType: formData.discountType,
      discountValue: parseFloat(formData.discountValue),
      minOrderAmount: parseFloat(formData.minOrderAmount),
      maxDiscount: parseFloat(formData.maxDiscount),
      usageLimit: parseInt(formData.usageLimit),
      usedCount: 0,
      validFrom: formData.validFrom ? new Date(formData.validFrom).toISOString() : new Date().toISOString(),
      validUntil: formData.validUntil ? new Date(formData.validUntil).toISOString() : null,
      isActive: formData.isActive,
      description: formData.description
    }
    
    setCoupons([newCoupon, ...coupons])
    setShowAddSheet(false)
    
    // Show success message
    alert('Coupon added successfully!')
  }
  
  // Handle edit coupon
  const handleEditCoupon = (e) => {
    e.preventDefault()
    
    if (!selectedCoupon) return
    
    // Update coupon
    const updatedCoupons = coupons.map(coupon => {
      if (coupon.id === selectedCoupon.id) {
        return {
          ...coupon,
          code: formData.code.toUpperCase(),
          discountType: formData.discountType,
          discountValue: parseFloat(formData.discountValue),
          minOrderAmount: parseFloat(formData.minOrderAmount),
          maxDiscount: parseFloat(formData.maxDiscount),
          usageLimit: parseInt(formData.usageLimit),
          validFrom: formData.validFrom ? new Date(formData.validFrom).toISOString() : coupon.validFrom,
          validUntil: formData.validUntil ? new Date(formData.validUntil).toISOString() : null,
          isActive: formData.isActive,
          description: formData.description
        }
      }
      return coupon
    })
    
    setCoupons(updatedCoupons)
    setShowEditSheet(false)
    
    // Show success message
    alert('Coupon updated successfully!')
  }
  
  // Handle delete coupon
  const handleDeleteCoupon = () => {
    if (!selectedCoupon) return
    
    // Filter out the deleted coupon
    const updatedCoupons = coupons.filter(coupon => coupon.id !== selectedCoupon.id)
    
    setCoupons(updatedCoupons)
    setShowDeleteDialog(false)
    
    // Show success message
    alert('Coupon deleted successfully!')
  }
  
  // Reset coupon usage
  const resetCouponUsage = (couponId) => {
    const updatedCoupons = coupons.map(coupon => {
      if (coupon.id === couponId) {
        return { ...coupon, usedCount: 0 }
      }
      return coupon
    })
    
    setCoupons(updatedCoupons)
    
    // Show success message
    alert('Coupon usage reset successfully!')
  }
  
  // Generate random coupon code
  const generateCouponCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code = ''
    
    for (let i = 0; i < 8; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length))
    }
    
    setFormData({ ...formData, code })
  }
  
  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-semibold">Coupons</h1>
        
        <div className="mt-4 flex flex-col sm:flex-row sm:space-x-4 md:mt-0">
          <form onSubmit={handleSearch} className="flex mb-4 sm:mb-0 h-10">
            <input
              type="text"
              placeholder="Search coupons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-l-md border border-gray-300 px-4 py-2 focus:border-5 focus:outline-none"
            />
            <Button type="submit" className="rounded-l-none h-full">
              <Search size={20} />
            </Button>
          </form>
          
          <Select value={statusFilter} onValueChange={filterCoupons}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Coupons</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={openAddCouponSheet} className="mt-4 sm:mt-0">
            <Plus size={20} className="mr-2" />
            Add Coupon
          </Button>
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
                  <TableHead>Code</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Valid Period</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {coupons.length > 0 ? (
                  coupons.map((coupon) => (
                    <TableRow key={coupon.id}>
                      <TableCell className="font-medium">
                        {coupon.code}
                        {coupon.description && (
                          <div className="text-xs text-gray-500">{coupon.description}</div>
                        )}
                      </TableCell>
                      <TableCell>
                        {coupon.discountType === 'percentage' ? (
                          <div>{coupon.discountValue}% off</div>
                        ) : (
                          <div>${coupon.discountValue.toFixed(2)} off</div>
                        )}
                        {coupon.minOrderAmount > 0 && (
                          <div className="text-xs text-gray-500">
                            Min. order: ${coupon.minOrderAmount.toFixed(2)}
                          </div>
                        )}
                        {coupon.maxDiscount > 0 && coupon.discountType === 'percentage' && (
                          <div className="text-xs text-gray-500">
                            Max discount: ${coupon.maxDiscount.toFixed(2)}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div>{coupon.usedCount} used</div>
                        {coupon.usageLimit > 0 && (
                          <div className="text-xs text-gray-500">
                            Limit: {coupon.usageLimit}
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div>From: {formatDate(coupon.validFrom)}</div>
                        <div>Until: {formatDate(coupon.validUntil)}</div>
                      </TableCell>
                      <TableCell>
                        <Badge className={coupon.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {coupon.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => resetCouponUsage(coupon.id)}
                          className="mr-2 text-blue-600 hover:text-blue-900"
                          title="Reset usage count"
                        >
                          <RefreshCw size={18} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => openEditCouponSheet(coupon)}
                          className="mr-2 text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit size={18} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => openDeleteDialog(coupon)}
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
                      No coupons found
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
      
      {/* Add Coupon Sheet */}
      <Sheet open={showAddSheet} onOpenChange={setShowAddSheet}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Add New Coupon</SheetTitle>
            <SheetDescription>
              Create a new discount coupon for your customers.
            </SheetDescription>
          </SheetHeader>
          <form onSubmit={handleAddCoupon} className="space-y-4 p-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                                <Label htmlFor="code" className="text-sm font-medium">Coupon Code</Label>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={generateCouponCode}
                  className="text-xs"
                >
                  Generate
                </Button>
              </div>
              <input
                id="code"
                name="code"
                type="text"
                required
                value={formData.code}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-5 focus:outline-none"
                placeholder="e.g. SUMMER20"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">Description</Label>
              <input
                id="description"
                name="description"
                type="text"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-5 focus:outline-none"
                placeholder="e.g. Summer sale discount"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="discountType" className="text-sm font-medium">Discount Type</Label>
                <Select 
                  value={formData.discountType} 
                  onValueChange={(value) => handleSelectChange('discountType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="discountValue" className="text-sm font-medium">
                  {formData.discountType === 'percentage' ? 'Discount (%)' : 'Discount Amount ($)'}
                </Label>
                <input
                  id="discountValue"
                  name="discountValue"
                  type="number"
                  min="0"
                  step={formData.discountType === 'percentage' ? '1' : '0.01'}
                  required
                  value={formData.discountValue}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-5 focus:outline-none"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="minOrderAmount" className="text-sm font-medium">Min Order Amount ($)</Label>
                <input
                  id="minOrderAmount"
                  name="minOrderAmount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.minOrderAmount}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-5 focus:outline-none"
                />
              </div>
              
              {formData.discountType === 'percentage' && (
                <div className="space-y-2">
                  <Label htmlFor="maxDiscount" className="text-sm font-medium">Max Discount ($)</Label>
                  <input
                    id="maxDiscount"
                    name="maxDiscount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.maxDiscount}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-5 focus:outline-none"
                  />
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="usageLimit" className="text-sm font-medium">Usage Limit (0 for unlimited)</Label>
              <input
                id="usageLimit"
                name="usageLimit"
                type="number"
                min="0"
                value={formData.usageLimit}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-5 focus:outline-none"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="validFrom" className="text-sm font-medium">Valid From</Label>
                <input
                  id="validFrom"
                  name="validFrom"
                  type="date"
                  required
                  value={formData.validFrom}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-5 focus:outline-none"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="validUntil" className="text-sm font-medium">Valid Until (leave empty for no expiry)</Label>
                <input
                  id="validUntil"
                  name="validUntil"
                  type="date"
                  value={formData.validUntil}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-5 focus:outline-none"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label htmlFor="isActive" className="text-sm font-medium">Active</Label>
            </div>
            
            <SheetFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setShowAddSheet(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Add Coupon
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
      
      {/* Edit Coupon Sheet */}
      <Sheet open={showEditSheet} onOpenChange={setShowEditSheet}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Edit Coupon</SheetTitle>
            <SheetDescription>
              Update the details of this coupon.
            </SheetDescription>
          </SheetHeader>
          <form onSubmit={handleEditCoupon} className="space-y-4 p-4">
            <div className="space-y-2">
              <Label htmlFor="edit-code" className="text-sm font-medium">Coupon Code</Label>
              <input
                id="edit-code"
                name="code"
                type="text"
                required
                value={formData.code}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-5 focus:outline-none"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-description" className="text-sm font-medium">Description</Label>
              <input
                id="edit-description"
                name="description"
                type="text"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-5 focus:outline-none"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-discountType" className="text-sm font-medium">Discount Type</Label>
                <Select 
                  value={formData.discountType} 
                  onValueChange={(value) => handleSelectChange('discountType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage (%)</SelectItem>
                    <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-discountValue" className="text-sm font-medium">
                  {formData.discountType === 'percentage' ? 'Discount (%)' : 'Discount Amount ($)'}
                </Label>
                <input
                  id="edit-discountValue"
                  name="discountValue"
                  type="number"
                  min="0"
                  step={formData.discountType === 'percentage' ? '1' : '0.01'}
                  required
                  value={formData.discountValue}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-5 focus:outline-none"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-minOrderAmount" className="text-sm font-medium">Min Order Amount ($)</Label>
                <input
                  id="edit-minOrderAmount"
                  name="minOrderAmount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.minOrderAmount}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-5 focus:outline-none"
                />
              </div>
              
              {formData.discountType === 'percentage' && (
                <div className="space-y-2">
                  <Label htmlFor="edit-maxDiscount" className="text-sm font-medium">Max Discount ($)</Label>
                  <input
                    id="edit-maxDiscount"
                    name="maxDiscount"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.maxDiscount}
                    onChange={handleInputChange}
                    className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-5 focus:outline-none"
                  />
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-usageLimit" className="text-sm font-medium">Usage Limit (0 for unlimited)</Label>
              <input
                id="edit-usageLimit"
                name="usageLimit"
                type="number"
                min="0"
                value={formData.usageLimit}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-5 focus:outline-none"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-validFrom" className="text-sm font-medium">Valid From</Label>
                <input
                  id="edit-validFrom"
                  name="validFrom"
                  type="date"
                  required
                  value={formData.validFrom}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-5 focus:outline-none"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-validUntil" className="text-sm font-medium">Valid Until (leave empty for no expiry)</Label>
                <input
                  id="edit-validUntil"
                  name="validUntil"
                  type="date"
                  value={formData.validUntil}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-5 focus:outline-none"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-isActive"
                name="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
              />
              <Label htmlFor="edit-isActive" className="text-sm font-medium">Active</Label>
            </div>
            
            <SheetFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setShowEditSheet(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Update Coupon
              </Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this coupon? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 flex space-x-2">
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCoupon}>
              Delete Coupon
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}