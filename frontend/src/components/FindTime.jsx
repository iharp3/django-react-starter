import PropTypes from "prop-types";
import { Button } from '@mui/material';
import Plot from 'react-plotly.js';
import "../styles/findtime.css";

const FindTime = ({ handleFindTime, findTimeImage }) => {

  const findTimeLayout = {
    title: "Time Series Plot",
    xaxis: {
        title: "Time",
        tickformat: "%Y-%m-%d %H:%M:%S", // Formats datetime on x-axis
        showgrid: true,
    },
    yaxis: {
        title: "2m Temperature (t2m)",
        showgrid: true,
    },
    showlegend: false,
    margin: { t: 50, l: 60, r: 30, b: 50 },
    plot_bgcolor: "#f9f9f9",  // Background color for plot area
    paper_bgcolor: "#ffffff", // Background color for entire figure
  };

  const findTimeConfig = {
    responsive: true,    
    scrollZoom: true,
    displaylogo: false,
    modeBarButtonsToRemove: ['select2d','lasso2d','zoomOut2d', 'zoomIn2d'],
  };

  return (
    <div className="find_time">
        <div className="ft_inputs">
          <Button onClick={() => handleFindTime()} variant="outlined" sx={{marginBottom: "48px", marginTop: "auto"}}>Query</Button>
        </div>
        { findTimeImage && Object.keys(findTimeImage).length > 0 ? (
        <div className="ft_plot">
          <Plot
              className="ft_plotly"
              data={findTimeImage.data}
              layout={findTimeLayout}
              frames={findTimeImage.frames}
              config={findTimeConfig}/>
        </div>
        ) : (
          <div className="ft_plot">
            No Find Time Data
          </div>
        )}
    </div>
  )
}

FindTime.propTypes = {
  handleFindTime: PropTypes.func,
  findTimeImage: PropTypes.object,
}

export default FindTime;