import PropTypes from "prop-types"
import { useState } from 'react';
import { Box, Tab } from '@mui/material'
import { Tabs as TabMui } from '@mui/material';
import TimeSeries from "./TimeSeries";
import HeatMap from "./HeatMap";
import FindTime from "./FindTime";
import FindArea from "./FindArea";
import '../styles/tabs.css';

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
      {value === index && <Box sx={{width: "100%", height: "100%"}}>{children}</Box>}
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

const Tabs = ({ formData, tsAggMethod, setTsAggMethod, htmlString, handleTimeSeries, timeSeriesImage, handleHeatMap, heatMapImage, handleFindTime, findTimeImage, findAreaImage, handleFindArea }) => {

  const [tabNum, setTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <>
      <div className="tabs_wrapper">
        <Box sx={{ width: '100%'}}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider'}}>
            <TabMui value={tabNum} onChange={handleTabChange} aria-label="Navigation">
              <Tab label="Raster Data" />
              <Tab label="Time Series" />
              <Tab label="Heatmap" />
              {/* For Both below, need predicat input(>, <, =, !=) and some comparison value input. */}
              <Tab label="Find Times Results" />
              <Tab label="Find Area Results" />
            </TabMui>
          </Box>
          <div className="page_wrapper">
            <CustomTabPanel value={tabNum} index={0} {...a11yProps(0)}>
              <div className="raster_data">
                {!htmlString ? (
                  <div className="no_content">No Content</div>
                ) : (
                  <pre className="raster_content">{`${htmlString}`}</pre>
                )}      
              </div>        
            </CustomTabPanel>
            <CustomTabPanel sx={{ width: "100%", height: "255px"}} value={tabNum} index={1} {...a11yProps(1)}>
              <TimeSeries 
                handleTimeSeries={handleTimeSeries} 
                timeSeriesImage={timeSeriesImage} 
                aggMethod={tsAggMethod} 
                handleChange={setTsAggMethod}
                formData={formData}/>
            </CustomTabPanel>
            <CustomTabPanel sx={{ width: "100%", height: "255px"}} value={tabNum} index={2} {...a11yProps(2)}>
              <HeatMap handleHeatMap={handleHeatMap} heatMapImage={heatMapImage}/>
            </CustomTabPanel>
            <CustomTabPanel value={tabNum} index={3} {...a11yProps(3)}>
              <FindTime handleFindTime={handleFindTime} findTimeImage={findTimeImage}/>
            </CustomTabPanel>
            <CustomTabPanel value={tabNum} index={4} {...a11yProps(4)}>
              <FindArea findAreaImage={findAreaImage} handleFindArea={handleFindArea} formData={formData}/>
            </CustomTabPanel>
          </div>
        </Box>
      </div>
    </>
  )
}

Tabs.propTypes = {
  formData: PropTypes.object,
  setTsAggMethod: PropTypes.func,
  tsAggMethod: PropTypes.string,
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