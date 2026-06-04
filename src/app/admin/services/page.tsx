'use client'

import { useCallback, useEffect, useState } from 'react'
import { Check, Eye, EyeOff, GripVertical, Pencil, Plus, Trash2, X } from 'lucide-react'
import toast from 'react-hot-toast'

interface Service {
  id: string
  title: string
  description: string | null
  icon: string | null
  order: number
  published: boolean
}

interface ServiceDraft {
  title: string
  description: string
  icon: string
  order: number
  published: boolean
}

const emptyDraft: ServiceDraft = {
  title: '',
  description: '',
  icon: '',
  order: 0,
  published: true,
}

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [newService, setNewService] = useState<ServiceDraft>(emptyDraft)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editDraft, setEditDraft] = useState<ServiceDraft>(emptyDraft)

  const fetchServices = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/services')
      if (!res.ok) throw new Error('Failed to load services')
      const { data } = await res.json()
      setServices(data || [])
    } catch {
      toast.error('Failed to load services')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchServices()
  }, [fetchServices])

  function toDraft(service: Service): ServiceDraft {
    return {
      title: service.title,
      description: service.description || '',
      icon: service.icon || '',
      order: service.order,
      published: service.published,
    }
  }

  async function addService() {
    if (!newService.title.trim()) return toast.error('Service title is required')

    setSaving(true)
    try {
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newService, order: Number(newService.order) }),
      })

      if (!res.ok) throw new Error('Failed to add service')

      const { data } = await res.json()
      setServices((prev) => [...prev, data])
      setNewService({ ...emptyDraft, order: services.length + 1 })
      toast.success('Service added')
    } catch {
      toast.error('Failed to add service')
    } finally {
      setSaving(false)
    }
  }

  function startEdit(service: Service) {
    setEditingId(service.id)
    setEditDraft(toDraft(service))
  }

  async function saveService(id: string) {
    if (!editDraft.title.trim()) return toast.error('Service title is required')

    setSaving(true)
    try {
      const res = await fetch(`/api/services/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...editDraft, order: Number(editDraft.order) }),
      })

      if (!res.ok) throw new Error('Failed to update service')

      const { data } = await res.json()
      setServices((prev) => prev.map((service) => (service.id === id ? data : service)))
      setEditingId(null)
      toast.success('Service updated')
    } catch {
      toast.error('Failed to update service')
    } finally {
      setSaving(false)
    }
  }

  async function togglePublished(service: Service) {
    try {
      const res = await fetch(`/api/services/${service.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: !service.published }),
      })

      if (!res.ok) throw new Error('Failed to update service')

      const { data } = await res.json()
      setServices((prev) => prev.map((item) => (item.id === service.id ? data : item)))
    } catch {
      toast.error('Failed to update status')
    }
  }

  async function deleteService(id: string) {
    if (!confirm('Delete this service?')) return

    try {
      const res = await fetch(`/api/services/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete service')

      setServices((prev) => prev.filter((service) => service.id !== id))
      toast.success('Service deleted')
    } catch {
      toast.error('Failed to delete service')
    }
  }

  const inputClass =
    'w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-charcoal focus:outline-none focus:border-crimson transition-colors'

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-charcoal font-display">Services</h1>
        <p className="text-sm text-gray-500 mt-1">{services.length} services</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
        <h2 className="text-sm font-bold text-charcoal tracking-wide mb-4">ADD NEW SERVICE</h2>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_8rem_auto] gap-4">
          <input
            value={newService.title}
            onChange={(e) => setNewService((prev) => ({ ...prev, title: e.target.value }))}
            placeholder="Service title..."
            className={inputClass}
          />
          <input
            value={newService.description}
            onChange={(e) => setNewService((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="Description (optional)..."
            className={inputClass}
          />
          <input
            type="number"
            value={newService.order}
            onChange={(e) => setNewService((prev) => ({ ...prev, order: Number(e.target.value) }))}
            aria-label="Service order"
            className={inputClass}
          />
          <button
            type="button"
            onClick={addService}
            disabled={saving}
            className="flex items-center justify-center gap-2 bg-crimson text-cream px-5 py-2.5 text-xs tracking-widest hover:bg-crimson-800 transition-colors disabled:opacity-60"
          >
            <Plus className="w-4 h-4" />
            ADD
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400 text-sm">Loading...</div>
        ) : services.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">No services yet.</div>
        ) : (
          <div className="divide-y divide-gray-50">
            {services.map((service) => {
              const isEditing = editingId === service.id

              return (
                <div key={service.id} className="px-6 py-4 hover:bg-gray-50/50">
                  <div className="flex items-start gap-4">
                    <GripVertical className="w-4 h-4 text-gray-300 shrink-0 mt-3" />

                    {isEditing ? (
                      <div className="grid flex-1 grid-cols-1 md:grid-cols-[1fr_1fr_7rem] gap-3">
                        <input
                          value={editDraft.title}
                          onChange={(e) => setEditDraft((prev) => ({ ...prev, title: e.target.value }))}
                          className={inputClass}
                        />
                        <input
                          value={editDraft.description}
                          onChange={(e) =>
                            setEditDraft((prev) => ({ ...prev, description: e.target.value }))
                          }
                          className={inputClass}
                        />
                        <input
                          type="number"
                          value={editDraft.order}
                          onChange={(e) =>
                            setEditDraft((prev) => ({ ...prev, order: Number(e.target.value) }))
                          }
                          aria-label="Service order"
                          className={inputClass}
                        />
                      </div>
                    ) : (
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-charcoal text-sm">{service.title}</p>
                        {service.description && (
                          <p className="text-xs text-gray-400 mt-0.5">{service.description}</p>
                        )}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => (isEditing ? null : togglePublished(service))}
                      disabled={isEditing}
                      className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded ${
                        service.published
                          ? 'bg-green-50 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      } disabled:opacity-50`}
                    >
                      {service.published ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      {service.published ? 'Active' : 'Hidden'}
                    </button>

                    <div className="flex items-center gap-1">
                      {isEditing ? (
                        <>
                          <button
                            type="button"
                            onClick={() => saveService(service.id)}
                            disabled={saving}
                            className="p-1.5 text-gray-400 hover:text-green-700 transition-colors"
                            title="Save"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            className="p-1.5 text-gray-400 hover:text-charcoal transition-colors"
                            title="Cancel"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => startEdit(service)}
                            className="p-1.5 text-gray-400 hover:text-charcoal transition-colors"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteService(service.id)}
                            className="p-1.5 text-gray-400 hover:text-red-600 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
