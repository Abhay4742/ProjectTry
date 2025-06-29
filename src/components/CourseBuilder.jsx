import React, { useState } from 'react'
import Header from './Header'
import ModuleList from './ModuleList'
import EmptyState from './EmptyState'
import ModuleModal from './ModuleModal'
import ResourceModal from './ResourceModal'
import StandaloneItem from './StandaloneItem'

const CourseBuilder = () => {
  const [modules, setModules] = useState([])
  const [standaloneItems, setStandaloneItems] = useState([]) // Items not in modules
  const [searchTerm, setSearchTerm] = useState('')
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false)
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false)
  const [editingModule, setEditingModule] = useState(null)
  const [selectedModuleId, setSelectedModuleId] = useState(null)
  const [resourceType, setResourceType] = useState('link')

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

  // Create standalone item from header
  const handleCreateStandaloneItem = (type) => {
    setResourceType(type)
    setSelectedModuleId(null) // No module selected - creating standalone
    setIsResourceModalOpen(true)
  }

  // Add resource to specific module
  const handleAddResource = (moduleId, type) => {
    console.log('Adding resource to module:', moduleId, 'type:', type)
    setSelectedModuleId(moduleId)
    setResourceType(type)
    setIsResourceModalOpen(true)
  }

  const handleSaveResource = (resourceData) => {
    const newResource = {
      id: Date.now().toString(),
      type: resourceType,
      ...resourceData
    }

    if (selectedModuleId) {
      // Add to specific module
      setModules(modules.map(module => 
        module.id === selectedModuleId
          ? { ...module, resources: [...module.resources, newResource] }
          : module
      ))
    } else {
      // Create as standalone item
      setStandaloneItems([...standaloneItems, newResource])
    }

    setIsResourceModalOpen(false)
    setSelectedModuleId(null)
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

  const handleMoveModule = (dragIndex, hoverIndex) => {
    const draggedModule = modules[dragIndex]
    const newModules = [...modules]
    newModules.splice(dragIndex, 1)
    newModules.splice(hoverIndex, 0, draggedModule)
    setModules(newModules)
  }

  // Handle dropping standalone item into module
  const handleDropItemIntoModule = (itemId, moduleId) => {
    const item = standaloneItems.find(item => item.id === itemId)
    if (item) {
      // Add item to module
      setModules(modules.map(module => 
        module.id === moduleId
          ? { ...module, resources: [...module.resources, item] }
          : module
      ))
      // Remove from standalone items
      setStandaloneItems(standaloneItems.filter(item => item.id !== itemId))
    }
  }

  // Handle moving resources within a module or between modules
  const handleMoveResource = (dragIndex, hoverIndex, moduleId) => {
    setModules(modules.map(module => {
      if (module.id === moduleId) {
        const newResources = [...module.resources]
        const draggedResource = newResources[dragIndex]
        newResources.splice(dragIndex, 1)
        newResources.splice(hoverIndex, 0, draggedResource)
        return { ...module, resources: newResources }
      }
      return module
    }))
  }

  // Handle moving resource between modules
  const handleMoveResourceBetweenModules = (resourceId, sourceModuleId, targetModuleId) => {
    let resourceToMove = null
    
    // Find and remove resource from source module
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

      // Add resource to target module
      return updatedModules.map(module => {
        if (module.id === targetModuleId && resourceToMove) {
          return {
            ...module,
            resources: [...module.resources, resourceToMove]
          }
        }
        return module
      })
    })
  }

  // Filter modules and standalone items based on search term
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

  const filteredStandaloneItems = standaloneItems.filter(item => {
    if (!searchTerm.trim()) return true
    
    const searchLower = searchTerm.toLowerCase()
    return item.name.toLowerCase().includes(searchLower) ||
           (item.url && item.url.toLowerCase().includes(searchLower)) ||
           (item.fileName && item.fileName.toLowerCase().includes(searchLower))
  })

  const hasContent = modules.length > 0 || standaloneItems.length > 0
  const hasFilteredContent = filteredModules.length > 0 || filteredStandaloneItems.length > 0

  return (
    <div className="course-builder">
      <Header 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onCreateModule={handleCreateModule}
        onCreateStandaloneItem={handleCreateStandaloneItem}
      />

      {!hasContent ? (
        <EmptyState onCreateModule={handleCreateModule} />
      ) : !hasFilteredContent ? (
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
        <div className="content-area">
          {/* Standalone Items */}
          {filteredStandaloneItems.length > 0 && (
            <div className="standalone-items">
              <h3 className="standalone-items-title">Items to be added to modules:</h3>
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

          {/* Modules */}
          <ModuleList
            modules={filteredModules}
            onEditModule={handleEditModule}
            onDeleteModule={handleDeleteModule}
            onAddResource={handleAddResource}
            onDeleteResource={handleDeleteResource}
            onMoveModule={handleMoveModule}
            onDropItem={handleDropItemIntoModule}
            onMoveResource={handleMoveResourceBetweenModules}
          />
        </div>
      )}

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
          }}
        />
      )}
    </div>
  )
}

export default CourseBuilder