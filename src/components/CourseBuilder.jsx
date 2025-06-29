import React, { useState } from 'react'
import Header from './Header'
import ModuleList from './ModuleList'
import EmptyState from './EmptyState'
import ModuleModal from './ModuleModal'
import ResourceModal from './ResourceModal'
import StandaloneItem from './StandaloneItem'

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

  const handleDropItemToModule = (itemId, moduleId) => {
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

  const handleMoveModule = (dragIndex, hoverIndex) => {
    const draggedModule = modules[dragIndex]
    const newModules = [...modules]
    newModules.splice(dragIndex, 1)
    newModules.splice(hoverIndex, 0, draggedModule)
    setModules(newModules)
  }

  const handleMoveResource = (dragIndex, hoverIndex, moduleId) => {
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

  return (
    <div className="course-builder">
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
          onEditModule={handleEditModule}
          onDeleteModule={handleDeleteModule}
          onAddResource={handleAddResource}
          onDeleteResource={handleDeleteResource}
          onMoveModule={handleMoveModule}
          onMoveResource={handleMoveResource}
          onDropItem={handleDropItemToModule}
        />
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
            setIsStandaloneMode(false)
          }}
        />
      )}
    </div>
  )
}

export default CourseBuilder