"use client"

import { useState, useEffect } from "react"
import ProductGrid from "./ProductGrid.jsx"

export default function ProductDetail({ product, onBack }) {
  const [similarProducts, setSimilarProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchSimilarProducts()
  }, [product])

  const fetchSimilarProducts = async () => {
    try {
      setLoading(true)
      setError(null)

      const imagePath = `../images/${product.id}.jpg` //can be replaced with s3 storage path

      const response = await fetch("http://localhost:8000/getrecommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          file_path: imagePath,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch recommendations")
      }

      const data = await response.json()
      setSimilarProducts(data.items || [])
    } catch (error) {
      console.error("Error fetching recommendations:", error)
      setError(`Failed to load recommendations: ${error.message}`)
      // Mock similar products for demo
      setSimilarProducts([
        {
          id: 101,
          productdisplayname: "Similar White Shirt",
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
          id: 102,
          productdisplayname: "Cotton White Tee",
          article_type: "Tshirts",
          master_category: "Apparel",
          subcategory: "Topwear",
          gender: "Men",
          season: "Summer",
          usage: "Casual",
          basecolour: "White",
          year: 2024,
          image: "/casual-t-shirt.png",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const getImageSrc = () => {
    if (product.image) {
      if (
        product.image.startsWith("data:image/") ||
        product.image.startsWith("/9j/") ||
        product.image.startsWith("iVBOR")
      ) {
        return product.image.startsWith("data:image/") ? product.image : `data:image/jpeg;base64,${product.image}`
      }
      return product.image
    }
    return "/placeholder.svg"
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="p-6">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="mb-6 flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
        >
          ← Back to Products
        </button>

        {/* Product Detail Section */}
        <div className="bg-white rounded-lg border border-border p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="aspect-square overflow-hidden rounded-lg border border-border">
              <img
                src={getImageSrc() || "/placeholder.svg"}
                alt={product.productDisplayName || product.name || "Product"}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Product Details */}
            <div className="space-y-4">
              <h1 className="text-2xl font-bold text-foreground">{product.productDisplayName || product.name}</h1>

              <div className="grid grid-cols-2 gap-4">
                {product.articleType && (
                  <div>
                    <span className="text-sm text-muted-foreground">Article Type:</span>
                    <p className="font-medium text-foreground">{product.articleType}</p>
                  </div>
                )}

                {product.masterCategory && (
                  <div>
                    <span className="text-sm text-muted-foreground">Master Category:</span>
                    <p className="font-medium text-foreground">{product.masterCategory}</p>
                  </div>
                )}

                {product.subCategory && (
                  <div>
                    <span className="text-sm text-muted-foreground">Subcategory:</span>
                    <p className="font-medium text-foreground">{product.subCategory}</p>
                  </div>
                )}

                {product.gender && (
                  <div>
                    <span className="text-sm text-muted-foreground">Gender:</span>
                    <p className="font-medium text-foreground">{product.gender}</p>
                  </div>
                )}

                {product.baseColour && (
                  <div>
                    <span className="text-sm text-muted-foreground">Base Color:</span>
                    <p className="font-medium text-foreground">{product.baseColour}</p>
                  </div>
                )}

                {product.usage && (
                  <div>
                    <span className="text-sm text-muted-foreground">Usage:</span>
                    <p className="font-medium text-foreground">{product.usage}</p>
                  </div>
                )}

                {product.season && (
                  <div>
                    <span className="text-sm text-muted-foreground">Season:</span>
                    <p className="font-medium text-foreground">{product.season}</p>
                  </div>
                )}

                {product.year && (
                  <div>
                    <span className="text-sm text-muted-foreground">Year:</span>
                    <p className="font-medium text-foreground">{product.year}</p>
                  </div>
                )}
              </div>

              {product.price && (
                <div className="pt-4 border-t border-border">
                  <span className="text-2xl font-bold text-foreground">${product.price}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Similar Products Section */}
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-6">
            Recommended Products {similarProducts.length > 0 && `(${similarProducts.length})`}
          </h2>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="text-muted-foreground">Loading recommendations...</div>
            </div>
          ) : error ? (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
              <p className="text-yellow-800 text-sm">{error} - Showing sample recommendations</p>
            </div>
          ) : null}

          <ProductGrid
            apiData={{
              items: similarProducts,
              loading: false,
              error: null,
              usingMockData: error !== null,
            }}
            currentPage={1}
            onProductClick={() => {}} // Disable clicking on similar products to avoid nested navigation
          />
        </div>
      </div>
    </div>
  )
}
