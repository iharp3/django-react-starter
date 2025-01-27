import PropTypes from "prop-types";
import { Button } from '@mui/material';
import Plot from 'react-plotly.js';
import Input from './input';
import "../styles/heatmap.css";
import { useState } from 'react';

// TODO,bug with areas where the height is a bit larger than the width.
const HeatMap = ({ handleHeatMap, heatMapImage, formData, handleChange }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      await handleHeatMap();
    } finally {
      setIsLoading(false);
    }
  };

  const heatmapLayout = {
    autosize: true,
    margin: { l: 50, r: 20, b: 40, t: 20 },
    xaxis: {
        title: { text: 'Longitude' },
        automargin: true,
        constrain: 'domain',
        showgrid: false
    },
    yaxis: {
        title: { text: 'Latitude' },
        automargin: true,
        scaleanchor: "x", 
        scaleratio: 1,
        showgrid: false
    },
    coloraxis: {
        colorscale: 'RdBu', 
        colorbar: {
            title: 'Temperature (°K)',
            ticksuffix: '°K',
            outlinewidth: 1
        }
    },
    hovermode: 'closest',
    showlegend: false 
  };

  const heatmapConfig = {
    displayModeBar: true,
    responsive: true,
    displaylogo: false,
    scrollZoom: true,
    toImageButtonOptions: {
        format: 'png',
        filename: 'heatmap_image'
    },
    modeBarButtonsToRemove: ['zoomOut2d', 'zoomIn2d'],
  };

  return (
    <div className="heat_map">
      <div className="hm_inputs">
        <Input
          val={formData.secondAgg}
          setVal={handleChange}
          name="hm_agg_method"
          label={"Select Aggregation Method"}
          options={["min", "max", "mean"]}
          sx={{ width: "80%" }}
          size={"small"}/>
        <Button 
          onClick={handleClick} 
          variant="outlined" 
          disabled={isLoading}
          sx={{marginBottom: "48px", marginTop: "auto"}}
        >
          <div className="button-content">
            {isLoading && <div className="loading-spinner" />}
            Query
          </div>
        </Button>
      </div>
      <div className="hline"></div>
      { heatMapImage && Object.keys(heatMapImage).length > 0 ? (
      <div className="hm_plot">
        <Plot
            className="hm_plotly"
            data={heatMapImage.data}
            layout={heatmapLayout}
            frames={heatMapImage.frames}
            config={heatmapConfig}/>
      </div>
      ) : (
        <div className="hm_plot">
          No Heat Map Data
        </div>
      )}
    </div>
  )
}

HeatMap.propTypes = {
  handleHeatMap: PropTypes.func,
  heatMapImage: PropTypes.object,
}  

export default HeatMap;