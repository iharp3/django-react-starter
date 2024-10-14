import PropTypes from "prop-types";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

const RadioButtons = ({label, options, val, setVal}) => {

    return (
        <FormControl sx={{}}>
            <FormLabel id={label}>{label}</FormLabel>
            <RadioGroup
            row
            aria-labelledby={label}
            name="row-radio-buttons-group" 
            sx={{width: "400px", scale: "65%"}}
            value={val}
            onChange={setVal}
            >
                {options.map((option) => {
                    return (
                        <FormControlLabel  key={option} value={option} control={<Radio/>} label={option}/>
                    );
                })}          
            </RadioGroup>
        </FormControl>
    );
}

RadioButtons.propTypes = {
    label: PropTypes.string,
    options: PropTypes.arrayOf(
        PropTypes.string),
    val: PropTypes.string,
    setVal: PropTypes.func,
}

export default RadioButtons;