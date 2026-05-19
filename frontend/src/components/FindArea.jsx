import PropTypes from "prop-types";
import Plot from 'react-plotly.js';
import "../styles/findarea.css";

const FindArea = ({ findAreaImage, formData }) => {

  const DOMAIN_BOUNDS = {
    east_domain: {
      east: 107,
      west: 54,
      north: 86,
      south: 58
    },
    west_domain: {
      east:76,
      west:-81,
      north: 86,
      south: 58
    }
  };

  const mapBounds = 
    DOMAIN_BOUNDS[formData.domain] || {
      east: formData.east,
      west: formData.west,
      north: formData.north,
      south: formData.south,
    };

  const centerLat = (mapBounds.north + mapBounds.south) / 2;
  const centerLon = (mapBounds.east + mapBounds.west) / 2;

  const lonSpan = Math.abs(mapBounds.east - mapBounds.west);
  const latSpan = Math.abs(mapBounds.north - mapBounds.south);

  const maxSpan = Math.max(lonSpan, latSpan);

  let zoom = 1;

  if (maxSpan < 0.1) zoom = 12;
  else if (maxSpan < 0.5) zoom = 10;
  else if (maxSpan < 1) zoom = 8;
  else if (maxSpan < 5) zoom = 6;
  else if (maxSpan < 20) zoom = 4;
  else if (maxSpan < 60) zoom = 3;
  else zoom = 1;

  const findAreaLayout = {
    mapbox: {
      style: "white-bg",

      center: { lat: centerLat, lon: centerLon },

      bounds: mapBounds,
      
      zoom: zoom,

      layers: [
        {
          below: "traces",
          sourcetype: "raster",
          source: ["https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"],
          sourceattribution: "United States Geological Survey",
        }
      ],
    },
    margin: { r: 1, t: 5, l: 1, b: 10 },
    plot_bgcolor: "#ffffff",
    paper_bgcolor: "#ffffff",

    showlegend: true,
    legend: {
      font: { size: 12 },
      x: 0.02,
      y: 0.02,
      xanchor: "left",
      yanchor: "bottom",
    },
  };

  const findAreaConfig = {
    responsive: true,
    scrollZoom: true,
    displaylogo: false,
    toImageButtonOptions: { format: "png", filename: "polaris_findarea" },
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
            config={findAreaConfig} 
            useResizeHandler
            style={{ width: "100%", height: "100%" }} 
            />
        </div>
      ) : (
        <div className="fa_plot">
          Boolean of values with respect to the Find Control Value and Predicate.
        </div>
      )}
    </div>
  )
}

FindArea.propTypes = {
  findAreaImage: PropTypes.object,
}

export default FindArea