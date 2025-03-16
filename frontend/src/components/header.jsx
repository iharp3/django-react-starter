import '../styles/header.css'
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'

const Header = () => {
    const [showInfo, setShowInfo] = useState(false);

    const variables = [
        "2m_temperature",
        "total_precipitation",
        "surface_pressure",
        "snow_depth",
        "snowfall",
        "snowmelt",
        "temperature_of_snow_layer",
        "ice_temperature_layer_1",
        "ice_temperature_layer_2",
        "ice_temperature_layer_3",
        "ice_temperature_layer_4",
    ]
    const regions = {
        "Greenland": { North: 84, South: 58, West: -75, East: -10 },
        "Alaska": { North: 72, South: 50, West: -170, East: -130 },
        "Antarctica": { North: -60, South: -90, West: -180, East: 180 }
    }

    const tableData = {}
    Object.keys(regions).forEach(region => {
        variables.forEach(variable => {
            tableData[`${variable} (${region})`] = {
                variable: variable,
                spatialRegion: region,
                North: regions[region].North,
                South: regions[region].South,
                West: regions[region].West,
                East: regions[region].East,
                spatialResolution: "0.25°, 0.5°, 1°",
                temporalRange: "2015-2024",
                temporalResolution: "hour, day, month, year"
            }
        })
    })


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
                            <h5>Available Data (by 03/16).</h5>
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