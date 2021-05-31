import React, {useState} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {useHistory, Link} from 'react-router-dom'
import {saveDiscountRateAction, deleteDiscountRateAction} from '../actions/discountActions'
import Moment from 'react-moment'
import ReactTooltip from 'react-tooltip'
import noImage from '../img/noImage.png'
import InfoModal from '../components/InfoModal'

const DiscountElement = props => {
    const {userInfo} = useSelector(state => state.listUser)
    const {loading} = useSelector(state => state.discountRate)

    const [message, setMessage] = useState('')

    const dispatch = useDispatch()
    const history = useHistory()

    const sale = 100-Number.parseInt((props.discount.price*100)/(props.discount.prevprice ? props.discount.prevprice : props.discount.price))

    const link = props.discount ? props.discount.link.match(/^https?:/) ? props.discount.link : '//' + props.discount.link : '#'

    const checkStatusHandler = status => {
        if(userInfo && props.discount.ratings.some(rating => rating.ratedBy===userInfo.id && rating.rating===status)) return true
        else return false
    }

    const checkHandler = rating => {
        if(userInfo) {
            dispatch(saveDiscountRateAction(props.discount._id, rating))
            document.activeElement.blur()
        }
        else setMessage('Zaloguj się lub zarejestruj aby ocenić okazję.')
    }

    const uncheckHandler = () => {
        if(userInfo) {
            dispatch(deleteDiscountRateAction(props.discount._id))
            document.activeElement.blur()
        }
        else setMessage('Zaloguj się lub zarejestruj aby usunąć ocenę okazji.')
    }

    const dismissMessageHandler = () => {
        setMessage('')
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

    const copyToClipboardHandler = text => {
        navigator.clipboard.writeText(text)
        document.activeElement.blur()
    }

    return <div id="discount-element" className="card mb-4">
        {message && <InfoModal status={'show'} message={message} onClose={dismissMessageHandler}/>}

        <div className="row">
            <div className="col-12 col-md-3 mt-3 mt-md-0 pe-md-0 d-flex justify-content-center align-items-center">
                <div className="row d-flex justify-content-center">
                    <div id="img-container" className="col-5 col-sm-6 col-md-12 mt-md-3 p-1 d-flex justify-content-center align-items-center">
                        <img className="d-flex justify-content-center align-items-center" src={props.discount.images.length>0 ? `${process.env.REACT_APP_API_URL}/static/${props.discount._id}/${props.discount.images[0]}` : noImage} alt="..."/>
                    </div>
                    <div id="liker-container" className="col-7 col-sm-6 col-md-12 my-md-3 p-0 d-flex justify-content-end justify-content-md-center align-items-center">
                        <div className="btn-group" role="group">

                            <button 
                                onClick={!loading ? (checkStatusHandler(true) ? uncheckHandler : () => checkHandler(true)) : undefined} 
                                type="button" id={checkStatusHandler(true) ? 'liker-element-checked' : 'liker-element'} 
                                className={userInfo && userInfo.id===props.discount.addedBy._id ? 'btn btn-outline-secondary liker-element-hidden' : 'btn btn-outline-secondary'}
                            >
                                <i className="bi bi-hand-thumbs-up-fill"/>
                            </button>

                            <div id="liker-label" className={userInfo && userInfo.id===props.discount.addedBy._id ? 'btn btn-secondary liker-label-alone' : 'btn btn-secondary'}>
                                {countRatingsHandler() > 0 ? '+' + countRatingsHandler() : countRatingsHandler()}
                            </div>

                            <button 
                                onClick={!loading ? (checkStatusHandler(false) ? uncheckHandler : () => checkHandler(false)) : undefined} 
                                type="button" id={checkStatusHandler(false) ? 'liker-element-checked' : 'liker-element'} 
                                className={userInfo && userInfo.id===props.discount.addedBy._id ? 'btn btn-outline-secondary liker-element-hidden' : 'btn btn-outline-secondary'}
                            >
                                <i className="bi bi-hand-thumbs-down-fill"/>
                            </button>

                        </div>
                    </div>
                </div>
            </div>

            <div className="col-12 col-md-9">
                <div className="card-header">
                    <Link to={'/discount/' + props.discount._id} className="text-light text-decoration-none">
                        <h4 className="card-title mx-0 my-1">{props.discount.title}</h4>
                    </Link>
                </div>

                <div className="card-body">
                    <p className="card-text d-flex flex-wrap align-items-center">
                        <span id="main-price" className="me-2">{Number.parseFloat(props.discount.price/100).toFixed(2)} zł</span>
                        {props.discount.prevprice!==0 && <span className="me-3">
                            <span id="previous-price" className="text-decoration-line-through me-1">{Number.parseFloat(props.discount.prevprice/100).toFixed(2)} zł</span>
                            <span id="discount-percentage">{sale>0 ? '-' : '+'}{Math.abs(sale)}%</span>
                        </span>}
                        {props.discount.store && <span id="store-badge" className="badge me-1">
                            <i className="bi bi-bag-check me-1"/>{props.discount.store}
                        </span>}
                        {props.discount.freeShipping && <span id="delivery-badge" className="badge me-1">
                            <i className="bi bi-truck me-1"/>Darmowa dostawa
                        </span>}
                        {props.discount.category!=='inne' && <span className="ms-1 fst-italic">
                            <small>{
                                props.discount.category==='artykuly_spozywcze' ? 'Artykuły spożywcze' : 
                                props.discount.category==='dom_i_ogrod' ? 'Dom i ogród' : 
                                props.discount.category==='elektronika' ? 'Elektronika' : 
                                props.discount.category==='moda' ? 'Moda' : 
                                props.discount.category==='podroze' ? 'Podróże' : 
                                props.discount.category==='rozrywka' ? 'Rozrywka' : 
                                props.discount.category==='sport' ? 'Sport' : 
                                props.discount.category==='subskrypcje_i_uslugi' ? 'Subskrypcje i usługi' : 
                                props.discount.category==='zdrowie_i_uroda' ? 'Zdrowie i uroda' : 
                                'Inne'
                            }</small>
                        </span>}
                    </p>
                    {props.discount.description && <p id="description" className="card-text overflow-hidden">
                        {props.discount.description}
                    </p>}
                    <p className="card-text">
                        <small className="me-2">
                            <i className="bi bi-person-circle me-1"/>
                            <Link to={'/user/' + props.discount.addedBy._id} className="text-decoration-none" style={{color: "inherit"}}>
                                <b>{userInfo && userInfo.id===props.discount.addedBy._id ? `Ty (${props.discount.addedBy.nick})` : props.discount.addedBy.nick}</b>
                            </Link>,
                        </small>
                        <small>
                            <Moment local={true} locale="pl" format="ddd, DD.MM.YYYY, HH:mm">{props.discount.createdAt}</Moment>
                        </small>
                    </p>
                </div>

                <div className="card-footer px-0 py-3">
                    <div className="row">
                        {props.discount.discountCode && <div className="col-12 col-sm-7 col-md-4">
                            <button onClick={() => copyToClipboardHandler(props.discount.discountCode)} data-tip="Kliknij aby skopiować kod" type="button" id="button-code" className="btn btn-outline-secondary w-100" title="Kliknij aby skopiować kod">
                               {props.discount.discountCode}<i className="bi bi-scissors ms-1"/>
                            </button>

                            <ReactTooltip effect="solid"/>
                        </div>}
                        <div className={props.discount.discountCode ? 'col-12 col-sm-5 col-md-4 mt-2 mt-sm-0' : 'col-12 col-md-6 mt-0'}>
                            <button onClick={() => history.push('/discount/' + props.discount._id)} type="button" id="button-more" className="btn btn-secondary w-100">
                                Zobacz więcej <i className="bi bi-arrow-left-square ms-1"/>
                            </button>
                        </div>
                        <div className={props.discount.discountCode ? 'col-12 col-md-4 mt-2 mt-md-0' : 'col-12 col-md-6 mt-2 mt-md-0'}>
                            <button onClick={() => window.open(link, '_blank')} type="button" id="button-go" className="btn btn-secondary w-100">
                                Idź do okazji <i className="bi bi-arrow-up-right-square ms-1"/>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
}

export default DiscountElement
