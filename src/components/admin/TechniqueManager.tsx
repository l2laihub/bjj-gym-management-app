import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useAuthStore } from '../../store/authStore'

interface Technique {
  id: string
  name: string
  description: string
  category: string
  belt_level: string
  video_url?: string
}

export const TechniqueManager: React.FC = () => {
  const [techniques, setTechniques] = useState<Technique[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { isAdmin } = useAuthStore()

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Guard',
    belt_level: 'white',
    video_url: '',
  })

  const fetchTechniques = async () => {
    try {
      const { data, error } = await supabase
        .from('techniques')
        .select('*')
        .order('name')
      
      if (error) throw error
      setTechniques(data || [])
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTechniques()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isAdmin) return

    try {
      const { error } = await supabase.from('techniques').insert([formData])
      if (error) throw error

      setFormData({
        name: '',
        description: '',
        category: 'Guard',
        belt_level: 'white',
        video_url: '',
      })
      
      fetchTechniques()
    } catch (err: any) {
      setError(err.message)
    }
  }

  const handleDelete = async (id: string) => {
    if (!isAdmin) return
    
    try {
      const { error } = await supabase
        .from('techniques')
        .delete()
        .match({ id })
      
      if (error) throw error
      fetchTechniques()
    } catch (err: any) {
      setError(err.message)
    }
  }

  if (!isAdmin) {
    return <div>Access denied. Admin privileges required.</div>
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Manage Techniques</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mb-8 space-y-4">
        <div>
          <label className="block mb-2">Name:</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-2">Description:</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div>
          <label className="block mb-2">Category:</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full p-2 border rounded"
          >
            {['Guard', 'Mount', 'Side Control', 'Back Control', 'Takedowns', 'Submissions'].map(
              (category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              )
            )}
          </select>
        </div>

        <div>
          <label className="block mb-2">Belt Level:</label>
          <select
            value={formData.belt_level}
            onChange={(e) => setFormData({ ...formData, belt_level: e.target.value })}
            className="w-full p-2 border rounded"
          >
            {['white', 'blue', 'purple', 'brown', 'black'].map((belt) => (
              <option key={belt} value={belt}>
                {belt.charAt(0).toUpperCase() + belt.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2">Video URL (optional):</label>
          <input
            type="url"
            value={formData.video_url}
            onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Technique
        </button>
      </form>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {techniques.map((technique) => (
          <div
            key={technique.id}
            className="border rounded p-4 relative hover:shadow-lg transition-shadow"
          >
            <h3 className="font-bold text-lg">{technique.name}</h3>
            <p className="text-gray-600 mb-2">{technique.description}</p>
            <div className="text-sm text-gray-500">
              <p>Category: {technique.category}</p>
              <p>Belt Level: {technique.belt_level}</p>
              {technique.video_url && (
                <a
                  href={technique.video_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Watch Video
                </a>
              )}
            </div>
            <button
              onClick={() => handleDelete(technique.id)}
              className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
