"use client"

import { useState } from "react"
import { Upload, X, Search } from "lucide-react"

export default function ImageUpload({ onSimilarImagesFound, onClearSimilarImages }) {
  const [dragActive, setDragActive] = useState(false)
  const [uploadedImage, setUploadedImage] = useState(null)
  const [uploadedFile, setUploadedFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file")
      return
    }

    setUploadedFile(file)

    const reader = new FileReader()
    reader.onload = (e) => {
      setUploadedImage(e.target.result)
      setError(null)
    }
    reader.readAsDataURL(file)
  }

  const findSimilarImages = async () => {
    if (!uploadedFile) return

    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", uploadedFile)

      const response = await fetch("http://localhost:8000/getSimilarImages", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Failed to find similar images")
      }

      const data = await response.json()
      onSimilarImagesFound(data.items || [])
    } catch (error) {
      console.error("Error finding similar images:", error)
      setError("Failed to find similar images. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const clearImage = () => {
    setUploadedImage(null)
    setUploadedFile(null)
    setError(null)
    onClearSimilarImages()
  }

  return (
    <div className="bg-white border-b border-gray-200 p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Find Similar Products</h2>

        {!uploadedImage ? (
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-gray-400"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600 mb-2">
              Drag and drop an image here, or{" "}
              <label className="text-blue-600 hover:text-blue-700 cursor-pointer font-medium">
                browse
                <input type="file" className="hidden" accept="image/*" onChange={handleFileInput} />
              </label>
            </p>
            <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB</p>
          </div>
        ) : (
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <img
              src={uploadedImage || "/placeholder.svg"}
              alt="Uploaded"
              className="w-20 h-20 object-cover rounded-lg"
            />
            <div className="flex-1">
              <p className="text-sm text-gray-600">Image uploaded successfully</p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={findSimilarImages}
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                  <Search className="w-4 h-4" />
                  {loading ? "Finding..." : "Find Similar"}
                </button>
                <button
                  onClick={clearImage}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm"
                >
                  <X className="w-4 h-4" />
                  Clear
                </button>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}
      </div>
    </div>
  )
}
