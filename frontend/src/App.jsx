import { useState } from 'react'
import './App.css'
import Header from './components/header'
import Sidebar from './components/sidebar'

function App() {
  
  return (
    <>
      <Header/>
      <div className="main_wrapper">
        <Sidebar/>
        <div className="main_content">
          <div className="map">
            MAP
          </div>
          <div className="tabs">
            TABS
          </div>
        </div>
      </div>
    </>
  )
}

export default App
