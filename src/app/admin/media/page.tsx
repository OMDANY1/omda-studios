'use client'

import { useState, useEffect, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, Trash2, Copy, Check, Pencil, X } from 'lucide-react'
import toast from 'react-hot-toast'

interface MediaItem {
  id: string
  filename: string
  url: string
  type: string
  size: number
  alt: string | null
  createdAt: string
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

export default function AdminMediaPage() {
  const [media, setMedia] = useState<MediaItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editFilename, setEditFilename] = useState('')
  const [editAlt, setEditAlt] = useState('')

  const fetchMedia = async () => {
    try {
      const res = await fetch('/api/upload')
      if (res.ok) {
        const { data } = await res.json()
        setMedia(data)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMedia()
  }, [])

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true)
    try {
      for (const file of acceptedFiles) {
        const formData = new FormData()
        formData.append('file', file)
        const res = await fetch('/api/upload', { method: 'POST', body: formData })
        if (!res.ok) toast.error(`Failed to upload ${file.name}`)
      }
      toast.success(`${acceptedFiles.length} file(s) uploaded!`)
      fetchMedia()
    } catch {
      toast.error('Upload failed')
    } finally {
      setUploading(false)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
  })

  function copyUrl(id: string, url: string) {
    const absoluteUrl = url.startsWith('http') ? url : window.location.origin + url
    navigator.clipboard.writeText(absoluteUrl)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
    toast.success('URL copied!')
  }

  async function deleteMedia(id: string) {
    if (!confirm('Delete this file?')) return
    try {
      await fetch(`/api/upload/${id}`, { method: 'DELETE' })
      setMedia((prev) => prev.filter((m) => m.id !== id))
      toast.success('Deleted')
    } catch {
      toast.error('Error deleting')
    }
  }

  function startEdit(item: MediaItem) {
    setEditingId(item.id)
    setEditFilename(item.filename)
    setEditAlt(item.alt || '')
  }

  async function saveMedia(id: string) {
    try {
      const res = await fetch(`/api/upload/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: editFilename, alt: editAlt }),
      })

      if (!res.ok) throw new Error('Failed to update media')

      const { data } = await res.json()
      setMedia((prev) => prev.map((item) => (item.id === id ? data : item)))
      setEditingId(null)
      toast.success('Media updated')
    } catch {
      toast.error('Failed to update media')
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-charcoal font-display">Media Library</h1>
        <p className="text-sm text-gray-500 mt-1">{media.length} files</p>
      </div>

      {/* Upload zone */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer mb-8 transition-colors ${
          isDragActive ? 'border-crimson bg-crimson/5' : 'border-gray-200 hover:border-gray-300 bg-white'
        }`}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-crimson border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-400">Uploading files...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <Upload className="w-10 h-10 text-gray-300" />
            <div>
              <p className="text-sm text-gray-500 font-medium">Drop images here or click to upload</p>
              <p className="text-xs text-gray-300 mt-1">JPG, PNG, WebP, GIF supported</p>
            </div>
          </div>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="aspect-square bg-gray-100 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : media.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 text-sm">No media uploaded yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {media.map((item) => (
            <div key={item.id} className="group relative bg-white rounded-lg overflow-hidden border border-gray-100">
              <div className="aspect-square relative overflow-hidden bg-gray-50">
                <img src={item.url} alt={item.filename} className="w-full h-full object-cover" />
              </div>
              <div className="p-2">
                {editingId === item.id ? (
                  <div className="space-y-2">
                    <input
                      value={editFilename}
                      onChange={(e) => setEditFilename(e.target.value)}
                      className="w-full border border-gray-200 rounded px-2 py-1 text-xs text-charcoal focus:outline-none focus:border-crimson"
                    />
                    <input
                      value={editAlt}
                      onChange={(e) => setEditAlt(e.target.value)}
                      className="w-full border border-gray-200 rounded px-2 py-1 text-xs text-charcoal focus:outline-none focus:border-crimson"
                      placeholder="Alt text"
                    />
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => saveMedia(item.id)}
                        className="p-1 text-gray-400 hover:text-green-700 transition-colors"
                        title="Save"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        className="p-1 text-gray-400 hover:text-charcoal transition-colors"
                        title="Cancel"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-xs text-gray-600 truncate">{item.filename}</p>
                    <p className="text-xs text-gray-300 truncate">
                      {item.alt || formatBytes(item.size)}
                    </p>
                  </>
                )}
              </div>
              {/* Hover actions */}
              <div className="absolute inset-0 bg-charcoal/60 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => copyUrl(item.id, item.url)}
                  className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                  title="Copy URL"
                >
                  {copiedId === item.id ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4 text-charcoal" />
                  )}
                </button>
                <button
                  onClick={() => startEdit(item)}
                  className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                  title="Edit metadata"
                >
                  <Pencil className="w-4 h-4 text-charcoal" />
                </button>
                <button
                  onClick={() => deleteMedia(item.id)}
                  className="p-2 bg-white rounded-full hover:bg-red-50 transition-colors"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
