import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Search, ChevronLeft, ChevronRight } from 'lucide-react'
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

export default function CategoriesPage() {
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
  const [selectedCategory, setSelectedCategory] = useState(null)
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    parent: '',
    image: '',
    featured: false,
    order: 0
  })
  
  // File upload state
  const [categoryImage, setCategoryImage] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  
  // Fetch categories from API
  const fetchCategories = async () => {
    setLoading(true)
    try {
      let url = `${API_URL}/categories?page=${currentPage}&limit=${limit}`
      
      // Add search term if present
      if (searchTerm.trim() !== '') {
        url += `&search=${searchTerm}`
      }
      
      const response = await axios.get(url)
      setCategories(response.data.categories || response.data)
      setTotalPages(response.data.totalPages || 1)
      setError(null)
    } catch (err) {
      setError('Failed to fetch categories. Please try again later.')
      console.error('Error fetching categories:', err)
    } finally {
      setLoading(false)
    }
  }
  
  // Initial data fetch
  useEffect(() => {
    fetchCategories()
  }, [currentPage])
  
  // Handle search with API
  const handleSearch = (e) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchCategories()
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
    
    // Update form data
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    })
    
    // Auto-generate slug when name changes and slug is empty
    if (name === 'name' && (!formData.slug || formData.slug === '')) {
      setFormData(prev => ({
        ...prev,
        slug: value.toLowerCase().replace(/\s+/g, '-')
      }))
    }
  }
  
  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setCategoryImage(file)
      setImagePreview(URL.createObjectURL(file))
    }
  }
  
  // Open add category sheet
  const openAddCategorySheet = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      parent: '',
      image: '',
      featured: false,
      order: 0
    })
    setCategoryImage(null)
    setImagePreview('')
    setShowAddSheet(true)
  }
  
  // Open edit category sheet
  const openEditCategorySheet = (category) => {
    setSelectedCategory(category)
    setFormData({
      id: category._id,
      name: category.name,
      slug: category.slug || '',
      description: category.description || '',
      parent: category.parent?._id || '',
      image: category.image || '',
      featured: category.featured || false,
      order: category.order || 0
    })
    
    // Reset image preview
    setCategoryImage(null)
    
    // If category has image, set it as preview
    if (category.image) {
      setImagePreview(
        category.image.startsWith('http') 
          ? category.image 
          : `${API_URL}/uploads/${category.image}`
      )
    } else {
      setImagePreview('')
    }
    
    setShowEditSheet(true)
  }
  
  // Open delete category dialog
  const openDeleteDialog = (category) => {
    setSelectedCategory(category)
    setShowDeleteDialog(true)
  }
  
  // Handle add category with API
  const handleAddCategory = async (e) => {
    e.preventDefault()
    
    try {
      // Validate required fields
      if (!formData.name.trim()) {
        return toast.error('Category name is required')
      }
      
      // Create form data for file upload
      const formDataToSend = new FormData()
      
      // Ensure name is properly set
      formDataToSend.append('name', formData.name.trim())
      
      // Generate slug if empty or use provided slug
      const slug = formData.slug.trim() 
        ? formData.slug.trim() 
        : formData.name.trim().toLowerCase().replace(/\s+/g, '-')
      
      formDataToSend.append('slug', slug)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('featured', formData.featured)
      formDataToSend.append('order', formData.order)
      
      // Add parent if selected
      if (formData.parent) {
        formDataToSend.append('parent', formData.parent)
      }
      
      // Append image file if selected
      if (categoryImage) {
        formDataToSend.append('categoryImage', categoryImage)
      }
      
      // Log the form data for debugging
      console.log('Sending category data:', {
        name: formData.name.trim(),
        slug: slug,
        description: formData.description,
        featured: formData.featured,
        order: formData.order,
        parent: formData.parent || null
      })
      
      const response = await axios.post(`${API_URL}/categories`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      // Refresh categories list
      fetchCategories()
      
      setShowAddSheet(false)
      toast.success('Category added successfully!')
    } catch (err) {
      console.error('Error adding category:', err)
      toast.error(err.response?.data?.message || 'Failed to add category')
    }
  }
  
  // Handle edit category with API
  const handleEditCategory = async (e) => {
    e.preventDefault()
    
    try {
      // Validate required fields
      if (!formData.name.trim()) {
        return toast.error('Category name is required')
      }
      
      if (!formData.slug.trim()) {
        return toast.error('Category slug is required')
      }
      
      // Create form data for file upload
      const formDataToSend = new FormData()
      formDataToSend.append('name', formData.name.trim())
      formDataToSend.append('slug', formData.slug.trim())
      formDataToSend.append('description', formData.description)
      formDataToSend.append('featured', formData.featured)
      formDataToSend.append('order', formData.order)
      
      // Add parent if selected
      if (formData.parent) {
        formDataToSend.append('parent', formData.parent)
      } else {
        // Explicitly set parent to null if not selected
        formDataToSend.append('parent', 'null')
      }
      
      // Append image file if selected
      if (categoryImage) {
        formDataToSend.append('categoryImage', categoryImage)
      }
      
      const response = await axios.put(`${API_URL}/categories/${formData.id}`, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      // Refresh categories list
      fetchCategories()
      
      setShowEditSheet(false)
      toast.success('Category updated successfully!')
    } catch (err) {
      console.error('Error updating category:', err)
      toast.error(err.response?.data?.message || 'Failed to update category')
    }
  }
  
  // Handle delete category with API
  const handleDeleteCategory = async () => {
    if (!selectedCategory) return
    
    try {
      await axios.delete(`${API_URL}/categories/${selectedCategory._id}`)
      
      // Refresh categories list
      fetchCategories()
      
      setShowDeleteDialog(false)
      toast.success('Category deleted successfully!')
    } catch (err) {
      console.error('Error deleting category:', err)
      toast.error(err.response?.data?.message || 'Failed to delete category')
    }
  }
  
  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-semibold">Categories</h1>
        
        <div className="mt-4 flex flex-col sm:flex-row sm:space-x-4 md:mt-0">
          <form onSubmit={handleSearch} className="flex mb-4 sm:mb-0 h-10">
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-l-md border border-gray-300 px-4 py-2 focus:border-5 focus:outline-none"
            />
            <Button type="submit" className="rounded-l-none h-full">
              <Search size={20} />
            </Button>
          </form>
          
          <Button onClick={openAddCategorySheet} className="flex items-center">
            <Plus size={20} className="mr-2" />
            Add Category
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
                  <TableHead>Slug</TableHead>
                  <TableHead>Parent</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead>Order</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <TableRow key={category._id}>
                      <TableCell className="font-medium">{category._id.substring(0, 8)}...</TableCell>
                      <TableCell>
                        {category.image ? (
                          <div className="h-12 w-12 overflow-hidden rounded-md">
                            <img 
                              src={category.image.startsWith('http') 
                                ? category.image 
                                : `${API_URL}/uploads/${category.image}`} 
                              alt={category.name} 
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = `https://placehold.co/100x100?text=${category.name.charAt(0)}`;
                              }}
                            />
                          </div>
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-gray-100">
                            <span className="text-lg font-semibold text-gray-500">
                              {category.name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>{category.name}</TableCell>
                      <TableCell>{category.slug}</TableCell>
                      <TableCell>
                        {category.parent ? (
                          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                            {category.parent.name}
                          </span>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {category.featured ? (
                          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                            Yes
                          </span>
                        ) : (
                          <span className="text-gray-500">No</span>
                        )}
                      </TableCell>
                      <TableCell>{category.order || 0}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => openEditCategorySheet(category)}
                          className="mr-2 text-indigo-600 hover:text-indigo-900"
                        >
                          <Edit size={18} />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => openDeleteDialog(category)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 size={18} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      No categories found
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
      
      {/* Add Category Sheet */}
      <Sheet open={showAddSheet} onOpenChange={setShowAddSheet}>
        <SheetContent className="sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Add New Category</SheetTitle>
            <SheetDescription>
              Fill in the details to add a new product category.
            </SheetDescription>
          </SheetHeader>
          <form onSubmit={handleAddCategory} className="space-y-4 p-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Category Name
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
              <label htmlFor="slug" className="text-sm font-medium">
                Slug <span className="text-red-500">*</span>
              </label>
              <input
                id="slug"
                name="slug"
                type="text"
                required
                value={formData.slug}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-5 focus:outline-none"
              />
              <p className="text-xs text-gray-500">URL-friendly version of the name (e.g., "home-decor")</p>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-5 focus:outline-none"
              ></textarea>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="parent" className="text-sm font-medium">
                Parent Category (Optional)
              </label>
              <select
                id="parent"
                name="parent"
                value={formData.parent || ""}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-5 focus:outline-none"
              >
                <option value="">None (Top Level Category)</option>
                {categories.map((category) => (
                  // Don't show the current category as a parent option when editing
                  formData.id !== category._id && (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  )
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="order" className="text-sm font-medium">
                Display Order
              </label>
              <input
                id="order"
                name="order"
                type="number"
                value={formData.order}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-5 focus:outline-none"
              />
              <p className="text-xs text-gray-500">Lower numbers appear first</p>
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
                Featured Category
              </label>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="categoryImage" className="text-sm font-medium">
                Category Image
              </label>
              <input
                id="categoryImage"
                name="categoryImage"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-5 focus:outline-none"
              />
              
              {/* Image Preview */}
              {imagePreview && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500 mb-1">Image Preview:</p>
                  <div className="h-32 w-32 overflow-hidden rounded-md">
                    <img 
                      src={imagePreview} 
                      alt="Category preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
            
            <SheetFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setShowAddSheet(false)}>
                Cancel
              </Button>
              <Button type="submit">Add Category</Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
      
      {/* Edit Category Sheet */}
      <Sheet open={showEditSheet} onOpenChange={setShowEditSheet}>
        <SheetContent className="sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Edit Category</SheetTitle>
            <SheetDescription>
              Update the details of your product category.
            </SheetDescription>
          </SheetHeader>
          <form onSubmit={handleEditCategory} className="space-y-4 p-4">
            <input type="hidden" name="id" value={formData.id} />
            
            <div className="space-y-2">
              <label htmlFor="edit-name" className="text-sm font-medium">
                Category Name
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
              <label htmlFor="edit-slug" className="text-sm font-medium">
                Slug <span className="text-red-500">*</span>
              </label>
              <input
                id="edit-slug"
                name="slug"
                type="text"
                required
                value={formData.slug}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-5 focus:outline-none"
              />
              <p className="text-xs text-gray-500">URL-friendly version of the name (e.g., "home-decor")</p>
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
            
            <div className="space-y-2">
              <label htmlFor="edit-parent" className="text-sm font-medium">
                Parent Category (Optional)
              </label>
              <select
                id="edit-parent"
                name="parent"
                value={formData.parent || ""}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-5 focus:outline-none"
              >
                <option value="">None (Top Level Category)</option>
                {categories.map((category) => (
                  // Don't show the current category as a parent option
                  formData.id !== category._id && (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  )
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="edit-order" className="text-sm font-medium">
                Display Order
              </label>
              <input
                id="edit-order"
                name="order"
                type="number"
                value={formData.order}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-5 focus:outline-none"
              />
              <p className="text-xs text-gray-500">Lower numbers appear first</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                id="edit-featured"
                name="featured"
                type="checkbox"
                checked={formData.featured}
                onChange={handleInputChange}
                className="h-4 w-4 rounded border-gray-300 text-5 focus:ring-5"
              />
              <label htmlFor="edit-featured" className="text-sm font-medium">
                Featured Category
              </label>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="edit-categoryImage" className="text-sm font-medium">
                Category Image
              </label>
              <input
                id="edit-categoryImage"
                name="categoryImage"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-5 focus:outline-none"
              />
              <p className="text-xs text-gray-500">
                Leave empty to keep current image
              </p>
              
              {/* Current Image Preview */}
              {imagePreview && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500 mb-1">Current Image:</p>
                  <div className="h-32 w-32 overflow-hidden rounded-md">
                    <img 
                      src={imagePreview} 
                      alt="Category preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
            
            <SheetFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setShowEditSheet(false)}>
                Cancel
              </Button>
              <Button type="submit">Update Category</Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedCategory?.name}"? This action cannot be undone.
              {selectedCategory?.parent && (
                <p className="mt-2 text-amber-600">
                  Warning: This may affect products assigned to this category.
                </p>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCategory}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}








