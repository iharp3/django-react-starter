import PropTypes from "prop-types";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

const RadioButtonsCol = ({ label, options, val, setVal, subLabel, defaultValue }) => {

    return (
        <FormControl sx={{}}>
            <FormLabel id={label}>{label}</FormLabel>
            <RadioGroup
                defaultValue={defaultValue}
                column
                aria-labelledby={label}
                name={subLabel}
                sx={{ width: "45%", height:"25%", scale: "95%", justifyContent: "center", border: "" }}
                value={val}
                onChange={setVal}
            >
                {options.map((option) => {
                    return (
                        <FormControlLabel key={option} value={option} control={<Radio />} label={option} />
                    );
                })}
            </RadioGroup>
        </FormControl>
    );
}

RadioButtonsCol.propTypes = {
    label: PropTypes.string,
    options: PropTypes.arrayOf(
        PropTypes.string),
    val: PropTypes.string,
    setVal: PropTypes.func,
    subLabel: PropTypes.string,
    defaultValue: PropTypes.string,
}

export default RadioButtonsCol;