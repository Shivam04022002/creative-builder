import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getCreativeById } from '../services/creativeService.js'
import api from '../services/api.js'

const Preview = () => {
  const { creativeId } = useParams()
  const navigate = useNavigate()
  const canvasRef = useRef(null)
  const [creative, setCreative] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const impressionTracked = useRef(false)

  useEffect(() => {
    const fetchCreative = async () => {
      try {
        setIsLoading(true)
        setError('')
        const data = await getCreativeById(creativeId)
        setCreative(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }
    fetchCreative()
  }, [creativeId])

  useEffect(() => {
    const trackImpression = async () => {
      if (creative && !impressionTracked.current) {
        impressionTracked.current = true
        try {
          await api.post('/impressions', { creativeId })
        } catch (err) {
          console.error('Failed to track impression:', err)
        }
      }
    }
    trackImpression()
  }, [creative, creativeId])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    )
  }

  if (error || !creative) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white mb-4">{error || 'Creative not found'}</p>
          <button onClick={() => navigate('/creatives')} className="px-4 py-2 bg-primary-600 text-white rounded hover:bg-primary-700">Back to Creatives</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-8">
      <div ref={canvasRef} className="bg-white relative overflow-hidden" style={{ width: creative.canvas.width, height: creative.canvas.height, maxWidth: '100%', maxHeight: '100vh' }}>
        {creative.layers.map((layer) => {
          const animationClass = layer.animation && layer.animation !== 'none' ? `animate-${layer.animation}` : ''
          return (
            <div
              key={`${layer.id}-${layer.animation || 'none'}`}
              className={`absolute ${animationClass}`}
              style={{
                left: layer.x, top: layer.y, width: layer.width, height: layer.height,
                zIndex: layer.zIndex, backgroundColor: layer.styles?.backgroundColor || 'transparent',
                opacity: layer.styles?.opacity || 1, display: 'flex', alignItems: 'center',
                justifyContent: layer.type === 'text' ? layer.styles?.textAlign || 'left' : 'center'
              }}
            >
              {layer.type === 'text' ? (
                <span style={{ color: layer.styles?.color || '#000000', fontSize: `${layer.styles?.fontSize || 16}px`, fontWeight: layer.styles?.fontWeight || 'normal' }}>
                  {layer.text}
                </span>
              ) : (layer.imageUrl || layer.src || layer.url) ? (
                <img
                  src={layer.imageUrl || layer.src || layer.url}
                  alt={layer.name}
                  className="w-full h-full object-contain"
                  draggable={false}
                />
              ) : (
                <div className="flex flex-col items-center text-gray-400">
                  <svg className="w-8 h-8 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-xs">Image Placeholder</span>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Preview
