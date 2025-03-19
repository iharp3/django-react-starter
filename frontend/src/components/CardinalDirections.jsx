// import PropTypes from 'prop-types';
// import { TextField } from '@mui/material';
// import '../styles/cardinaldirections.css';

// const CardinalDirections = ({formData, handleChange}) => {
//     return (
//         <>
//             <div className="cardinal_container">
//                 <div className="north_container">
//                     <p className="cardinal_title">North</p>
//                     <TextField
//                         type="number"
//                         className="cardinal_input"
//                         value={formData.north}
//                         name="North"
//                         onChange={handleChange}
//                         max="90"
//                         min="-90"
//                         />
//                 </div>
//                 <div className="ew_container">
//                     <div className="ew_sub_container">
//                         <p className="cardinal_title">West</p>
//                         <TextField 
//                             type="number" 
//                             max="180" 
//                             min="-180" 
//                             className="ew_input" 
//                             name="wWst"
//                             value={formData.west} 
//                             onChange={handleChange}/>
//                     </div>
//                     <div className="ew_sub_container">
//                         <p className="cardinal_title">East</p>
//                         <TextField 
//                             type="number" 
//                             max="180" 
//                             min="-180" 
//                             name="east"
//                             className="ew_input" 
//                             value={formData.east} 
//                             onChange={handleChange}/>
//                     </div>
//                 </div>
//                 <div className="north_container">
//                     <p className="cardinal_title">South</p>
//                     <TextField  
//                         max="90" 
//                         min="-90" 
//                         type="number" 
//                         name="south"
//                         className="cardinal_input" 
//                         value={formData.south} 
//                         onChange={handleChange}/>
//                 </div>
//             </div>
//         </>
//     )
// }

// export default CardinalDirections;

// CardinalDirections.propTypes = {
//     formData: PropTypes.object,
//     handleChange: PropTypes.func,
// }
import PropTypes from "prop-types";
import { TextField } from "@mui/material";
import "../styles/cardinaldirections.css";

const CardinalDirections = ({ formData, handleChange }) => {
  return (
    <div className="cardinal_container">
      {/* North Input */}
      <div className="north_container">
        <p className="cardinal_title">North</p>
        <TextField
          type="number"
          className="cardinal_input"
          value={formData.north}
          name="north"
          onChange={handleChange}
          min={-90}
          max={90}
        />
      </div>

      {/* East & West Inputs */}
      <div className="ew_container">
        <div className="ew_sub_container">
          <p className="cardinal_title">West</p>
          <TextField
            type="number"
            className="ew_input"
            name="west"
            value={formData.west}
            onChange={handleChange}
            min={-180}
            max={180}
          />
        </div>
        <div className="ew_sub_container">
          <p className="cardinal_title">East</p>
          <TextField
            type="number"
            name="east"
            className="ew_input"
            value={formData.east}
            onChange={handleChange}
            min={-180}
            max={180}
          />
        </div>
      </div>

      {/* South Input */}
      <div className="north_container">
        <p className="cardinal_title">South</p>
        <TextField
          type="number"
          name="south"
          className="cardinal_input"
          value={formData.south}
          onChange={handleChange}
          min={-90}
          max={90}
        />
      </div>
    </div>
  );
};

export default CardinalDirections;

CardinalDirections.propTypes = {
  formData: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
};
