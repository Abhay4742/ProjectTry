import React, { useRef } from 'react'
import { useDrag } from 'react-dnd'

const StandaloneItem = ({ item, onDelete }) => {
  const ref = useRef(null)

  const [{ isDragging }, drag] = useDrag({
    type: 'standalone-item',
    item: { id: item.id, type: 'standalone-item' },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  drag(ref)

  const getItemIcon = () => {
    switch (item.type) {
      case 'link':
        return '🔗'
      case 'file':
        return '📄'
      default:
        return '📄'
    }
  }

  const getItemDetails = () => {
    if (item.type === 'link') {
      return item.url
    } else if (item.type === 'file') {
      return `${item.fileName} (${Math.round(item.fileSize / 1024)} KB)`
    }
    return ''
  }

  return (
    <div 
      ref={ref}
      className={`standalone-item ${isDragging ? 'dragging' : ''}`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      <div className="standalone-item-content">
        <div className="standalone-item-drag-handle">⋮⋮</div>
        <div className={`standalone-item-icon ${item.type}`}>
          {getItemIcon()}
        </div>
        <div className="standalone-item-details">
          <h4>{item.name}</h4>
          <p>{getItemDetails()}</p>
        </div>
      </div>
      <div className="standalone-item-actions">
        <button 
          className="icon-button delete"
          onClick={onDelete}
          title="Delete item"
        >
          🗑️
        </button>
      </div>
    </div>
  )
}

export default StandaloneItem