import PropTypes from "prop-types"
import { useState } from 'react';
import { Box, Tab } from '@mui/material'
import { Tabs as TabMui } from '@mui/material';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
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
  
    const handleTabChange1 = (event, newValue) => setTab1(newValue);
    const handleTabChange2 = (event, newValue) => setTab2(newValue);
    const handleTabChange3 = (event, newValue) => setTab3(newValue);
  
    return (
      <>
        <div className="tabs_wrapper">
          <Box sx={{ width: '100%', display: "flex", height: "100%" }}>
            
            {/* Panel 1 */}
            <div style={{ flex: 1 , 
                          border: "0.5px solid  rgb(183, 183, 183)",
                          display: "flex",
                          flexDirection: "column", 
                          width: "100%", 
                          minHeight: "120%" }}>
              <FormControl variant="filled" fullWidth>
                <InputLabel id="tab-select-label">Select Plot</InputLabel>
                <Select
                  labelId="tab-select-label"
                  value={tabNum1}
                  onChange={(event) => setTab1(event.target.value)}
                >
                  <MenuItem value={2}>Raster Info</MenuItem>
                  <MenuItem value={1}>Time Series</MenuItem>
                  <MenuItem value={0}>Heatmap</MenuItem>
                  <MenuItem value={3}>Find Time</MenuItem>
                  <MenuItem value={4}>Find Area</MenuItem>
                </Select>
              </FormControl>
              <CustomTabPanel value={tabNum1} index={2} {...a11yProps(2)}>
                <div className="raster_data">
                  {!htmlString ? <div className="no_content">No Content</div> : <pre className="raster_content">{htmlString}</pre>} 
                </div>
              </CustomTabPanel>
              <CustomTabPanel value={tabNum1} index={1} {...a11yProps(1)}>
                <TimeSeries 
                    handleTimeSeries={handleTimeSeries} 
                    timeSeriesImage={timeSeriesImage} 
                    // handleChange={setSecondAggMethod} 
                    formData={formData} />
              </CustomTabPanel>
              <CustomTabPanel value={tabNum1} index={0} {...a11yProps(0)}>
                <HeatMap 
                    handleHeatMap={handleHeatMap} 
                    heatMapImage={heatMapImage} 
                    formData={formData} 
                    handleChange={setSecondAggMethod}
                     />
              </CustomTabPanel>
              <CustomTabPanel value={tabNum1} index={3} {...a11yProps(3)}>
                <FindTime
                    handleFindTime={handleFindTime}
                    findTimeImage={findTimeImage}
                    formData={formData}
                    setComparisonVal={setComparisonVal}
                    setPredicate={setPredicate}
                    handleChange={setSecondAggMethod} />
              </CustomTabPanel>
              <CustomTabPanel value={tabNum1} index={4} {...a11yProps(4)}>
                <FindArea
                    findAreaImage={findAreaImage}
                    handleFindArea={handleFindArea}
                    formData={formData}
                    setComparisonVal={setComparisonVal}
                    setPredicate={setPredicate}
                    handleChange={setSecondAggMethod} />
              </CustomTabPanel>
            </div>
  
            {/* Panel 2 */}
            <div style={{ flex: 1 , 
                          border: "0.5px solid  rgb(183, 183, 183)",
                          display: "flex",
                          flexDirection: "column", 
                          width: "100%", 
                          minHeight: "120%" }}>
              <FormControl variant="filled" fullWidth>
                  <InputLabel id="tab-select-label">Select Plot</InputLabel>
                  <Select
                    labelId="tab-select-label"
                    value={tabNum2}
                    onChange={(event) => setTab2(event.target.value)}
                  >
                    <MenuItem value={1}>Raster Info</MenuItem>
                    <MenuItem value={0}>Time Series</MenuItem>
                    <MenuItem value={2}>Heatmap</MenuItem>
                    <MenuItem value={3}>Find Time</MenuItem>
                    <MenuItem value={4}>Find Area</MenuItem>
                  </Select>
                </FormControl>
                <CustomTabPanel value={tabNum2} index={1} {...a11yProps(1)}>
                  <div className="raster_data">
                    {!htmlString ? <div className="no_content">No Content</div> : <pre className="raster_content">{htmlString}</pre>} 
                  </div>
                </CustomTabPanel>
                <CustomTabPanel value={tabNum2} index={0} {...a11yProps(0)}>
                  <TimeSeries 
                      handleTimeSeries={handleTimeSeries} 
                      timeSeriesImage={timeSeriesImage} 
                      handleChange={setSecondAggMethod} 
                      formData={formData} />
                </CustomTabPanel>
                <CustomTabPanel value={tabNum2} index={2} {...a11yProps(2)}>
                  <HeatMap 
                      handleHeatMap={handleHeatMap} 
                      heatMapImage={heatMapImage} 
                      formData={formData} 
                      handleChange={setSecondAggMethod} />
                </CustomTabPanel>
                <CustomTabPanel value={tabNum2} index={3} {...a11yProps(3)}>
                  <FindTime
                      handleFindTime={handleFindTime}
                      findTimeImage={findTimeImage}
                      formData={formData}
                      setComparisonVal={setComparisonVal}
                      setPredicate={setPredicate}
                      handleChange={setSecondAggMethod} />
                </CustomTabPanel>
                <CustomTabPanel value={tabNum2} index={4} {...a11yProps(4)}>
                  <FindArea
                      findAreaImage={findAreaImage}
                      handleFindArea={handleFindArea}
                      formData={formData}
                      setComparisonVal={setComparisonVal}
                      setPredicate={setPredicate}
                      handleChange={setSecondAggMethod} />
                </CustomTabPanel>
            </div>
  
            {/* Panel 3 */}
            <div style={{ flex: 1 , 
                          border: "0.5px solid  rgb(183, 183, 183)",
                          display: "flex",
                          flexDirection: "column", 
                          width: "100%", 
                          minHeight: "120%" }}>
              <FormControl variant="filled" fullWidth>
                  <InputLabel id="tab-select-label">Select Plot</InputLabel>
                  <Select
                    labelId="tab-select-label"
                    value={tabNum3}
                    onChange={(event) => setTab3(event.target.value)}
                  >
                    <MenuItem value={3}>Raster Info</MenuItem>
                    <MenuItem value={1}>Time Series</MenuItem>
                    <MenuItem value={2}>Heatmap</MenuItem>
                    <MenuItem value={0}>Find Time</MenuItem>
                    <MenuItem value={4}>Find Area</MenuItem>
                  </Select>
                </FormControl>
                <CustomTabPanel value={tabNum3} index={3} {...a11yProps(3)}>
                  <div className="raster_data">
                    {!htmlString ? <div className="no_content">No Content</div> : <pre className="raster_content">{htmlString}</pre>}   
                  </div>
                </CustomTabPanel>
                <CustomTabPanel value={tabNum3} index={1} {...a11yProps(1)}>
                  <TimeSeries 
                      handleTimeSeries={handleTimeSeries} 
                      timeSeriesImage={timeSeriesImage} 
                      handleChange={setSecondAggMethod} 
                      formData={formData} />
                </CustomTabPanel>
                <CustomTabPanel value={tabNum3} index={2} {...a11yProps(2)}>
                  <HeatMap 
                      handleHeatMap={handleHeatMap} 
                      heatMapImage={heatMapImage} 
                      formData={formData} 
                      handleChange={setSecondAggMethod} />
                </CustomTabPanel>
                <CustomTabPanel value={tabNum3} index={0} {...a11yProps(0)}>
                  <FindTime
                      handleFindTime={handleFindTime}
                      findTimeImage={findTimeImage}
                      formData={formData}
                      setComparisonVal={setComparisonVal}
                      setPredicate={setPredicate}
                      handleChange={setSecondAggMethod} />
                </CustomTabPanel>
                <CustomTabPanel value={tabNum3} index={4} {...a11yProps(4)}>
                  <FindArea
                      findAreaImage={findAreaImage}
                      handleFindArea={handleFindArea}
                      formData={formData}
                      setComparisonVal={setComparisonVal}
                      setPredicate={setPredicate}
                      handleChange={setSecondAggMethod} />
                </CustomTabPanel>
            </div>
  
          </Box>
        </div>
      </>
    );
  };
  

Tabs.propTypes = {
  formData: PropTypes.object,
  setSecondAggMethod: PropTypes.func,
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
}

export default Tabs