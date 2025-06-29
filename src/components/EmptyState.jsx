import React from 'react'

const EmptyState = ({ onCreateModule }) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        📚
      </div>
      <h2 className="empty-state-title">Nothing added here yet</h2>
      <p className="empty-state-description">
        Click on the [+] Add button to add items to this course
      </p>
      <button className="empty-state-button" onClick={onCreateModule}>
        Add your first module
      </button>
    </div>
  )
}

export default EmptyState