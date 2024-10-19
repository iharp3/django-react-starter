import PropTypes from "prop-types"
import { useState } from 'react';
import { Box, Tab } from '@mui/material'
import { Tabs as TabMui } from '@mui/material';
import '../styles/tabs.css'

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
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

const Tabs = ({ htmlString }) => {

  const [tabNum, setTab] = useState(0);

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <>
      <div className="tabs_wrapper">
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabMui value={tabNum} onChange={handleChange} aria-label="Navigation">
              <Tab label="Raster Data" />
              <Tab label="Time Series" />
              <Tab label="Heatmap" />
              <Tab label="Page Four" />
            </TabMui>
          </Box>
          <div className="page_wrapper">
            <CustomTabPanel value={tabNum} index={0} {...a11yProps(0)}>
              {!htmlString ? (
                <div className="">No Content</div>
              ) :
                (
                  <pre className="">{`${htmlString}`}</pre>
                )}
              {/* <div dangerouslySetInnerHTML={{ __html: htmlContent }} />                         */}
            </CustomTabPanel>
            <CustomTabPanel value={tabNum} index={1} {...a11yProps(1)}>
              Time Series
            </CustomTabPanel>
            <CustomTabPanel value={tabNum} index={2} {...a11yProps(2)}>
              Heatmap
            </CustomTabPanel>
            <CustomTabPanel value={tabNum} index={3} {...a11yProps(3)}>
              Page Four
            </CustomTabPanel>
          </div>
        </Box>
      </div>
    </>
  )
}
Tabs.propTypes = {
  htmlString: PropTypes.string,
}

export default Tabs