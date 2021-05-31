import React, {useEffect, useState, useRef} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {useHistory} from 'react-router-dom'
import {detailsDiscountReset, saveManagedDiscountReset} from '../actions/discountActions'
import {Modal} from 'bootstrap'

const AddModal = props => {
    const {userInfo} = useSelector(state => state.listUser)
    const {discount} = useSelector(state => state.detailsDiscount)

    const [modal, setModal] = useState(null)

    const dispatch = useDispatch()
    const addModal = useRef()
    const history = useHistory()

    useEffect(() => {
        if(!modal) setModal(new Modal(addModal.current, {
            backdrop: 'static',
            keyboard: false
        }))
        else if(modal && props.status && props.status==='show') modal.show()
        else if(modal && props.status && props.status==='hide') modal.hide()
    
        return () => {}
    }, [modal, props.status])

    const goToProfileHandler = () => {
        modal.hide()
        discount && dispatch(detailsDiscountReset())
        dispatch(saveManagedDiscountReset())
        history.push(userInfo && userInfo.id ? '/user/' + userInfo.id : '/')
    }

    const backToAddHandler = () => {
        modal.hide()
        discount && dispatch(detailsDiscountReset())
        dispatch(saveManagedDiscountReset())
        history.push(props.id ? '/add?id=' + props.id : '/add')
    }

    const goToAddHandler = () => {
        modal.hide()
        discount ? dispatch(detailsDiscountReset()) : props.clearInputsHandler()
        dispatch(saveManagedDiscountReset())
        history.push('/add')
    }

    return <div ref={addModal} className="modal fade" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div id="modal" className="modal-content">
                <div id="modal-header" className="modal-header">
                    {props.title && <h5 className="modal-title">{props.title}</h5>}
                    <button onClick={backToAddHandler} type="button" className="btn-close"></button>
                </div>

                <div id="modal-body" className="modal-body">
                    <p>{props.message ? props.message : 'Błąd wiadomości.'}</p>
                </div>

                <div id="modal-footer" className="modal-footer">
                    <button onClick={goToProfileHandler} type="button" id="button-ok" className="btn btn-secondary">Wróć do profilu</button>
                    <button onClick={backToAddHandler} type="button" id="button-ok" className="btn btn-secondary">Wróć do edycji</button>
                    <button onClick={goToAddHandler} type="button" id="button-ok" className="btn btn-secondary">Dodaj nową</button>
                </div>
            </div>
        </div>
    </div>
}

export default AddModal
