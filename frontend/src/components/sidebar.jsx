import Input from './input';
import DateInput from './DateInput';
import CardinalDirections from './CardinalDirections';
import RadioButtons from './Radio';
import PropTypes from 'prop-types';
import { Button } from '@mui/material'
import '../styles/sidebar.css'

// Once the date is changed the tempRes and Agglevel get reset in formdata back to their useState initial values
const Sidebar = ({
    variable,
    setVariable,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    formData,
    handleChange,
    queryData, }) => {

    return (
        <>
            <div className="sidebar_wrapper">
                <div className="padding" />
                <Input
                    val={variable}
                    setVal={setVariable}
                    label={"Variable"}
                    options={["2m_temperature",
                        //"Surface Pressure",
                        //Total Precipitation",
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
                    label="End Date & Time"/>  
                <RadioButtons
                    label="Temporal Resolution" 
                    options = {["hour", "day", "month", "year"]} 
                    var={formData.temporalLevel} 
                    setVal={handleChange} 
                    subLabel="temporalLevel"
                    defaultValue={"day"}/>  
                <RadioButtons 
                    label="Temporal Aggregation" 
                    options = {["min", "max", "mean"]} 
                    var={formData.aggLevel} 
                    setVal={handleChange} 
                    subLabel="aggLevel"
                    defaultValue={"mean"}/>  
                <div className="hr"/>                         
                <CardinalDirections formData={formData} handleChange={handleChange}/>
                <div className="hr"/>
                <Button onClick={() => queryData()} variant="outlined" sx={{marginBottom: "48px", marginTop: "auto"}}>Query</Button>
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
};

export default Sidebar;