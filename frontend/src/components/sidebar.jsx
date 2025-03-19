import Input from './input';
import DateInput from './DateInput';
import CardinalDirections from './CardinalDirections';
import RadioButtons from './Radio';
import PropTypes from 'prop-types';
import { Box, Button } from '@mui/material'
import '../styles/sidebar.css'
import '../styles/loading.css'
import '../styles/header.css'

// Once the date is changed the tempRes and temporalAggregation get reset in formdata back to their useState initial values
const Sidebar = ({
    variable,
    setVariable,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    formData,
    handleChange,
    queryData,
    isLoading, }) => {

    return (
        <>
            <div className="sidebar_wrapper" style={{ width: "300px" }}>
                <div className="padding" />
                    <div className="header_wrapper">
                        <div className="title-container">
                            <p className='title'>POLARIS</p>
                        </div>
                    <a href="https://github.com/iharp3/iharp-query-executor" >
                        [Github]
                    </a>
                    </div>
                <Input
                    val={variable}
                    setVal={setVariable}
                    label={"Variable"}
                    options={["2 meter temperature",
                        "Surface Pressure",
                        "Sea Surface Temperature",
                        "Total Precipitation",
                        "Ice Temperature - Layer 1",
                        "Ice Temperature - Layer 2",
                        "Ice Temperature - Layer 3",
                        "Ice Temperature - Layer 4",
                        "Snow Depth",
                        "Snowfall",
                        "Snowmelt",
                        "Temperature of Snow Layer"
                    ]}
                    sx={{ width: "95%" }}
                    size={"medium"}
                    varLabel={"variable"} />
                <div className="time_range" style={{display: "flex"}}>
                    <DateInput
                        sx={{width: "50%", minWidth:"0"}}
                        size={"x-small"}
                        date={startDate}
                        setDate={setStartDate}
                        label="Start Date & Time" />
                    <DateInput
                        sx={{width: "50%", minWidth:"0"}}
                        size={"x-small"}
                        date={endDate}
                        setDate={setEndDate}
                        label="End Date & Time" />
                </div>
                <RadioButtons
                    label="Temporal Resolution"
                    options={["hour", "day", "month", "year"]}
                    var={formData.temporalResolution}
                    setVal={handleChange}
                    subLabel="temporalResolution"
                    defaultValue={"year"} />
                <RadioButtons
                    label="Temporal Aggregation"
                    options={["min", "max", "mean"]}
                    var={formData.temporalAggregation}
                    setVal={handleChange}
                    subLabel="temporalAggregation"
                    defaultValue={"mean"} />
                <RadioButtons
                    label="Spatial Resolution"
                    options={[0.25, 0.5, 1]}
                    var={formData.spatialResolution}
                    setVal={handleChange}
                    subLabel="spatialResolution"
                    defaultValue={1} />
                <RadioButtons
                    label="Spatial Aggregation"
                    options={["min", "max", "mean"]}
                    var={formData.spatialAggregation}
                    setVal={handleChange}
                    subLabel="spatialAggregation"
                    defaultValue={"mean"} />
                <div className="hr" />
                <CardinalDirections formData={formData} handleChange={handleChange} />
                <div className="hr" />
                <Button
                    onClick={() => queryData()}
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
        </>
    )
}

Sidebar.propTypes = {
    variable: PropTypes.any,
    setVariable: PropTypes.func,
    startDate: PropTypes.any,
    endDate: PropTypes.any,
    setStartDate: PropTypes.func,
    setEndDate: PropTypes.func,
    formData: PropTypes.object,
    handleChange: PropTypes.func,
    queryData: PropTypes.func,
    isLoading: PropTypes.bool,
};

export default Sidebar;