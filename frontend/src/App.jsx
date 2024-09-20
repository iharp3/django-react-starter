import { useState } from 'react'
import './App.css'
import Header from './components/header'
import Sidebar from './components/sidebar'

function App() {
  const [a, setA] = useState()
  const [b, setB] = useState()
  const [sum, setSum] = useState()


  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/plus/?a=${a}&b=${b}`, {
        method: "GET",
      });
  
      const status = response.status;
      if (status > 200) {
        alert("Request Failed. Status code: " + status);
        return;
      }
  
      const res = await response.json(); 
      console.log(res)
      setSum(res.result)
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("An error occurred while fetching the data.");
    }
  };
  

  return (
    <>
      <Header/>
      <div className="main_wrapper">
        <Sidebar></Sidebar>
        <div className="main_content">
          <form onSubmit={handleSubmit} className="">
            <input type="text" placeholder='a' onChange={(e) => setA(e.target.value)}/><br/>
            <input type="text" placeholder='b' onChange={(e) => setB(e.target.value)}/><br/>
            <input type="submit" name="submit" id="submit" />
          </form>
          {sum && 
          <div>
            Result: {sum}
          </div>
          }
        </div>
      </div>

    </>
  )
}

export default App
