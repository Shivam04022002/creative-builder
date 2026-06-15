import { useSortable, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const LayerIcon = ({ type }) => {
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

const SortableLayerItem = ({ layer, selectedLayerId, onSelectLayer, onDeleteLayer }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: layer.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 999 : undefined
  }

  const isSelected = selectedLayerId === layer.id

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 px-3 py-2.5 border-b border-gray-100 group
        ${isSelected ? 'bg-blue-50 border-r-2 border-r-blue-500' : 'hover:bg-gray-50'}
        ${isDragging ? 'shadow-lg rounded-lg' : ''}
      `}
    >
      <button
        className="flex-shrink-0 cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 touch-none p-1 rounded"
        {...attributes}
        {...listeners}
        title="Drag to reorder"
        tabIndex={-1}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
        </svg>
      </button>

      <span
        className={`flex-shrink-0 ${layer.type === 'text' ? 'text-blue-500' : 'text-purple-500'}`}
        onClick={() => onSelectLayer(layer.id)}
      >
        <LayerIcon type={layer.type} />
      </span>

      <div
        className="flex-1 min-w-0 cursor-pointer"
        onClick={() => onSelectLayer(layer.id)}
      >
        <p className={`text-sm font-medium truncate ${isSelected ? 'text-blue-700' : 'text-gray-800'}`}>
          {layer.name}
        </p>
      </div>

      <button
        onClick={(e) => { e.stopPropagation(); onDeleteLayer(layer.id) }}
        className="flex-shrink-0 p-1 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
        title="Delete layer"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </li>
  )
}

const LayerPanel = ({ layers, selectedLayerId, onSelectLayer, onDeleteLayer }) => {
  const reversedIds = [...layers].reverse().map(l => l.id)

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
          <SortableContext items={reversedIds} strategy={verticalListSortingStrategy}>
            <ul>
              {[...layers].reverse().map((layer) => (
                <SortableLayerItem
                  key={layer.id}
                  layer={layer}
                  selectedLayerId={selectedLayerId}
                  onSelectLayer={onSelectLayer}
                  onDeleteLayer={onDeleteLayer}
                />
              ))}
            </ul>
          </SortableContext>
        )}
      </div>
      <div className="px-4 py-2 border-t border-gray-100">
        <p className="text-xs text-gray-400 flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
          </svg>
          Drag to reorder
        </p>
      </div>
    </div>
  )
}

export default LayerPanel
