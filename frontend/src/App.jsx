import { useState, useEffect, useContext } from 'react'
import { BoundsContext } from './util/context/BoundsContext'
import Header from './components/header'
import Sidebar from './components/sidebar'
import MyMap from "./components/map"
import Tabs from './components/tabs'
import dayjs from 'dayjs'
import './App.css'


function App() {

  const [startDate, setStartDate] = useState(dayjs("2023-01-01T00:00Z"));
  const [endDate, setEndDate] = useState(dayjs("2023-01-31T00:00Z"));
  const [variable, setVariable] = useState("2m Temperature");
  const [aggLevel, setAggLevel] = useState("min");
  const [tempLevel, setTempLevel] = useState("hour");
  const [htmlString, setHtml] = useState("");

  const { drawnShapeBounds, setDrawnShapeBounds } = useContext(BoundsContext);


  const [formData, setFormData] = useState({
    requestType: "",
    variable: variable,
    startDateTime: startDate,
    endDateTime: endDate,
    temporalLevel: "day",
    aggLevel: "mean",
    spatialLevel: "2.0",
    north: 84,
    south: 59,
    east: -10,
    west: -74,
    secondAgg: "",
    comparison: "",
    value: 285,
    downloadOption: "",
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev, 
      variable: variable,
      startDateTime: startDate,
      endDateTime: endDate,  
      aggLevel: aggLevel,
      temporalLevel: tempLevel,    
    }))        
  }, [variable, startDate, endDate, aggLevel, tempLevel]);

  
  const handleChange = (e) => {
    let myValue;
    const { name, value } = e.target;
    console.log("NAME/VAL", name, value);
    console.log(e.target);
    console.log(formData);
    // Convert the input value to a number
    if (
      name === "north" ||
      name === "south" ||
      name === "east" ||
      name === "west"
    ) {
      let numericValue = parseFloat(value);

      // Define the range boundaries based on the input name
      let min, max;
      if (name === "north" || name === "south") {
        min = -90;
        max = 90;
      } else if (name === "east" || name === "west") {
        min = -180;
        max = 180;
      }

      // Clamp the value to the range
      numericValue = Math.min(Math.max(numericValue, min), max);
      myValue = numericValue;
      // Update the form data with the clamped value

      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: numericValue,
      }));
    } else {
      // For other inputs, update the form data as usual
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
      // setTemporalLevelSelected(value !== "");
    }
    if (drawnShapeBounds) {
      setDrawnShapeBounds((prevBounds) => ({
        _southWest: {
          lat: name === "south" ? myValue : prevBounds._southWest.lat,
          lng: name === "west" ? myValue : prevBounds._southWest.lng,
        },
        _northEast: {
          lat: name === "north" ? myValue : prevBounds._northEast.lat,
          lng: name === "east" ? myValue : prevBounds._northEast.lng,
        },
      }));
    } else {
      if (formData.south && formData.north && formData.east && formData.west) {
        console.log(formData);
        setDrawnShapeBounds(() => ({
          _southWest: {
            lat: formData.south,
            lng: formData.west,
          },
          _northEast: {
            lat: formData.north,
            lng: formData.east,
          },
        }));
      }
    }   
    // setTemporalLevelSelected(value !== "");
  };

  const queryData = async () => {
    console.log("FORMDATA", formData);
    try {
      const response = await fetch("http://127.0.0.1:8000/api/query/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const jsonData = await response.json();
        setHtml(jsonData);
        console.log(jsonData);
      }
      else {
        const errorResponse = await response.json();
        console.error(
          "Failed to fetch areas. HTTP status:",
          response.status,
          "Error message:",
          errorResponse.error
        );
      }
    } catch(error) {
      console.error("Error fetching data", error)
    }
  }

  useEffect(() => {
    if (drawnShapeBounds) {
      const north_val = drawnShapeBounds._northEast.lat;
      const east_val = drawnShapeBounds._northEast.lng;
      const south_val = drawnShapeBounds._southWest.lat;
      const west_val = drawnShapeBounds._southWest.lng;

      setFormData((prevFormData) => ({
        ...prevFormData,
        north: north_val,
        east: east_val,
        south: south_val,
        west: west_val,
      }));
    }
    // if (variable){
    //   setFormData((prevFormData) => ({
    //     ...prevFormData,
    //     variable: variable, // Update formData.variable with the selected variable
    //   }));
    // }
  }, [drawnShapeBounds]);

  return (
    <>
      <Header/>
      <div className="main_wrapper">
        <Sidebar 
          variable={formData.variable} 
          setVariable = {setVariable}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          formData={formData}
          handleChange={handleChange}
          queryData={queryData}
          aggLevel={aggLevel}
          setAgg={setAggLevel}
          tempLevel={tempLevel} 
          setTempLevel={setTempLevel}/>
        <div className="main_content">
          <MyMap/>
          <Tabs htmlString={htmlString}/>
        </div>
      </div>
    </>
  )
}

export default App;