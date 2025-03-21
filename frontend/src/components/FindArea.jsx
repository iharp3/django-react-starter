import PropTypes from "prop-types";
import { Button, TextField } from '@mui/material';
import Input from "./input";
import Plot from 'react-plotly.js';
import "../styles/findarea.css";

const FindArea = ({ findAreaImage, formData }) => {

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
    modeBarButtonsToRemove: ['select2d', 'lasso2d', 'zoomOut2d', 'zoomIn2d'],
  };


  return (
    <div className="find_area">
      {findAreaImage && Object.keys(findAreaImage).length > 0 ? (
        <div className="fa_plot">
          <Plot
            className="fa_plotly"
            data={findAreaImage.data}
            layout={findAreaLayout}
            frames={findAreaImage.frames}
            config={findAreaConfig} />
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
}

export default FindArea