import React, { useState } from 'react'
import Header from './Header'
import ModuleList from './ModuleList'
import EmptyState from './EmptyState'
import ModuleModal from './ModuleModal'
import ResourceModal from './ResourceModal'

const CourseBuilder = () => {
  const [modules, setModules] = useState([])
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

  const handleAddResourceFromHeader = (type) => {
    if (modules.length === 0) {
      // If no modules exist, create one first
      const newModule = {
        id: Date.now().toString(),
        name: 'New Module',
        resources: []
      }
      setModules([newModule])
      setSelectedModuleId(newModule.id)
    } else {
      // Use the first module
      setSelectedModuleId(modules[0].id)
    }
    setResourceType(type)
    setIsResourceModalOpen(true)
  }

  const handleAddResource = (moduleId, type) => {
    console.log('CourseBuilder: Adding resource to module:', moduleId, 'type:', type)
    setSelectedModuleId(moduleId)
    setResourceType(type)
    setIsResourceModalOpen(true)
  }

  const handleSaveResource = (resourceData) => {
    console.log('CourseBuilder: Saving resource:', resourceData, 'to module:', selectedModuleId)
    const newResource = {
      id: Date.now().toString(),
      type: resourceType,
      ...resourceData
    }

    setModules(modules.map(module => 
      module.id === selectedModuleId
        ? { ...module, resources: [...module.resources, newResource] }
        : module
    ))

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
        const newResources = [...module.resources]
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

  return (
    <div className="course-builder">
      <Header 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onCreateModule={handleCreateModule}
        onAddResource={handleAddResourceFromHeader}
      />

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
          }}
        />
      )}
    </div>
  )
}

export default CourseBuilder