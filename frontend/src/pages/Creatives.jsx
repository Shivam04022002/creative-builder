import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getCreatives } from '../services/creativeService.js'
import { exportCreative } from '../services/exportService.js'
import CreateCreativeModal from '../components/CreateCreativeModal.jsx'
import EditCreativeModal from '../components/EditCreativeModal.jsx'
import DeleteConfirmModal from '../components/DeleteConfirmModal.jsx'

const Creatives = () => {
  const [creatives, setCreatives] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedCreative, setSelectedCreative] = useState(null)

  const fetchCreatives = async () => {
    try {
      setIsLoading(true)
      setError('')
      const data = await getCreatives()
      setCreatives(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => { fetchCreatives() }, [])

  const handleEdit = (creative) => { setSelectedCreative(creative); setIsEditModalOpen(true) }
  const handleDelete = (creative) => { setSelectedCreative(creative); setIsDeleteModalOpen(true) }
  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

  if (isLoading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Creatives</h1>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Creatives</h1>
        <button onClick={() => setIsCreateModalOpen(true)} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Creative
        </button>
      </div>

      {error && <div className="mb-4 p-4 bg-red-100 border border-red-300 rounded-lg text-red-700">{error}</div>}

      {creatives.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-500 mb-4">No creatives created yet</p>
          <button onClick={() => setIsCreateModalOpen(true)} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium">Create Creative</button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Canvas Size</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {creatives.map((creative) => (
                  <tr key={creative._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link to={`/editor/${creative._id}`} className="text-sm font-medium text-primary-600 hover:text-primary-800">{creative.name}</Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded">{creative.canvas.width} x {creative.canvas.height}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(creative.createdAt)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                      <Link to={`/editor/${creative._id}`} className="text-primary-600 hover:text-primary-900">Open</Link>
                      <Link to={`/preview/${creative._id}`} target="_blank" className="text-green-600 hover:text-green-900">Preview</Link>
                      <Link to={`/analytics/${creative._id}`} className="text-purple-600 hover:text-purple-900">Analytics</Link>
                      <button onClick={() => exportCreative(creative._id)} className="text-orange-600 hover:text-orange-900">Export HTML</button>
                      <button onClick={() => handleEdit(creative)} className="text-gray-600 hover:text-gray-900">Rename</button>
                      <button onClick={() => handleDelete(creative)} className="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <CreateCreativeModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} onSuccess={fetchCreatives} />
      <EditCreativeModal isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); setSelectedCreative(null) }} creative={selectedCreative} onSuccess={fetchCreatives} />
      <DeleteConfirmModal isOpen={isDeleteModalOpen} onClose={() => { setIsDeleteModalOpen(false); setSelectedCreative(null) }} creative={selectedCreative} onSuccess={fetchCreatives} />
    </div>
  )
}

export default Creatives
