import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export default function DeleteCategoryModal({ isOpen, onClose, onDelete, category }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Category</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this category? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {category && (
            <p>
              You are about to delete <strong>{category.name}</strong>.
            </p>
          )}
          <p className="mt-2 text-sm text-amber-600">
            Warning: Deleting a category may affect products assigned to it.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}