import { useState, useEffect, useContext } from 'react'
import { BoundsContext } from './util/context/BoundsContext'
import Sidebar from './components/Sidebar/Sidebar'
// import AdminSidebar from './components/AdminSidebar/AdminSidebar'
import MyMap from "./components/map"
import Tabs from './components/tabs'
// import AdminTabs from './components/AdminTabs/AdminTabs'
import dayjs from 'dayjs'
import './App.css'

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";


function App() {

  // Always visible
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [bottomBarCollapsed, setBottomBarCollapsed] = useState(false);
  const { drawnShapeBounds, setDrawnShapeBounds } = useContext(BoundsContext);

  // Sidebar
  const [dataset, setDataset] = useState("ERA5");
  const [variable, setVariable] = useState("2m_temperature");
  const [startDate, setStartDate] = useState(dayjs("2020-06-01T00:00Z"));
  const [endDate, setEndDate] = useState(dayjs("2023-12-31T23:00Z"));
  const [domain, setDomain] = useState("east_domain");
  const [height, setHeight] = useState("15_m");
  const [comparisonVal, setComparisonVal] = useState(285);
  const [predicate, setPredicate] = useState("<");
  const [htmlString, setHtml] = useState("");
  const [queryLog, setQueryLog] = useState([]);
  const [showQueryLog, setShowQueryLog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Bottom bar
  const [timeSeriesImage, setImageRecieved] = useState({});
  const [heatMapImage, setHeatMap] = useState({});
  const [findTimeImage, setFindTime] = useState({});
  const [findAreaImage, setFindArea] = useState({});
  const [heatmapTextOut, setHeatmapTextOut] = useState({});   // list of local files, api calls
  const [heatmapRangeOut, setHeatmapRangeOut] = useState({})  // heatmap YMDH ranges
  const [timeseriesTextOut, setTimeseriesTextOut] = useState({});   // list of local files, api calls
  // const [adminUser, setAdminUser] = useState(false);
  // const [uiTable, setUiTable] = useState([]);


  // Bottom bar
  const [activeTabs, setActiveTabs] = useState({
    panel1: 0,
    panel2: 1,
    panel3: 3,
  });

  const handleTabChange = (panelId, event) => {
    const v = Number(event.target.value); // force number
    setActiveTabs(prev => ({ ...prev, [panelId]: v }));
  };

  // const [activeAdminTab, setActiveAdminTab] = useState(0)

  // const handleAdminTabChange = (event) => {
  //   const v = Number(event.target.value);
  //   setActiveAdminTab(v);
  // }

  // // Sidebar
  const [formData, setFormData] = useState({
    requestType: "",
    dataset: dataset,
    variable: variable,
    startDateTime: startDate,
    endDateTime: endDate,
    temporalResolution: "year",
    temporalAggregation: "mean",
    north: 84,
    south: 59,
    east: -10,
    west: -74,
    spatialResolution: 1,
    aggregation: "mean",
    domain: "east_domain",
    height: "15_m",
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      dataset:dataset,
      variable: variable,
      startDateTime: startDate,
      endDateTime: endDate,
      domain: domain,
      height: height,
    }))
  }, [dataset, variable, startDate, endDate, domain, height]);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      filterValue: comparisonVal,
      filterPredicate: predicate,
    }))
  }, [comparisonVal, predicate])

  const handleChange = (e) => {
    console.log(formData);
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

      let min, max;
      if (name === "north" || name === "south") {
        min = -90;
        max = 90;
      } else if (name === "east" || name === "west") {
        min = -180;
        max = 180;
      }
      numericValue = Math.min(Math.max(numericValue, min), max);
      myValue = numericValue;

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
  };

  const queryData = async () => {
    setIsLoading(true);

    const round2 = (val) => (val != null ? Number(val.toFixed(2)) : "-");

    const spatialPredicates = [
      formData.north != null ? `N: ${round2(formData.north)}` : "N: -",
      formData.south != null ? `S: ${round2(formData.south)}` : "S: -",
      formData.east  != null ? `E: ${round2(formData.east)}` : "E: -",
      formData.west  != null ? `W: ${round2(formData.west)}` : "W: -",
      formData.spatialResolution ? `Resolution: ${formData.spatialResolution}` : "Resolution: -"
    ];

    const temporalPredicates = [
      startDate ? `Start Date: ${startDate.format("YYYY-MM-DD HH")}` : "Start Date: -",
      endDate   ? `End Date: ${endDate.format("YYYY-MM-DD HH")}` : "End Date: -",
      formData.temporalResolution ? `Resolution: ${formData.temporalResolution}` : "Resolution: -"
    ];

    const filters = [
      formData.filterPredicate ? `Predicate: ${formData.filterPredicate}` : "-",
      formData.filterValue     ? `Value: ${formData.filterValue}` : "-"
    ];

    const newQuery = {
      timestamp: dayjs().format("YYYY-MM-DD HH:mm"),
      dataset,
      variable,
      spatialPredicates,
      temporalPredicates,
      aggregation: formData.aggregation || "-",
      filters
    };

    // Append to queryLog
    setQueryLog(prevLog => [...prevLog, newQuery]);

    try {
      const response = await fetch("/api/query/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          startDateTime: dayjs(formData.startDateTime).toISOString(),
          endDateTime: dayjs(formData.endDateTime).toISOString(),
        }),
      });

      if (response.ok) {
        const jsonData = await response.json();
        setHtml(jsonData);

        await handleHeatMap();
        await handleTimeSeries();
        await handleFindArea();
        await handleFindTime();

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
    } catch (error) {
      console.error("Error fetching data", error)
    } finally {
      setIsLoading(false);
    }
  }

  // Main
