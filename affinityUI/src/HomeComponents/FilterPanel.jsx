"use client"

import { ChevronDown } from "lucide-react"
import { useState } from "react"

export default function FilterPanel({ filters, onFilterChange, onClearFilters }) {
  const [openDropdowns, setOpenDropdowns] = useState({})

  const filterOptions = {
    gender: ["Men", "Women", "Unisex"],
    masterCategory: ["Apparel", "Footwear", "Accessories", "Personal Care", "Home & Living"],
    subCategory: ["Topwear", "Bottomwear", "Innerwear", "Shoes", "Bags", "Watches"],
    articleType: ["Shirts", "Jeans", "T-shirts", "Dresses", "Sneakers", "Formal Shoes"],
    season: ["Summer", "Winter", "Fall", "Spring", "All Season"],
    usage: ["Casual", "Formal", "Sports", "Party", "Ethnic", "Travel"],
  }

  const filterLabels = {
    gender: "Gender",
    masterCategory: "Master Category",
    subCategory: "Sub Category",
    articleType: "Article Type",
    season: "Season",
    usage: "Usage",
  }

  const toggleDropdown = (filterType) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [filterType]: !prev[filterType],
    }))
  }

  const hasActiveFilters = Object.values(filters).some((filter) => filter !== "")

  return (
    <aside className="w-80 bg-white border-r border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground">Filters</h2>
        {hasActiveFilters && (
          <button onClick={onClearFilters} className="text-sm text-muted-foreground hover:text-foreground underline">
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-4">
        {Object.keys(filterOptions).map((filterType) => (
          <div key={filterType} className="border-b border-border pb-4">
            <button
              onClick={() => toggleDropdown(filterType)}
              className="flex items-center justify-between w-full text-left py-2"
            >
              <span className="font-medium text-foreground">{filterLabels[filterType]}</span>
              <ChevronDown
                className={`w-4 h-4 text-muted-foreground transition-transform ${
                  openDropdowns[filterType] ? "rotate-180" : ""
                }`}
              />
            </button>

            {openDropdowns[filterType] && (
              <div className="mt-2 space-y-2">
                <button
                  onClick={() => onFilterChange(filterType, "")}
                  className={`block w-full text-left px-3 py-1 text-sm rounded hover:bg-muted ${
                    filters[filterType] === "" ? "bg-muted text-foreground" : "text-muted-foreground"
                  }`}
                >
                  All
                </button>
                {filterOptions[filterType].map((option) => (
                  <button
                    key={option}
                    onClick={() => onFilterChange(filterType, option)}
                    className={`block w-full text-left px-3 py-1 text-sm rounded hover:bg-muted ${
                      filters[filterType] === option ? "bg-muted text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  )
}
