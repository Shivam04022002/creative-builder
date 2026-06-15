const LayerPanel = ({ layers, selectedLayerId, onSelectLayer, onMoveLayer, onDeleteLayer }) => {
  const getLayerIcon = (type) => {
    if (type === 'text') {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      )
    }
    return (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )
  }

  return (
    <div className="bg-white border-r border-gray-200 w-64 flex flex-col">
      <div className="px-4 py-3 border-b border-gray-200">
        <h3 className="font-semibold text-gray-800">Layers</h3>
        <p className="text-xs text-gray-500 mt-1">{layers.length} layer{layers.length !== 1 ? 's' : ''}</p>
      </div>
      <div className="flex-1 overflow-y-auto">
        {layers.length === 0 ? (
          <div className="p-4 text-center">
            <p className="text-sm text-gray-400">No layers yet</p>
            <p className="text-xs text-gray-300 mt-1">Add a layer to get started</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-100">
            {[...layers].reverse().map((layer, index) => (
              <li key={layer.id} className={`px-4 py-3 hover:bg-gray-50 ${selectedLayerId === layer.id ? 'bg-primary-50 border-r-2 border-primary-500' : ''}`}>
                <div className="flex items-center mb-2">
                  <span className={`mr-3 cursor-pointer ${layer.type === 'text' ? 'text-blue-500' : 'text-purple-500'}`} onClick={() => onSelectLayer(layer.id)}>
                    {getLayerIcon(layer.type)}
                  </span>
                  <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onSelectLayer(layer.id)}>
                    <p className="text-sm font-medium text-gray-800 truncate">{layer.name}</p>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); onDeleteLayer(layer.id) }} className="ml-2 text-red-400 hover:text-red-600 p-1" title="Delete layer">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                <div className="flex items-center space-x-1 ml-7">
                  <button onClick={(e) => { e.stopPropagation(); onMoveLayer(layer.id, 'up') }} disabled={index === 0} className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed" title="Move up">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); onMoveLayer(layer.id, 'down') }} disabled={index === layers.length - 1} className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed" title="Move down">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}

export default LayerPanel
