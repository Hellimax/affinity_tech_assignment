import ProductCard from "./ProductCard.jsx"

export default function ProductGrid({ apiData, currentPage, onProductClick }) {
  const { items, loading, error, usingMockData } = apiData

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Loading products...</p>
      </div>
    )
  }

  return (
    <div>
      {usingMockData && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">Using Sample Data</h3>
              <div className="mt-1 text-sm text-yellow-700">
                <p>Cannot connect to API at localhost:8000. Showing sample products.</p>
                <p className="mt-1">
                  <strong>To connect your API:</strong> Enable CORS on your server and ensure it's running on port 8000.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-2">
          Products ({items.length}) {usingMockData && "(Sample Data)"}
        </h2>
        <p className="text-muted-foreground">
          Page {currentPage} - Showing {items.length} products
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((product) => (
          <ProductCard key={product.id} product={product} onProductClick={onProductClick} />
        ))}
      </div>

      {items.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No products found matching your filters.</p>
        </div>
      )}
    </div>
  )
}
