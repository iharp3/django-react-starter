import Input from './input';
import DateInput from './DateInput';
import CardinalDirections from './CardinalDirections';
import RadioButtons from './Radio';
import PropTypes from 'prop-types';
import { Button } from '@mui/material'
import '../styles/sidebar.css'
import '../styles/loading.css'

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
    handleQuery,
    isLoading, }) => {

    return (
        <>
            <div className="sidebar_wrapper">
                <div className="padding" />
                <Input
                    val={variable}
                    setVal={setVariable}
                    label={"Variable"}
                    options={[
                        "2m_temperature",
                        "total_precipitation",
                        "surface_pressure",
                        "snow_depth",
                        "snowfall",
                        "snowmelt",
                        "temperature_of_snow_layer",
                        "ice_temperature_layer_1",
                        "ice_temperature_layer_2",
                        "ice_temperature_layer_3",
                        "ice_temperature_layer_4",
                    ]}
                    sx={{ width: "65%" }}
                    size={"small"}
                    varLabel={"variable"} />
                <DateInput
                    date={startDate}
                    setDate={setStartDate}
                    label="Start Date & Time" />
                <DateInput
                    date={endDate}
                    setDate={setEndDate}
                    label="End Date & Time" />
                <RadioButtons
                    label="Temporal Resolution"
                    options={["hour", "day", "month", "year"]}
                    var={formData.temporalResolution}
                    setVal={handleChange}
                    subLabel="temporalResolution"
                    defaultValue={"year"} />
                <RadioButtons
                    label="Spatial Resolution"
                    options={[0.25, 0.5, 1]}
                    var={formData.spatialResolution}
                    setVal={handleChange}
                    subLabel="spatialResolution"
                    defaultValue={1} />
                <RadioButtons
                    label="Spatio-Temporal Aggregation"
                    options={["min", "max", "mean"]}
                    var={formData.aggregation}
                    setVal={handleChange}
                    subLabel="aggregation"
                    defaultValue={"mean"} />
                <div className="hr" />
                <CardinalDirections formData={formData} handleChange={handleChange} />
                <div className="hr" />
                {/* <Button onClick={onQuery}>Query</Button> */}
                <Button
                    onClick={() => handleQuery()}
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