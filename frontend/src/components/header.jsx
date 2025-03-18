import '../styles/header.css'
import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub } from '@fortawesome/free-brands-svg-icons'

const Header = () => {

    const [showInfo, setShowInfo] = useState(false);

    return (
        <>
            <div className="header_wrapper">
                <div className="title-container">
                    <p className='title'>POLARIS</p>
                </div>
                <a href="https://github.com/iharp3/iharp-query-executor" >
                    [Github]
                </a>
            </div>
        </>
    )
}

export default Header;