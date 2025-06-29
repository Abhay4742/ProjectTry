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

  const handleAddResource = (moduleId, type) => {
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

  const filteredModules = modules.filter(module =>
    module.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="course-builder">
      <Header 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onCreateModule={handleCreateModule}
      />

      {modules.length === 0 ? (
        <EmptyState onCreateModule={handleCreateModule} />
      ) : (
        <ModuleList
          modules={filteredModules}
          onEditModule={handleEditModule}
          onDeleteModule={handleDeleteModule}
          onAddResource={handleAddResource}
          onDeleteResource={handleDeleteResource}
          onMoveModule={handleMoveModule}
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