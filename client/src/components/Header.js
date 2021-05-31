import React, {useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {useLocation, useHistory, Link} from 'react-router-dom'
import {logoutUserAction} from '../actions/userActions'
import mainLogo from '../img/mainLogo.png'

const Header = () => {
    const {userInfo} = useSelector(state => state.listUser)

    const dispatch = useDispatch()
    const location = useLocation()
    const history = useHistory()

    useEffect(() => {
        if(location.pathname==='/register' && userInfo) history.push('/')
        if(location.pathname==='/signin' && userInfo) history.push('/')

        if(location.pathname==='/add' && !userInfo) history.push('/signin')
        
        return () => {}
    }, [location.pathname, userInfo, history])

    const logoutHandler = () => {
        dispatch(logoutUserAction())
        return history.push('/')
    }

    return <header id="header">
        <nav id="navbar-1" className="navbar sticky-top">
            <div className="container-xxl">
                
                <span className="navbar-brand p-0">
                    {location.pathname!=='/' && <div id="back-button" className="btn p-0 me-2">
                        <i onClick={() => history.goBack()} className="bi bi-caret-left-fill"/>
                    </div>}

                    <Link to={'/'}>
                        <img src={mainLogo} alt="Discount" title="Discount"/>
                    </Link>
                </span>

                <div className="btn-toolbar" role="toolbar">

                    {location.pathname!=='/add' && location.pathname!=='/register' && location.pathname!=='/signin' && <button onClick={() => history.push('/add')} className="btn btn-secondary">
                        <span className="option-1">
                            <i className="bi bi-plus-square"/>
                        </span>
                        <span className="option-2">
                            <i className="bi bi-plus-square me-1"/>
                            Dodaj okazję
                        </span>
                    </button>}

                    {userInfo && location.pathname!=='/user/' + userInfo.id && <button onClick={() => history.push('/user/' + userInfo.id)} className="btn btn-secondary ms-2">
                        <span className="option-1">
                            <i className="bi bi-person"/>
                        </span>
                        <span className="option-2">
                            <i className="bi bi-person me-1"/>
                            {userInfo.nick}
                        </span>
                    </button>}

                    {userInfo ? <button onClick={logoutHandler} className="btn btn-secondary ms-2">
                        <span className="option-1">
                            <i className="bi bi-door-open"/>
                        </span>
                        <span className="option-2">
                            <i className="bi bi-door-open me-1"/>
                            Wyloguj się
                        </span>
                    </button> : 
                    location.pathname!=='/register' && location.pathname!=='/signin' ? <button onClick={() => history.push('/signin')} className="btn btn-secondary ms-2">
                        <span className="option-1">
                            <i className="bi bi-person"/>
                        </span>
                        <span className="option-2">
                            <i className="bi bi-person me-1"/>
                            Zaloguj się / Zarejestruj się
                        </span>
                    </button> : 
                    location.pathname==='/register' ? <button onClick={() => history.push('/signin')} className="btn btn-secondary ms-2">
                        <span className="option-1">
                            <i className="bi bi-person"/>
                        </span>
                        <span className="option-2">
                            <i className="bi bi-person me-1"/>
                            Masz już konto? - Zaloguj się
                        </span>
                    </button> : 
                    location.pathname==='/signin' && <button onClick={() => history.push('/register')} className="btn btn-secondary ms-2">
                        <span className="option-1">
                            <i className="bi bi-person"/>
                        </span>
                        <span className="option-2">
                            <i className="bi bi-person me-1"/>
                            Nie masz konta? - Zarejestruj się
                        </span>
                    </button>}

                    {userInfo && location.pathname==='/user/' + userInfo.id && userInfo.isAdmin && <button onClick={() => history.push('/users')} id="admin-button" className="btn btn-danger ms-2">
                        <span className="option-1">
                            <i className="bi bi-file-earmark-person"/>
                        </span>
                        <span className="option-2">
                            <i className="bi bi-file-earmark-person me-1"/>
                            Użytkownicy
                        </span>
                    </button>}

                </div>
            </div>
        </nav>
    </header>
}

export default Header
