import { Button } from '@mui/material';
import Input from './input';
import PropTypes from "prop-types";
import Plot from 'react-plotly.js';
import "../styles/timeseries.css"
import { useState } from 'react';

const TimeSeries = ({ handleTimeSeries, timeSeriesImage, formData, handleChange }) => {
  const [isLoading, setIsLoading] = useState(false);

  const defaultLayout = {
    ...timeSeriesImage.layout,
    autosize: true,
    margin: {
      l: 50,
      r: 20,
      b: 40,
      t: 20
    },
    xaxis: {
      title: 'Time',
      automargin: true,
    },
    yaxis: {
      title: 'Value',
      automargin: true,
    }
  };

  const defaultConfig = {
    displayModeBar: true,
    responsive: true,
    displaylogo: false,
    toImageButtonOptions: {
      format: 'png',
      filename: 'plot_image'
    }
  };

  const handleClick = async () => {
    setIsLoading(true);
    try {
      await handleTimeSeries();
    } finally {
      setIsLoading(false);
    }
  };

  // TODO: Add warning if temporal res is less than date start/end differences
  return (
    <div className="time_series">
      <div className="ts_inputs">
        <Button
          onClick={handleClick}
          variant="outlined"
          disabled={isLoading}
          sx={{ marginBottom: "48px", marginTop: "auto" }}
        >
          <div className="button-content">
            {isLoading && <div className="loading-spinner" />}
            Query
          </div>
        </Button>
      </div>
      <div className="hline"></div>
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
}

export default TimeSeries