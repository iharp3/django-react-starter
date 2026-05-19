// import PropTypes from 'prop-types';
// import { TextField } from '@mui/material';
// import '../styles/cardinaldirections.css';

// const CardinalDirections = ({ formData, handleChange }) => {
//     return (
//         <>
//         <TextField
//             id="outlined-number"
//             label="North"
//             type="number"
//             value={formData.north}
//             name="north"
//             onChange={handleChange}
//             max="90"
//             min="-90"
//         />
//         <TextField
//             id="outlined-number"
//             label="West"
//             type="number"
//             max="180"
//             min="-180"
//             name="west"
//             value={formData.west}
//             onChange={handleChange} 
//         />
//         <TextField
//             id="outlined-number"
//             label="East"
//             type="number"
//             max="180"
//             min="-180"
//             name="east"
//             value={formData.east}
//             onChange={handleChange} 
//         />
//         <TextField
//             id="outlined-number"
//             label="South"
//             max="90"
//             min="-90"
//             type="number"
//             name="south"
//             value={formData.south}
//             onChange={handleChange} 
//         />
//         </>
//     )
// }

// export default CardinalDirections;

// CardinalDirections.propTypes = {
//     formData: PropTypes.object,
//     handleChange: PropTypes.func,
// }