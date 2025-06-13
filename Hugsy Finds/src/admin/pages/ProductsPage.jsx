import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Search, ChevronLeft, ChevronRight, Image } from 'lucide-react'
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
import { toast } from 'react-hot-toast'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export default function ProductsPage() {
  // State for products
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [limit] = useState(10)
  
  // Modal states
  const [showAddSheet, setShowAddSheet] = useState(false)
  const [showEditSheet, setShowEditSheet] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discountPrice: '',
    stock: '',
    category: '',
    featured: false,
    tags: ''
  })
  
  // File upload state
  const [productImages, setProductImages] = useState([])
  const [imagePreviewUrls, setImagePreviewUrls] = useState([])
  
  // Fetch products from API
  const fetchProducts = async () => {
    setLoading(true)
    try {
      let url = `${API_URL}/products?page=${currentPage}&limit=${limit}`
      
      // Add search term if present
      if (searchTerm.trim() !== '') {
        url += `&search=${searchTerm}`
      }
      
      const response = await axios.get(url)
      setProducts(response.data.products || response.data)
      setTotalPages(response.data.totalPages || 1)
      setError(null)
    } catch (err) {
      setError('Failed to fetch products. Please try again later.')
      console.error('Error fetching products:', err)
    } finally {
      setLoading(false)
    }
  }
  
  // Fetch categories for product form
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/categories`)
      setCategories(response.data.categories || response.data)
    } catch (err) {
      console.error('Error fetching categories:', err)
    }
  }
  
  // Initial data fetch
  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [currentPage])
  
  // Handle search with API
  const handleSearch = (e) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchProducts()
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
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
  }
  
  // Handle image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files)
    
    // Limit to 5 images
    const selectedFiles = files.slice(0, 5)
    setProductImages(selectedFiles)
    
    // Create preview URLs
    const newImagePreviews = selectedFiles.map(file => URL.createObjectURL(file))
    
    // Clean up previous preview URLs to avoid memory leaks
    imagePreviewUrls.forEach(url => URL.revokeObjectURL(url))
    
    setImagePreviewUrls(newImagePreviews)
  }
  
  // Open add product sheet
  const openAddProductSheet = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      discountPrice: '',
      stock: '',
      category: categories.length > 0 ? categories[0]._id : '',
      featured: false,
      tags: ''
    })
    setProductImages([])
    setImagePreviewUrls([])
    setShowAddSheet(true)
  }
  
  // Open edit product sheet
  const openEditProductSheet = (product) => {
    setSelectedProduct(product)
    setFormData({
      id: product._id,
      name: product.name,
      description: product.description || '',
      price: product.price,
      discountPrice: product.discountPrice || '',
      stock: product.stock,
      category: product.category?._id || product.category,
      featured: product.featured || false,
      tags: product.tags ? product.tags.join(', ') : ''
    })
    
    // Reset image previews
    setProductImages([])
    setImagePreviewUrls([])
    
    // If product has images, set them as previews
    if (product.images && product.images.length > 0) {
      // For real API, use actual image URLs
      const previews = product.images.map(img => 
        img.startsWith('http') ? img : `${API_URL}/uploads/${img}`
      )
      setImagePreviewUrls(previews)
    }
    
    setShowEditSheet(true)
  }
  
  // Open delete product dialog
  const openDeleteDialog = (product) => {
    setSelectedProduct(product)
    setShowDeleteDialog(true)
  }
  
  // Handle add product with API
  const handleAddProduct = async (e) => {
    e.preventDefault()
    
    try {
      // Create form data for file upload
      const formDataToSend = new FormData()
      formDataToSend.append('name', formData.name)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('price', formData.price)
      
      if (formData.discountPrice) {
        formDataToSend.append('discountPrice', formData.discountPrice)
      }
      
      formDataToSend.append('stock', formData.stock)
      formDataToSend.append('category', formData.category)
      formDataToSend.append('featured', formData.featured)
      
      if (formData.tags) {
        const tagsArray = formData.tags.split(',').map(tag => tag.trim())
        formDataToSend.append('tags', JSON.stringify(tagsArray))
      }
      
      // Append each image file
      productImages.forEach(image => {
        formDataToSend.append('productImages', image)
      })
      
      const response = await axios.post(`${API_URL}/products`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      // Refresh products list
      fetchProducts()
      
      setShowAddSheet(false)
      toast.success('Product added successfully!')
    } catch (err) {
      console.error('Error adding product:', err)
      toast.error(err.response?.data?.message || 'Failed to add product')
    }
  }
  
  // Handle edit product with API
  const handleEditProduct = async (e) => {
    e.preventDefault()
    
    try {
      // Create form data for file upload
      const formDataToSend = new FormData()
      formDataToSend.append('name', formData.name)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('price', formData.price)
      
      if (formData.discountPrice) {
        formDataToSend.append('discountPrice', formData.discountPrice)
      } else {
        formDataToSend.append('discountPrice', null)
      }
      
      formDataToSend.append('stock', formData.stock)
      formDataToSend.append('category', formData.category)
      formDataToSend.append('featured', formData.featured)
      
      if (formData.tags) {
        const tagsArray = formData.tags.split(',').map(tag => tag.trim())
        formDataToSend.append('tags', JSON.stringify(tagsArray))
      }
      
      // Only append images if new ones were selected
      if (productImages.length > 0) {
        productImages.forEach(image => {
          formDataToSend.append('productImages', image)
        })
      }
      
      const response = await axios.put(`${API_URL}/products/${formData.id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      // Refresh products list
      fetchProducts()
      
      setShowEditSheet(false)
      toast.success('Product updated successfully!')
    } catch (err) {
      console.error('Error updating product:', err)
      toast.error(err.response?.data?.message || 'Failed to update product')
    }
  }
  
  // Handle delete product with API
  const handleDeleteProduct = async () => {
    if (!selectedProduct) return
    
    try {
      await axios.delete(`${API_URL}/products/${selectedProduct._id}`)
      
      // Refresh products list
      fetchProducts()
      
      setShowDeleteDialog(false)
      toast.success('Product deleted successfully!')
    } catch (err) {
      console.error('Error deleting product:', err)
      toast.error(err.response?.data?.message || 'Failed to delete product')
    }
  }
  
  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-semibold">Products</h1>
        
        <div className="mt-4 flex flex-col sm:flex-row sm:space-x-4 md:mt-0">
          <form onSubmit={handleSearch} className="flex mb-4 sm:mb-0 h-10">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-l-md border border-gray-300 px-4 py-2 focus:border-5 focus:outline-none"
            />
            <Button type="submit" className="rounded-l-none h-full">
              <Search size={20} />
            </Button>
          </form>
          
          <Button onClick={openAddProductSheet} className="flex items-center">
            <Plus size={20} className="mr-2" />
            Add Product
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
                  <TableHead>ID</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.length > 0 ? (
                  products.map((product) => (
                    <TableRow key={product._id}>
                      <TableCell className="font-medium">{product._id.substring(0, 8)}...</TableCell>
                      <TableCell>
                        {product.images && product.images.length > 0 ? (
                          <div className="h-12 w-12 overflow-hidden rounded-md">
                            <img 
                              src={product.images[0].startsWith('http') 
                                ? product.images[0] 
                                : `${API_URL}/uploads/${product.images[0]}`} 
                              alt={product.name} 
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = `https://placehold.co/100x100?text=Image`;
                              }}
                            />
                          </div>
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-gray-100">
                            <Image size={18} className="text-gray-400" />
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>${parseFloat(product.price).toFixed(2)}</TableCell>
                      <TableCell>{product.stock}</TableCell>
                      <TableCell>{product.category?.name || 'Unknown'}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => openEditProductSheet(product)}
                          className="mr-2 text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit size={18} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => openDeleteDialog(product)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 size={18} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      No products found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          
          {/* Pagination */}
          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing {products.length} products
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrevPage}
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
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        </>
      )}
      
      {/* Add Product Sheet */}
      <Sheet open={showAddSheet} onOpenChange={setShowAddSheet}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Add New Product</SheetTitle>
            <SheetDescription>
              Fill in the details to add a new product to your inventory.
            </SheetDescription>
          </SheetHeader>
          <form onSubmit={handleAddProduct} className="space-y-4 p-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Product Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-5 focus:outline-none"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-5 focus:outline-none"
              ></textarea>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="price" className="text-sm font-medium">
                  Price
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-5 focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="discountPrice" className="text-sm font-medium">
                  Discount Price (Optional)
                </label>
                <input
                  id="discountPrice"
                  name="discountPrice"
                  type="number"
                  step="0.01"
                  value={formData.discountPrice}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-5 focus:outline-none"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="stock" className="text-sm font-medium">
                Stock Quantity
              </label>
              <input
                id="stock"
                name="stock"
                type="number"
                required
                value={formData.stock}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-5 focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">
                Category
              </label>
              <select
                id="category"
                name="category"
                required
                value={formData.category}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-5 focus:outline-none"
              >
                {categories.length === 0 && (
                  <option value="">Loading categories...</option>
                )}
                {categories.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="tags" className="text-sm font-medium">
                Tags (comma separated)
              </label>
              <input
                id="tags"
                name="tags"
                type="text"
                value={formData.tags}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-5 focus:outline-none"
                placeholder="vintage, handmade, etc."
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                id="featured"
                name="featured"
                type="checkbox"
                checked={formData.featured}
                onChange={handleInputChange}
                className="h-4 w-4 rounded border-gray-300 text-5 focus:ring-5"
              />
              <label htmlFor="featured" className="text-sm font-medium">
                Featured Product
              </label>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="images" className="text-sm font-medium">
                Product Images (Max 5)
              </label>
              <input
                id="images"
                name="images"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-5 focus:outline-none"
              />
              
              {/* Image Previews */}
              {imagePreviewUrls.length > 0 && (
                <div className="mt-2 grid grid-cols-5 gap-2">
                  {imagePreviewUrls.map((url, index) => (
                    <div key={index} className="relative h-20 w-20 overflow-hidden rounded-md">
                      <img src={url} alt={`Preview ${index + 1}`} className="h-full w-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <SheetFooter>
              <Button type="button" variant="outline" onClick={() => setShowAddSheet(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Product</Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
      
      {/* Edit Product Sheet */}
      <Sheet open={showEditSheet} onOpenChange={setShowEditSheet}>
        <SheetContent className="sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Edit Product</SheetTitle>
            <SheetDescription>
              Update the details of your product.
            </SheetDescription>
          </SheetHeader>
          <form onSubmit={handleEditProduct} className="space-y-4 p-4">
            <input type="hidden" name="id" value={formData.id} />
            
            <div className="space-y-2">
              <label htmlFor="edit-name" className="text-sm font-medium">
                Product Name
              </label>
              <input
                id="edit-name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-5 focus:outline-none"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="edit-description" className="text-sm font-medium">
                Description
              </label>
              <textarea
                id="edit-description"
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-5 focus:outline-none"
              ></textarea>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="edit-price" className="text-sm font-medium">
                  Price
                </label>
                <input
                  id="edit-price"
                  name="price"
                  type="number"
                  step="0.01"
                  required
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-5 focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-discountPrice" className="text-sm font-medium">
                  Discount Price (Optional)
                </label>
                <input
                  id="edit-discountPrice"
                  name="discountPrice"
                  type="number"
                  step="0.01"
                  value={formData.discountPrice}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-5 focus:outline-none"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="edit-stock" className="text-sm font-medium">
                  Stock
                </label>
                <input
                  id="edit-stock"
                  name="stock"
                  type="number"
                  required
                  value={formData.stock}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-5 focus:outline-none"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-category" className="text-sm font-medium">
                  Category
                </label>
                <select
                  id="edit-category"
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-5 focus:outline-none"
                >
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="edit-tags" className="text-sm font-medium">
                Tags (comma separated)
              </label>
              <input
                id="edit-tags"
                name="tags"
                type="text"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="e.g. new, sale, featured"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-5 focus:outline-none"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  id="edit-featured"
                  name="featured"
                  type="checkbox"
                  checked={formData.featured}
                  onChange={handleInputChange}
                  className="h-4 w-4 rounded border-gray-300"
                />
                <label htmlFor="edit-featured" className="text-sm font-medium">
                  Featured Product
                </label>
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="edit-images" className="text-sm font-medium">
                Replace Images (Max 5)
              </label>
              <input
                id="edit-images"
                name="images"
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-5 focus:outline-none"
              />
              <p className="text-xs text-gray-500">
                Leave empty to keep current images. Uploading new images will replace all existing ones.
              </p>
              
              {/* Current Images */}
              {imagePreviewUrls.length > 0 && (
                <div className="mt-2 flex gap-2 flex-wrap">
                  {imagePreviewUrls.map((url, index) => (
                    <div key={index} className="relative h-20 w-20 overflow-hidden rounded-md">
                      <img 
                        src={url} 
                        alt={`Current ${index + 1}`} 
                        className="h-full w-full object-cover" 
                      />
                    </div>
                  ))}
                </div>
              )}
              
              {/* New Image Previews */}
              {productImages.length > 0 && (
                <div className="mt-2 flex gap-2 flex-wrap">
                  <p className="w-full text-sm font-medium">New Images:</p>
                  {productImages.map((file, index) => (
                    <div key={`new-${index}`} className="relative h-20 w-20 overflow-hidden rounded-md">
                      <img 
                        src={URL.createObjectURL(file)} 
                        alt={`New ${index + 1}`} 
                        className="h-full w-full object-cover" 
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <SheetFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setShowEditSheet(false)}>
                Cancel
              </Button>
              <Button type="submit">Update Product</Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedProduct?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteProduct}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}







