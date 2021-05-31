import React, {useEffect, useState} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {useHistory} from 'react-router-dom'
import queryString from 'query-string'
import {logoutUserAction, listUsersAction, listUsersErrorReset, deleteManagedUserAction, deleteManagedUserErrorReset, deleteManagedUserReset} from '../actions/userActions'
import Loader from '../components/Loader'
import Success from '../components/Success'
import Error from '../components/Error'
import Info from '../components/Info'
import UserElement from '../components/UserElement'
import UsersPaginator from '../components/UsersPaginator'

const UsersScreen = props => {
    const {loading: loading_listUsers, users, parameters, error: error_listUsers} = useSelector(state => state.listUsers)
    const {loading: loading_deleteManagedUser, message, error: error_deleteManagedUser} = useSelector(state => state.deleteManagedUser)

    const [searchKeyword, setSearchKeyword] = useState('')

    const dispatch = useDispatch()
    const history = useHistory()
    const params = queryString.parse(props.location.search)

    useEffect(() => {
        if(error_listUsers) dispatch(listUsersErrorReset())
        if(error_deleteManagedUser) dispatch(deleteManagedUserErrorReset())

        if(message) {
            setTimeout(() => {
                dispatch(deleteManagedUserReset())
            }, 1000);
        }
        else {
            let data = {
                searchKeyword: '',
                sortOrder: '',
                page: 1
            }
            if(params.searchKeyword && params.searchKeyword!=='undefined') data.searchKeyword = params.searchKeyword
            else setSearchKeyword('')
            if(params.sortOrder && params.sortOrder!=='undefined') data.sortOrder = params.sortOrder
            if(params.page && params.page!=='undefined') data.page = parseInt(params.page)

            dispatch(listUsersAction(data.searchKeyword, data.sortOrder, data.page))
        }

        return () => {}
    }, [message, dispatch, props.location.search, props.history]) // eslint-disable-line react-hooks/exhaustive-deps
    
    const searchHandler = event => {
        event.preventDefault()
        history.push('/users/?searchKeyword=' + searchKeyword + '&sortOrder=' + (params.sortOrder ? params.sortOrder : ''))
    }
    const searchHandlerEnter = event => {
        event.key==='Enter' && history.push('/users/?searchKeyword=' + searchKeyword + '&sortOrder=' + (params.sortOrder ? params.sortOrder : ''))
    }

    const clearSearchHandler = event => {
        event.preventDefault()
        setSearchKeyword('')
        history.push('/users/?searchKeyword=&sortOrder=' + (params.sortOrder ? params.sortOrder : ''))
    }

    const sortHandler = event => {
        history.push('/users/?searchKeyword=' + (params.searchKeyword ? params.searchKeyword : '') + '&sortOrder=' + event.target.value)
    }

    const deleteManagedUserHandler = (userId) => {
        dispatch(deleteManagedUserAction(userId))
    }

    return <>

        <Loader isVisible={
            loading_listUsers || 
            loading_deleteManagedUser ? true : false
        }/>

        {!error_listUsers && <header id="header">
            <nav id="navbar-3" className="navbar">
                <div className="container-xxl my-1 my-md-0">
                    <div className="row">
                        <div className="col-12 col-md-3 offset-md-1">
                            <h3 id="title" className="mb-2 mb-md-0">Użytkownicy:</h3>
                        </div>
                        
                        <div className="col-12 my-1 col-md-4 my-md-0">
                            <div className="input-group">
                                {searchKeyword && <div onClick={clearSearchHandler} id="button-search" className="input-group-text">
                                    <i className="bi bi-x"/>
                                </div>}
                                <input onKeyDown={!loading_listUsers && searchKeyword ? searchHandlerEnter : undefined} value={searchKeyword} name="searchKeyword" type="text" className="form-control" placeholder="Wyszukaj po nicku" onChange={e => setSearchKeyword(e.target.value)}/>
                                <div onClick={!loading_listUsers && searchKeyword ? searchHandler : undefined} id="button-search" className="input-group-text">Szukaj</div>
                            </div>
                        </div>

                        <div className="col-12 col-md-3">
                            <select onChange={sortHandler} value={params.sortOrder} name="sortOrder" className="form-select">
                                <option value="">Sortuj po nicku A-Z</option>
                                <option value="nick_z">Sortuj po nicku Z-A</option>
                                <option value="date_newest">Sortuj od najnowszych</option>
                                <option value="date_oldest">Sortuj od najstarszych</option>
                            </select>
                        </div>
                    </div>
                </div>
            </nav>
        </header>}
    
        <main id="UsersScreen" className="pt-4">
            <section>
                <div className="container-xxl">

                    {message ? <Success message={message}/> : 
                    error_deleteManagedUser && error_deleteManagedUser==='Konto użytkownika nie istnieje lub zostało usunięte.' ? dispatch(logoutUserAction()) : 
                    error_deleteManagedUser && <Error message={error_deleteManagedUser}/>}

                    {error_listUsers && error_listUsers==='Konto użytkownika nie istnieje lub zostało usunięte.' ? dispatch(logoutUserAction()) : 
                    error_listUsers ? <Error message={error_listUsers}/> : 
                    !loading_listUsers && (!users || users.length===0) ? <Info message={'Brak użytkowników.'}/> : 
                    users && users.map(user => <UserElement key={user._id} user={user} delete={deleteManagedUserHandler}/>)}

                </div>
            </section>

            {users && users.length>0 && parameters && <UsersPaginator/>}
        </main>
    </>
}

export default UsersScreen
