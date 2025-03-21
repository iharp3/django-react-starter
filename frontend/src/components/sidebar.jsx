import Input from './input';
import DateInput from './DateInput';
import CardinalDirections from './CardinalDirections';
import RadioButtons from './Radio';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import { Button, TextField } from '@mui/material'
import '../styles/sidebar.css'
import '../styles/loading.css'

const Sidebar = ({
    setComparisonVal, 
    setPredicate,
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
            <div className="sidebar_wrapper">
                <div className="title_container">
                    <p className='title'>POLARIS</p>
                </div>
                <div className="padding"/>
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
                        sx={{ width: "95%"}}
                        size={"small"}
                        varLabel={"variable"}
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <div className="row_wrapper">
                            <DateTimePicker
                                ampm={false} // 24-hour format, hides AM/PM
                                value={startDate ? dayjs(startDate) : null}
                                onChange={(newValue) => setStartDate(newValue ? newValue.format('YYYY-MM-DD HH:mm') : null)}
                                renderInput={({ inputRef, inputProps, InputProps }) => (
                                    <Button
                                        variant="contained"
                                        size="small"
                                        className="date-button"
                                        onClick={InputProps?.onClick}>
                                        {startDate ? dayjs(startDate).format("MMM D, HH:mm") : "Start Date"}
                                    </Button>
                                )}
                            />
                            <DateTimePicker
                                ampm={false} // 24-hour format, hides AM/PM
                                value={endDate ? dayjs(endDate) : null}
                                onChange={(newValue) => setEndDate(newValue ? newValue.format('YYYY-MM-DD HH:mm') : null)}
                                renderInput={({ inputRef, inputProps, InputProps }) => (
                                    <Button
                                        variant="contained"
                                        size="small"
                                        className="date-button"
                                        onClick={InputProps?.onClick}>
                                        {endDate ? dayjs(endDate).format("MMM D, HH:mm") : "End Date"}
                                    </Button>
                                )}
                            />
                        </div>
                    </LocalizationProvider>
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
                    <div className="padding" />
                    <Input
                        name="predicate"
                        label={"Predicate"}
                        options={["<", ">", "<=", ">=", "!="]}
                        sx={{ width: "60%", ml: "1vw"}}
                        size={"small"}
                        val={formData.filterPredicate}
                        setVal={setPredicate} />
                    <TextField 
                        type="number"
                        name="comparison_val"
                        className="comparison_val"
                        value={formData.filterValue}
                        onChange={(e) => { setComparisonVal(e.target.value) }} />
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
            {/* <div className="sidebar_wrapper">
            <div className="title-container">
                <p className='title'>POLARIS</p>
            </div>
            <div className="data_controls" >
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
            </div>
            <div className="plot_controls">
                <div className="padding" />
                <Input
                    name="predicate"
                    label={"Predicate"}
                    options={["<", ">", "<=", ">=", "!="]}
                    sx={{ width: "60%", ml: "1vw"}}
                    size={"medium"}
                    val={formData.filterPredicate}
                    setVal={setPredicate} />
                <TextField 
                    type="number"
                    name="comparison_val"
                    className="comparison_val"
                    value={formData.filterValue}
                    onChange={(e) => { setComparisonVal(e.target.value) }} />
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
            </div> */}
        </>
    )
}

Sidebar.propTypes = {
    setComparisonVal: PropTypes.func, 
    setPredicate: PropTypes.func,
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