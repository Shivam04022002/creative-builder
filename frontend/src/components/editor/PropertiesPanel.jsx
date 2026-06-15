import { useState, useRef } from 'react'
import { uploadImage } from '../../services/uploadService.js'

const PropertiesPanel = ({ layer, onUpdateLayer }) => {
  if (!layer) {
    return (
      <div className="bg-white border-l border-gray-200 w-72 flex flex-col">
        <div className="px-4 py-3 border-b border-gray-200">
          <h3 className="font-semibold text-gray-800">Properties</h3>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-gray-400">Select a layer to view properties</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border-l border-gray-200 w-72 flex flex-col">
      <div className="px-4 py-3 border-b border-gray-200">
        <h3 className="font-semibold text-gray-800">Properties</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Layer Name</label>
            <input type="text" value={layer.name} onChange={(e) => onUpdateLayer(layer.id, { name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Layer Type</label>
            <div className="px-3 py-2 bg-gray-50 rounded text-sm text-gray-800 capitalize">{layer.type}</div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-1">X Position</label>
              <div className="px-3 py-2 bg-gray-50 rounded text-sm text-gray-800">{layer.x}px</div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Y Position</label>
              <div className="px-3 py-2 bg-gray-50 rounded text-sm text-gray-800">{layer.y}px</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Width</label>
              <div className="px-3 py-2 bg-gray-50 rounded text-sm text-gray-800">{layer.width}px</div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Height</label>
              <div className="px-3 py-2 bg-gray-50 rounded text-sm text-gray-800">{layer.height}px</div>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Opacity</label>
            <input type="range" min="0" max="1" step="0.1" value={layer.styles?.opacity ?? 1} onChange={(e) => onUpdateLayer(layer.id, { styles: { ...layer.styles, opacity: parseFloat(e.target.value) } })} className="w-full" />
            <div className="text-xs text-gray-500 mt-1">{Math.round((layer.styles?.opacity ?? 1) * 100)}%</div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Animation</label>
            <select value={layer.animation || 'none'} onChange={(e) => onUpdateLayer(layer.id, { animation: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
              <option value="none">None</option>
              <option value="fadeIn">Fade In</option>
              <option value="fadeInLeft">Fade In Left</option>
              <option value="fadeInRight">Fade In Right</option>
              <option value="zoomIn">Zoom In</option>
            </select>
          </div>
          {layer.type === 'text' && (
            <>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Text Content</label>
                <textarea value={layer.text || ''} onChange={(e) => onUpdateLayer(layer.id, { text: e.target.value })} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Text Color</label>
                <div className="flex items-center space-x-2">
                  <input type="color" value={layer.styles?.color || '#000000'} onChange={(e) => onUpdateLayer(layer.id, { styles: { ...layer.styles, color: e.target.value } })} className="w-10 h-8 rounded cursor-pointer border border-gray-300" />
                  <span className="text-sm text-gray-600">{layer.styles?.color || '#000000'}</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Font Size</label>
                <input type="number" min="8" max="120" value={layer.styles?.fontSize || 16} onChange={(e) => onUpdateLayer(layer.id, { styles: { ...layer.styles, fontSize: parseInt(e.target.value) || 16 } })} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Font Weight</label>
                <select value={layer.styles?.fontWeight || 'normal'} onChange={(e) => onUpdateLayer(layer.id, { styles: { ...layer.styles, fontWeight: e.target.value } })} className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-primary-500">
                  <option value="normal">Normal</option>
                  <option value="bold">Bold</option>
                </select>
              </div>
            </>
          )}
          {layer.type === 'image' && <ImageUploadSection layer={layer} onUpdateLayer={onUpdateLayer} />}
        </div>
      </div>
    </div>
  )
}

const ImageUploadSection = ({ layer, onUpdateLayer }) => {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const fileInputRef = useRef(null)

  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setIsUploading(true)
    setUploadError('')
    try {
      const result = await uploadImage(file)
      onUpdateLayer(layer.id, { imageUrl: result.url })
    } catch (err) {
      setUploadError(err.message || 'Upload failed')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-3">
      <label className="block text-xs font-medium text-gray-500 uppercase mb-1">Image</label>
      {uploadError && <div className="p-2 bg-red-100 border border-red-300 rounded text-red-700 text-xs">{uploadError}</div>}
      {layer.imageUrl ? (
        <div className="space-y-2">
          <img src={layer.imageUrl} alt="Layer content" className="w-full h-32 object-cover rounded border border-gray-300" />
          <div className="flex space-x-2">
            <button onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="flex-1 px-3 py-2 bg-primary-600 text-white text-sm rounded hover:bg-primary-700 disabled:opacity-50">
              {isUploading ? 'Uploading...' : 'Change Image'}
            </button>
            <button onClick={() => onUpdateLayer(layer.id, { imageUrl: '' })} className="px-3 py-2 bg-red-100 text-red-600 text-sm rounded hover:bg-red-200">Remove</button>
          </div>
        </div>
      ) : (
        <div onClick={() => !isUploading && fileInputRef.current?.click()} className={`border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-primary-400 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
          <svg className="w-8 h-8 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-sm text-gray-500">{isUploading ? 'Uploading...' : 'Click to upload image'}</p>
          <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP up to 5MB</p>
        </div>
      )}
      <input ref={fileInputRef} type="file" accept="image/jpeg,image/jpg,image/png,image/webp" onChange={handleFileChange} className="hidden" />
    </div>
  )
}

export default PropertiesPanel
