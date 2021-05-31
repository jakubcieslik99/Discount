import React, {useState} from 'react'
import {useSelector} from 'react-redux'
import {useHistory} from 'react-router-dom'
import Moment from 'react-moment'
import noImage from '../img/noImage.png'
import DeleteModal from './DeleteModal'

const ProfileDiscountElement = props => {
    const {userInfo} = useSelector(state => state.listUser)
    const {loading, message} = useSelector(state => state.deleteManagedDiscount)

    const [deleteManagedDiscountModal, setDeleteManagedDiscountModal] = useState(false)

    const history = useHistory()

    const link = props.discount ? props.discount.link.match(/^https?:/) ? props.discount.link : '//' + props.discount.link : '#'

    const deleteManagedDiscountHandler = () => {
        props.delete(props.discount._id)
        setDeleteManagedDiscountModal(false)
    }
    const dismissDeletionManagedDiscountHandler = () => {
        setDeleteManagedDiscountModal(false)
    }

    const countRatingsHandler = () => {
        if(props.discount.ratings.length===0) return 'Nowe'
        else {
            let positive = 0, negative = 0

            for(let i=0; i<props.discount.ratings.length; i++) {
                if(props.discount.ratings[i].rating===true) positive++
                else if(props.discount.ratings[i].rating===false) negative--
            }

            return positive + negative
        }
    }

    return <div id="discounts-card-element" className="card mb-3">
        <div className="row d-flex align-items-center">

            <div onClick={() => history.push('/discount/' + props.discount._id)} style={{cursor: 'pointer'}} className="col-12 col-md-1 ps-md-1 pe-md-0 py-2 py-md-1 d-flex justify-content-center align-items-center">
                <div id="img-container" className="p-1 d-flex justify-content-center align-items-center">
                    <img src={props.discount.images.length>0 ? `${process.env.REACT_APP_API_URL}/static/${props.discount._id}/${props.discount.images[0]}` : noImage} alt="..."/>
                </div>
            </div>
            <div className="col-12 col-md-5">
                <div onClick={() => history.push('/discount/' + props.discount._id)} style={{cursor: 'pointer'}}>
                    <small>Tytuł:</small>
                    <h6 id="my-title">{props.discount.title}</h6>
                </div>
                <div>
                    <small>Link:</small>
                    <a href={link} rel="noreferrer" target="_blank">
                        <h6 id="my-link">{props.discount.link}</h6>
                    </a>
                </div>
            </div>
            <div onClick={() => history.push('/discount/' + props.discount._id)} style={{cursor: 'pointer'}} className="col-12 col-md-4">
                <div className="row">
                    <div className="col-7">
                        <small>Cena:</small>
                        <h6>{Number.parseFloat(props.discount.price/100).toFixed(2)} zł</h6>
                    </div>
                    <div className="col-5">
                        <small>Ocena:</small>
                        <h6>{countRatingsHandler() > 0 ? '+' + countRatingsHandler() : countRatingsHandler()}</h6>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12">
                        <small>Data dodania:</small>
                        <h6>
                            <Moment local={true} locale="pl" format="DD.MM.YYYY, HH:mm">{props.discount.createdAt}</Moment>
                        </h6>
                    </div>
                </div>
            </div>

            <div className="col-12 col-md-2 d-flex justify-content-center align-items-center">

                {userInfo && (userInfo.id===props.discount.addedBy || userInfo.isAdmin) ? <div className="row">
                    <div className="col-12 p-0 mt-1 mb-2 my-md-1">
                        <button onClick={!loading && !message ? () => history.push('/add?id=' + props.discount._id) : undefined} id="edit-my-button" className="btn btn-success btn-sm">Edytuj</button>
                    </div>
                    <div className="col-12 p-0 mb-2 my-md-1">
                        <button onClick={!loading && !message ? () => setDeleteManagedDiscountModal(true) : undefined} id="delete-my-button" className="btn btn-danger btn-sm">Usuń</button>

                        <DeleteModal 
                            status={deleteManagedDiscountModal ? 'show' : 'hide'} 
                            message={`Czy na pewno chcesz usunąć tą okazję? Dostęp do niej zostanie bezpowrotnie utracony.`} 
                            onExecute={() => deleteManagedDiscountHandler()} 
                            onDismiss={() => dismissDeletionManagedDiscountHandler()}
                        />
                    </div>
                </div> : 
                <div className="row">
                    <div className="col-12 p-0 mt-1 mb-2 my-md-1">
                        <button onClick={() => history.push('/discount/' + props.discount._id)} id="edit-my-button" className="btn btn-secondary btn-sm">Zobacz</button>
                    </div>
                </div>}

            </div>
        </div>
    </div>
}

export default ProfileDiscountElement
