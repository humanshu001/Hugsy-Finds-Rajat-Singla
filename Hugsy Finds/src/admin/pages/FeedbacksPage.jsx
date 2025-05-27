import React, { useState } from 'react'
import { Search, MessageCircle, Check, X, ChevronLeft, ChevronRight, Mail, Info } from 'lucide-react'
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
import { Textarea } from "@/components/ui/textarea"

export default function FeedbacksPage() {
  // Static data for feedbacks
  const staticFeedbacks = [
    {
      id: 'FB1',
      name: 'John Smith',
      email: 'john.smith@example.com',
      mobile: '555-123-4567',
      feedback: 'I love the quality of your handmade toys. My daughter absolutely adores the knitted bunny I purchased last month. The attention to detail is amazing!',
      isResolved: false,
      adminResponse: '',
      createdAt: '2023-11-15T14:23:45'
    },
    {
      id: 'FB2',
      name: 'Emily Johnson',
      email: 'emily.j@example.com',
      mobile: '555-987-6543',
      feedback: 'The shipping was extremely fast, and the packaging was very secure. However, I noticed a small tear in one of the items. Is it possible to get a replacement?',
      isResolved: true,
      adminResponse: 'Thank you for your feedback, Emily. We apologize for the damaged item. Please email us a photo of the tear, and we will send a replacement right away.',
      createdAt: '2023-11-10T09:15:30'
    },
    {
      id: 'FB3',
      name: 'Michael Brown',
      email: 'mbrown@example.com',
      mobile: '555-456-7890',
      feedback: 'I had some issues with the checkout process on your website. The payment kept failing even though my card was valid. I eventually managed to complete my purchase, but it was frustrating.',
      isResolved: true,
      adminResponse: 'We apologize for the inconvenience, Michael. Our team has identified and fixed the issue with our payment gateway. Thank you for bringing this to our attention.',
      createdAt: '2023-11-05T16:45:20'
    },
    {
      id: 'FB4',
      name: 'Sarah Wilson',
      email: 'swilson@example.com',
      mobile: '555-789-0123',
      feedback: 'I would love to see more variety in your wooden toy collection. Have you considered adding educational wooden puzzles?',
      isResolved: false,
      adminResponse: '',
      createdAt: '2023-11-01T11:30:15'
    },
    {
      id: 'FB5',
      name: 'David Lee',
      email: 'dlee@example.com',
      mobile: '555-234-5678',
      feedback: 'The customer service I received was exceptional. The representative was very helpful and went above and beyond to answer all my questions.',
      isResolved: true,
      adminResponse: 'Thank you for your kind words, David! We pride ourselves on providing excellent customer service, and we\'re glad we could help.',
      createdAt: '2023-10-28T13:20:10'
    }
  ];

  const [feedbacks, setFeedbacks] = useState(staticFeedbacks)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  
  // Response dialog states
  const [showResponseDialog, setShowResponseDialog] = useState(false)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [selectedFeedback, setSelectedFeedback] = useState(null)
  const [responseText, setResponseText] = useState('')
  
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
      filterFeedbacks(statusFilter)
      return
    }
    
    // Filter feedbacks based on search term
    const filtered = staticFeedbacks.filter(feedback => 
      feedback.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.feedback.toLowerCase().includes(searchTerm.toLowerCase())
    )
    
    // Apply status filter if needed
    if (statusFilter !== 'all') {
      const statusFiltered = filtered.filter(feedback => 
        statusFilter === 'resolved' ? feedback.isResolved : !feedback.isResolved
      )
      setFeedbacks(statusFiltered)
    } else {
      setFeedbacks(filtered)
    }
    
    setCurrentPage(1)
  }
  
  // Handle status filter change
  const filterFeedbacks = (status) => {
    setStatusFilter(status)
    
    if (status === 'all') {
      setFeedbacks(staticFeedbacks)
    } else {
      const filtered = staticFeedbacks.filter(feedback => 
        status === 'resolved' ? feedback.isResolved : !feedback.isResolved
      )
      setFeedbacks(filtered)
    }
    
    setCurrentPage(1)
  }
  
  // Open response dialog
  const openResponseDialog = (feedback) => {
    setSelectedFeedback(feedback)
    setResponseText(feedback.adminResponse || '')
    setShowResponseDialog(true)
  }
  
  // Open details dialog
  const openDetailsDialog = (feedback) => {
    setSelectedFeedback(feedback)
    setShowDetailsDialog(true)
  }
  
  // Handle submit response
  const handleSubmitResponse = () => {
    if (!selectedFeedback || !responseText.trim()) return
    
    // Update feedback with response
    const updatedFeedbacks = feedbacks.map(feedback => {
      if (feedback.id === selectedFeedback.id) {
        return {
          ...feedback,
          adminResponse: responseText,
          isResolved: true
        }
      }
      return feedback
    })
    
    setFeedbacks(updatedFeedbacks)
    setShowResponseDialog(false)
    
    // Show success message
    alert('Response submitted successfully!')
  }
  
  // Handle mark as resolved without response
  const handleMarkAsResolved = (feedbackId) => {
    // Update feedback status
    const updatedFeedbacks = feedbacks.map(feedback => {
      if (feedback.id === feedbackId) {
        return {
          ...feedback,
          isResolved: true
        }
      }
      return feedback
    })
    
    setFeedbacks(updatedFeedbacks)
    
    // Show success message
    alert('Feedback marked as resolved!')
  }
  
  // Handle mark as unresolved
  const handleMarkAsUnresolved = (feedbackId) => {
    // Update feedback status
    const updatedFeedbacks = feedbacks.map(feedback => {
      if (feedback.id === feedbackId) {
        return {
          ...feedback,
          isResolved: false
        }
      }
      return feedback
    })
    
    setFeedbacks(updatedFeedbacks)
    
    // Show success message
    alert('Feedback marked as unresolved!')
  }
  
  // Handle email customer
  const handleEmailCustomer = (email) => {
    window.location.href = `mailto:${email}`
  }
  
  return (
    <div>
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-semibold">Customer Feedbacks</h1>
        
        <div className="mt-4 flex flex-col sm:flex-row sm:space-x-4 md:mt-0">
          <form onSubmit={handleSearch} className="flex mb-4 sm:mb-0 h-10">
            <input
              type="text"
              placeholder="Search feedbacks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-l-md border border-gray-300 px-4 py-2 focus:border-5 focus:outline-none"
            />
            <Button type="submit" className="rounded-l-none h-full">
              <Search size={20} />
            </Button>
          </form>
          
          <Select value={statusFilter} onValueChange={filterFeedbacks}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Feedbacks</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="unresolved">Unresolved</SelectItem>
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
                  <TableHead>Customer</TableHead>
                  <TableHead>Feedback</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {feedbacks.length > 0 ? (
                  feedbacks.map((feedback) => (
                    <TableRow key={feedback.id}>
                      <TableCell>
                        <div className="font-medium">{feedback.name}</div>
                        {feedback.email && (
                          <div className="text-xs text-gray-500">{feedback.email}</div>
                        )}
                        {feedback.mobile && (
                          <div className="text-xs text-gray-500">{feedback.mobile}</div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="max-w-md truncate">
                          {feedback.feedback.length > 100 
                            ? `${feedback.feedback.substring(0, 100)}...` 
                            : feedback.feedback
                          }
                        </div>
                        {feedback.adminResponse && (
                          <div className="mt-1 text-xs text-gray-500 italic">
                            Response: {feedback.adminResponse.length > 50 
                              ? `${feedback.adminResponse.substring(0, 50)}...` 
                              : feedback.adminResponse
                            }
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        {formatDate(feedback.createdAt)}
                      </TableCell>
                      <TableCell>
                        <Badge className={feedback.isResolved ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}>
                          {feedback.isResolved ? 'Resolved' : 'Pending'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => openDetailsDialog(feedback)}
                          className="mr-2 text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <Info size={18} />
                        </Button>
                        
                        {feedback.email && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleEmailCustomer(feedback.email)}
                            className="mr-2 text-purple-600 hover:text-purple-900"
                            title="Email Customer"
                          >
                            <Mail size={18} />
                          </Button>
                        )}
                        
                        {!feedback.isResolved ? (
                          <>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => openResponseDialog(feedback)}
                              className="mr-2 text-indigo-600 hover:text-indigo-900"
                              title="Respond"
                            >
                              <MessageCircle size={18} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => handleMarkAsResolved(feedback.id)}
                              className="text-green-600 hover:text-green-900"
                              title="Mark as Resolved"
                            >
                              <Check size={18} />
                            </Button>
                          </>
                        ) : (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleMarkAsUnresolved(feedback.id)}
                            className="text-amber-600 hover:text-amber-900"
                            title="Mark as Unresolved"
                          >
                            <X size={18} />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center">
                      No feedbacks found
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
      
      {/* Response Dialog */}
      <Dialog open={showResponseDialog} onOpenChange={setShowResponseDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Respond to Feedback</DialogTitle>
            <DialogDescription>
              Write a response to the customer's feedback.
            </DialogDescription>
          </DialogHeader>
          
          {selectedFeedback && (
            <div className="mt-4 space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="mb-4">
                    <div className="font-medium">{selectedFeedback.name}</div>
                    {selectedFeedback.email && (
                      <div className="text-sm text-gray-500">{selectedFeedback.email}</div>
                    )}
                  </div>
                  <div className="text-gray-700 mb-2">
                    {selectedFeedback.feedback}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatDate(selectedFeedback.createdAt)}
                  </div>
                </CardContent>
              </Card>
              
              <div className="space-y-2">
                <label htmlFor="response" className="block text-sm font-medium text-gray-700">
                  Your Response
                </label>
                <Textarea
                  id="response"
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Type your response here..."
                  rows={5}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-5 focus:outline-none"
                />
              </div>
            </div>
          )}
          
          <DialogFooter className="mt-6 flex space-x-2">
            <Button variant="outline" onClick={() => setShowResponseDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmitResponse}>
              Submit Response
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Details Dialog */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Feedback Details</DialogTitle>
          </DialogHeader>
          
          {selectedFeedback && (
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Customer</h3>
                  <p className="mt-1">{selectedFeedback.name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Date</h3>
                  <p className="mt-1">{formatDate(selectedFeedback.createdAt)}</p>
                </div>
                {selectedFeedback.email && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                    <p className="mt-1">{selectedFeedback.email}</p>
                  </div>
                )}
                {selectedFeedback.mobile && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Mobile</h3>
                    <p className="mt-1">{selectedFeedback.mobile}</p>
                  </div>
                )}
                <div className="col-span-2">
                  <h3 className="text-sm font-medium text-gray-500">Status</h3>
                  <p className="mt-1">
                    <Badge className={selectedFeedback.isResolved ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}>
                      {selectedFeedback.isResolved ? 'Resolved' : 'Pending'}                    </Badge>
                  </p>
                </div>
              </div>
              
              <div>
                <h3 className="text-sm font-medium text-gray-500">Feedback</h3>
                <div className="mt-2 rounded-md bg-gray-50 p-4">
                  <p className="whitespace-pre-wrap">{selectedFeedback.feedback}</p>
                </div>
              </div>
              
              {selectedFeedback.adminResponse && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Admin Response</h3>
                  <div className="mt-2 rounded-md bg-blue-50 p-4">
                    <p className="whitespace-pre-wrap">{selectedFeedback.adminResponse}</p>
                  </div>
                </div>
              )}
              
              <div className="flex justify-end space-x-2">
                {selectedFeedback.email && (
                  <Button 
                    variant="outline" 
                    onClick={() => handleEmailCustomer(selectedFeedback.email)}
                  >
                    <Mail size={16} className="mr-2" />
                    Email Customer
                  </Button>
                )}
                
                {!selectedFeedback.isResolved ? (
                  <>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setShowDetailsDialog(false)
                        openResponseDialog(selectedFeedback)
                      }}
                    >
                      <MessageCircle size={16} className="mr-2" />
                      Respond
                    </Button>
                    <Button 
                      onClick={() => {
                        handleMarkAsResolved(selectedFeedback.id)
                        setShowDetailsDialog(false)
                      }}
                    >
                      <Check size={16} className="mr-2" />
                      Mark as Resolved
                    </Button>
                  </>
                ) : (
                  <Button 
                    variant="outline"
                    onClick={() => {
                      handleMarkAsUnresolved(selectedFeedback.id)
                      setShowDetailsDialog(false)
                    }}
                  >
                    <X size={16} className="mr-2" />
                    Mark as Unresolved
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Stats Cards */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Feedbacks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{staticFeedbacks.length}</div>
            <p className="text-xs text-gray-500">All time</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {staticFeedbacks.filter(f => f.isResolved).length}
            </div>
            <p className="text-xs text-gray-500">
              {Math.round((staticFeedbacks.filter(f => f.isResolved).length / staticFeedbacks.length) * 100)}% of total
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {staticFeedbacks.filter(f => !f.isResolved).length}
            </div>
            <p className="text-xs text-gray-500">
              {Math.round((staticFeedbacks.filter(f => !f.isResolved).length / staticFeedbacks.length) * 100)}% of total
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round((staticFeedbacks.filter(f => f.adminResponse).length / staticFeedbacks.length) * 100)}%
            </div>
            <p className="text-xs text-gray-500">
              {staticFeedbacks.filter(f => f.adminResponse).length} responses sent
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}