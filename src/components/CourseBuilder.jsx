import React, { useState } from 'react'
import Header from './Header'
import ModuleList from './ModuleList'
import EmptyState from './EmptyState'
import ModuleModal from './ModuleModal'
import ResourceModal from './ResourceModal'
import StandaloneItem from './StandaloneItem'
import CourseOutline from './CourseOutline'

const CourseBuilder = () => {
  const [modules, setModules] = useState([])
  const [standaloneItems, setStandaloneItems] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false)
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false)
  const [editingModule, setEditingModule] = useState(null)
  const [selectedModuleId, setSelectedModuleId] = useState(null)
  const [resourceType, setResourceType] = useState('link')
  const [isStandaloneMode, setIsStandaloneMode] = useState(false)
  const [activeModuleId, setActiveModuleId] = useState(null)

  const handleCreateModule = () => {
    setEditingModule(null)
    setIsModuleModalOpen(true)
  }

  const handleEditModule = (module) => {
    setEditingModule(module)
    setIsModuleModalOpen(true)
  }

  const handleDeleteModule = (moduleId) => {
    setModules(modules.filter(m => m.id !== moduleId))
    if (activeModuleId === moduleId) {
      setActiveModuleId(null)
    }
  }

  const handleSaveModule = (moduleData) => {
    if (editingModule) {
      setModules(modules.map(m => 
        m.id === editingModule.id 
          ? { ...m, ...moduleData }
          : m
      ))
    } else {
      const newModule = {
        id: Date.now().toString(),
        ...moduleData,
        resources: []
      }
      setModules([...modules, newModule])
    }
    setIsModuleModalOpen(false)
    setEditingModule(null)
  }

  // Header add functionality - creates standalone items
  const handleAddResourceFromHeader = (type) => {
    console.log('CourseBuilder: Adding resource from header, type:', type)
    setSelectedModuleId(null)
    setResourceType(type)
    setIsStandaloneMode(true)
    setIsResourceModalOpen(true)
  }

  // Module add functionality - adds directly to module
  const handleAddResource = (moduleId, type) => {
    console.log('CourseBuilder: Adding resource to module:', moduleId, 'type:', type)
    setSelectedModuleId(moduleId)
    setResourceType(type)
    setIsStandaloneMode(false)
    setIsResourceModalOpen(true)
  }

  const handleSaveResource = (resourceData) => {
    console.log('CourseBuilder: Saving resource:', resourceData, 'standalone mode:', isStandaloneMode, 'moduleId:', selectedModuleId)
    
    const newResource = {
      id: Date.now().toString(),
      type: resourceType,
      ...resourceData
    }

    if (isStandaloneMode) {
      // Add as standalone item
      console.log('Adding as standalone item')
      setStandaloneItems([...standaloneItems, newResource])
    } else {
      // Add directly to module
      console.log('Adding directly to module:', selectedModuleId)
      setModules(modules.map(module => 
        module.id === selectedModuleId
          ? { ...module, resources: [...(module.resources || []), newResource] }
          : module
      ))
    }

    setIsResourceModalOpen(false)
    setSelectedModuleId(null)
    setIsStandaloneMode(false)
  }

  const handleDeleteResource = (moduleId, resourceId) => {
    setModules(modules.map(module => 
      module.id === moduleId
        ? { ...module, resources: module.resources.filter(r => r.id !== resourceId) }
        : module
    ))
  }

  const handleDeleteStandaloneItem = (itemId) => {
    setStandaloneItems(standaloneItems.filter(item => item.id !== itemId))
  }

  // Move standalone item to module
  const handleDropItemToModule = (itemId, moduleId) => {
    console.log('Moving standalone item to module:', itemId, moduleId)
    const item = standaloneItems.find(item => item.id === itemId)
    if (item) {
      // Add item to module
      setModules(modules.map(module => 
        module.id === moduleId
          ? { ...module, resources: [...(module.resources || []), item] }
          : module
      ))
      
      // Remove from standalone items
      setStandaloneItems(standaloneItems.filter(item => item.id !== itemId))
    }
  }

  // Move resource between modules
  const handleMoveResourceBetweenModules = (resourceId, sourceModuleId, targetModuleId) => {
    console.log('Moving resource between modules:', resourceId, 'from:', sourceModuleId, 'to:', targetModuleId)
    
    if (sourceModuleId === targetModuleId) {
      return // Same module, no need to move
    }

    let resourceToMove = null

    // Find and remove the resource from source module
    setModules(prevModules => {
      const updatedModules = prevModules.map(module => {
        if (module.id === sourceModuleId) {
          const resource = module.resources.find(r => r.id === resourceId)
          if (resource) {
            resourceToMove = resource
          }
          return {
            ...module,
            resources: module.resources.filter(r => r.id !== resourceId)
          }
        }
        return module
      })

      // Add the resource to target module
      if (resourceToMove) {
        return updatedModules.map(module => {
          if (module.id === targetModuleId) {
            return {
              ...module,
              resources: [...(module.resources || []), resourceToMove]
            }
          }
          return module
        })
      }

      return updatedModules
    })
  }

  const handleMoveModule = (dragIndex, hoverIndex) => {
    const draggedModule = modules[dragIndex]
    const newModules = [...modules]
    newModules.splice(dragIndex, 1)
    newModules.splice(hoverIndex, 0, draggedModule)
    setModules(newModules)
  }

  // Reorder resources within the same module
  const handleMoveResource = (dragIndex, hoverIndex, moduleId) => {
    console.log('Reordering resources within module:', moduleId, 'from index:', dragIndex, 'to index:', hoverIndex)
    setModules(modules.map(module => {
      if (module.id === moduleId) {
        const newResources = [...(module.resources || [])]
        const draggedResource = newResources[dragIndex]
        newResources.splice(dragIndex, 1)
        newResources.splice(hoverIndex, 0, draggedResource)
        return { ...module, resources: newResources }
      }
      return module
    }))
  }

  // Handle outline navigation
  const handleOutlineClick = (moduleId) => {
    setActiveModuleId(moduleId)
    // Scroll to module
    const moduleElement = document.querySelector(`[data-module-id="${moduleId}"]`)
    if (moduleElement) {
      moduleElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  // Filter modules based on search term
  const filteredModules = modules.filter(module => {
    if (!searchTerm.trim()) return true
    
    const searchLower = searchTerm.toLowerCase()
    const moduleNameMatch = module.name.toLowerCase().includes(searchLower)
    
    const resourceMatch = module.resources?.some(resource => 
      resource.name.toLowerCase().includes(searchLower) ||
      (resource.url && resource.url.toLowerCase().includes(searchLower)) ||
      (resource.fileName && resource.fileName.toLowerCase().includes(searchLower))
    )
    
    return moduleNameMatch || resourceMatch
  })

  // Filter standalone items based on search term
  const filteredStandaloneItems = standaloneItems.filter(item => {
    if (!searchTerm.trim()) return true
    
    const searchLower = searchTerm.toLowerCase()
    return item.name.toLowerCase().includes(searchLower) ||
           (item.url && item.url.toLowerCase().includes(searchLower)) ||
           (item.fileName && item.fileName.toLowerCase().includes(searchLower))
  })

  // Show sidebar only when there are multiple modules
  const showSidebar = modules.length > 1

  return (
    <div className={`course-builder ${showSidebar ? 'with-sidebar' : ''}`}>
      {/* Course Outline Sidebar - Only show when there are multiple modules */}
      {showSidebar && (
        <CourseOutline
          modules={modules}
          activeModuleId={activeModuleId}
          onModuleClick={handleOutlineClick}
        />
      )}

      <div className={`course-content ${showSidebar ? '' : 'full-width'}`}>
        <Header 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onCreateModule={handleCreateModule}
          onAddResource={handleAddResourceFromHeader}
        />

        {/* Standalone Items Section */}
        {standaloneItems.length > 0 && (
          <div className="standalone-items-section">
            <h3 className="standalone-items-title">Items to be added to modules</h3>
            <div className="standalone-items-list">
              {filteredStandaloneItems.map(item => (
                <StandaloneItem
                  key={item.id}
                  item={item}
                  onDelete={() => handleDeleteStandaloneItem(item.id)}
                />
              ))}
            </div>
          </div>
        )}

        {modules.length === 0 ? (
          <EmptyState onCreateModule={handleCreateModule} />
        ) : filteredModules.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔍</div>
            <h2 className="empty-state-title">No results found</h2>
            <p className="empty-state-description">
              Try adjusting your search terms or create a new module
            </p>
            <button className="empty-state-button" onClick={handleCreateModule}>
              Create new module
            </button>
          </div>
        ) : (
          <ModuleList
            modules={filteredModules}
            activeModuleId={activeModuleId}
            onEditModule={handleEditModule}
            onDeleteModule={handleDeleteModule}
            onAddResource={handleAddResource}
            onDeleteResource={handleDeleteResource}
            onMoveModule={handleMoveModule}
            onMoveResource={handleMoveResource}
            onDropItem={handleDropItemToModule}
            onMoveResourceBetweenModules={handleMoveResourceBetweenModules}
          />
        )}
      </div>

      {isModuleModalOpen && (
        <ModuleModal
          module={editingModule}
          onSave={handleSaveModule}
          onClose={() => {
            setIsModuleModalOpen(false)
            setEditingModule(null)
          }}
        />
      )}

      {isResourceModalOpen && (
        <ResourceModal
          type={resourceType}
          onSave={handleSaveResource}
          onClose={() => {
            setIsResourceModalOpen(false)
            setSelectedModuleId(null)
            setIsStandaloneMode(false)
          }}
        />
      )}
    </div>
  )
}

export default CourseBuilder