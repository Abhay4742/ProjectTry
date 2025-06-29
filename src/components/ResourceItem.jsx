import React, { useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'

const ResourceItem = ({ resource, index, moduleId, onDelete, onMove }) => {
  const ref = useRef(null)

  const [{ handlerId }, drop] = useDrop({
    accept: 'resource',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item, monitor) {
      if (!ref.current) {
        return
      }

      // Don't replace items with themselves
      if (item.id === resource.id) {
        return
      }

      // Only allow reordering within the same module
      if (item.sourceModuleId !== moduleId) {
        return
      }

      const dragIndex = item.index
      const hoverIndex = index

      if (dragIndex === hoverIndex) {
        return
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect()

      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

      // Determine mouse position
      const clientOffset = monitor.getClientOffset()

      // Get pixels to the top
      const hoverClientY = clientOffset.y - hoverBoundingRect.top

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      // Time to actually perform the action
      onMove(dragIndex, hoverIndex)

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex
    },
  })

  const [{ isDragging }, drag] = useDrag({
    type: 'resource',
    item: () => {
      return { 
        id: resource.id, 
        index, 
        sourceModuleId: moduleId,
        type: 'resource'
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const opacity = isDragging ? 0.4 : 1
  drag(drop(ref))

  const getResourceIcon = (type) => {
    switch (type) {
      case 'link':
        return '🔗'
      case 'file':
        return '📄'
      default:
        return '📄'
    }
  }

  const getResourceDetails = () => {
    if (resource.type === 'link') {
      return resource.url
    } else if (resource.type === 'file') {
      return `${resource.fileName} (${Math.round(resource.fileSize / 1024)} KB)`
    }
    return ''
  }

  return (
    <div 
      ref={ref}
      className="resource-item"
      style={{ opacity, cursor: 'move' }}
      data-handler-id={handlerId}
    >
      <div className="resource-info">
        <div className="resource-drag-handle" style={{ marginRight: '8px', color: '#6c757d' }}>
          ⋮⋮
        </div>
        <div className={`resource-icon ${resource.type}`}>
          {getResourceIcon(resource.type)}
        </div>
        <div className="resource-details">
          <h4>{resource.name}</h4>
          <p>{getResourceDetails()}</p>
        </div>
      </div>
      <div className="resource-actions">
        <button 
          className="icon-button delete"
          onClick={onDelete}
          title="Delete resource"
        >
          🗑️
        </button>
      </div>
    </div>
  )
}

export default ResourceItem