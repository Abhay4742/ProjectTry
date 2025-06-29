import React, { useState, useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import ResourceItem from './ResourceItem'
import DropdownMenu from './DropdownMenu'

const ModuleCard = ({ 
  module, 
  index, 
  isActive,
  onEdit, 
  onDelete, 
  onAddResource, 
  onDeleteResource,
  onMove,
  onDropItem,
  onMoveResource,
  onMoveResourceBetweenModules
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const [showAddMenu, setShowAddMenu] = useState(false)
  const ref = useRef(null)
  const dragRef = useRef(null)
  const addButtonRef = useRef(null)

  const [{ handlerId }, drop] = useDrop({
    accept: ['module', 'standalone-item', 'resource'],
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      }
    },
    hover(item, monitor) {
      if (item.type === 'standalone-item' || item.type === 'resource') {
        return // Don't handle hover for items
      }

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
    drop(item, monitor) {
      console.log('Drop detected in module:', module.id, 'item:', item)
      
      if (item.type === 'standalone-item') {
        console.log('Dropping standalone item into module')
        onDropItem(item.id, module.id)
      } else if (item.type === 'resource' && item.sourceModuleId !== module.id) {
        console.log('Moving resource between modules')
        onMoveResourceBetweenModules(item.id, item.sourceModuleId, module.id)
      }
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

  // Close add menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (addButtonRef.current && !addButtonRef.current.contains(event.target)) {
        setShowAddMenu(false)
      }
    }

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setShowAddMenu(false)
      }
    }

    if (showAddMenu) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
      return () => {
        document.removeEventListener('mousedown', handleClickOutside)
        document.removeEventListener('keydown', handleEscape)
      }
    }
  }, [showAddMenu])

  drag(dragRef)
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

  const handleResourceMove = (dragIndex, hoverIndex) => {
    if (onMoveResource) {
      onMoveResource(dragIndex, hoverIndex, module.id)
    }
  }

  const handleAddButtonClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('Add item button clicked for module:', module.id)
    setShowAddMenu(!showAddMenu)
  }

  const handleAddLink = (e) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('Adding link to module:', module.id)
    onAddResource(module.id, 'link')
    setShowAddMenu(false)
  }

  const handleAddFile = (e) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('Adding file to module:', module.id)
    onAddResource(module.id, 'file')
    setShowAddMenu(false)
  }

  return (
    <div 
      ref={ref} 
      className={`module-card ${isActive ? 'active' : ''}`}
      style={{ opacity }}
      data-handler-id={handlerId}
      data-module-id={module.id}
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
          <div className="menu-container">
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
              {module.resources.map((resource, resourceIndex) => (
                <ResourceItem
                  key={resource.id}
                  resource={resource}
                  index={resourceIndex}
                  moduleId={module.id}
                  onDelete={() => onDeleteResource(module.id, resource.id)}
                  onMove={handleResourceMove}
                />
              ))}
            </div>
          )}
          
          {(!module.resources || module.resources.length === 0) && (
            <div className="empty-module-message">
              No content added to this module yet. Drag items here or use the button below.
            </div>
          )}
          
          <div className="add-item-container" ref={addButtonRef}>
            <button 
              className="add-resource-button"
              onClick={handleAddButtonClick}
              type="button"
            >
              <span>+</span>
              Add item
            </button>
            
            {showAddMenu && (
              <div className="add-item-dropdown">
                <button
                  className="dropdown-item"
                  onClick={handleAddLink}
                  type="button"
                >
                  <span>🔗</span>
                  Add a link
                </button>
                <button
                  className="dropdown-item"
                  onClick={handleAddFile}
                  type="button"
                >
                  <span>📁</span>
                  Upload file
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ModuleCard