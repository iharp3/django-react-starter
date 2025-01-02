import PropTypes from "prop-types";
import { Button, TextField } from '@mui/material';
import Plot from 'react-plotly.js';
import Input from './input';
import "../styles/findtime.css";

const FindTime = ({ handleFindTime, findTimeImage, formData, setPredicate, setComparisonVal, handleChange }) => {

  const findTimeLayout = {
    title: "Time Series Plot",
    xaxis: {
      title: "Time",
      tickformat: "%Y-%m-%d %H:%M:%S",
      showgrid: true,
    },
    yaxis: {
      title: "2m_temperature (t2m)",
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
      <div className="ft_inputs">
        <Input
          val={formData.secondAgg}
          setVal={handleChange}
          name="ts_agg_method"
          label={"Select Aggregation"}
          options={["min", "max", "mean"]}
          sx={{ width: "80%" }}
          size={"small"} />
        <div className="ft_text_input_wrapper">
          <Input
            name="ft_predicate"
            label={"Predicate"}
            options={["<", ">", "=", "<=", ">=", "!="]}
            sx={{ width: "60%", ml: "1vw" }}
            size={"small"}
            val={formData.filterPredicate}
            setVal={setPredicate} />
          <TextField
            type="number"
            name="comparison_val"
            className="comparison_val"
            value={formData.filterValue}
            onChange={(e) => { setComparisonVal(e.target.value) }} />
        </div>
        <Button onClick={() => handleFindTime()} variant="outlined" sx={{ marginBottom: "48px", marginTop: "auto" }}>Query</Button>
      </div>
      <div className="hline"></div>
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
  handleFindTime: PropTypes.func,
  findTimeImage: PropTypes.object,
  setPredicate: PropTypes.func,
  setComparisonVal: PropTypes.func,
  handleChange: PropTypes.func,
}

export default FindTime;