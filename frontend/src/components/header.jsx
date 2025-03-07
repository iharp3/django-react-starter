import '../styles/header.css'
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'

const Header = () => {
    const [showInfo, setShowInfo] = useState(false);

    const tableData = {
        "Temperature (Greenland)": {
            variable: "2m Temperature",
            spatialRegion: "Greenland",
            North: 84,
            South: 58,
            West: -75,
            East: -10,
            spatialResolution: "0.25°, 0.5°, 1°",
            temporalRange: "2015-2024",
            temporalResolution: "hour, day, month, year"
        },
    };

    return (
        <>
            <div className="header_wrapper">
                <div className="title-container">
                    <p className='title'>POLARIS</p>
                    <button
                        // className="info-button"
                        onClick={() => setShowInfo(!showInfo)}
                    >
                        Click To See Current Available Data
                    </button>
                    {showInfo && (
                        <div className="info-popup">
                            <h5>Available Data (by 03/07)</h5>
                            <table className="info-table">
                                <thead>
                                    <tr>
                                        <th>Variable</th>
                                        <th>Spatial Region</th>
                                        <th>North</th>
                                        <th>South</th>
                                        <th>West</th>
                                        <th>East</th>
                                        <th>Spatial Resolution</th>
                                        <th>Temporal Range</th>
                                        <th>Temporal Resolution</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.values(tableData).map((row, index) => (
                                        <tr key={index}>
                                            <td>{row.variable}</td>
                                            <td>{row.spatialRegion}</td>
                                            <td>{row.North}</td>
                                            <td>{row.South}</td>
                                            <td>{row.West}</td>
                                            <td>{row.East}</td>
                                            <td>{row.spatialResolution}</td>
                                            <td>{row.temporalRange}</td>
                                            <td>{row.temporalResolution}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
                <a href="https://github.com/iharp3/iharp-query-executor" >
                    [Github]
                </a>
            </div>
        </>
    )
}

export default Header;