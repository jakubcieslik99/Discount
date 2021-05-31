import React, {useEffect, useState, useRef} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {useHistory} from 'react-router-dom'
import {useForm} from 'react-hook-form'
import {registerUserAction, listUserMessageErrorReset} from '../actions/userActions'
import Loader from '../components/Loader'
import Error from '../components/Error'
import InfoModal from '../components/InfoModal'

const RegisterScreen = () => {
    const {loading, message, error} = useSelector(state => state.listUser)

    const [email, setEmail] = useState('')
    const [nick, setNick] = useState('')
    const [password, setPassword] = useState('')
    const [repassword, setRepassword] = useState('')
    const [rules, setRules] = useState(false)

    const dispatch = useDispatch()
    const history = useHistory()
    const {register, setValue, handleSubmit, watch, errors} = useForm()
    const matchPassword = useRef()
    matchPassword.current = watch('password', '')

    useEffect(() => {
        if(error) dispatch(listUserMessageErrorReset())

        return () => {}
    }, [dispatch]) // eslint-disable-line react-hooks/exhaustive-deps

    const registeredHandler = () => {
        dispatch(listUserMessageErrorReset())
        history.push('/signin')
    }

    const submitHandler = () => {
        dispatch(registerUserAction({
            email: email,
            nick: nick,
            password: password, 
            repassword: repassword,
            rules: rules
        }))
        setValue('password', '')
        setValue('repassword', '')
        setValue('rules', false)
        setPassword('')
        setRepassword('')
        setRules(false)
    }

    return <main id="RegisterScreen" className="pt-4">

        <Loader isVisible={loading ? true : false}/>

        <section>
            <div className="container-xxl">
                <div className="row d-flex justify-content-center align-items-center">
                    <div className="col-12 col-sm-9 col-md-7 col-lg-5 col-xl-4 my-md-5">
                        <div id="form-card" className="card mb-4">
                            <div className="card-header mt-1">
                                <h3><i className="bi bi-bookmark-plus me-3"></i>Rejestracja:</h3>
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleSubmit(submitHandler)}>
                                    
                                    {message ? <InfoModal status={'show'} message={message} onClose={registeredHandler}/> : 
                                    error && <Error message={error}/>}

                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">Adres e-mail</label>
                                        <input type="email" name="email" className="form-control" id="email" onChange={e => setEmail(e.target.value)} ref={register({
                                            required: true,
                                            maxLength: 64,
                                            pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g
                                        })}/>
                                        <div id="email-help" className="form-text">Nikomu nie udostępniamy Twojego adresu e-mail.</div>
                                    </div>
                                    {errors.email && errors.email.type==='required' && <Error message="Pole wymagane."/>}
                                    {errors.email && errors.email.type==='maxLength' && <Error message="Maksymalna długość wynosi 40."/>}
                                    {errors.email && errors.email.type==='pattern' && <Error message="Niepoprawny format adresu e-mail."/>}

                                    <div className="mb-3">
                                        <label htmlFor="nick" className="form-label">Nick</label>
                                        <input type="text" name="nick" className="form-control" id="nick" onChange={e => setNick(e.target.value)} ref={register({
                                            required: true,
                                            maxLength: 32,
                                            pattern: /^[0-9a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšśžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð_-]+$/g
                                        })}/>
                                        <div id="nick-help" className="form-text">Unikalna nazwa wyróżniająca Cię w serwisie Discount.</div>
                                    </div>
                                    {errors.nick && errors.nick.type==='required' && <Error message="Pole wymagane."/>}
                                    {errors.nick && errors.nick.type==='maxLength' && <Error message="Maksymalna długość wynosi 32."/>}
                                    {errors.nick && errors.nick.type==='pattern' && <Error message="Niepoprawny format nicku."/>}

                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label">Hasło</label>
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
                                        <label htmlFor="repassword" className="form-label">Powtórz hasło</label>
                                        <input type="password" name="repassword" className="form-control" id="repassword" onChange={e => setRepassword(e.target.value)} ref={register({
                                            validate: value => value===matchPassword.current
                                        })}/>
                                    </div>
                                    {errors.repassword && <Error message="Hasła nie są identyczne."/>}

                                    <div className="form-check mt-4 mb-3">
                                        <input type="checkbox" name="rules" className="form-check-input" id="rules" onChange={e => setRules(e.target.checked)} ref={register({
                                            required: true
                                        })}/>
                                        <label className="form-check-label" htmlFor="rules">
                                            Akceptuję <a href="/rules" target="_blank">regulamin</a> serwisu Discount.
                                        </label>
                                    </div>
                                    {errors.rules && errors.rules.type==='required' && <Error message="Wymagana akceptacja regulaminu."/>}

                                    <div className="d-flex justify-content-center mt-4">
                                        <button disabled={loading} type="submit" id="form-button" className="btn btn-secondary my-1">Zarejestruj się</button>
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

export default RegisterScreen
