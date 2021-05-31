import React, {useEffect, useState, useRef} from 'react'
import {Modal} from 'bootstrap'

const DeleteModal = props => {
    const [modal, setModal] = useState(null)
    
    const deleteModal = useRef()

    useEffect(() => {
        if(!modal) setModal(new Modal(deleteModal.current, {
            backdrop: 'static',
            keyboard: false
        }))
        else if(modal && props.status && props.status==='show') modal.show()
        else if(modal && props.status && props.status==='hide') modal.hide()
    
        return () => {}
    }, [modal, props.status])

    const executeHandler = () => props.onExecute && props.onExecute()

    const dismissHandler = () => props.onDismiss && props.onDismiss()

    return <div ref={deleteModal} className="modal fade" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div id="modal" className="modal-content">
                <div id="modal-header" className="modal-header">
                    {props.title && <h5 className="modal-title">{props.title}</h5>}
                    <button onClick={dismissHandler} type="button" className="btn-close"></button>
                </div>

                <div id="modal-body" className="modal-body">
                    <p>{props.message ? props.message : 'Błąd wiadomości.'}</p>
                </div>

                <div id="modal-footer" className="modal-footer">
                    <button onClick={executeHandler} type="button" id="button-danger" className="btn btn-danger">{props.button ? props.button : 'Usuń'}</button>
                    <button onClick={dismissHandler} type="button" id="button-ok" className="btn btn-secondary">Wróć</button>
                </div>
            </div>
        </div>
    </div>
}

export default DeleteModal
