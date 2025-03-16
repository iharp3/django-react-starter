import PropTypes from "prop-types"
import React, { useState } from 'react';    //check if importing React is necessary
import { Box, Select, MenuItem } from '@mui/material'
import { Tabs as TabMui } from '@mui/material';
import TimeSeries from "./TimeSeries";
import HeatMap from "./HeatMap";
import FindTime from "./FindTime";
import FindArea from "./FindArea";
import '../styles/tabs.css';
import '../styles/loading.css'
import { Button } from '@mui/material';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      className="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
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


function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const Tabs = ({
    formData,
    htmlString,
    handleTimeSeries,
    timeSeriesImage,
    handleHeatMap,
    heatMapImage,
    handleFindTime,
    findTimeImage,
    handleFindArea,
    findAreaImage,
    setSecondAggMethod,
    setComparisonVal,
    setPredicate,
  }) => {
    // Separate state for each panel
    const [tabNum1, setTab1] = useState(0);
    const [tabNum2, setTab2] = useState(1);
    const [tabNum3, setTab3] = useState(2);

    const tabOptions = [
        { label:"Raster Info", index:0 },
        { label:"Time Series", index:1 },
        { label:"Heatmap", index:2 },
        { label:"Find Time", index:3 },
        { label:"Find Area", index:4}
    ];
  
    return (
      
          <Box sx={{ width: '100%', display: "flex", height: "100%", gap:2 }}>
            
            {/* Panel 1 */}
            <Box sx={{ flex: 1}}>
              <Select fullWidth value={tabNum1} onChange={(e) => setTab1(e.target.value)}>
                {tabOptions.map((tab) => (
                  <MenuItem key={tab.index} value={tab.index}>
                    {tab.label}
                  </MenuItem>
                ))}
              </Select>
              <CustomTabPanel value={tabNum1} index={0}>
                <div className="raster_data">
                  {!htmlString ? <div className="no_content">No Content</div> : <pre className="raster_content">{htmlString}</pre>}
                </div>
              </CustomTabPanel>
              <CustomTabPanel value={tabNum1} index={1}>
                <TimeSeries handleTimeSeries={handleTimeSeries} timeSeriesImage={timeSeriesImage} handleChange={setSecondAggMethod} formData={formData} />
              </CustomTabPanel>
              <CustomTabPanel value={tabNum1} index={2}>
                <HeatMap handleHeatMap={handleHeatMap} heatMapImage={heatMapImage} handleChange={setSecondAggMethod} formData={formData} />
              </CustomTabPanel>
              <CustomTabPanel value={tabNum1} index={3}>
                <FindTime handleFindTime={handleFindTime} findTimeImage={findTimeImage} setComparisonVal={setComparisonVal} setPredicate={setPredicate} handleChange={setSecondAggMethod} formData={formData} />
              </CustomTabPanel>
              <CustomTabPanel value={tabNum1} index={4}>
                <FindArea handleFindArea={handleFindArea} findAreaImage={findAreaImage} setComparisonVal={setComparisonVal} setPredicate={setPredicate} handleChange={setSecondAggMethod} formData={formData} />
              </CustomTabPanel>
              </Box>

          {/* Panel 2 */}
          <Box sx={{ flex: 1}}>
              <Select fullWidth value={tabNum2} onChange={(e) => setTab1(e.target.value)}>
                {tabOptions.map((tab) => (
                  <MenuItem key={tab.index} value={tab.index}>
                    {tab.label}
                  </MenuItem>
                ))}
              </Select>
              <CustomTabPanel value={tabNum2} index={0}>
                <div className="raster_data">
                  {!htmlString ? <div className="no_content">No Content</div> : <pre className="raster_content">{htmlString}</pre>}
                </div>
              </CustomTabPanel>
              <CustomTabPanel value={tabNum2} index={1}>
                <TimeSeries handleTimeSeries={handleTimeSeries} timeSeriesImage={timeSeriesImage} handleChange={setSecondAggMethod} formData={formData} />
              </CustomTabPanel>
              <CustomTabPanel value={tabNum2} index={2}>
                <HeatMap handleHeatMap={handleHeatMap} heatMapImage={heatMapImage} handleChange={setSecondAggMethod} formData={formData} />
              </CustomTabPanel>
              <CustomTabPanel value={tabNum2} index={3}>
                <FindTime handleFindTime={handleFindTime} findTimeImage={findTimeImage} setComparisonVal={setComparisonVal} setPredicate={setPredicate} handleChange={setSecondAggMethod} formData={formData} />
              </CustomTabPanel>
              <CustomTabPanel value={tabNum2} index={4}>
                <FindArea handleFindArea={handleFindArea} findAreaImage={findAreaImage} setComparisonVal={setComparisonVal} setPredicate={setPredicate} handleChange={setSecondAggMethod} formData={formData} />
              </CustomTabPanel>
              </Box>

          {/* Panel 3 */}
          <Box sx={{ flex: 1}}>
              <Select fullWidth value={tabNum3} onChange={(e) => setTab1(e.target.value)}>
                {tabOptions.map((tab) => (
                  <MenuItem key={tab.index} value={tab.index}>
                    {tab.label}
                  </MenuItem>
                ))}
              </Select>
              <CustomTabPanel value={tabNum3} index={0}>
                <div className="raster_data">
                  {!htmlString ? <div className="no_content">No Content</div> : <pre className="raster_content">{htmlString}</pre>}
                </div>
              </CustomTabPanel>
              <CustomTabPanel value={tabNum3} index={1}>
                <TimeSeries handleTimeSeries={handleTimeSeries} timeSeriesImage={timeSeriesImage} handleChange={setSecondAggMethod} formData={formData} />
              </CustomTabPanel>
              <CustomTabPanel value={tabNum3} index={2}>
                <HeatMap handleHeatMap={handleHeatMap} heatMapImage={heatMapImage} handleChange={setSecondAggMethod} formData={formData} />
              </CustomTabPanel>
              <CustomTabPanel value={tabNum3} index={3}>
                <FindTime handleFindTime={handleFindTime} findTimeImage={findTimeImage} setComparisonVal={setComparisonVal} setPredicate={setPredicate} handleChange={setSecondAggMethod} formData={formData} />
              </CustomTabPanel>
              <CustomTabPanel value={tabNum3} index={4}>
                <FindArea handleFindArea={handleFindArea} findAreaImage={findAreaImage} setComparisonVal={setComparisonVal} setPredicate={setPredicate} handleChange={setSecondAggMethod} formData={formData} />
              </CustomTabPanel>
              </Box>
          </Box>
    );
};