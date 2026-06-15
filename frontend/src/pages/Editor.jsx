import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Moveable from 'react-moveable'
import { DndContext, PointerSensor, useSensor, useSensors, closestCenter } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { getCreativeById, updateCreative } from '../services/creativeService.js'
import Toolbar from '../components/editor/Toolbar.jsx'
import LayerPanel from '../components/editor/LayerPanel.jsx'
import PropertiesPanel from '../components/editor/PropertiesPanel.jsx'

const generateId = () => `layer-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

const Editor = () => {
  const { creativeId } = useParams()
  const navigate = useNavigate()
  const canvasRef = useRef(null)
  const layerRefs = useRef({})
  const [moveableTarget, setMoveableTarget] = useState(null)

  const [creative, setCreative] = useState(null)
  const [layers, setLayers] = useState([])
  const [selectedLayerId, setSelectedLayerId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchCreative = async () => {
      try {
        setIsLoading(true)
        setError('')
        const data = await getCreativeById(creativeId)
        setCreative(data)
        setLayers(data.layers || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }
    fetchCreative()
  }, [creativeId])

  const handleAddTextLayer = () => {
    const newLayer = {
      id: generateId(), name: `Text Layer ${layers.filter(l => l.type === 'text').length + 1}`,
      type: 'text', text: 'New Text', x: 20, y: 20, width: 150, height: 40,
      zIndex: layers.length + 1, animation: 'none',
      styles: { color: '#000000', fontSize: 16, fontWeight: 'normal', textAlign: 'left', backgroundColor: 'transparent', opacity: 1 }
    }
    setLayers([...layers, newLayer])
    setSelectedLayerId(newLayer.id)
  }

  const handleAddImageLayer = () => {
    const newLayer = {
      id: generateId(), name: `Image Layer ${layers.filter(l => l.type === 'image').length + 1}`,
      type: 'image', imageUrl: '', x: 20, y: 20, width: 120, height: 120,
      zIndex: layers.length + 1, animation: 'none',
      styles: { backgroundColor: '#e5e7eb', opacity: 1 }
    }
    setLayers([...layers, newLayer])
    setSelectedLayerId(newLayer.id)
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      setError('')
      await updateCreative(creativeId, { name: creative.name, canvas: creative.canvas, layers })
      alert('Creative saved successfully!')
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpdateLayer = useCallback((layerId, updates) => {
    setLayers(prev => prev.map(layer => layer.id === layerId ? { ...layer, ...updates } : layer))
  }, [])


  const handleDeleteLayer = useCallback((layerId) => {
    setLayers(prev => prev.filter(l => l.id !== layerId))
    if (selectedLayerId === layerId) setSelectedLayerId(null)
  }, [selectedLayerId])

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    setLayers(prev => {
      const reversed = [...prev].reverse()
      const oldIndex = reversed.findIndex(l => l.id === active.id)
      const newIndex = reversed.findIndex(l => l.id === over.id)
      const reordered = arrayMove(reversed, oldIndex, newIndex)
      return reordered.reverse().map((layer, i) => ({ ...layer, zIndex: i + 1 }))
    })
  }, [])

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  const updateLayerPosition = useCallback((layerId, x, y) => {
    setLayers(prev => prev.map(l => l.id === layerId ? { ...l, x: Math.round(x), y: Math.round(y) } : l))
  }, [])

  const updateLayerSize = useCallback((layerId, width, height) => {
    setLayers(prev => prev.map(l => l.id === layerId ? { ...l, width: Math.round(width), height: Math.round(height) } : l))
  }, [])

  const selectedLayer = layers.find(l => l.id === selectedLayerId)

  useEffect(() => {
    if (selectedLayerId && layerRefs.current[selectedLayerId]) {
      setMoveableTarget(layerRefs.current[selectedLayerId])
    } else {
      setMoveableTarget(null)
    }
  }, [selectedLayerId, layers])

  const handlePreview = () => {
    window.open(`/preview/${creativeId}`, '_blank')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error && !creative) {
    return (
      <div className="p-6">
        <div className="p-4 bg-red-100 border border-red-300 rounded-lg text-red-700">
          <p className="font-medium">Error loading creative</p>
          <p className="text-sm mt-1">{error}</p>
          <button onClick={() => navigate('/creatives')} className="mt-3 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm">Back to Creatives</button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full -m-6">
      <Toolbar onAddTextLayer={handleAddTextLayer} onAddImageLayer={handleAddImageLayer} onPreview={handlePreview} onSave={handleSave} isSaving={isSaving} />
      {error && <div className="mx-4 mt-4 p-3 bg-red-100 border border-red-300 rounded text-red-700 text-sm">{error}</div>}
      <div className="flex flex-1 overflow-hidden">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <LayerPanel layers={layers} selectedLayerId={selectedLayerId} onSelectLayer={setSelectedLayerId} onDeleteLayer={handleDeleteLayer} />
        </DndContext>
        <div className="flex-1 bg-gray-100 overflow-auto p-8 flex items-center justify-center">
          {creative && (
            <div
              ref={canvasRef}
              className="bg-white shadow-lg relative"
              style={{ width: creative.canvas.width, height: creative.canvas.height, minWidth: creative.canvas.width, minHeight: creative.canvas.height }}
              onClick={() => setSelectedLayerId(null)}
            >
              {layers.map((layer) => {
                const animationClass = layer.animation && layer.animation !== 'none' ? `animate-${layer.animation}` : ''
                return (
                  <div
                    key={layer.id}
                    ref={el => { layerRefs.current[layer.id] = el }}
                    onClick={(e) => { e.stopPropagation(); setSelectedLayerId(layer.id) }}
                    className={`absolute cursor-move ${animationClass} ${selectedLayerId === layer.id ? 'ring-2 ring-primary-500 ring-offset-0' : ''}`}
                    style={{
                      left: layer.x, top: layer.y, width: layer.width, height: layer.height,
                      zIndex: layer.zIndex, backgroundColor: layer.styles?.backgroundColor || 'transparent',
                      opacity: layer.styles?.opacity ?? 1, display: 'flex', alignItems: 'center',
                      justifyContent: layer.type === 'text' ? layer.styles?.textAlign || 'left' : 'center'
                    }}
                  >
                    {layer.type === 'text' ? (
                      <span style={{ color: layer.styles?.color || '#000000', fontSize: `${layer.styles?.fontSize || 16}px`, fontWeight: layer.styles?.fontWeight || 'normal', pointerEvents: 'none' }}>
                        {layer.text}
                      </span>
                    ) : layer.imageUrl ? (
                      <img src={layer.imageUrl} alt={layer.name} className="w-full h-full object-contain pointer-events-none" draggable={false} />
                    ) : (
                      <div className="flex flex-col items-center text-gray-400 pointer-events-none">
                        <svg className="w-8 h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span className="text-xs">Image Placeholder</span>
                      </div>
                    )}
                  </div>
                )
              })}
              {selectedLayer && moveableTarget && (
                <Moveable
                  target={moveableTarget}
                  draggable={true}
                  resizable={true}
                  bounds={{ left: 0, top: 0, right: creative.canvas.width, bottom: creative.canvas.height }}
                  onDrag={({ target, left, top }) => {
                    target.style.left = `${left}px`
                    target.style.top = `${top}px`
                    updateLayerPosition(selectedLayerId, left, top)
                  }}
                  onResize={({ target, width, height, drag }) => {
                    target.style.width = `${width}px`
                    target.style.height = `${height}px`
                    target.style.left = `${drag.left}px`
                    target.style.top = `${drag.top}px`
                    updateLayerSize(selectedLayerId, width, height)
                    updateLayerPosition(selectedLayerId, drag.left, drag.top)
                  }}
                  renderDirections={['nw', 'n', 'ne', 'w', 'e', 'sw', 's', 'se']}
                  edge={true} zoom={1} origin={false}
                  padding={{ left: 0, top: 0, right: 0, bottom: 0 }}
                />
              )}
            </div>
          )}
        </div>
        <PropertiesPanel layer={selectedLayer} onUpdateLayer={handleUpdateLayer} />
      </div>
    </div>
  )
}

export default Editor
