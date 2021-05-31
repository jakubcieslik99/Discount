import React, {useEffect, useState} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {useForm} from 'react-hook-form'
import {fetchUserAction, updateUserAction, updateUserReset, deleteUserAction, logoutUserAction, listUserMessageErrorReset} from '../actions/userActions'
import DeleteModal from '../components/DeleteModal'
import Success from './Success'
import Error from './Error'

const ProfileSettings = () => {
    const {loading, message, userInfo, error} = useSelector(state => state.listUser)

    const [email, setEmail] = useState('')
    const [nick, setNick] = useState('')
    const [password, setPassword] = useState('')
    const [newpassword, setNewpassword] = useState('')

    const [deleteAccountModal, setDeleteAccountModal] = useState(false)

    const dispatch = useDispatch()
    const {register, setValue, handleSubmit, errors} = useForm()

    useEffect(() => {
        if(error) dispatch(listUserMessageErrorReset())

        if(message) {
            setTimeout(() => {
                dispatch(updateUserReset())
            }, 1000);
        }
        else if(userInfo) {
            dispatch(fetchUserAction())

            setValue('email', userInfo.email ? userInfo.email : '')
            setValue('nick', userInfo.nick ? userInfo.nick : '')

            setEmail(userInfo.email ? userInfo.email : '')
            setNick(userInfo.nick ? userInfo.nick : '')
        }

        return () => {}
    }, [message, dispatch, userInfo, setValue]) // eslint-disable-line react-hooks/exhaustive-deps

    const deleteAccountHandler = () => {
        dispatch(deleteUserAction())
        setDeleteAccountModal(false)
    }
    const dismissDeletionAccountHandler = () => {
        setDeleteAccountModal(false)
    }

    const submitHandler = () => {
        dispatch(updateUserAction({
            id: userInfo.id,
            email: email,
            nick: nick,
            password: password,
            newpassword: newpassword
        }))
        setValue('password', '')
        setValue('newpassword', '')
        setPassword('')
        setNewpassword('')
    }

    return <div className="col-12 col-sm-10 col-lg-9 mb-3">
        <div id="form-card" className="card mb-4">
            <div className="card-header mt-1 d-flex flex-wrap justify-content-between">
                <h3><i className="bi bi-person me-3"/>Edytuj profil:</h3>

                <div className="d-flex align-items-center">
                    <span onClick={() => setDeleteAccountModal(true)} id="comment-delete" className="badge rounded-pill mb-1">
                        <i className="bi bi-trash me-1"/>
                        Usuń konto
                    </span>

                    <DeleteModal 
                        status={deleteAccountModal ? 'show' : 'hide'} 
                        message={'Czy na pewno chcesz usunąć swoje konto? Dostęp do niego zostanie bezpowrotnie utracony.'} 
                        onExecute={() => deleteAccountHandler()} 
                        onDismiss={() => dismissDeletionAccountHandler()}
                    />
                </div>
            </div>
            <div className="card-body">
                <form onSubmit={handleSubmit(submitHandler)}>
                    <div className="row d-flex justify-content-center">
                        <div className="col-12 col-sm-10 col-md-8 px-0 px-sm-3">
                            {message ? <Success message={message}/> : 
                            error && error==='Konto użytkownika nie istnieje lub zostało usunięte.' ? dispatch(logoutUserAction()) : 
                            error && <Error message={error}/>}
                        </div>

                        <div className="col-12 col-md-6 px-0 px-sm-5 px-md-0 pe-md-3 px-lg-4">
                            <div className="mb-3">
                                <label htmlFor="email" className="form-label">Adres e-mail*</label>
                                <input type="email" name="email" className="form-control" id="email" onChange={e => setEmail(e.target.value)} ref={register({
                                    required: true,
                                    maxLength: 64,
                                    pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g
                                })}/>
                            </div>
                            {errors.email && errors.email.type==='required' && <Error message="Pole wymagane."/>}
                            {errors.email && errors.email.type==='maxLength' && <Error message="Maksymalna długość wynosi 40."/>}
                            {errors.email && errors.email.type==='pattern' && <Error message="Niepoprawny format adresu e-mail."/>}

                            <div className="mb-3">
                                <label htmlFor="nick" className="form-label">Nick*</label>
                                <input type="text" name="nick" className="form-control" id="nick" onChange={e => setNick(e.target.value)} ref={register({
                                    required: true,
                                    maxLength: 32,
                                    pattern: /^[0-9a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšśžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð-]+$/g
                                })}/>
                            </div>
                            {errors.nick && errors.nick.type==='required' && <Error message="Pole wymagane."/>}
                            {errors.nick && errors.nick.type==='maxLength' && <Error message="Maksymalna długość wynosi 32."/>}
                            {errors.nick && errors.nick.type==='pattern' && <Error message="Niepoprawny format nicku."/>}
                        </div>
                        <div className="col-12 col-md-6 px-0 px-sm-5 px-md-0 ps-md-3 px-lg-4">
                            <div className="mb-3">
                                <label htmlFor="password" className="form-label">Aktualne hasło*</label>
                                <input type="password" name="password" className="form-control" id="password" onChange={e => setPassword(e.target.value)} ref={register({
                                    required: true,
                                    minLength: 8,
                                    maxLength: 64
                                })}/>
                            </div>
                            {errors.password && errors.password.type==='required' && <Error message="Pole wymagane."/>}
                            {errors.password && errors.password.type==='minLength' && <Error message="Minimalna długość wynosi 8."/>}
                            {errors.password && errors.password.type==='maxLength' && <Error message="Maksymalna długość wynosi 64."/>}

                            <div className="mb-3">
                                <label htmlFor="newpassword" className="form-label">Nowe hasło</label>
                                <input type="password" name="newpassword" className="form-control" id="newpassword" onChange={e => setNewpassword(e.target.value)} ref={register({
                                    minLength: 8,
                                    maxLength: 64
                                })}/>
                            </div>
                            {errors.newpassword && errors.newpassword.type==='minLength' && <Error message="Minimalna długość wynosi 8."/>}
                            {errors.newpassword && errors.newpassword.type==='maxLength' && <Error message="Maksymalna długość wynosi 64."/>}
                        </div>
                    </div>
                    <div className="d-flex justify-content-center">
                        <button disabled={loading || message} type="submit" id="form-button" className="btn btn-secondary mt-2 mb-1">Zapisz</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
}

export default ProfileSettings
