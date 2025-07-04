import React from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import CourseBuilder from './components/CourseBuilder'
import './App.css'

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="App">
        <CourseBuilder />
      </div>
    </DndProvider>
  )
}

export default App