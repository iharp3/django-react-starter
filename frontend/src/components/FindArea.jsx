import PropTypes from "prop-types";
import { Button, TextField } from '@mui/material';
import Input from "./input";
import Plot from 'react-plotly.js';
import "../styles/findarea.css";
import { useState } from 'react';

const FindArea = ({ findAreaImage, handleFindArea, formData, setComparisonVal, setPredicate, handleChange }) => {  
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      await handleFindArea();
    } finally {
      setIsLoading(false);
    }
  };

  const bounds = [
    (formData.north + formData.south) / 2,
    (formData.east + formData.west) / 2,
  ]   

  const findAreaLayout = {
    mapbox: {
        style: "white-bg",
        // TODO: Mess with these bounds a bit, right now it will update on any change on the main map.
        // Change this so that they only get updated on find area query. 
        center: { lat: bounds[0], lon: bounds[1] }, 
        zoom: 1,
        bounds: {
            east: 180,
            north: 90,
            west: -180,
            south: -90,
        },
        layers: [
            {
                below: "traces",
                sourcetype: "raster",
                source: ["https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"],
                sourceattribution: "United States Geological Survey",
            }
        ],
    },
    margin: { r: 0, t: 0, l: 0, b: 0 },
    showlegend: true,
    legend: {
        font: { size: 11 },
        x: 1,
        y: 0.9,
        xanchor: "right",
        yanchor: "top",
    },
};

const findAreaConfig = {
    responsive: true,
    scrollZoom: true,
    displaylogo: false,
    modeBarButtonsToRemove: ['select2d','lasso2d','zoomOut2d', 'zoomIn2d'],
};


  return (
    <div className="find_area">
      <div className="fa_inputs">
        {/* <Input
          val={formData.secondAgg}
          setVal={handleChange}
          name="ts_agg_method"
          label={"Select Aggregation"}
          options={["min", "max", "mean"]}
          sx={{ width: "80%" }}
          size={"small"}/> */}
        <div className="fa_text_input_wrapper">
          <Input
            name="fa_predicate"
            label={"Predicate"}
            options={["<", ">", "=", "<=", ">=", "!="]}
            sx={{ width: "60%", ml: "1vw"}}
            size={"small"}
            val={formData.filterPredicate}
            setVal={setPredicate}/>
          <TextField 
            type="number" 
            name="comparison_val" 
            className="comparison_val"
            value={formData.filterValue}
            onChange={(e) => {setComparisonVal(e.target.value)}}/>
        </div>
        {/* <Button 
          onClick={handleClick} 
          variant="outlined" 
          disabled={isLoading}
          sx={{marginBottom: "48px", marginTop: "auto"}}
        >
          <div className="button-content">
            {isLoading && <div className="loading-spinner" />}
            Query
          </div>
        </Button> */}
      </div>
      {/* <div className="hline"></div> */}
      { findAreaImage && Object.keys(findAreaImage).length > 0 ? (
      <div className="fa_plot">
        <Plot
            className="fa_plotly"
            data={findAreaImage.data}
            layout={findAreaLayout}
            frames={findAreaImage.frames}
            config={findAreaConfig}/>
      </div>
      ) : (
        <div className="fa_plot">
          No Find Area Data
        </div>
      )}
    </div>
  )
}

FindArea.propTypes = {
  findAreaImage: PropTypes.object,
  handleFindArea: PropTypes.func,
  setComparisonVal: PropTypes.func,
  setPredicate: PropTypes.func,
  handleChange: PropTypes.func,
}

export default FindArea