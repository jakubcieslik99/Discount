import React, {useState} from 'react'
import {useSelector} from 'react-redux'
import {useHistory} from 'react-router-dom'
import Moment from 'react-moment'
import DeleteModal from './DeleteModal'

const UserElement = props => {
    const {userInfo} = useSelector(state => state.listUser)
    const {loading, message} = useSelector(state => state.deleteManagedUser)

    const [deleteManagedUserModal, setDeleteManagedUserModal] = useState(false)

    const history = useHistory()

    const deleteManagedUserHandler = () => {
        props.delete(props.user._id)
        setDeleteManagedUserModal(false)
    }
    const dismissDeletionManagedUserHandler = () => {
        setDeleteManagedUserModal(false)
    }

    return <div id="list-card" className="card mb-2">
        <div className="card-body">
            <div className="row d-flex justify-content-center align-items-center">
                <div onClick={() => history.push('/user/' + props.user._id)} id="list-nick" className="col-12 col-md-12 col-lg-3 d-flex align-items-center text-break">
                    <span>
                        <small>Nick:</small>
                        <h5>{props.user.nick}</h5>
                    </span>
                </div>
                <div className="col-12 col-md-12 col-lg-5">
                    <small>Adres e-mail:</small>
                    <h6 id="list-email">{props.user.email}</h6>
                </div>
                <div className="col-12 col-md-9 col-lg-2">
                    <small>Konto utworzono:</small>
                    <h6>
                        <Moment local={true} locale="pl" format="DD.MM.YYYY, HH:mm">{props.user.createdAt}</Moment>
                    </h6>
                </div>
                <div className="col-12 col-md-3 col-lg-2 mt-2 mt-lg-0 d-flex justify-content-start justify-content-md-end justify-content-lg-center">
                    <button disabled={userInfo && userInfo.id===props.user._id} onClick={!loading && !message ? () => setDeleteManagedUserModal(true) : undefined} id="delete-button" className="btn btn-danger">Usuń</button>

                    <DeleteModal 
                        status={deleteManagedUserModal ? 'show' : 'hide'} 
                        message={`Czy na pewno chcesz usunąć konto użytkownika ${props.user.nick}? Dostęp do niego zostanie bezpowrotnie utracony.`} 
                        onExecute={() => deleteManagedUserHandler()} 
                        onDismiss={() => dismissDeletionManagedUserHandler()}
                    />
                </div>
            </div>
        </div>
    </div>
}

export default UserElement
