import PropTypes from "prop-types"
import { useState } from 'react';
import { Box, Tab } from '@mui/material'
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
  findAreaImage,
  handleFindArea,
  // setSecondAggMethod,
  setComparisonVal,
  setPredicate, }) => {

  const [tabNum, setTab] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const handleDownload = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/download_raster/', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const blob = await response.blob();
        const fileName = "iHARPV_download.nc";
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } else {
        console.error('Download failed');
      }
    } catch (error) {
      console.error('Error downloading file:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="tabs_wrapper">
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabMui value={tabNum} onChange={handleTabChange} aria-label="Navigation">
              <Tab label="Raster Info" />
              <Tab label="Time Series" />
              <Tab label="Heatmap" />
              <Tab label="Find Time" />
              <Tab label="Find Area" />
            </TabMui>
          </Box>
          <div className="page_wrapper">
            <CustomTabPanel value={tabNum} index={0} {...a11yProps(0)}>
              <div className="raster_data">
                {!htmlString ? (
                  <div className="no_content">No Content</div>
                ) : (
                  <div className="raster_info">
                    <div className="download_btn">
                      {/* Consider: StreamingHttpResponse or maybe Celery task queue? */}
                      <Button
                        onClick={handleDownload}
                        variant="outlined"
                        disabled={isLoading}
                        sx={{ marginBottom: "48px", marginTop: "auto", textWrap: "noWrap" }}
                      >
                        <div className="button-content">
                          {isLoading && <div className="loading-spinner" />}
                          Download
                        </div>
                      </Button>
                    </div>
                    <div className="hline"></div>
                    <pre className="raster_content">{`${htmlString}`}</pre>
                  </div>
                )}
              </div>
            </CustomTabPanel>
            <CustomTabPanel sx={{ width: "100%", height: "255px" }} value={tabNum} index={1} {...a11yProps(1)}>
              <TimeSeries
                handleTimeSeries={handleTimeSeries}
                timeSeriesImage={timeSeriesImage}
                // handleChange={setSecondAggMethod}
                formData={formData} />
            </CustomTabPanel>
            <CustomTabPanel sx={{ width: "100%", height: "255px" }} value={tabNum} index={2} {...a11yProps(2)}>
              <HeatMap
                handleHeatMap={handleHeatMap}
                heatMapImage={heatMapImage}
                formData={formData}
                // handleChange={setSecondAggMethod}
                 />
            </CustomTabPanel>
            <CustomTabPanel value={tabNum} index={3} {...a11yProps(3)}>
              <FindTime
                handleFindTime={handleFindTime}
                findTimeImage={findTimeImage}
                formData={formData}
                setComparisonVal={setComparisonVal}
                setPredicate={setPredicate}
                // handleChange={setSecondAggMethod} 
                />
            </CustomTabPanel>
            <CustomTabPanel value={tabNum} index={4} {...a11yProps(4)}>
              <FindArea
                findAreaImage={findAreaImage}
                handleFindArea={handleFindArea}
                formData={formData}
                setComparisonVal={setComparisonVal}
                setPredicate={setPredicate}
                // handleChange={setSecondAggMethod} 
                />
            </CustomTabPanel>
          </div>
        </Box>
      </div>
    </>
  )
}

Tabs.propTypes = {
  formData: PropTypes.object,
  // setSecondAggMethod: PropTypes.func,
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