"use client"

export default function ProductCard({ product, onProductClick }) {
  const getImageSrc = () => {
    if (product.image) {
      // Check if it's base64 data
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

  const handleClick = () => {
    if (onProductClick) {
      onProductClick(product)
    }
  }

  return (
    <div
      className="bg-white border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
      onClick={handleClick}
    >
      <div className="aspect-square overflow-hidden">
        <img
          src={getImageSrc() || "/placeholder.svg"}
          alt={product.productDisplayName || product.name || "Product"}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-3">
        <h3 className="font-medium text-foreground mb-2 line-clamp-2 text-sm">
          {product.productDisplayName || product.name}
        </h3>

        <div className="space-y-1.5 mb-3">
          {product.articleType && (
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Type:</span>
              <span className="text-foreground font-medium">{product.articleType}</span>
            </div>
          )}

          {product.masterCategory && (
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Master Category:</span>
              <span className="text-foreground">{product.masterCategory}</span>
            </div>
          )}

          {product.subCategory && (
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Subcategory:</span>
              <span className="text-foreground">{product.subCategory}</span>
            </div>
          )}

          {product.gender && (
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Gender:</span>
              <span className="text-foreground">{product.gender}</span>
            </div>
          )}

          {product.baseColour && (
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Color:</span>
              <span className="text-foreground">{product.baseColour}</span>
            </div>
          )}

          {product.usage && (
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Usage:</span>
              <span className="text-foreground">{product.usage}</span>
            </div>
          )}

          {product.year && (
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Year:</span>
              <span className="text-foreground">{product.year}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border">
          {product.price ? (
            <span className="text-sm font-semibold text-foreground">${product.price}</span>
          ) : (
            <span className="text-xs text-muted-foreground">Price not available</span>
          )}
        </div>
      </div>
    </div>
  )
}
