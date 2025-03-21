import PropTypes from "prop-types";
import { useState } from "react";
import { Box, MenuItem, FormControl, InputLabel, Select } from "@mui/material";
import TimeSeries from "./TimeSeries";
import HeatMap from "./HeatMap";
import FindTime from "./FindTime";
import FindArea from "./FindArea";
import "../styles/tabs.css";
import "../styles/loading.css";

function CustomTabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      className="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ width: "100%", height: "100%" }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.any,
  value: PropTypes.number,
  index: PropTypes.number,
};

const Tabs = ({

  activeTabs,
  handleTabChange,

  formData,
  htmlString,
  handleTimeSeries,
  timeSeriesImage,
  handleHeatMap,
  heatMapImage,
  handleFindTime,
  findTimeImage,
  findAreaImage,
  handleFindArea,
  setComparisonVal,
  setPredicate,
}) => {

  // Available tab options
  const tabOptions = [
    { value: 0, label: "Heatmap" },
    { value: 1, label: "Time Series" },
    { value: 2, label: "Raster Info" },
    { value: 3, label: "Find Time" },
    { value: 4, label: "Find Area" },
  ];

  return (
    <div className="tabs_wrapper">
      <Box sx={{ display: "flex", gap: 2, width: "100%" }}>
        {/* Render 3 Panels */}
        {["panel1", "panel2", "panel3"].map((panelId) => (
          <div key={panelId} className="panel-container">
            {/* Dropdown to select tab for each panel */}
            <FormControl variant="filled" fullWidth>
              <InputLabel id={`tab-select-label-${panelId}`}>Select Plot</InputLabel>
              <Select
                labelId={`tab-select-label-${panelId}`}
                value={activeTabs[panelId]}
                onChange={(event) => handleTabChange(panelId, event)}
              >
                {tabOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Custom Panels */}
            <CustomTabPanel value={activeTabs[panelId]} index={0}>
              <HeatMap heatMapImage={heatMapImage} />
            </CustomTabPanel>
            <CustomTabPanel value={activeTabs[panelId]} index={1}>
              <TimeSeries timeSeriesImage={timeSeriesImage} />
            </CustomTabPanel>
            <CustomTabPanel value={activeTabs[panelId]} index={2}>
              <div className="raster_data">
                {!htmlString ? <div className="no_content">No Content</div> : <pre className="raster_content">{htmlString}</pre>}
              </div>
            </CustomTabPanel>
            <CustomTabPanel value={activeTabs[panelId]} index={3}>
              <FindTime findTimeImage={findTimeImage} />
            </CustomTabPanel>
            <CustomTabPanel value={activeTabs[panelId]} index={4}>
              <FindArea findAreaImage={findAreaImage} formData={formData} />
            </CustomTabPanel>
          </div>
        ))}
      </Box>
    </div>
  );
};

Tabs.propTypes = {
  formData: PropTypes.object,
  setPredicate: PropTypes.func,
  setComparisonVal: PropTypes.func,
  htmlString: PropTypes.string,
  handleTimeSeries: PropTypes.func,
  timeSeriesImage: PropTypes.object,
  handleHeatMap: PropTypes.func,
  heatMapImage: PropTypes.object,
  handleFindTime: PropTypes.func,
  findTimeImage: PropTypes.object,
  handleFindArea: PropTypes.func,
  findAreaImage: PropTypes.object,
};

export default Tabs;
