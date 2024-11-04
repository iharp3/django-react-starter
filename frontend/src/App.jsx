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
  const [htmlString, setHtml] = useState("");
  const [timeSeriesImage, setImageRecieved] = useState({});
  const [heatMapImage, setHeatMap] = useState({});
  const [findTimeImage, setFindTime] = useState({});
  const [findAreaImage, setFindArea] = useState({});

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
    }))        
  }, [variable, startDate, endDate]);

  
  const handleChange = (e) => {
    let myValue;
    const { name, value } = e.target;
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
    try {
      const response = await fetch("/api/query/", {
        method: "POST",
        headers: {          
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const jsonData = await response.json();
        setHtml(jsonData);        
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

  const handleTimeSeries = async (e) => {
    if (e) e.preventDefault();
  
    if (formData.variable === "") {
      // If not, display an error message or perform any other action to prompt the user to select a temporal level
      alert(
        "ERROR: Please select a variable before proceeding..."
      );
      return; // Exit the function early
    }
    else if (endDate.isBefore(startDate)) {
      alert(
        "ERROR: End Date Time Must Be After Than Start Date Time"
      );
      return; // Exit the function early
    }
    else if (formData.temporalLevel === "") {
      // If not, display an error message or perform any other action to prompt the user to select a temporal level
      alert(
        "ERROR: Please select a temporal level resolution before proceeding..."
      );
      return; // Exit the function early
    } else if (!startDate) {
      alert("ERROR: Please select a start date and time before proceeding.");
      return; // Exit the function early
    } else if (!endDate) {
      alert("ERROR: Please select an end date and time before proceeding..");
      return; // Exit the function early
    } else if (
      isNaN(formData.north) ||
      isNaN(formData.south) ||
      isNaN(formData.east) ||
      isNaN(formData.west) ||
      (formData.north > 90) ||
      (formData.south < -90) ||
      (formData.west < -180) ||
      (formData.east > 180)
    ) {
      alert(
        "ERROR: Please select an area on the map or enter FOUR coordinates of interest manually(S,N,W,E) before proceeding..."
      );
      alert(
        "Coordinates should be between -90:90 and -180:180 for (S,N,W,E) respectively..."
      );
      return; // Exit the function early
    }

    formData.requestType = "Time Series";
    formData.startDateTime = startDate;
    formData.endDateTime = endDate;
    // TODO: Change this once dropdown/radio is added
    formData.secondAgg = "max";
    try {

      // console.log(formData);
      // Send request to the backend to fetch both time series data and image data
      const response = await fetch("/api/timeseries/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      // Check if the response is successful
      if (response.ok) {
        // Parse the response as JSON
        const responseData = await response.json();
        console.log("Successfully requested time series data:", responseData);
        setImageRecieved(responseData);
      } else {
        const errorResponse = await response.json();
        // setProgress(5);
        // setProgressDesc(errorResponse.error, response.status);
        console.error(
          "Failed to fetch time series data. HTTP status:",
          response.status,
          "Error message:",
          errorResponse.error
        );
      }
    } catch (error) {
      console.error("Error requesting Time Series:", error);
    }
  };

  const handleHeatMap = async (e) => {
    if (e) e.preventDefault();

    if (formData.variable === "") {
      // If not, display an error message or perform any other action to prompt the user to select a temporal level
      alert(
        "ERROR: Please select a variable before proceeding..."
      );
      return; // Exit the function early
    }
    else if (endDate.isBefore(startDate)) {
      alert(
        "ERROR: End Date Time Must Be After Than Start Date Time"
      );
      return; // Exit the function early
    }
    else if (formData.temporalLevel === "") {
      // If not, display an error message or perform any other action to prompt the user to select a temporal level
      alert(
        "ERROR: Please select a temporal level resolution before proceeding..."
      );
      return; // Exit the function early
    } else if (!startDate) {
      alert("ERROR: Please select a start date and time before proceeding.");
      return; // Exit the function early
    } else if (!endDate) {
      alert("ERROR: Please select an end date and time before proceeding..");
      return; // Exit the function early
    } else if (
      isNaN(formData.north) ||
      isNaN(formData.south) ||
      isNaN(formData.east) ||
      isNaN(formData.west) ||
      (formData.north > 90) ||
      (formData.south < -90) ||
      (formData.west < -180) ||
      (formData.east > 180)
    ) {
      alert(
        "ERROR: Please select an area on the map or enter FOUR coordinates of interest manually(S,N,W,E) before proceeding..."
      );
      alert(
        "Coordinates should be between -90:90 and -180:180 for (S,N,W,E) respectively..."
      );
      return; // Exit the function early
    }

    formData.requestType = "Heap Map";
    formData.startDateTime = startDate;
    formData.endDateTime = endDate;
    // TODO: Change this once dropdown/radio is added
    formData.secondAgg = "max";
    try {

      // console.log(formData);
      // Send request to the backend to fetch both time series data and image data
      const response = await fetch("/api/heatmap/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      // Check if the response is successful
      if (response.ok) {
        // Parse the response as JSON
        const responseData = await response.json();
        console.log("Successfully requested heat map data:", responseData);
        setHeatMap(responseData);
      } else {
        const errorResponse = await response.json();
        // setProgress(5);
        // setProgressDesc(errorResponse.error, response.status);
        console.error(
          "Failed to fetch heat map. HTTP status:",
          response.status,
          "Error message:",
          errorResponse.error
        );
      }
    } catch (error) {
      console.error("Error requesting Heat Map:", error);
    }
  }

  const handleFindTime = async (e) => {
    if (e) e.preventDefault();

    if (formData.variable === "") {
      // If not, display an error message or perform any other action to prompt the user to select a temporal level
      alert(
        "ERROR: Please select a variable before proceeding..."
      );
      return; // Exit the function early
    }
    else if (endDate.isBefore(startDate)) {
      alert(
        "ERROR: End Date Time Must Be After Than Start Date Time"
      );
      return; // Exit the function early
    }
    else if (formData.temporalLevel === "") {
      // If not, display an error message or perform any other action to prompt the user to select a temporal level
      alert(
        "ERROR: Please select a temporal level resolution before proceeding..."
      );
      return; // Exit the function early
    } else if (!startDate) {
      alert("ERROR: Please select a start date and time before proceeding.");
      return; // Exit the function early
    } else if (!endDate) {
      alert("ERROR: Please select an end date and time before proceeding..");
      return; // Exit the function early
    } else if (
      isNaN(formData.north) ||
      isNaN(formData.south) ||
      isNaN(formData.east) ||
      isNaN(formData.west) ||
      (formData.north > 90) ||
      (formData.south < -90) ||
      (formData.west < -180) ||
      (formData.east > 180)
    ) {
      alert(
        "ERROR: Please select an area on the map or enter FOUR coordinates of interest manually(S,N,W,E) before proceeding..."
      );
      alert(
        "Coordinates should be between -90:90 and -180:180 for (S,N,W,E) respectively..."
      );
      return; // Exit the function early
    }

    formData.requestType = "Find Time";
    formData.startDateTime = startDate;
    formData.endDateTime = endDate;
    // TODO: Change this once dropdown/radio is added
    formData.secondAgg = "max";
    try {
      // console.log(formData);
      // Send request to the backend to fetch both time series data and image data
      const response = await fetch("/api/findtime/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      // Check if the response is successful
      if (response.ok) {
        // Parse the response as JSON
        const responseData = await response.json();
        console.log("Successfully requested find time data:", responseData);
        setFindTime(responseData);
      } else {
        const errorResponse = await response.json();
        // setProgress(5);
        // setProgressDesc(errorResponse.error, response.status);
        console.error(
          "Failed to fetch find time. HTTP status:",
          response.status,
          "Error message:",
          errorResponse.error
        );
      }
    } catch (error) {
      console.error("Error requesting Find Time:", error);
    }  
  }

  const handleFindArea = async (e) => {
    if (e) e.preventDefault();

    if (formData.variable === "") {
      // If not, display an error message or perform any other action to prompt the user to select a temporal level
      alert(
        "ERROR: Please select a variable before proceeding..."
      );
      return; // Exit the function early
    }
    else if (endDate.isBefore(startDate)) {
      alert(
        "ERROR: End Date Time Must Be After Than Start Date Time"
      );
      return; // Exit the function early
    }
    else if (formData.temporalLevel === "") {
      // If not, display an error message or perform any other action to prompt the user to select a temporal level
      alert(
        "ERROR: Please select a temporal level resolution before proceeding..."
      );
      return; // Exit the function early
    } else if (!startDate) {
      alert("ERROR: Please select a start date and time before proceeding.");
      return; // Exit the function early
    } else if (!endDate) {
      alert("ERROR: Please select an end date and time before proceeding..");
      return; // Exit the function early
    } else if (
      isNaN(formData.north) ||
      isNaN(formData.south) ||
      isNaN(formData.east) ||
      isNaN(formData.west) ||
      (formData.north > 90) ||
      (formData.south < -90) ||
      (formData.west < -180) ||
      (formData.east > 180)
    ) {
      alert(
        "ERROR: Please select an area on the map or enter FOUR coordinates of interest manually(S,N,W,E) before proceeding..."
      );
      alert(
        "Coordinates should be between -90:90 and -180:180 for (S,N,W,E) respectively..."
      );
      return; // Exit the function early
    }

    formData.requestType = "Find Area";
    formData.startDateTime = startDate;
    formData.endDateTime = endDate;
    // TODO: Change this once dropdown/radio is added
    formData.secondAgg = "max";
    try {
      // console.log(formData);
      // Send request to the backend to fetch both time series data and image data
      const response = await fetch("/api/findarea/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      // Check if the response is successful
      if (response.ok) {
        // Parse the response as JSON
        const responseData = await response.json();
        console.log("Successfully requested find area data:", responseData);
        setFindArea(responseData);
      } else {
        const errorResponse = await response.json();
        // setProgress(5);
        // setProgressDesc(errorResponse.error, response.status);
        console.error(
          "Failed to fetch find area. HTTP status:",
          response.status,
          "Error message:",
          errorResponse.error
        );
      }
    } catch (error) {
      console.error("Error requesting Find Area:", error);
    }  
  }

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
          queryData={queryData}/>
        <div className="main_content">
          <MyMap/>
          <Tabs 
            formData={formData}
            htmlString={htmlString} 
            handleTimeSeries={handleTimeSeries} 
            timeSeriesImage={timeSeriesImage}
            handleHeatMap={handleHeatMap}
            heatMapImage={heatMapImage}
            handleFindTime={handleFindTime}
            findTimeImage={findTimeImage}
            handleFindArea={handleFindArea}
            findAreaImage={findAreaImage}/>
        </div>
      </div>
    </>
  )
}

export default App;