import React, {useEffect, useState, useRef} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {useHistory} from 'react-router-dom'
import {useForm} from 'react-hook-form'
import {Modal} from 'bootstrap'
import {sendPasswordResetLinkAction, sendPasswordResetLinkReset} from '../actions/userActions'
import Loader from './Loader'
import Success from './Success'
import Error from './Error'

const PasswordResetModal = props => {
    const {loading, message, error} = useSelector(state => state.sendPasswordResetLink)

    const [modal, setModal] = useState(null)
    const [email, setEmail] = useState('')
    
    const dispatch = useDispatch()
    const passwordResetModal = useRef()
    const history = useHistory()
    const {register, setValue, handleSubmit, errors} = useForm()

    useEffect(() => {
        if(!modal) setModal(new Modal(passwordResetModal.current, {
            backdrop: 'static',
            keyboard: false
        }))
        else if(modal && props.status && props.status==='show') modal.show()
        else if(modal && props.status && props.status==='hide') modal.hide()
    
        return () => {}
    }, [modal, props.status])

    const closeHandler = () => {
        dispatch(sendPasswordResetLinkReset())
        setValue('email', '')
        setEmail('')
        modal.hide()
        history.push('/signin')
    }

    const submitHandler = () => {
        dispatch(sendPasswordResetLinkAction({email: email}))
        setValue('email', '')
        setEmail('')
    }

    return <div ref={passwordResetModal} className="modal fade" tabIndex="-1">

        <Loader isVisible={loading ? true : false}/>

        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div id="modal" className="modal-content">
                <div id="modal-header" className="modal-header">
                    <h5 className="modal-title">Zresetuj hasło:</h5>
                    <button onClick={closeHandler} type="button" className="btn-close"></button>
                </div>

                {message ? <div className="modal-body">
                    <Success message={message}/>
                </div> : 
                <div id="modal-body" className="modal-body">
                    <p>Podaj adres e-mail na który zostanie wysłany link do zresetowania hasła:</p>

                    {error && <Error message={error}/>}

                    <div className="mb-3">
                        <input type="email" name="email" className="form-control" id="email" placeholder="Adres e-mail" onChange={e => setEmail(e.target.value)} ref={register({
                            required: true,
                            maxLength: 64,
                            pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g
                        })}/>
                    </div>
                    {errors.email && errors.email.type==='required' && <Error message="Pole wymagane."/>}
                    {errors.email && errors.email.type==='maxLength' && <Error message="Maksymalna długość wynosi 40."/>}
                    {errors.email && errors.email.type==='pattern' && <Error message="Niepoprawny format adresu e-mail."/>}
                </div>}

                <div id="modal-footer" className="modal-footer">
                    {message ? <button onClick={closeHandler} type="button" id="button-ok" className="btn btn-secondary">OK</button> : 
                    <button onClick={!loading ? handleSubmit(submitHandler) : undefined} type="button" id="button-ok" className="btn btn-secondary">Wyślij</button>}
                </div>
            </div>
        </div>
    </div>
}

export default PasswordResetModal
