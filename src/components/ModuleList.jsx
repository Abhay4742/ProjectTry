import React from 'react'
import ModuleCard from './ModuleCard'

const ModuleList = ({ 
  modules, 
  onEditModule, 
  onDeleteModule, 
  onAddResource, 
  onDeleteResource,
  onMoveModule,
  onDropItem
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
          onDropItem={onDropItem}
        />
      ))}
    </div>
  )
}

export default ModuleList