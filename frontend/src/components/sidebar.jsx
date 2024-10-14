import Input from './input';
import DateInput from './DateInput';
import CardinalDirections from './CardinalDirections';
import RadioButtons from './Radio';
import PropTypes from 'prop-types';
import { Button } from '@mui/material'
import '../styles/sidebar.css'


const Sidebar = ({
    variable, 
    setVariable, 
    startDate, 
    setStartDate, 
    endDate, 
    setEndDate, 
    formData, 
    handleChange,
    queryData}) => {

    return (
        <>
            <div className="sidebar_wrapper">   
                <div className="padding"/>
                <Input 
                    val={variable} 
                    setVal={setVariable} 
                    label={"Variable"} 
                    options={["2m Temperature", "Surface Pressure", "Total Precipitation"]}
                    sx={{width: "80%"}}
                    size={"small"}
                    varLabel={"variable"}/>
                <DateInput 
                    date={startDate} 
                    setDate={setStartDate}
                    label="Start Date & Time"/>
                <DateInput 
                    date={endDate} 
                    setDate={setEndDate}
                    label="End Date & Time"/>  
                <RadioButtons label="Temporal Resolution" options = {["hourly", "daily", "monthly", "yearly"]} var={formData.temporalLevel} setVal={handleChange}/>  
                <RadioButtons label="Temporal Aggregation" options = {["min", "max", "mean"]} var={formData.aggLevel} setVal={handleChange}/>  
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