import React, {useEffect, useState} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {Link} from 'react-router-dom'
import {useForm} from 'react-hook-form'
import queryString from 'query-string'
import {signinUserAction, listUserMessageErrorReset, confirmUserAction} from '../actions/userActions'
import Loader from '../components/Loader'
import Error from '../components/Error'
import Info from '../components/Info'
import InfoModal from '../components/InfoModal'
import UserConfirmationModal from '../components/UserConfirmationModal'
import PasswordResetModal from '../components/PasswordResetModal'

const SigninScreen = props => {
    const {loading: loading_listUser, message: message_listUser, error: error_listUser} = useSelector(state => state.listUser)
    const {loading: loading_confirmUser, message: message_confirmUser, error: error_confirmUser} = useSelector(state => state.confirmUser)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const dispatch = useDispatch()
    const {register, setValue, handleSubmit, errors} = useForm()
    const params = queryString.parse(props.location.search)

    useEffect(() => {
        if(error_listUser) dispatch(listUserMessageErrorReset())

        if(params.token) dispatch(confirmUserAction({token: params.token}))

        return () => {}
    }, [dispatch, params.token, params.confirmation, params.password]) // eslint-disable-line react-hooks/exhaustive-deps

    const submitHandler = () => {
        dispatch(signinUserAction({
            email: email,
            password: password
        }))
        setValue('password', '')
        setPassword('')
    }

    return <main id="SigninScreen" className="pt-4">

        <Loader isVisible={
            loading_listUser || 
            loading_confirmUser ? true : false
        }/>

        {params.confirmation && params.confirmation==='true' && <UserConfirmationModal status={'show'}/>}
        {params.password && params.password==='true' && <PasswordResetModal status={'show'}/>}

        <section>
            <div className="container-xxl">
                <div className="row d-flex justify-content-center align-items-center">
                    <div className="col-12 col-sm-9 col-md-7 col-lg-5 col-xl-4 my-md-5">
                        <div id="form-card" className="card mb-4">
                            <div className="card-header mt-1">
                                <h3><i className="bi bi-bookmark-check me-3"/>Logowanie:</h3>
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleSubmit(submitHandler)}>

                                    {message_confirmUser ? <InfoModal status={'show'} message={message_confirmUser}/> : 
                                    error_confirmUser && <Error message={error_confirmUser}/>}

                                    {message_listUser ? <InfoModal status={'show'} message={message_listUser} onClose={() => dispatch(listUserMessageErrorReset())}/> : 
                                    error_listUser && <div>
                                        <Error message={error_listUser}/>
                                        {error_listUser==='E-mail nie został potwierdzony.' && <Info message={<Link to="/signin?confirmation=true" style={{color: 'inherit'}}>Nie otrzymałem potwierdzenia.</Link>}/>}
                                    </div>}

                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">Adres e-mail</label>
                                        <input type="email" name="email" className="form-control" id="email" onChange={e => setEmail(e.target.value)} ref={register({
                                            required: true,
                                            maxLength: 40,
                                            pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g
                                        })}/>
                                    </div>
                                    {errors.email && errors.email.type === 'required' && <Error message="Pole wymagane."/>}
                                    {errors.email && errors.email.type === 'maxLength' && <Error message="Maksymalna długość wynosi 40."/>}
                                    {errors.email && errors.email.type === 'pattern' && <Error message="Niepoprawny format adresu e-mail."/>}

                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label">Hasło</label>
                                        <input type="password" name="password" className="form-control" id="password" onChange={e => setPassword(e.target.value)} ref={register({
                                            required: true,
                                            minLength: 8,
                                            maxLength: 40
                                        })}/>
                                    </div>
                                    {errors.password && errors.password.type === 'required' && <Error message="Pole wymagane."/>}
                                    {errors.password && errors.password.type === 'minLength' && <Error message="Minimalna długość wynosi 8."/>}
                                    {errors.password && errors.password.type === 'maxLength' && <Error message="Maksymalna długość wynosi 40."/>}

                                    <div className="mt-4 mb-3">
                                        <Link to="/signin?password=true">Nie pamiętam hasła.</Link>
                                    </div>
                                    <div className="d-flex justify-content-center mt-4">
                                        <button disabled={loading_listUser} type="submit" id="form-button" className="btn btn-secondary mb-1">Zaloguj się</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>
}

export default SigninScreen
