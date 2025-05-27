import React from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'

export default function AddCategoryModal({ isOpen, onClose, onSubmit, formData, setFormData }) {
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Add New Category</SheetTitle>
          <SheetDescription>
            Fill in the details to add a new product category.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
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
  )
}