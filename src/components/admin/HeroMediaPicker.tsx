'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X } from 'lucide-react'
import toast from 'react-hot-toast'

interface HeroMediaPickerProps {
  url: string
  mediaType: 'image' | 'video'
  onChange: (url: string, mediaType: 'image' | 'video') => void
}

export default function HeroMediaPicker({ url, mediaType, onChange }: HeroMediaPickerProps) {
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
          const type = file.type.startsWith('video/') ? 'video' : 'image'
          onChange(data.url, type)
          toast.success('Media uploaded!')
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
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.gif'],
      'video/*': ['.mp4', '.webm', '.mov'],
    },
    maxFiles: 1,
  })

  if (url) {
    const isVideo = mediaType === 'video'
    return (
      <div className="relative group">
        <div
          className={`aspect-video relative overflow-hidden rounded-lg ${
            isVideo ? 'hero-media-frame--transparent bg-[linear-gradient(45deg,#EDE7DF_25%,transparent_25%,transparent_75%,#EDE7DF_75%),linear-gradient(45deg,#EDE7DF_25%,transparent_25%,transparent_75%,#EDE7DF_75%)] bg-[length:16px_16px] bg-[position:0_0,8px_8px]' : 'bg-cream-dark'
          }`}
        >
          {isVideo ? (
            <video
              src={url}
              className="w-full h-full object-contain"
              style={{ background: 'transparent' }}
              muted
              playsInline
              autoPlay
              loop
            />
          ) : (
            <img src={url} alt="Hero media" className="w-full h-full object-cover" />
          )}
        </div>
        <div className="flex gap-2 mt-3">
          <select
            value={mediaType}
            onChange={(e) => onChange(url, e.target.value as 'image' | 'video')}
            className="border border-gray-200 rounded-lg px-3 py-2 text-xs text-charcoal focus:outline-none focus:border-crimson"
          >
            <option value="image">Image</option>
            <option value="video">Video</option>
          </select>
          <button
            type="button"
            onClick={() => onChange('', 'image')}
            className="text-xs tracking-widest text-gray-400 hover:text-red-500 px-3"
          >
            REMOVE
          </button>
        </div>
      </div>
    )
  }

  return (
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
          <p className="text-sm text-gray-500">Hero image or transparent WebM video</p>
          <p className="text-xs text-gray-300">JPG, PNG, WebP, WebM (alpha), MP4</p>
        </div>
      )}
    </div>
  )
}
