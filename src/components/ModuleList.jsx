import React from 'react'
import ModuleCard from './ModuleCard'

const ModuleList = ({ 
  modules, 
  onEditModule, 
  onDeleteModule, 
  onAddResource, 
  onDeleteResource,
  onMoveModule,
  onMoveResource
}) => {
  return (
    <div className="modules-list">
      {modules.map((module, index) => (
        <ModuleCard
          key={module.id}
          module={module}
          index={index}
          onEdit={onEditModule}
          onDelete={onDeleteModule}
          onAddResource={onAddResource}
          onDeleteResource={onDeleteResource}
          onMove={onMoveModule}
          onMoveResource={onMoveResource}
        />
      ))}
    </div>
  )
}

export default ModuleList