import React from 'react'

const CourseOutline = ({ modules, activeModuleId, onModuleClick }) => {
  return (
    <div className="course-outline">
      <h3 className="course-outline-title">Course outline</h3>
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