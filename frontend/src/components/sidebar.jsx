/* eslint-disable react/prop-types */
import Input from './input';
import DateInput from './DateInput';
import CardinalDirections from './CardinalDirections';
import PropTypes from 'prop-types';
import { Button } from '@mui/material'
import '../styles/sidebar.css'


const Sidebar = ({variable, setVariable, startDate, setStartDate, endDate, setEndDate}) => {

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
                    size={"small"}/>
                <DateInput 
                    date={startDate} 
                    setDate={setStartDate}
                    label="Start Date & Time"/>
                <DateInput 
                    date={endDate} 
                    setDate={setEndDate}
                    label="End Date & Time"/>    
                <div className="hr"/>                         
                <CardinalDirections/>
                <div className="hr"/>
                <Button variant="outlined" sx={{marginBottom: "48px", marginTop: "auto"}}>Query</Button>
            </div>
        </>
    )
}

Sidebar.propTypes = {
    variable: PropTypes.any,
    setVariable: PropTypes.func,
};

export default Sidebar;