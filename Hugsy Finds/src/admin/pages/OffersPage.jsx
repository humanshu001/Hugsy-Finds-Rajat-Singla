import React, { useState, useEffect } from 'react'
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
import { toast } from 'react-hot-toast'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export default function OffersPage() {
  // State for offers
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalOffers: 0,
    activeOffers: 0,
    upcomingOffers: 0,
    expiredOffers: 0,
    offerTypeCounts: {}
  });
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  
  // Sheet and dialog states
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [showEditSheet, setShowEditSheet] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showPreviewDialog, setShowPreviewDialog] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  
  // Products and categories for selection
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  
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
    offerType: 'seasonal',
    applicableProducts: [],
    applicableCategories: [],
    couponCode: '',
    showOnHomepage: true,
    displayOrder: 0
  });
  
  // Fetch offers from API
  const fetchOffers = async () => {
    setLoading(true);
    try {
      let url = `${API_URL}/offers?page=${currentPage}&limit=${limit}`;
      
      // Add filters if set
      if (statusFilter !== 'all') {
        url += `&isActive=${statusFilter === 'active'}`;
      }
      
      if (typeFilter !== 'all') {
        url += `&offerType=${typeFilter}`;
      }
      
      const response = await axios.get(url);
      setOffers(response.data.offers);
      setTotalPages(response.data.totalPages);
      setError(null);
    } catch (err) {
      setError('Failed to fetch offers. Please try again later.');
      console.error('Error fetching offers:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch offer stats
  const fetchOfferStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/offers/stats/summary`);
      setStats(response.data);
    } catch (err) {
      console.error('Error fetching offer stats:', err);
    }
  };
  
  // Fetch products and categories for selection
  const fetchProductsAndCategories = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        axios.get(`${API_URL}/products`),
        axios.get(`${API_URL}/categories`)
      ]);
      
      setProducts(productsRes.data.products || productsRes.data);
      setCategories(categoriesRes.data.categories || categoriesRes.data);
    } catch (err) {
      console.error('Error fetching products and categories:', err);
    }
  };
  
  // Load data on component mount and when filters change
  useEffect(() => {
    fetchOffers();
    fetchOfferStats();
  }, [currentPage, statusFilter, typeFilter]);
  
  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'No expiration';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    
    if (searchTerm.trim() === '') {
      fetchOffers();
      return;
    }
    
    // Filter offers based on search term
    const filtered = offers.filter(offer => 
      offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      offer.discount.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    setOffers(filtered);
  };
  
  // Handle status filter change
  const filterOffers = (status, type) => {
    setStatusFilter(status);
    setTypeFilter(type);
    setCurrentPage(1);
  };
  
  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle select change
  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle multi-select change
  const handleMultiSelectChange = (name, value) => {
    // If value is already in array, remove it, otherwise add it
    const currentValues = formData[name];
    let newValues;
    
    if (currentValues.includes(value)) {
      newValues = currentValues.filter(v => v !== value);
    } else {
      newValues = [...currentValues, value];
    }
    
    setFormData({
      ...formData,
      [name]: newValues
    });
  };
  
  // Open add offer sheet
  const openAddOfferSheet = () => {
    // Fetch products and categories for selection
    fetchProductsAndCategories();
    
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
      offerType: 'seasonal',
      applicableProducts: [],
      applicableCategories: [],
      couponCode: '',
      showOnHomepage: true,
      displayOrder: 0
    });
    
    setShowAddSheet(true);
  };
  
  // Open edit offer sheet
  const openEditOfferSheet = (offer) => {
    // Fetch products and categories for selection
    fetchProductsAndCategories();
    
    setSelectedOffer(offer);
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
      offerType: offer.offerType,
      applicableProducts: offer.applicableProducts.map(p => typeof p === 'object' ? p._id : p),
      applicableCategories: offer.applicableCategories.map(c => typeof c === 'object' ? c._id : c),
      couponCode: offer.couponCode || '',
      showOnHomepage: offer.showOnHomepage !== undefined ? offer.showOnHomepage : true,
      displayOrder: offer.displayOrder || 0
    });
    
    setShowEditSheet(true);
  };
  
  // Open delete offer dialog
  const openDeleteDialog = (offer) => {
    setSelectedOffer(offer);
    setShowDeleteDialog(true);
  };
  
  // Handle add offer
  const handleAddOffer = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post(`${API_URL}/offers`, formData);
      
      // Refresh offers list
      fetchOffers();
      fetchOfferStats();
      
      setShowAddSheet(false);
      toast.success('Offer added successfully!');
    } catch (err) {
      console.error('Error adding offer:', err);
      toast.error(err.response?.data?.message || 'Failed to add offer');
    }
  };
  
  // Handle edit offer
  const handleEditOffer = async (e) => {
    e.preventDefault();
    
    if (!selectedOffer) return;
    
    try {
      const response = await axios.put(`${API_URL}/offers/${selectedOffer._id}`, formData);
      
      // Refresh offers list
      fetchOffers();
      fetchOfferStats();
      
      setShowEditSheet(false);
      toast.success('Offer updated successfully!');
    } catch (err) {
      console.error('Error updating offer:', err);
      toast.error(err.response?.data?.message || 'Failed to update offer');
    }
  };
  
  // Handle delete offer
  const handleDeleteOffer = async () => {
    if (!selectedOffer) return;
    
    try {
      await axios.delete(`${API_URL}/offers/${selectedOffer._id}`);
      
      // Refresh offers list
      fetchOffers();
      fetchOfferStats();
      
      setShowDeleteDialog(false);
      toast.success('Offer deleted successfully!');
    } catch (err) {
      console.error('Error deleting offer:', err);
      toast.error(err.response?.data?.message || 'Failed to delete offer');
    }
  };
  
  // Toggle offer status
  const toggleOfferStatus = async (offerId) => {
    try {
      await axios.patch(`${API_URL}/offers/${offerId}/toggle`);
      
      // Refresh offers list
      fetchOffers();
      fetchOfferStats();
      
      toast.success('Offer status updated successfully!');
    } catch (err) {
      console.error('Error toggling offer status:', err);
      toast.error(err.response?.data?.message || 'Failed to update offer status');
    }
  };

  // Preview offer
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
    };
    
    setPreviewData(preview);
    setShowPreviewDialog(true);
  };
  
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
                <SelectItem value="flash">Flash</SelectItem>
                <SelectItem value="bundle">Bundle</SelectItem>
                <SelectItem value="clearance">Clearance</SelectItem>
                <SelectItem value="holiday">Holiday</SelectItem>
                <SelectItem value="promotion">Promotion</SelectItem>
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
                    <TableRow key={offer._id}>
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
                           offer.discountType === 'bogo' ? 'Buy One Get One' : 
                           'Special Offer'}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={
                          offer.offerType === 'seasonal' ? 'bg-blue-100 text-blue-800' :
                          offer.offerType === 'bundle' ? 'bg-purple-100 text-purple-800' :
                          offer.offerType === 'flash' ? 'bg-red-100 text-red-800' :
                          offer.offerType === 'clearance' ? 'bg-orange-100 text-orange-800' :
                          offer.offerType === 'holiday' ? 'bg-green-100 text-green-800' :
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
                            onCheckedChange={() => toggleOfferStatus(offer._id)}
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
            <div className="mt-4 flex items-center justify-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={16} />
              </Button>
              
              <span className="text-sm">
                Page {currentPage} of {totalPages}
              </span>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          )}
          
          {/* Stats Cards */}
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Offers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.totalOffers}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Active Offers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.activeOffers}
                </div>
                <p className="text-xs text-gray-500">
                  {stats.totalOffers > 0 ? Math.round((stats.activeOffers / stats.totalOffers) * 100) : 0}% of total
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.upcomingOffers}
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
                  {stats.expiredOffers}
                </div>
                <p className="text-xs text-gray-500">Past end date</p>
              </CardContent>
            </Card>
          </div>
        </>
      )}
      
      {/* Add Offer Sheet */}
      <Sheet open={showAddSheet} onOpenChange={setShowAddSheet}>
        <SheetContent className="sm:max-w-md overflow-y-auto">
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
                    <SelectItem value="bundle">Bundle</SelectItem>
                    <SelectItem value="bogo">Buy One Get One</SelectItem>
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
                    <SelectItem value="flash">Flash</SelectItem>
                    <SelectItem value="bundle">Bundle</SelectItem>
                    <SelectItem value="clearance">Clearance</SelectItem>
                    <SelectItem value="holiday">Holiday</SelectItem>
                    <SelectItem value="promotion">Promotion</SelectItem>
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
            
            <div className="space-y-2">
              <Label htmlFor="couponCode">Coupon Code (Optional)</Label>
              <input
                id="couponCode"
                name="couponCode"
                type="text"
                value={formData.couponCode}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-5 focus:outline-none"
                placeholder="SUMMER2024"
              />
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




