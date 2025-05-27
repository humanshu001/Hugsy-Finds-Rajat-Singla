import React, { useState } from 'react'
import { Search, Plus, Edit, Trash2, Calendar, ChevronLeft, ChevronRight, Tag, Percent, Eye } from 'lucide-react'
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
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

export default function OffersPage() {
  // Static data for offers
  const staticOffers = [
    { 
      id: 1, 
      title: "Summer Sale", 
      description: "Get amazing discounts on our summer collection",
      discount: "30% OFF",
      discountType: "percentage",
      discountValue: 30,
      startDate: "2024-06-01T00:00:00",
      endDate: "2024-08-31T23:59:59",
      isActive: true,
      bgColor: "bg-1",
      textColor: "text-black",
      buttonColor: "bg-5",
      offerType: "seasonal"
    },
    { 
      id: 2, 
      title: "Bundle & Save", 
      description: "Purchase any two items and get the third one free",
      discount: "Buy 2 Get 1 Free",
      discountType: "bundle",
      discountValue: 0,
      startDate: "2024-01-01T00:00:00",
      endDate: null,
      isActive: true,
      bgColor: "bg-2",
      textColor: "text-black",
      buttonColor: "bg-5",
      offerType: "bundle"
    },
    { 
      id: 3, 
      title: "New Customer Special", 
      description: "Special discount for first-time customers",
      discount: "15% OFF",
      discountType: "percentage",
      discountValue: 15,
      startDate: "2024-01-01T00:00:00",
      endDate: null,
      isActive: true,
      bgColor: "bg-4",
      textColor: "text-black",
      buttonColor: "bg-5",
      offerType: "special"
    },
    { 
      id: 4, 
      title: "Flash Sale", 
      description: "24 Hours Only! Don't miss our exclusive flash sale with discounts up to 50% off on selected items.",
      discount: "Up to 50% OFF",
      discountType: "percentage",
      discountValue: 50,
      startDate: "2024-07-15T00:00:00",
      endDate: "2024-07-16T00:00:00",
      isActive: false,
      bgColor: "bg-2",
      textColor: "text-black",
      buttonColor: "bg-5",
      offerType: "flash"
    },
    { 
      id: 5, 
      title: "Loyalty Program", 
      description: "Join our loyalty program and earn points on every purchase. Redeem your points for discounts, free products, or exclusive offers!",
      discount: "Points Program",
      discountType: "loyalty",
      discountValue: 0,
      startDate: "2024-01-01T00:00:00",
      endDate: null,
      isActive: true,
      bgColor: "bg-4",
      textColor: "text-black",
      buttonColor: "bg-5",
      offerType: "loyalty"
    }
  ];

  const [offers, setOffers] = useState(staticOffers)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  
  // Sheet and dialog states
  const [showAddSheet, setShowAddSheet] = useState(false)
  const [showEditSheet, setShowEditSheet] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showPreviewDialog, setShowPreviewDialog] = useState(false)
  const [selectedOffer, setSelectedOffer] = useState(null)
  const [previewData, setPreviewData] = useState(null)
  
  // Form data
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discount: '',
    discountType: 'percentage',
    discountValue: 0,
    startDate: '',
    endDate: '',
    isActive: true,
    bgColor: 'bg-1',
    textColor: 'text-black',
    buttonColor: 'bg-5',
    offerType: 'seasonal'
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
      filterOffers(statusFilter, typeFilter)
      return
    }
    
    // Filter offers based on search term
    let filtered = staticOffers.filter(offer => 
      offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.discount.toLowerCase().includes(searchTerm.toLowerCase())
    )
    
    // Apply status filter if needed
    if (statusFilter !== 'all') {
      filtered = filtered.filter(offer => 
        statusFilter === 'active' ? offer.isActive : !offer.isActive
      )
    }
    
    // Apply type filter if needed
    if (typeFilter !== 'all') {
      filtered = filtered.filter(offer => offer.offerType === typeFilter)
    }
    
    setOffers(filtered)
    setCurrentPage(1)
  }
  
  // Handle status filter change
  const filterOffers = (status, type) => {
    setStatusFilter(status)
    setTypeFilter(type)
    
    let filtered = staticOffers
    
    // Apply status filter
    if (status !== 'all') {
      filtered = filtered.filter(offer => 
        status === 'active' ? offer.isActive : !offer.isActive
      )
    }
    
    // Apply type filter
    if (type !== 'all') {
      filtered = filtered.filter(offer => offer.offerType === type)
    }
    
    setOffers(filtered)
    setCurrentPage(1)
  }
  
  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }
  
  // Handle select change
  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    })
  }
  
  // Open add offer sheet
  const openAddOfferSheet = () => {
    // Reset form data
    setFormData({
      title: '',
      description: '',
      discount: '',
      discountType: 'percentage',
      discountValue: 0,
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      isActive: true,
      bgColor: 'bg-1',
      textColor: 'text-black',
      buttonColor: 'bg-5',
      offerType: 'seasonal'
    })
    setShowAddSheet(true)
  }
  
  // Open edit offer sheet
  const openEditOfferSheet = (offer) => {
    setSelectedOffer(offer)
    setFormData({
      title: offer.title,
      description: offer.description,
      discount: offer.discount,
      discountType: offer.discountType,
      discountValue: offer.discountValue,
      startDate: offer.startDate ? new Date(offer.startDate).toISOString().split('T')[0] : '',
      endDate: offer.endDate ? new Date(offer.endDate).toISOString().split('T')[0] : '',
      isActive: offer.isActive,
      bgColor: offer.bgColor,
      textColor: offer.textColor,
      buttonColor: offer.buttonColor,
      offerType: offer.offerType
    })
    setShowEditSheet(true)
  }
  
  // Open delete offer dialog
  const openDeleteDialog = (offer) => {
    setSelectedOffer(offer)
    setShowDeleteDialog(true)
  }
  
  // Handle add offer
  const handleAddOffer = (e) => {
    e.preventDefault()
    
    // Create new offer
    const newOffer = {
      id: Date.now(),
      title: formData.title,
      description: formData.description,
      discount: formData.discount,
      discountType: formData.discountType,
      discountValue: parseFloat(formData.discountValue),
      startDate: formData.startDate ? new Date(formData.startDate).toISOString() : new Date().toISOString(),
      endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
      isActive: formData.isActive,
      bgColor: formData.bgColor,
      textColor: formData.textColor,
      buttonColor: formData.buttonColor,
      offerType: formData.offerType
    }
    
    setOffers([newOffer, ...offers])
    setShowAddSheet(false)
    
    // Show success message
    alert('Offer added successfully!')
  }
  
  // Handle edit offer
  const handleEditOffer = (e) => {
    e.preventDefault()
    
    if (!selectedOffer) return
    
    // Update offer
    const updatedOffers = offers.map(offer => {
      if (offer.id === selectedOffer.id) {
        return {
          ...offer,
          title: formData.title,
          description: formData.description,
          discount: formData.discount,
          discountType: formData.discountType,
          discountValue: parseFloat(formData.discountValue),
          startDate: formData.startDate ? new Date(formData.startDate).toISOString() : offer.startDate,
          endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
          isActive: formData.isActive,
          bgColor: formData.bgColor,
          textColor: formData.textColor,
          buttonColor: formData.buttonColor,
          offerType: formData.offerType
        }
      }
      return offer
    })
    
    setOffers(updatedOffers)
    setShowEditSheet(false)
    
    // Show success message
    alert('Offer updated successfully!')
  }
  
  // Handle delete offer
  const handleDeleteOffer = () => {
    if (!selectedOffer) return
    
    // Filter out the deleted offer
    const updatedOffers = offers.filter(offer => offer.id !== selectedOffer.id)
    
    setOffers(updatedOffers)
    setShowDeleteDialog(false)
    
    // Show success message
    alert('Offer deleted successfully!')
  }
  
  // Toggle offer status
  const toggleOfferStatus = (offerId) => {
    const updatedOffers = offers.map(offer => {
      if (offer.id === offerId) {
        return { ...offer, isActive: !offer.isActive }
      }
      return offer
    })
    
    setOffers(updatedOffers)
  }

   const previewOffer = (isNew = false) => {
    // Create preview data from current form
    const preview = {
      title: formData.title,
      description: formData.description,
      discount: formData.discount,
      discountType: formData.discountType,
      discountValue: parseFloat(formData.discountValue),
      startDate: formData.startDate ? new Date(formData.startDate).toISOString() : new Date().toISOString(),
      endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
      isActive: formData.isActive,
      bgColor: formData.bgColor,
      textColor: formData.textColor,
      buttonColor: formData.buttonColor,
      offerType: formData.offerType
    }
    
    setPreviewData(preview)
    setShowPreviewDialog(true)
  }
  
  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-semibold">Special Offers</h1>
        
        <div className="mt-4 flex flex-col sm:flex-row sm:space-x-4 md:mt-0">
          <form onSubmit={handleSearch} className="flex mb-4 sm:mb-0 h-10">
            <input
              type="text"
              placeholder="Search offers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-l-md border border-gray-300 px-4 py-2 focus:border-5 focus:outline-none"
            />
            <Button type="submit" className="rounded-l-none h-full">
              <Search size={20} />
            </Button>
          </form>
          
          <div className="flex space-x-2">
            <Select value={statusFilter} onValueChange={(value) => filterOffers(value, typeFilter)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={typeFilter} onValueChange={(value) => filterOffers(statusFilter, value)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="seasonal">Seasonal</SelectItem>
                <SelectItem value="bundle">Bundle</SelectItem>
                <SelectItem value="special">Special</SelectItem>
                <SelectItem value="flash">Flash</SelectItem>
                <SelectItem value="loyalty">Loyalty</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button onClick={openAddOfferSheet} className="mt-4 sm:mt-0">
            <Plus size={20} className="mr-2" />
            Add Offer
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
                  <TableHead>Title</TableHead>
                  <TableHead>Discount</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {offers.length > 0 ? (
                  offers.map((offer) => (
                    <TableRow key={offer.id}>
                      <TableCell className="font-medium">
                        {offer.title}
                        <div className="text-xs text-gray-500 truncate max-w-xs">
                          {offer.description}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{offer.discount}</div>
                        <div className="text-xs text-gray-500">
                          {offer.discountType === 'percentage' ? 'Percentage' : 
                           offer.discountType === 'fixed' ? 'Fixed Amount' : 
                           offer.discountType === 'bundle' ? 'Bundle Deal' : 
                           offer.discountType === 'loyalty' ? 'Loyalty Program' : 
                           'Special Offer'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={
                          offer.offerType === 'seasonal' ? 'bg-blue-100 text-blue-800' :
                          offer.offerType === 'bundle' ? 'bg-purple-100 text-purple-800' :
                          offer.offerType === 'special' ? 'bg-green-100 text-green-800' :
                          offer.offerType === 'flash' ? 'bg-red-100 text-red-800' :
                          'bg-amber-100 text-amber-800'
                        }>
                          {offer.offerType.charAt(0).toUpperCase() + offer.offerType.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar size={14} className="mr-1" />
                          <span className="text-sm">
                            {formatDate(offer.startDate)} - {formatDate(offer.endDate)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={offer.isActive}
                            onCheckedChange={() => toggleOfferStatus(offer.id)}
                          />
                          <span className={offer.isActive ? 'text-green-600' : 'text-gray-500'}>
                            {offer.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => {
                            setPreviewData(offer);
                            setShowPreviewDialog(true);
                          }}
                          className="mr-2 text-blue-600 hover:text-blue-900"
                          title="Preview"
                        >
                          <Eye size={18} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => openEditOfferSheet(offer)}
                          className="mr-2 text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit size={18} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => openDeleteDialog(offer)}
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
                      No offers found
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
          
          {/* Stats Cards */}
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Offers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{staticOffers.length}</div>
                <p className="text-xs text-gray-500">All offers</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Offers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {staticOffers.filter(offer => offer.isActive).length}
                </div>
                <p className="text-xs text-gray-500">
                  {Math.round((staticOffers.filter(offer => offer.isActive).length / staticOffers.length) * 100)}% of total
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {staticOffers.filter(offer => {
                    const now = new Date();
                    const start = new Date(offer.startDate);
                    return start > now;
                  }).length}
                </div>
                <p className="text-xs text-gray-500">Not yet started</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Expired</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {staticOffers.filter(offer => {
                    const now = new Date();
                    const end = offer.endDate ? new Date(offer.endDate) : null;
                    return end && end < now;
                  }).length}
                </div>
                <p className="text-xs text-gray-500">Past end date</p>
              </CardContent>
            </Card>
          </div>
        </>
      )}
      
      {/* Add Offer Sheet */}
      <Sheet open={showAddSheet} onOpenChange={setShowAddSheet}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Add New Offer</SheetTitle>
            <SheetDescription>
              Create a new special offer or promotion.
            </SheetDescription>
          </SheetHeader>
          
          <form onSubmit={handleAddOffer} className="mt-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Offer Title</Label>
              <input
                id="title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-5 focus:outline-none"
                placeholder="Summer Sale"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-5 focus:outline-none"
                placeholder="Get amazing discounts on our summer collection"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="discount">Discount Label</Label>
                <input
                  id="discount"
                  name="discount"
                  type="text"
                  value={formData.discount}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-5 focus:outline-none"
                  placeholder="30% OFF"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="discountType">Discount Type</Label>
                <Select 
                  value={formData.discountType} 
                  onValueChange={(value) => handleSelectChange('discountType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                    <SelectItem value="bundle">Bundle Deal</SelectItem>
                    <SelectItem value="loyalty">Loyalty Program</SelectItem>
                    <SelectItem value="special">Special Offer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="discountValue">Discount Value</Label>
                <input
                  id="discountValue"
                  name="discountValue"
                  type="number"
                  min="0"
                  value={formData.discountValue}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-5 focus:outline-none"
                  placeholder="30"
                />
                <p className="text-xs text-gray-500">
                  {formData.discountType === 'percentage' ? 'Percentage value (e.g. 30 for 30%)' : 
                   formData.discountType === 'fixed' ? 'Amount in currency' : 
                   'Enter 0 if not applicable'}
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="offerType">Offer Type</Label>
                <Select 
                  value={formData.offerType} 
                  onValueChange={(value) => handleSelectChange('offerType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="seasonal">Seasonal</SelectItem>
                    <SelectItem value="bundle">Bundle</SelectItem>
                    <SelectItem value="special">Special</SelectItem>
                    <SelectItem value="flash">Flash</SelectItem>
                    <SelectItem value="loyalty">Loyalty</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-5 focus:outline-none"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-5 focus:outline-none"
                />
                <p className="text-xs text-gray-500">Leave empty for no expiration</p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bgColor">Background Color</Label>
                <Select 
                  value={formData.bgColor} 
                  onValueChange={(value) => handleSelectChange('bgColor', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select color" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bg-1">Light Green</SelectItem>
                    <SelectItem value="bg-2">Mint Green</SelectItem>
                    <SelectItem value="bg-3">Cream</SelectItem>
                    <SelectItem value="bg-4">Light Yellow</SelectItem>
                    <SelectItem value="bg-5">Light Brown</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="textColor">Text Color</Label>
                <Select 
                  value={formData.textColor} 
                  onValueChange={(value) => handleSelectChange('textColor', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select color" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text-black">Black</SelectItem>
                    <SelectItem value="text-white">White</SelectItem>
                    <SelectItem value="text-gray-800">Dark Gray</SelectItem>
                    <SelectItem value="text-gray-600">Medium Gray</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="buttonColor">Button Color</Label>
                <Select 
                  value={formData.buttonColor} 
                  onValueChange={(value) => handleSelectChange('buttonColor', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select color" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bg-5">Brown</SelectItem>
                    <SelectItem value="bg-1">Light Green</SelectItem>
                    <SelectItem value="bg-2">Mint Green</SelectItem>
                    <SelectItem value="bg-4">Light Yellow</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
            
            <div className="mt-6 flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setShowAddSheet(false)}>
                Cancel
              </Button>
              <Button type="submit">
                Add Offer
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
      
      {/* Edit Offer Sheet */}
      <Sheet open={showEditSheet} onOpenChange={setShowEditSheet}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Edit Offer</SheetTitle>
            <SheetDescription>
              Update the details of this offer.
            </SheetDescription>
          </SheetHeader>
          
          <form onSubmit={handleEditOffer} className="mt-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Offer Title</Label>
              <input
                id="edit-title"
                name="title"
                type="text"
                value={formData.title}
                onChange={handleInputChange}
                required
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-5 focus:outline-none"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Textarea
                id="edit-description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-5 focus:outline-none"
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-discount">Discount Label</Label>
                <input
                  id="edit-discount"
                  name="discount"
                  type="text"
                  value={formData.discount}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-5 focus:outline-none"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-discountType">Discount Type</Label>
                <Select 
                  value={formData.discountType} 
                  onValueChange={(value) => handleSelectChange('discountType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="fixed">Fixed Amount</SelectItem>
                    <SelectItem value="bundle">Bundle Deal</SelectItem>
                    <SelectItem value="loyalty">Loyalty Program</SelectItem>
                    <SelectItem value="special">Special Offer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-discountValue">Discount Value</Label>
                <input
                  id="edit-discountValue"
                  name="discountValue"
                  type="number"
                  min="0"
                  value={formData.discountValue}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-5 focus:outline-none"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-offerType">Offer Type</Label>
                <Select 
                  value={formData.offerType} 
                  onValueChange={(value) => handleSelectChange('offerType', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="seasonal">Seasonal</SelectItem>
                    <SelectItem value="bundle">Bundle</SelectItem>
                    <SelectItem value="special">Special</SelectItem>
                    <SelectItem value="flash">Flash</SelectItem>
                    <SelectItem value="loyalty">Loyalty</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-startDate">Start Date</Label>
                <input
                  id="edit-startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-5 focus:outline-none"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-endDate">End Date</Label>
                <input
                  id="edit-endDate"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-5 focus:outline-none"
                />
                <p className="text-xs text-gray-500">Leave empty for no expiration</p>
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-bgColor">Background Color</Label>
                <Select 
                  value={formData.bgColor} 
                  onValueChange={(value) => handleSelectChange('bgColor', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select color" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bg-1">Light Green</SelectItem>
                    <SelectItem value="bg-2">Mint Green</SelectItem>
                    <SelectItem value="bg-3">Cream</SelectItem>
                    <SelectItem value="bg-4">Light Yellow</SelectItem>
                    <SelectItem value="bg-5">Light Brown</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-textColor">Text Color</Label>
                <Select 
                  value={formData.textColor} 
                  onValueChange={(value) => handleSelectChange('textColor', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select color" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text-black">Black</SelectItem>
                    <SelectItem value="text-white">White</SelectItem>
                    <SelectItem value="text-gray-800">Dark Gray</SelectItem>
                    <SelectItem value="text-gray-600">Medium Gray</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-buttonColor">Button Color</Label>
                <Select 
                  value={formData.buttonColor} 
                  onValueChange={(value) => handleSelectChange('buttonColor', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select color" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bg-5">Brown</SelectItem>
                    <SelectItem value="bg-1">Light Green</SelectItem>
                    <SelectItem value="bg-2">Mint Green</SelectItem>
                    <SelectItem value="bg-4">Light Yellow</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-isActive"
                name="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({...formData, isActive: checked})}
              />
              <Label htmlFor="edit-isActive">Active</Label>
            </div>
            
            <div className="mt-6 flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setShowEditSheet(false)}>
                Cancel
              </Button>
              <Button type="button" variant="secondary" onClick={() => previewOffer(false)} className="mr-2">
                <Eye size={16} className="mr-2" />
                Preview
              </Button>
              <Button type="submit">
                Save Changes
              </Button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
      
      {/* Delete Offer Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Offer</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this offer? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {selectedOffer && (
            <div className="py-4">
              <h3 className="font-medium">{selectedOffer.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{selectedOffer.description}</p>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteOffer}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Offer Dialog */}
      <Dialog open={showPreviewDialog} onOpenChange={setShowPreviewDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Offer Preview</DialogTitle>
            <DialogDescription>
              This is how your offer will appear to customers.
            </DialogDescription>
          </DialogHeader>
          
          {previewData && (
            <div className="py-4">
              <div className={`${previewData.bgColor} p-6 rounded-lg shadow-md text-center ${previewData.textColor}`}>
                <div className={`${previewData.buttonColor} text-white text-xl font-bold py-2 px-4 rounded-full inline-block mb-4`}>
                  {previewData.discount}
                </div>
                <h3 className="text-2xl playwrite mb-4">{previewData.title}</h3>
                <p className="mb-6">{previewData.description}</p>
                <div className="flex items-center justify-center mb-4">
                  <Calendar size={18} className="mr-2" />
                  <span>
                    {previewData.endDate 
                      ? `Ends: ${formatDate(previewData.endDate)}` 
                      : 'No expiration'}
                  </span>
                </div>
                <button className={`${previewData.buttonColor} text-white px-6 py-3 rounded-full inline-block`}>
                  Shop Now
                </button>
              </div>
              
              <div className="mt-4 text-sm text-gray-500">
                <p>Offer Type: {previewData.offerType.charAt(0).toUpperCase() + previewData.offerType.slice(1)}</p>
                <p>Status: {previewData.isActive ? 'Active' : 'Inactive'}</p>
                <p>
                  Period: {formatDate(previewData.startDate)} - {previewData.endDate ? formatDate(previewData.endDate) : 'No expiration'}
                </p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={() => setShowPreviewDialog(false)}>
              Close Preview
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}



