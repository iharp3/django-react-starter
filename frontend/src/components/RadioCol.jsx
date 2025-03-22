import PropTypes from "prop-types";
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { Grid2 } from "@mui/material";

const RadioButtonsCol = ({ label, options, val, setVal, subLabel, defaultValue }) => {
    return (
        <FormControl sx={{ width: "48%" }}>
            <FormLabel id={label}>{label}</FormLabel>
            <RadioGroup
                defaultValue={defaultValue}
                aria-labelledby={label}
                name={subLabel}
                value={val}
                onChange={setVal}
            >
                <Grid2 container spacing={0.5}>
                    {options.map((option, index) => (
                        <Grid2 item xs={6} key={option} sx={{ padding: "0px" }}>
                            <FormControlLabel 
                                value={option} 
                                control={<Radio size="x-small" />} 
                                label={option} 
                                sx={{ margin: 0 }}
                            />
                        </Grid2>
                    ))}
                </Grid2>
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
