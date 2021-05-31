import React from 'react'

const Success = props => {
    return <div id="error" className="alert alert-success fade show py-2 mb-3" role="alert">
        {props.message}
    </div>
}

export default Success
