"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"

export default function Pagination({ currentPage, onPageChange, totalPages, pages }) {
  const createSmartPagination = () => {
    if (totalPages <= 7) {
      // If total pages is 7 or less, show all pages
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const pageNumbers = []

    // Always show first 2 pages
    pageNumbers.push(1, 2)

    // Add ellipsis if there's a gap
    if (currentPage > 4) {
      pageNumbers.push("...")
    }

    // Show current page and neighbors (if not already shown)
    const start = Math.max(3, currentPage - 1)
    const end = Math.min(totalPages - 2, currentPage + 1)

    for (let i = start; i <= end; i++) {
      if (!pageNumbers.includes(i)) {
        pageNumbers.push(i)
      }
    }

    // Add ellipsis if there's a gap before last pages
    if (currentPage < totalPages - 3) {
      pageNumbers.push("...")
    }

    // Always show last 2 pages (if not already included)
    if (!pageNumbers.includes(totalPages - 1)) {
      pageNumbers.push(totalPages - 1)
    }
    if (!pageNumbers.includes(totalPages)) {
      pageNumbers.push(totalPages)
    }

    return pageNumbers
  }

  const pageNumbers = createSmartPagination()

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  }

  if (totalPages <= 1) {
    return null
  }

  return (
    <div className="flex items-center justify-center space-x-2 mt-8">
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="flex items-center px-3 py-2 text-sm border border-border rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="w-4 h-4 mr-1" />
        Previous
      </button>

      <div className="flex space-x-1">
        {pageNumbers.map((page, index) =>
          page === "..." ? (
            <span key={`ellipsis-${index}`} className="px-3 py-2 text-sm text-muted-foreground">
              ...
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-2 text-sm rounded ${
                currentPage === page ? "bg-primary text-primary-foreground" : "border border-border hover:bg-muted"
              }`}
            >
              {page}
            </button>
          ),
        )}
      </div>

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="flex items-center px-3 py-2 text-sm border border-border rounded hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
        <ChevronRight className="w-4 h-4 ml-1" />
      </button>
    </div>
  )
}
