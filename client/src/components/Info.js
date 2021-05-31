import React from 'react'

const Info = props => {
    return <div id="error" className="alert alert-warning fade show py-2 mb-3" role="alert">
        {props.message}
    </div>
}

export default Info
