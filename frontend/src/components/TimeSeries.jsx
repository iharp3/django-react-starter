import { Button } from '@mui/material';
import Input from './input';
import PropTypes from "prop-types";
import Plot from 'react-plotly.js';
import "../styles/timeseries.css"

const TimeSeries = ({ handleTimeSeries, timeSeriesImage, formData, handleChange, aggMethod }) => {

  console.log(formData);

  const defaultLayout = {
    ...timeSeriesImage.layout,
    autosize: true,       // Enables automatic resizing
    margin: {             // Adds margins for better spacing
      l: 50,            // left
      r: 20,            // right
      b: 40,            // bottom
      t: 20             // top
    },
    xaxis: {
      title: 'Time',    // Example x-axis title
      automargin: true, // Ensures x-axis labels don’t get cut off
    },
    yaxis: {
      title: 'Value',   // Example y-axis title
      automargin: true, // Ensures y-axis labels don’t get cut off
    }
  };

  const defaultConfig = {
    displayModeBar: true,    // Shows interaction toolbar
    responsive: true,        // Makes the plot responsive            
    displaylogo: false,      // Hides the Plotly logo
    toImageButtonOptions: {
      format: 'png',       // Export options
      filename: 'plot_image'
    }
  };

  // TODO: Add radio buttons
  return (
    <div className="time_series">
      <div className="ts_inputs">
        <Input
          val={formData.ts_agg_method}
          setVal={handleChange}
          name="ts_agg_method"
          label={"Select Aggregation Method"}
          options={["min", "max", "mean"]}
          sx={{ width: "80%" }}
          size={"small"}/>
        <Button onClick={() => handleTimeSeries()} variant="outlined" sx={{ marginBottom: "48px", marginTop: "auto" }}>Query</Button>
      </div>
      {timeSeriesImage && Object.keys(timeSeriesImage).length > 0 ? (
        <div className='ts_plot'>
          <Plot
            className='ts_plotly'
            data={timeSeriesImage.data}
            layout={defaultLayout}
            frames={timeSeriesImage.frames}
            config={defaultConfig} />
        </div>
      ) : (
        <div className='ts_plot'>No Time Series Data</div>
      )}
    </div>
  )
}

TimeSeries.propTypes = {  
  handleTimeSeries: PropTypes.func,
  timeSeriesImage: PropTypes.object,
  formData: PropTypes.object,
  handleChange: PropTypes.func,
  aggMethod: PropTypes.string,
}

export default TimeSeries