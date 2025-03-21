import PropTypes from "prop-types";
import Plot from 'react-plotly.js';
import "../styles/findtime.css";

const FindTime = ({ findTimeImage }) => {

  const findTimeLayout = {
    title: "Time Series Plot",
    xaxis: {
      title: "Time",
      tickformat: "%Y-%m-%d %H:%M:%S",
      showgrid: true,
    },
    yaxis: {
      title: "Filter",
      showgrid: true,
    },
    showlegend: false,
    margin: { t: 50, l: 60, r: 30, b: 50 },
    plot_bgcolor: "#f9f9f9",
    paper_bgcolor: "#ffffff",
  };

  const findTimeConfig = {
    responsive: true,
    scrollZoom: true,
    displaylogo: false,
    modeBarButtonsToRemove: ['select2d', 'lasso2d', 'zoomOut2d', 'zoomIn2d'],
  };

  return (
    <div className="find_time">
      {findTimeImage && Object.keys(findTimeImage).length > 0 ? (
        <div className="ft_plot">
          <Plot
            className="ft_plotly"
            data={findTimeImage.data}
            layout={findTimeLayout}
            frames={findTimeImage.frames}
            config={findTimeConfig} />
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
  findTimeImage: PropTypes.object,
}

export default FindTime;