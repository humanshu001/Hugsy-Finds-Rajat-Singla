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

export default function CategoriesPage() {
  // Static categories data for demo
  const staticCategories = [
    { id: 1, name: "Toys", slug: "toys", description: "Children's toys and games", image: "/images/categories/toys.jpg" },
    { id: 2, name: "Home", slug: "home", description: "Home decor and accessories", image: "/images/categories/home.jpg" },
    { id: 3, name: "Decor", slug: "decor", description: "Decorative items for your space", image: "/images/categories/decor.jpg" },
    { id: 4, name: "Gifts", slug: "gifts", description: "Perfect items for gifting", image: "/images/categories/gifts.jpg" }
  ];

  const [categories, setCategories] = useState(staticCategories)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  
  // Modal states
  const [showAddSheet, setShowAddSheet] = useState(false)
  const [showEditSheet, setShowEditSheet] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: ''
  })
  
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
      setCategories(staticCategories)
      return
    }
    
    // Filter categories based on search term
    const filtered = staticCategories.filter(category => 
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    
    setCategories(filtered)
  }
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }
  
  // Open add category sheet
  const openAddCategorySheet = () => {
    setFormData({
      name: '',
      description: '',
      image: ''
    })
    setShowAddSheet(true)
  }
  
  // Open edit category sheet
  const openEditCategorySheet = (category) => {
    setSelectedCategory(category)
    setFormData({
      id: category.id,
      name: category.name,
      description: category.description || '',
      image: category.image || ''
    })
    setShowEditSheet(true)
  }
  
  // Open delete category dialog
  const openDeleteDialog = (category) => {
    setSelectedCategory(category)
    setShowDeleteDialog(true)
  }
  
  // Handle add category
  const handleAddCategory = (e) => {
    e.preventDefault()
    
    // Create new category with mock data
    const newCategory = {
      id: Date.now(),
      name: formData.name,
      slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
      description: formData.description,
      image: formData.image || '/images/categories/placeholder.jpg'
    }
    
    setCategories([...categories, newCategory])
    setShowAddSheet(false)
    
    // Show success message
    alert('Category added successfully!')
  }
  
  // Handle edit category
  const handleEditCategory = (e) => {
    e.preventDefault()
    
    // Update the category
    const updatedCategories = categories.map(category => {
      if (category.id === formData.id) {
        return {
          ...category,
          name: formData.name,
          slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
          description: formData.description,
          image: formData.image || category.image
        }
      }
      return category
    })
    
    setCategories(updatedCategories)
    setShowEditSheet(false)
    
    // Show success message
    alert('Category updated successfully!')
  }
  
  // Handle delete category
  const handleDeleteCategory = () => {
    if (!selectedCategory) return
    
    // Filter out the deleted category
    const updatedCategories = categories.filter(category => category.id !== selectedCategory.id)
    
    setCategories(updatedCategories)
    setShowDeleteDialog(false)
    
    // Show success message
    alert('Category deleted successfully!')
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
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">{category.id}</TableCell>
                      <TableCell>{category.name}</TableCell>
                      <TableCell className="max-w-xs truncate">{category.description || '-'}</TableCell>
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
                    <TableCell colSpan={4} className="text-center">
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
              <label htmlFor="image" className="text-sm font-medium">
                Image URL
              </label>
              <input
                id="image"
                name="image"
                type="text"
                value={formData.image}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-5 focus:outline-none"
              />
            </div>
            <SheetFooter className="pt-4">
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
              <label htmlFor="edit-image" className="text-sm font-medium">
                Image URL
              </label>
              <input
                id="edit-image"
                name="image"
                type="text"
                value={formData.image}
                onChange={handleInputChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-5 focus:outline-none"
              />
              {formData.image && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500 mb-1">Image Preview:</p>
                  <img 
                    src={formData.image} 
                    alt={formData.name}
                    className="h-20 w-20 object-cover rounded-md"
                    onError={(e) => {
                      e.target.src = 'https://placehold.co/200x200?text=No+Image';
                    }}
                  />
                </div>
              )}
            </div>
            <SheetFooter className="pt-4">
              <Button type="submit" className='w-full'>Update Category</Button>
            </SheetFooter>
          </form>
        </SheetContent>
      </Sheet>
      
      {/* Delete Category Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this category? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedCategory && (
              <p>
                You are about to delete <strong>{selectedCategory.name}</strong>.
              </p>
            )}
            <p className="mt-2 text-sm text-amber-600">
              Warning: Deleting a category may affect products assigned to it.
            </p>
          </div>
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

