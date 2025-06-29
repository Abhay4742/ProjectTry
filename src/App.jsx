import React from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { ThemeProvider } from './contexts/ThemeContext'
import CourseBuilder from './components/CourseBuilder'
import './App.css'

function App() {
  return (
    <ThemeProvider>
      <DndProvider backend={HTML5Backend}>
        <div className="App">
          <CourseBuilder />
        </div>
      </DndProvider>
    </ThemeProvider>
  )
}

export default App