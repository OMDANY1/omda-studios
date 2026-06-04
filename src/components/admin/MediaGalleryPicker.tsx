'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X, GripVertical, Film, Image as ImageIcon } from 'lucide-react'
import toast from 'react-hot-toast'
import type { MediaItem, MediaItemType } from '@/lib/media'

interface MediaGalleryPickerProps {
  value: MediaItem[]
  onChange: (items: MediaItem[]) => void
  label?: string
}

export default function MediaGalleryPicker({ value, onChange, label }: MediaGalleryPickerProps) {
  const [uploading, setUploading] = useState(false)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return
      setUploading(true)

      try {
        const uploaded: MediaItem[] = []

        for (const file of acceptedFiles) {
          const formData = new FormData()
          formData.append('file', file)

          const res = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          })

          if (res.ok) {
            const { data } = await res.json()
            const type: MediaItemType = file.type.startsWith('video/') ? 'video' : 'image'
            uploaded.push({ url: data.url, type })
          } else {
            toast.error(`Failed to upload ${file.name}`)
          }
        }

        if (uploaded.length > 0) {
          onChange([...value, ...uploaded])
          toast.success(`${uploaded.length} file(s) uploaded`)
        }
      } catch {
        toast.error('Upload error')
      } finally {
        setUploading(false)
      }
    },
    [onChange, value]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.webp', '.gif'],
      'video/*': ['.mp4', '.webm', '.mov'],
    },
    multiple: true,
  })

  function removeAt(index: number) {
    onChange(value.filter((_, i) => i !== index))
  }

  function moveItem(from: number, to: number) {
    if (to < 0 || to >= value.length) return
    const next = [...value]
    const [item] = next.splice(from, 1)
    next.splice(to, 0, item)
    onChange(next)
  }

  function toggleType(index: number) {
    const next = [...value]
    next[index] = {
      ...next[index],
      type: next[index].type === 'video' ? 'image' : 'video',
    }
    onChange(next)
  }

  return (
    <div className="space-y-4">
      {label && <p className="text-xs tracking-widest text-gray-400 font-medium">{label}</p>}

      {value.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {value.map((item, index) => (
            <div
              key={`${item.url}-${index}`}
              className="relative group rounded-lg overflow-hidden border border-gray-100 bg-gray-50"
            >
              <div className="aspect-video relative bg-charcoal">
                {item.type === 'video' ? (
                  <video
                    src={item.url}
                    className="w-full h-full object-cover"
                    muted
                    playsInline
                  />
                ) : (
                  <img src={item.url} alt="" className="w-full h-full object-cover" />
                )}
                <span className="absolute top-2 left-2 text-[10px] tracking-widest bg-charcoal/80 text-cream px-2 py-0.5 rounded">
                  {item.type.toUpperCase()}
                </span>
              </div>
              <div className="flex items-center gap-1 p-2 bg-white border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => moveItem(index, index - 1)}
                  disabled={index === 0}
                  className="p-1 text-gray-400 hover:text-charcoal disabled:opacity-30"
                  title="Move up"
                >
                  <GripVertical className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => toggleType(index)}
                  className="p-1 text-gray-400 hover:text-crimson"
                  title="Toggle image/video"
                >
                  {item.type === 'video' ? (
                    <Film className="w-4 h-4" />
                  ) : (
                    <ImageIcon className="w-4 h-4" />
                  )}
                </button>
                <p className="flex-1 text-xs text-gray-400 truncate">{item.url}</p>
                <button
                  type="button"
                  onClick={() => removeAt(index)}
                  className="p-1 text-gray-400 hover:text-red-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

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
              <p className="text-sm text-gray-500">Drop images or videos, or click to upload</p>
              <p className="text-xs text-gray-300 mt-1">JPG, PNG, WebP, MP4, WebM</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
