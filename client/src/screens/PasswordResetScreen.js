import React, {useEffect, useState, useRef} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {useHistory} from 'react-router-dom'
import {useForm} from 'react-hook-form'
import queryString from 'query-string'
import {resetPasswordAction, resetPasswordReset} from '../actions/userActions'
import Loader from '../components/Loader'
import Error from '../components/Error'
import InfoModal from '../components/InfoModal'

const PasswordResetScreen = props => {
    const {loading, message, error} = useSelector(state => state.resetPassword)

    const [password, setPassword] = useState('')
    const [repassword, setRepassword] = useState('')
    const [token, setToken] = useState('')

    const dispatch = useDispatch()
    const history = useHistory()
    const {register, setValue, handleSubmit, watch, errors} = useForm()
    const matchPassword = useRef()
    matchPassword.current = watch('password', '')
    const params = queryString.parse(props.location.search)

    useEffect(() => {
        if(error) dispatch(resetPasswordReset())

        if(params.token) setToken(params.token)

        return () => {}
    }, [dispatch, params.token]) // eslint-disable-line react-hooks/exhaustive-deps

    const resetHandler = () => {
        dispatch(resetPasswordReset())
        history.push('/signin')
    }

    const submitHandler = () => {
        dispatch(resetPasswordAction({
            password: password, 
            repassword: repassword,
            token: token
        }))
        setValue('password', '')
        setValue('repassword', '')
        setPassword('')
        setRepassword('')
    }

    return <main id="PasswordResetScreen" className="pt-4">

        <Loader isVisible={loading ? true : false}/>

        <section>
            <div className="container-xxl">
                <div className="row d-flex justify-content-center align-items-center">
                    <div className="col-12 col-sm-9 col-md-7 col-lg-5 col-xl-4 my-md-5">
                        <div id="form-card" className="card mb-4">
                            <div className="card-header mt-1">
                                <h3><i className="bi bi-asterisk me-3"></i>Zresetuj hasło:</h3>
                            </div>
                            <div className="card-body">
                                <form onSubmit={handleSubmit(submitHandler)}>
                                    {message ? <InfoModal status={'show'} message={message} onClose={resetHandler}/> : 
                                    error && <Error message={error}/>}

                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label">Nowe hasło</label>
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

                                    <div className="d-flex justify-content-center mt-4">
                                        <button disabled={loading} type="submit" id="form-button" className="btn btn-secondary my-1">Ustaw nowe hasło</button>
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

export default PasswordResetScreen
