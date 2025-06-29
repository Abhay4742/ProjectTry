import React from 'react'

const CourseOutline = ({ modules, activeModuleId, onModuleClick }) => {
  return (
    <div className="course-outline">
      <div className="course-outline-header">
        <div className="course-outline-indicator"></div>
        <h3 className="course-outline-title">Introduction to Trigonometry</h3>
      </div>
      <ul className="course-outline-list">
        {modules.map((module) => (
          <li key={module.id} className="course-outline-item">
            <button
              className={`course-outline-link ${activeModuleId === module.id ? 'active' : ''}`}
              onClick={() => onModuleClick(module.id)}
            >
              {module.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default CourseOutline