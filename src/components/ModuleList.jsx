import React from 'react'
import ModuleCard from './ModuleCard'

const ModuleList = ({ 
  modules, 
  activeModuleId,
  onEditModule, 
  onDeleteModule, 
  onAddResource, 
  onDeleteResource,
  onMoveModule,
  onMoveResource,
  onDropItem,
  onMoveResourceBetweenModules
}) => {
  return (
    <div className="modules-list">
      {modules.map((module, index) => (
        <ModuleCard
          key={module.id}
          module={module}
          index={index}
          isActive={activeModuleId === module.id}
          onEdit={onEditModule}
          onDelete={onDeleteModule}
          onAddResource={onAddResource}
          onDeleteResource={onDeleteResource}
          onMove={onMoveModule}
          onMoveResource={onMoveResource}
          onDropItem={onDropItem}
          onMoveResourceBetweenModules={onMoveResourceBetweenModules}
        />
      ))}
    </div>
  )
}

export default ModuleList