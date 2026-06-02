'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import toast from 'react-hot-toast'

interface MediaPickerProps {
  value?: string
  onChange: (url: string) => void
  label?: string
}

export default function MediaPicker({ value, onChange, label }: MediaPickerProps) {
  const [uploading, setUploading] = useState(false)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (!file) return

      setUploading(true)
      try {
        const formData = new FormData()
        formData.append('file', file)

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (res.ok) {
          const { data } = await res.json()
          onChange(data.url)
          toast.success('Image uploaded!')
        } else {
          toast.error('Upload failed')
        }
      } catch {
        toast.error('Upload error')
      } finally {
        setUploading(false)
      }
    },
    [onChange]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.gif'] },
    maxFiles: 1,
  })

  if (value) {
    return (
      <div className="relative group">
        <div className="aspect-video relative overflow-hidden rounded-lg bg-gray-100">
          <img src={value} alt="Cover" className="w-full h-full object-cover" />
        </div>
        <button
          type="button"
          onClick={() => onChange('')}
          className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <X className="w-4 h-4 text-gray-600" />
        </button>
        <p className="text-xs text-gray-400 mt-2 truncate">{value}</p>
      </div>
    )
  }

  return (
    <div>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive ? 'border-crimson bg-crimson/5' : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-2 border-crimson border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-400">Uploading...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <Upload className="w-8 h-8 text-gray-300" />
            <div>
              <p className="text-sm text-gray-500">Drop image here or click to upload</p>
              <p className="text-xs text-gray-300 mt-1">JPG, PNG, WebP up to 10MB</p>
            </div>
          </div>
        )}
      </div>

      {/* Or paste URL */}
      <div className="mt-3">
        <input
          type="text"
          placeholder="Or paste an image URL..."
          className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-charcoal focus:outline-none focus:border-crimson transition-colors"
          onBlur={(e) => {
            if (e.target.value) onChange(e.target.value)
          }}
        />
      </div>
    </div>
  )
}
