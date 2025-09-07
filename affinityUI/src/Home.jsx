"use client"

import { useState, useEffect } from "react"
import FilterPanel from "./HomeComponents/FilterPanel.jsx"
import ProductGrid from "./HomeComponents/ProductGrid.jsx"
import Pagination from "./HomeComponents/Pagination.jsx"
import Header from "./HomeComponents/Header.jsx"
import ImageUpload from "./HomeComponents/ImageUpload.jsx"
import ProductDetail from "./HomeComponents/ProductDetail.jsx"
import SearchBar from "./HomeComponents/SearchBar.jsx"

export default function Home() {
  const [filters, setFilters] = useState({
    gender: "",
    masterCategory: "",
    subCategory: "",
    articleType: "",
    season: "",
    usage: "",
  })

  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [apiData, setApiData] = useState({
    items: [],
    total_pages: 0,
    pages: [],
    page: 1,
    page_size: 9,
    loading: true,
    error: null,
    usingMockData: false,
  })

  const [similarImages, setSimilarImages] = useState([])
  const [showingSimilarImages, setShowingSimilarImages] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showingProductDetail, setShowingProductDetail] = useState(false)

  useEffect(() => {
    fetchProducts(currentPage, filters, searchQuery)
  }, [currentPage, filters, searchQuery])

  const fetchProducts = async (page, currentFilters, search = "") => {
    try {
      setApiData((prev) => ({ ...prev, loading: true, error: null }))

      const params = new URLSearchParams({
        page: page.toString(),
        page_size: "9",
      })

      if (search) {
        params.append("search", search)
      }

      Object.entries(currentFilters).forEach(([key, value]) => {
        if (value) {
          params.append(key, value)
        }
      })

      const response = await fetch(`http://localhost:8000/products?${params}`)
      if (!response.ok) {
        throw new Error("Failed to fetch products")
      }

      const data = await response.json()
      setApiData({
        items: data.items || [],
        total_pages: data.total_pages || 0,
        pages: data.pages || [],
        page: data.page || 1,
        page_size: data.page_size || 9,
        loading: false,
        error: null,
        usingMockData: false,
      })
    } catch (error) {
      console.error("Error fetching products:", error)

      console.log("[v0] API failed, using mock data as fallback")

      let filteredItems = mockData.items

      if (search) {
        filteredItems = filteredItems.filter((item) => {
          const searchableFields = [
            item.productdisplayname,
            item.article_type,
            item.master_category,
            item.subcategory,
            item.basecolour,
            item.gender,
            item.usage,
            item.season,
          ]
          return searchableFields.some((field) => field && field.toLowerCase().includes(search.toLowerCase()))
        })
      }

      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          filteredItems = filteredItems.filter((item) => {
            const itemValue = item[key] || item[key.replace("Category", "_category")] || ""
            return itemValue.toLowerCase().includes(value.toLowerCase())
          })
        }
      })

      const startIndex = (currentPage - 1) * 9
      const paginatedItems = filteredItems.slice(startIndex, startIndex + 9)
      const totalPages = Math.ceil(filteredItems.length / 9)
      const pages = Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1)

      setApiData({
        items: paginatedItems,
        total_pages: totalPages,
        pages: pages,
        page: currentPage,
        page_size: 9,
        loading: false,
        error: "API connection failed - showing sample data",
        usingMockData: true,
      })
    }
  }

  const handleFilterChange = (filterType, value) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }))
    setCurrentPage(1)
  }

  const handleSearch = (query) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  const handleSimilarImagesFound = (images) => {
    setSimilarImages(images)
    setShowingSimilarImages(true)
  }

  const handleClearSimilarImages = () => {
    setSimilarImages([])
    setShowingSimilarImages(false)
  }

  const handleProductClick = (product) => {
    setSelectedProduct(product)
    setShowingProductDetail(true)
  }

  const handleBackFromDetail = () => {
    setSelectedProduct(null)
    setShowingProductDetail(false)
  }

  const clearFilters = () => {
    setFilters({
      gender: "",
      masterCategory: "",
      subCategory: "",
      articleType: "",
      season: "",
      usage: "",
    })
    setSearchQuery("")
    setCurrentPage(1)
  }

  const mockData = {
    page: 1,
    page_size: 9,
    total_pages: 5,
    pages: [1, 2, 3, 4, 5],
    items: [
      {
        id: 1,
        productdisplayname: "Classic White Shirt",
        article_type: "Shirts",
        master_category: "Apparel",
        subcategory: "Topwear",
        gender: "Men",
        season: "Summer",
        usage: "Casual",
        basecolour: "White",
        year: 2024,
        image: "/white-shirt.png",
      },
      {
        id: 2,
        productdisplayname: "Blue Denim Jeans",
        article_type: "Jeans",
        master_category: "Apparel",
        subcategory: "Bottomwear",
        gender: "Women",
        season: "All Season",
        usage: "Casual",
        basecolour: "Blue",
        year: 2024,
        image: "/classic-blue-jeans.png",
      },
      {
        id: 3,
        productdisplayname: "Summer Floral Dress",
        article_type: "Dresses",
        master_category: "Apparel",
        subcategory: "Dresses",
        gender: "Women",
        season: "Summer",
        usage: "Party",
        basecolour: "Floral",
        year: 2024,
        image: "/woman-in-floral-summer-dress.png",
      },
      {
        id: 4,
        productdisplayname: "Running Sneakers",
        article_type: "Shoes",
        master_category: "Footwear",
        subcategory: "Sports Shoes",
        gender: "Unisex",
        season: "All Season",
        usage: "Sports",
        basecolour: "White",
        year: 2024,
        image: "/running-sneakers.png",
      },
      {
        id: 5,
        productdisplayname: "Leather Jacket",
        article_type: "Jackets",
        master_category: "Apparel",
        subcategory: "Topwear",
        gender: "Men",
        season: "Winter",
        usage: "Casual",
        basecolour: "Black",
        year: 2024,
        image: "/classic-leather-jacket.png",
      },
      {
        id: 6,
        productdisplayname: "Floral Blouse",
        article_type: "Shirts",
        master_category: "Apparel",
        subcategory: "Topwear",
        gender: "Women",
        season: "Spring",
        usage: "Formal",
        basecolour: "Pink",
        year: 2024,
        image: "/floral-blouse.png",
      },
      {
        id: 7,
        productdisplayname: "Casual T-Shirt",
        article_type: "Tshirts",
        master_category: "Apparel",
        subcategory: "Topwear",
        gender: "Men",
        season: "Summer",
        usage: "Casual",
        basecolour: "Blue",
        year: 2024,
        image: "/casual-t-shirt.png",
      },
      {
        id: 8,
        productdisplayname: "Elegant High Heels",
        article_type: "Heels",
        master_category: "Footwear",
        subcategory: "Formal Shoes",
        gender: "Women",
        season: "All Season",
        usage: "Formal",
        basecolour: "Black",
        year: 2024,
        image: "/elegant-high-heels.png",
      },
      {
        id: 9,
        productdisplayname: "Winter Coat",
        article_type: "Coats",
        master_category: "Apparel",
        subcategory: "Topwear",
        gender: "Unisex",
        season: "Winter",
        usage: "Casual",
        basecolour: "Navy",
        year: 2024,
        image: "/cozy-winter-coat.png",
      },
    ],
  }

  if (showingProductDetail && selectedProduct) {
    return <ProductDetail product={selectedProduct} onBack={handleBackFromDetail} />
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <ImageUpload onSimilarImagesFound={handleSimilarImagesFound} onClearSimilarImages={handleClearSimilarImages} />
      {/* <SearchBar onSearch={handleSearch} searchQuery={searchQuery} /> */}
      <div className="flex">
        <FilterPanel filters={filters} onFilterChange={handleFilterChange} onClearFilters={clearFilters} />
        <main className="flex-1 p-6">
          {showingSimilarImages ? (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Similar Products ({similarImages.length})</h2>
                <button
                  onClick={handleClearSimilarImages}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm"
                >
                  Back to All Products
                </button>
              </div>
              <ProductGrid
                apiData={{
                  items: similarImages,
                  loading: false,
                  error: null,
                  usingMockData: false,
                }}
                currentPage={1}
                onProductClick={handleProductClick}
              />
            </div>
          ) : (
            <>
              <ProductGrid apiData={apiData} currentPage={currentPage} onProductClick={handleProductClick} />
              <Pagination
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                totalPages={apiData.total_pages}
                pages={apiData.pages}
              />
            </>
          )}
        </main>
      </div>
    </div>
  )
}
