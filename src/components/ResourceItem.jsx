import React from 'react'

const ResourceItem = ({ resource, onDelete }) => {
  const getResourceIcon = (type) => {
    switch (type) {
      case 'link':
        return '🔗'
      case 'file':
        return '📄'
      default:
        return '📄'
    }
  }

  const getResourceDetails = () => {
    if (resource.type === 'link') {
      return resource.url
    } else if (resource.type === 'file') {
      return `${resource.fileName} (${Math.round(resource.fileSize / 1024)} KB)`
    }
    return ''
  }

  return (
    <div className="resource-item">
      <div className="resource-info">
        <div className={`resource-icon ${resource.type}`}>
          {getResourceIcon(resource.type)}
        </div>
        <div className="resource-details">
          <h4>{resource.name}</h4>
          <p>{getResourceDetails()}</p>
        </div>
      </div>
      <div className="resource-actions">
        <button 
          className="icon-button delete"
          onClick={onDelete}
          title="Delete resource"
        >
          🗑️
        </button>
      </div>
    </div>
  )
}

export default ResourceItem