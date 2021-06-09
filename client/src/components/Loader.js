import React from 'react'
import Animated from 'react-css-animated'

const Loader = props => {

    return <Animated isVisible={props.isVisible} animationIn="fadeIn" animationOut="fadeOut" duration={200} className="loading-cover">
        <div className="position-absolute top-50 start-50 translate-middle">
            <div id="loading-spinner" className="spinner-grow" role="status">
                <span className="visually-hidden">Ładowanie...</span>
            </div>
        </div>
    </Animated>
}

export default Loader
