import React, { useState, useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import ResourceItem from './ResourceItem'
import DropdownMenu from './DropdownMenu'

const ModuleCard = ({ 
  module, 
  index, 
  onEdit, 
  onDelete, 
  onAddResource, 
  onDeleteResource,
  onMove 
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [showAddMenu, setShowAddMenu] = useState(false)
  const ref = useRef(null)
  const dragRef = useRef(null)

  const [{ handlerId }, drop] = useDrop({
    accept: 'module',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item, monitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index

      if (dragIndex === hoverIndex) {
        return
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect()
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      const clientOffset = monitor.getClientOffset()
      const hoverClientY = clientOffset.y - hoverBoundingRect.top

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      onMove(dragIndex, hoverIndex)
      item.index = hoverIndex
    },
  })

  const [{ isDragging }, drag, preview] = useDrag({
    type: 'module',
    item: () => {
      return { id: module.id, index }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  // Connect drag to the drag handle only
  drag(dragRef)
  // Connect drop to the entire card
  drop(ref)

  const opacity = isDragging ? 0.4 : 1
  const resourceCount = module.resources?.length || 0

  const menuItems = [
    {
      label: 'Edit module name',
      icon: '✏️',
      onClick: () => {
        onEdit(module)
        setShowMenu(false)
      }
    },
    {
      label: 'Delete',
      icon: '🗑️',
      onClick: () => {
        onDelete(module.id)
        setShowMenu(false)
      },
      danger: true
    }
  ]

  const addMenuItems = [
    {
      label: 'Add a link',
      icon: '🔗',
      onClick: () => {
        onAddResource(module.id, 'link')
        setShowAddMenu(false)
      }
    },
    {
      label: 'Upload file',
      icon: '📁',
      onClick: () => {
        onAddResource(module.id, 'file')
        setShowAddMenu(false)
      }
    }
  ]

  return (
    <div 
      ref={ref} 
      className="module-card" 
      style={{ opacity }}
      data-handler-id={handlerId}
    >
      <div className="module-header">
        <div className="module-info" onClick={() => setIsExpanded(!isExpanded)}>
          <span 
            ref={dragRef}
            className="module-drag-handle"
            style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
          >
            ⋮⋮
          </span>
          <div>
            <h3 className="module-title">{module.name}</h3>
            <p className="module-subtitle">
              {resourceCount === 0 
                ? 'Add items to this module' 
                : `${resourceCount} item${resourceCount !== 1 ? 's' : ''}`
              }
            </p>
          </div>
        </div>
        <div className="module-actions">
          <button 
            className={`expand-button ${isExpanded ? 'expanded' : ''}`}
            onClick={(e) => {
              e.stopPropagation()
              setIsExpanded(!isExpanded)
            }}
          >
            ▼
          </button>
          <div style={{ position: 'relative' }}>
            <button 
              className="menu-button"
              onClick={(e) => {
                e.stopPropagation()
                setShowMenu(!showMenu)
              }}
            >
              ⋮
            </button>
            {showMenu && (
              <DropdownMenu 
                items={menuItems}
                onClose={() => setShowMenu(false)}
              />
            )}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="module-content">
          {module.resources && module.resources.length > 0 && (
            <div className="module-resources">
              {module.resources.map(resource => (
                <ResourceItem
                  key={resource.id}
                  resource={resource}
                  onDelete={() => onDeleteResource(module.id, resource.id)}
                />
              ))}
            </div>
          )}
          
          {(!module.resources || module.resources.length === 0) && (
            <p style={{ 
              textAlign: 'center', 
              color: '#6c757d', 
              margin: '20px 0',
              fontStyle: 'italic'
            }}>
              No content added to this module yet.
            </p>
          )}
          
          <div style={{ position: 'relative', textAlign: 'center', marginTop: '20px' }}>
            <button 
              className="add-resource-button"
              onClick={() => setShowAddMenu(!showAddMenu)}
              style={{
                background: 'white',
                border: '2px dashed #dee2e6',
                borderRadius: '8px',
                padding: '16px',
                cursor: 'pointer',
                color: '#6c757d',
                fontSize: '14px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                width: '100%',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = '#0d6efd'
                e.target.style.backgroundColor = '#f8f9fa'
                e.target.style.color = '#0d6efd'
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = '#dee2e6'
                e.target.style.backgroundColor = 'white'
                e.target.style.color = '#6c757d'
              }}
            >
              <span>+</span>
              Add item
            </button>
            
            {showAddMenu && (
              <DropdownMenu 
                items={addMenuItems}
                onClose={() => setShowAddMenu(false)}
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ModuleCard