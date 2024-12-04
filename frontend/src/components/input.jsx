import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';


const Input = ({ val, setVal, label, options, sx, size, name }) => {

    const handleChange = (event) => {
        setVal(event.target.value);
    };

    return (
        <Box sx={sx}>
            <FormControl fullWidth size={size}>
                <InputLabel id="demo-simple-select-label">{label}</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={!val ? options[0] : val}
                    label={label}
                    onChange={handleChange} 
                    name={name}>
                    {options.map((option) => (
                        <MenuItem key={option} value={option}>
                            {option}  {/* Add this line to display the option title */}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
};

Input.propTypes = {
    val: PropTypes.string,
    setVal: PropTypes.func,
    label: PropTypes.string,
    options: PropTypes.arrayOf(
        PropTypes.string),
    sx: PropTypes.object,
    size: PropTypes.string,
    name: PropTypes.string,
};

export default Input;
