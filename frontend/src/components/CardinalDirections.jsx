import { TextField } from '@mui/material';
import '../styles/cardinaldirections.css';

const CardinalDirections = () => {
    return (
        <>
            <div className="cardinal_container">
                <div className="north_container">
                    <p className="cardinal_title">North</p>
                    <TextField type="number" className="cardinal_input" />
                </div>
                <div className="ew_container">
                    <div className="ew_sub_container">
                        <p className="cardinal_title">West</p>
                        <TextField type="number" className="ew_input" />
                    </div>
                    <div className="ew_sub_container">
                        <p className="cardinal_title">East</p>
                        <TextField type="number" className="ew_input" />
                    </div>
                </div>
                <div className="north_container">
                    <p className="cardinal_title">South</p>
                    <TextField type="number" className="cardinal_input" />
                </div>
            </div>
        </>
    )
}

export default CardinalDirections;