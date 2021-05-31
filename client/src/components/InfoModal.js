import React, {useEffect, useState, useRef} from 'react'
import {Modal} from 'bootstrap'

const InfoModal = props => {
    const [modal, setModal] = useState(null)
    
    const infoModal = useRef()

    useEffect(() => {
        if(!modal) setModal(new Modal(infoModal.current, {
            backdrop: 'static',
            keyboard: false
        }))
        else if(modal && props.status && props.status==='show') modal.show()
        else if(modal && props.status && props.status==='hide') modal.hide()
    
        return () => {}
    }, [modal, props.status])

    const closeHandler = () => {
        props.onClose && props.onClose()
        modal.hide()
    }

    return <div ref={infoModal} className="modal fade" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div id="modal" className="modal-content">
                <div id="modal-header" className="modal-header">
                    {props.title && <h5 className="modal-title">{props.title}</h5>}
                    <button onClick={closeHandler} type="button" className="btn-close"></button>
                </div>

                <div id="modal-body" className="modal-body">
                    <p>{props.message ? props.message : 'Błąd wiadomości.'}</p>
                </div>

                <div id="modal-footer" className="modal-footer">
                    <button onClick={closeHandler} type="button" id="button-ok" className="btn btn-secondary">{props.button ? props.button : 'OK'}</button>
                </div>
            </div>
        </div>
    </div>
}

export default InfoModal
