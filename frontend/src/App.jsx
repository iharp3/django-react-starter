import { useState } from 'react'
import Header from './components/header'
import Sidebar from './components/sidebar'
import Map from './components/map'
import Tabs from './components/tabs'
import dayjs from 'dayjs'
import './App.css'


function App() {

  const [variable, setVariable] = useState("2m Temperature");
  const [startDate, setStartDate] = useState(dayjs("2023-01-01T00:00"));
  const [endDate, setEndDate] = useState(dayjs("2023-01-30T00:00"));

  return (
    <>
      <Header/>
      <div className="main_wrapper">
        <Sidebar 
          variable={variable} 
          setVariable={setVariable}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}/>
        <div className="main_content">
          <Map/>
          <Tabs/>
        </div>
      </div>
    </>
  )
}

export default App;