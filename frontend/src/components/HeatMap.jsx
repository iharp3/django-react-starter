import PropTypes from "prop-types";
import { Button } from '@mui/material';
import Plot from 'react-plotly.js';
import "../styles/heatmap.css";


const HeatMap = ({ handleHeatMap, heatMapImage }) => {

  const heatmapLayout = {
    autosize: true,
    margin: { l: 50, r: 20, b: 40, t: 20 },
    xaxis: {
        title: { text: 'Longitude' },
        automargin: true,
        constrain: 'domain',    // Keeps x-axis within domain limits
        showgrid: false
    },
    yaxis: {
        title: { text: 'Latitude' },
        automargin: true,
        scaleanchor: "x",        // Ensures equal aspect ratio
        scaleratio: 1,
        showgrid: false
    },
    coloraxis: {
        colorscale: 'RdBu',      // Ensure colorscale matches backend
        colorbar: {
            title: 'Temperature (°K)', // Label for the color bar
            ticksuffix: '°K',
            outlinewidth: 1
        }
    },
    hovermode: 'closest',        // Displays hover information near the cursor
    showlegend: false            // Hides legend as it’s a single heatmap
  };

  const heatmapConfig = {
    displayModeBar: true,
    responsive: true,
    displaylogo: false,
    scrollZoom: true,  // Allows zooming with scroll
    toImageButtonOptions: {
        format: 'png',
        filename: 'heatmap_image'
    }
  };

  // // TODO: Add radio buttons
  return (
    <>
      <div className="heat_map">
        <div className="hm_inputs">
          <Button onClick={() => handleHeatMap()} variant="outlined" sx={{marginBottom: "48px", marginTop: "auto"}}>Query</Button>
        </div>
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
    </>
  )
}

HeatMap.propTypes = {
  handleHeatMap: PropTypes.func,
  heatMapImage: PropTypes.object,
}  

export default HeatMap;