/* eslint-disable react/prop-types */
import * as React from 'react';
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

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

const Tabs = () => {

    const [tabNum, setTab] = React.useState(0);

    const handleChange = (event, newValue) => {
      setTab(newValue);
    };

    return (
        <>
            <div className="tabs_wrapper">
                <Box sx={{ width: '100%' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <TabMui value={tabNum} onChange={handleChange} aria-label="Navigation">
                            <Tab label="Page One"  />
                            <Tab label="Page Two"  />
                            <Tab label="Page Three" />
                        </TabMui>
                    </Box>
                    <CustomTabPanel value={tabNum} index={0} {...a11yProps(0)}>
                        Page One
                    </CustomTabPanel>
                    <CustomTabPanel value={tabNum} index={1} {...a11yProps(1)}>
                        Page Two
                    </CustomTabPanel>
                    <CustomTabPanel value={tabNum} index={2} {...a11yProps(2)}>
                        Page Three
                    </CustomTabPanel>
                </Box>
            </div>
        </>
    )
}

export default Tabs