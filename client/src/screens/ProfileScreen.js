import React, {useEffect, useState} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {useParams, useHistory} from 'react-router-dom'
import {listUserDataAction} from '../actions/userActions'
import {logoutUserAction, deleteManagedUserAction, deleteManagedUserReset, changeUserRankAction, changeUserRankReset} from '../actions/userActions'
import {deleteManagedDiscountAction, deleteManagedDiscountReset} from '../actions/discountActions'
import DeleteModal from '../components/DeleteModal'
import Loader from '../components/Loader'
import Success from '../components/Success'
import Error from '../components/Error'
import Info from '../components/Info'
import ProfileSettings from '../components/ProfileSettings'
import ProfileDiscountElement from '../components/ProfileDiscountElement'

const ProfileScreen = () => {
    const {loading: loading_listUser, message: message_listUser, userInfo} = useSelector(state => state.listUser)
    const {loading: loading_listUserData, nick, isAdmin, discounts, error: error_listUserData} = useSelector(state => state.listUserData)
    const {loading: loading_changeUserRank, message: message_changeUserRank, error: error_changeUserRank} = useSelector(state => state.changeUserRank)
    const {loading: loading_deleteManagedUser, message: message_deleteManagedUser, error: error_deleteManagedUser} = useSelector(state => state.deleteManagedUser)
    const {loading: loading_deleteManagedDiscount, message: message_deleteManagedDiscount, error: error_deleteManagedDiscount} = useSelector(state => state.deleteManagedDiscount)

    const [deleteManagedUserModal, setDeleteManagedUserModal] = useState(false)

    const dispatch = useDispatch()
    const {id} = useParams()
    const history = useHistory()

    useEffect(() => {
        if(error_deleteManagedDiscount) dispatch(deleteManagedDiscountReset())
        if(error_deleteManagedUser) dispatch(deleteManagedUserReset())
        if(error_changeUserRank) dispatch(changeUserRankReset())

        if(message_listUser && message_listUser==='Usunięto konto z serwisu.') history.push('/signin')
        else if(message_deleteManagedDiscount) {
            setTimeout(() => {
                dispatch(deleteManagedDiscountReset())
            }, 1000);
        }
        else if(message_deleteManagedUser) {
            setTimeout(() => {
                history.push('/users')
                dispatch(deleteManagedUserReset())
            }, 1000);
        }
        else if(message_changeUserRank) {
            setTimeout(() => {
                dispatch(changeUserRankReset())
            }, 1000);
        }
        else if(!message_listUser) dispatch(listUserDataAction(id))

        return () => {}
    }, [message_listUser, message_deleteManagedDiscount, message_deleteManagedUser, message_changeUserRank, dispatch, history, id]) // eslint-disable-line react-hooks/exhaustive-deps

    const deleteManagedDiscountHandler = (discountId) => {
        dispatch(deleteManagedDiscountAction(discountId))
    }

    const deleteManagedUserHandler = (userId) => {
        dispatch(deleteManagedUserAction(userId))
        setDeleteManagedUserModal(false)
    }
    const dismissDeletionManagedUserHandler = () => {
        setDeleteManagedUserModal(false)
    }

    const changeUserRankHandler = (userId) => {
        dispatch(changeUserRankAction(userId))
    }

    return <main id="ProfileScreen" className="pt-4">

        <Loader isVisible={
            loading_listUser || 
            loading_listUserData || 
            loading_changeUserRank || 
            loading_deleteManagedUser || 
            loading_deleteManagedDiscount ? true : false
        }/>
        
        <section>
            <div className="container-xxl">
                <div className="row justify-content-center">
                    
                    {userInfo && userInfo.id===id && <ProfileSettings/>}

                    <div className="col-12">

                        {message_changeUserRank ? <Success message={message_changeUserRank}/> : 
                        error_changeUserRank && <Error message={error_changeUserRank}/>}

                        {message_deleteManagedUser ? <Success message={message_deleteManagedUser}/> : 
                        error_deleteManagedUser && error_deleteManagedUser==='Konto użytkownika nie istnieje lub zostało usunięte.' ? dispatch(logoutUserAction()) : 
                        error_deleteManagedUser && <Error message={error_deleteManagedUser}/>}

                        {error_listUserData ? <Error message={error_listUserData}/> : 
                        nick && <div id="discounts-card" className="card mb-4">
                            <div className="card-header pt-3 d-flex flex-wrap justify-content-between align-items-start">
                                {userInfo && userInfo.id===id ? <span id="discounts-header">
                                    <h5>
                                        <i className="bi bi-card-checklist me-2"/>Twoje okazje:
                                    </h5>
                                </span> : 
                                <span id="discounts-header">
                                    <h5>
                                        <i className="bi bi-card-checklist me-2"/>Okazje od <b className="ms-1">{nick}</b>:
                                    </h5>
                                </span>}

                                {userInfo && userInfo.id!==id && userInfo.isAdmin && <div className="d-flex align-items-center">
                                    <span onClick={!loading_changeUserRank && !message_changeUserRank ? () => changeUserRankHandler(id) : undefined} id="comment-delete" className="badge rounded-pill">
                                        <i className="bi bi-person-plus me-1"/>
                                        {!isAdmin ? 'Daj administratora' : 'Usuń administratora'}
                                    </span>

                                    <span onClick={!loading_deleteManagedUser && !message_deleteManagedUser ? () => setDeleteManagedUserModal(true) : undefined} id="comment-delete" className="badge rounded-pill ms-2">
                                        <i className="bi bi-trash me-1"/>
                                        Usuń konto
                                    </span>

                                    <DeleteModal 
                                        status={deleteManagedUserModal ? 'show' : 'hide'} 
                                        message={`Czy na pewno chcesz usunąć konto użytkownika ${nick}? Dostęp do niego zostanie bezpowrotnie utracony.`} 
                                        onExecute={() => deleteManagedUserHandler(id)} 
                                        onDismiss={() => dismissDeletionManagedUserHandler()}
                                    />
                                </div>}
                            </div>

                            <div className="card-body pt-3 pb-0">

                                {message_deleteManagedDiscount ? <Success message={message_deleteManagedDiscount}/> : 
                                error_deleteManagedDiscount && error_deleteManagedDiscount==='Konto użytkownika nie istnieje lub zostało usunięte.' ? dispatch(logoutUserAction()) : 
                                error_deleteManagedDiscount && <Error message={error_deleteManagedDiscount}/>}

                                {!discounts || discounts.length===0 ? <Info message={'Brak okazji.'}/> : 
                                discounts && discounts.map(discount => <ProfileDiscountElement key={discount._id} discount={discount} delete={deleteManagedDiscountHandler}/>)}

                            </div>
                        </div>}
                    </div>
                
                </div>
            </div>
        </section>
    </main>
}

export default ProfileScreen