// TODO: make shape bounds for carra match east/west domain
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
  }, [drawnShapeBounds]);

  // Bottom bar
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
    else if (formData.temporalResolution === "") {
      // If not, display an error message or perform any other action to prompt the user to select a temporal level
      alert(
        "ERROR: Please select a temporal resolution level before proceeding..."
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
    // setActiveTab("TimeSeries")
    formData.requestType = "Time Series";
    formData.startDateTime = startDate;
    formData.endDateTime = endDate;
    try {
      const response = await fetch("/api/timeseries/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const responseData = await response.json();
        console.log("Successfully requested time series data:", responseData);
        setImageRecieved(responseData.figure);
        setTimeseriesTextOut(responseData.log);
      } else {
        const errorResponse = await response.json();
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
    else if (formData.temporalResolution === "") {
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
    // setActiveTab("HeatMap")
    formData.requestType = "Heap Map";
    formData.startDateTime = startDate;
    formData.endDateTime = endDate;
    try {
      const response = await fetch("/api/heatmap/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const responseData = await response.json();
        console.log("Successfully requested heat map data:", responseData);
        setHeatMap(responseData.figure);
        setHeatmapTextOut(responseData.log);
        setHeatmapRangeOut(responseData.range);
      } else {
        const errorResponse = await response.json();
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
    else if (formData.temporalResolution === "") {
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
    // setActiveTab("FindTime")
    formData.requestType = "Find Time";
    formData.startDateTime = startDate;
    formData.endDateTime = endDate;
    try {
      const response = await fetch("/api/findtime/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const responseData = await response.json();
        console.log("Successfully requested find time data:", responseData);
        setFindTime(responseData);
      } else {
        const errorResponse = await response.json();
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
    else if (formData.temporalResolution === "") {
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
    // setActiveTab("FindArea")
    formData.requestType = "Find Area";
    formData.startDateTime = startDate;
    formData.endDateTime = endDate;
    try {
      const response = await fetch("/api/findarea/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const responseData = await response.json();
        console.log("Successfully requested find area data:", responseData);
        setFindArea(responseData);
      } else {
        const errorResponse = await response.json();
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
    <div
      className={`app-layout 
        ${sidebarCollapsed ? "sidebar-collapsed" : ""} 
        ${bottomBarCollapsed ? "bottombar-collapsed" : ""}`}
    >
      <div className="sidebar">
        <button onClick={() => setSidebarCollapsed(s => !s)}>
          {sidebarCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </button>
        <Sidebar
          sidebarCollapsed={sidebarCollapsed}
          setComparisonVal={setComparisonVal}
          setPredicate={setPredicate}
          dataset={formData.dataset}
          setDataset={setDataset}
          variable={formData.variable}
          setVariable={setVariable}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          formData={formData}
          handleChange={handleChange}
          queryData={queryData}
          isLoading={isLoading}
          queryLog={queryLog} 
          showQueryLog={showQueryLog}
          setShowQueryLog={setShowQueryLog}/>
      </div>

      <div className="main-content">
        <MyMap sidebarCollapsed={sidebarCollapsed} bottomBarCollapsed={bottomBarCollapsed} />
      </div>

      <div className="bottom-bar">
        <button onClick={() => setBottomBarCollapsed(b => !b)}>
          {bottomBarCollapsed ? "↑" : "↓"}
        </button>
        {!bottomBarCollapsed && (
        <Tabs
          activeTabs={activeTabs}
          handleTabChange={handleTabChange}
          formData={formData}
          htmlString={htmlString}
          timeSeriesImage={timeSeriesImage}
          heatMapImage={heatMapImage}
          findTimeImage={findTimeImage}
          findAreaImage={findAreaImage}
          timeseriesTextOut={timeseriesTextOut}
          heatmapTextOut={heatmapTextOut}
          heatmapRangeOut={heatmapRangeOut}
        />
      )}
    </div>
  </div>
  )
}

export default App;