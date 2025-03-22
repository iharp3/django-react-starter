import Input from './input';
import CardinalDirections from './CardinalDirections';
import RadioButtonsRow from './RadioRow';
import RadioButtonsCol from './RadioCol';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import { Button, TextField } from '@mui/material';
import '../styles/sidebar.css';
import '../styles/loading.css';

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
    isLoading,
}) => {
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
                    options={["2m_temperature", "total_precipitation", "surface_pressure", "snow_depth", "snowfall", "snowmelt", "temperature_of_snow_layer", "ice_temperature_layer_1", "ice_temperature_layer_2", "ice_temperature_layer_3", "ice_temperature_layer_4"]}
                    sx={{ width: "95%"}}
                    size={"small"}
                    varLabel={"variable"}
                />
                
                <div className="control_section">
                    <p className="section_title">Spatial Controls</p>
                    <CardinalDirections formData={formData} handleChange={handleChange} />
                    <div className="padding"/>
                    <RadioButtonsRow 
                        label="Spatial Resolution" 
                        options={[0.25, 0.5, 1]} 
                        var={formData.spatialResolution} 
                        setVal={handleChange} 
                        subLabel="spatialResolution" 
                        defaultValue={1} />
                </div>

                <div className="control_section">
                    <p className="section_title">Temporal Controls</p>
                    <div className="row_wrapper">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <div className="half_column_wrapper">
                            <DateTimePicker 
                                label="Start Date Time" 
                                views={['year', 'day', 'hours']} 
                                ampm={false} 
                                value={startDate ? dayjs(startDate) : null} 
                                onChange={(newValue) => setStartDate(newValue ? newValue.format('YYYY-MM-DD HH:mm') : null)} />
                            <DateTimePicker 
                                label="End Date Time" 
                                views={['year', 'day', 'hours']} 
                                ampm={false} 
                                value={endDate ? dayjs(endDate) : null} 
                                onChange={(newValue) => setEndDate(newValue ? newValue.format('YYYY-MM-DD HH:mm') : null)} />
                        </div>
                    </LocalizationProvider>
                    <RadioButtonsCol 
                        label="Temporal Resolution" 
                        options={["hour", "day", "month", "year"]} 
                        var={formData.temporalResolution} setVal={handleChange} 
                        subLabel="temporalResolution" 
                        defaultValue={"year"} />
                    </div>
                </div>

                <div className="control_section">
                    <p className="section_title">Aggregation</p>
                    <RadioButtonsRow 
                        label="Spatio-Temporal Aggregation" 
                        options={["min", "max", "mean"]} 
                        var={formData.aggregation} 
                        setVal={handleChange} 
                        subLabel="aggregation" 
                        defaultValue={"mean"} />
                </div>

                <div className="control_section">
                    <p className="section_title">Find Controls</p>
                    <div className="pred_value">
                        <Input 
                            name="predicate" 
                            label={"Predicate"} 
                            options={["<", ">", "<=", ">=", "!="]} 
                            sx={{ width: "25%" }} 
                            size={"small"} 
                            val={formData.filterPredicate} 
                            setVal={setPredicate} />
                        <TextField 
                            id="outlined-number" 
                            label="Value" 
                            type="number" 
                            sx={{ width:"25%" }} 
                            value={formData.filterValue} 
                            onChange={(e) => { setComparisonVal(e.target.value) }} />
                    </div>
                </div>
                
                <div className="padding"/>
                <Button 
                    onClick={() => queryData()} 
                    variant="outlined" 
                    disabled={isLoading} 
                    className="query_button">
                <div className="button-content">{isLoading && <div className="loading-spinner" />} Query</div>
                </Button>
            </div>
        </>
    )
}

export default Sidebar;