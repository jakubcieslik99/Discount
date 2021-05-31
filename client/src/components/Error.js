import React from 'react'

const Error = props => {
    return <div id="error" className="alert alert-danger fade show py-2 mb-3" role="alert">
        {props.message}
    </div>
}

export default Error
