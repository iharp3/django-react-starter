import '../styles/header.css'
import { useState } from 'react'

const Header = () => {
    const [showInfo, setShowInfo] = useState(false);

    const tableData = {
        "Sea Surface Temperature1": {
            variable: "Sea Surface Temperature",
            spatialRegion: "90,60,180,-180",
            spatialResolution: "0.25°",
            temporalRange: "2024",
            temporalResolution: "Hourly"
        },
        "Sea Surface Temperature2": {
            variable: "Sea Surface Temperature",
            spatialRegion: "90,50,-70,-180",
            spatialResolution: "0.5°",
            temporalRange: "2020-2023",
            temporalResolution: "Daily"
        },
        "Sea Surface Temperature3": {
            variable: "Sea Surface Temperature",
            spatialRegion: "90,50,10,-70",
            spatialResolution: "0.25°",
            temporalRange: "2020-2023",
            temporalResolution: "Daily"
        },
        "Sea Surface Temperature4": {
            variable: "Sea Surface Temperature",
            spatialRegion: "90,50,180,10",
            spatialResolution: "0.5°",
            temporalRange: "2020-2023",
            temporalResolution: "Daily"
        },
        "Sea Surface Temperature5": {
            variable: "Sea Surface Temperature",
            spatialRegion: "90,60,180,-180",
            spatialResolution: "1°",
            temporalRange: "2015-2019",
            temporalResolution: "Yearly"
        },
        "Sea Surface Temperature6": {
            variable: "Sea Surface Temperature",
            spatialRegion: "80,70,-50,-80",
            spatialResolution: "0.25°",
            temporalRange: "2010-2014",
            temporalResolution: "Hourly"
        },
        "Sea Surface Temperature7": {
            variable: "Sea Surface Temperature",
            spatialRegion: "90,60,180,-180",
            spatialResolution: "1°",
            temporalRange: "2010-2014",
            temporalResolution: "Daily"
        },
        "Sea Surface Temperature8": {
            variable: "Sea Surface Temperature",
            spatialRegion: "90,60,180,-180",
            spatialResolution: "1°",
            temporalRange: "2006-2009",
            temporalResolution: "Monthly"
        },
        "Sea Surface Temperature9": {
            variable: "Sea Surface Temperature",
            spatialRegion: "90,60,180,-180",
            spatialResolution: "1°",
            temporalRange: "2001-2005",
            temporalResolution: "Yearly"
        },
        "Temperature (Northern Region)": {
        variable: "2m Temperature",
        spatialRegion: "90,40,180,-180",
        spatialResolution: "1°",
        temporalRange: "1940-1994",
        temporalResolution: "Yearly"
    },
    "Temperature (Southern Region)": {
        variable: "2m Temperature",
        spatialRegion: "-70,-90,180,-180",
        spatialResolution: "1°",
        temporalRange: "1940-1994",
        temporalResolution: "Yearly"
    },
    "pressure_2024": {
        variable: "Surface Pressure",
        spatialRegion: "90,60,-10,-80",
        spatialResolution: "0.25°",
        temporalRange: "2024",
        temporalResolution: "Hourly"
    },
    "pressure_2015_2023": {
        variable: "Surface Pressure",
        spatialRegion: "90,50,180,-180",
        spatialResolution: "0.5°",
        temporalRange: "2015-2023",
        temporalResolution: "Daily"
    },
    "pressure_2010_2014_west": {
        variable: "Surface Pressure",
        spatialRegion: "90,50,0,-80",
        spatialResolution: "0.5°",
        temporalRange: "2010-2014",
        temporalResolution: "Daily"
    },
    "pressure_2010_2014_east": {
        variable: "Surface Pressure",
        spatialRegion: "90,50,180,0",
        spatialResolution: "0.5°",
        temporalRange: "2010-2014",
        temporalResolution: "Monthly"
    }
    };

    return (
        <>
            <div className="header_wrapper">
                <div className="title-container">
                    <p className='title'>iHARPV</p>
                    <button
                        className="info-button"
                        onClick={() => setShowInfo(!showInfo)}
                    >
                        i
                    </button>
                    {showInfo && (
                        <div className="info-popup">
                            <table className="info-table">
                                <thead>
                                    <tr>
                                        <th>Variable</th>
                                        <th>Spatial Region</th>
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
            </div>
        </>
    )
}

export default Header;