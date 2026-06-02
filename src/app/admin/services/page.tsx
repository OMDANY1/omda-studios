'use client'

import { useState, useEffect } from 'react'
import { Plus, Pencil, Trash2, GripVertical } from 'lucide-react'
import toast from 'react-hot-toast'

interface Service {
  id: string
  title: string
  description: string | null
  order: number
  published: boolean
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<string | null>(null)
  const [newTitle, setNewTitle] = useState('')
  const [newDesc, setNewDesc] = useState('')

  useEffect(() => {
    fetch('/api/services')
      .then((r) => r.json())
      .then(({ data }) => setServices(data || []))
      .finally(() => setLoading(false))
  }, [])

  async function addService() {
    if (!newTitle.trim()) return
    try {
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle, description: newDesc, order: services.length }),
      })
      if (res.ok) {
        const { data } = await res.json()
        setServices((prev) => [...prev, data])
        setNewTitle('')
        setNewDesc('')
        toast.success('Service added!')
      }
    } catch { toast.error('Error') }
  }

  async function deleteService(id: string) {
    if (!confirm('Delete this service?')) return
    try {
      await fetch(`/api/services/${id}`, { method: 'DELETE' })
      setServices((prev) => prev.filter((s) => s.id !== id))
      toast.success('Deleted')
    } catch { toast.error('Error') }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-charcoal font-display">Services</h1>
        <p className="text-sm text-gray-500 mt-1">{services.length} services</p>
      </div>

      {/* Add new */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
        <h2 className="text-sm font-bold text-charcoal tracking-wide mb-4">ADD NEW SERVICE</h2>
        <div className="flex gap-4">
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Service title..."
            className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-crimson"
          />
          <input
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            placeholder="Description (optional)..."
            className="flex-1 border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-crimson"
          />
          <button
            onClick={addService}
            className="flex items-center gap-2 bg-crimson text-cream px-5 py-2.5 text-xs tracking-widest hover:bg-crimson-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            ADD
          </button>
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Loading...</div>
        ) : services.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">No services yet.</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {services.map((service) => (
              <div key={service.id} className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50/50">
                <GripVertical className="w-4 h-4 text-gray-300 shrink-0" />
                <div className="flex-1">
                  <p className="font-semibold text-charcoal text-sm">{service.title}</p>
                  {service.description && (
                    <p className="text-xs text-gray-400 mt-0.5">{service.description}</p>
                  )}
                </div>
                <span className={`text-xs px-2 py-0.5 rounded ${service.published ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {service.published ? 'Active' : 'Hidden'}
                </span>
                <button
                  onClick={() => deleteService(service.id)}
                  className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
