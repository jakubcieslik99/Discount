import React, {useEffect} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {useParams, Link} from 'react-router-dom'
import {detailsDiscountAction, detailsDiscountSuccessReset, listDiscountRateAction, listDiscountCommentAction} from '../actions/discountActions'
import Moment from 'react-moment'
import Loader from '../components/Loader'
import ReactTooltip from 'react-tooltip'
import noImage from '../img/noImage.png'
import DiscountLiker from '../components/DiscountLiker'
import DiscountCommenter from '../components/DiscountCommenter'
import Error from '../components/Error'

const DiscountScreen = () => {
    const {userInfo} = useSelector(state => state.listUser)
    const {loading, success, discount, error: error_detailsDiscount} = useSelector(state => state.detailsDiscount)
    const {ratings, error: error_discountRate} = useSelector(state => state.discountRate)
    const {comments} = useSelector(state => state.discountComment)

    const dispatch = useDispatch()
    const {id} = useParams()

    useEffect(() => {
        if(discount && success) dispatch(detailsDiscountSuccessReset())
        else {
            dispatch(detailsDiscountAction(id))
            dispatch(listDiscountRateAction(id))
            dispatch(listDiscountCommentAction(id))
        }

        return () => {}
    }, [discount, dispatch, id]) // eslint-disable-line react-hooks/exhaustive-deps

    const sale = discount ? 100-Number.parseInt((discount.price*100)/(discount.prevprice ? discount.prevprice : discount.price)) : 0

    const link = discount ? discount.link.match(/^https?:/) ? discount.link : '//' + discount.link : '#'

    const copyToClipboardHandler = text => {
        navigator.clipboard.writeText(text)
        document.activeElement.blur()
    }

    return <main id="DiscountScreen" className="pt-4">

        <Loader isVisible={loading ? true : false}/>

        <section>
            <div className="container-xxl">

                {error_discountRate && <Error message={error_discountRate}/>}

                {error_detailsDiscount ? <Error message={error_detailsDiscount}/> : 
                discount && ratings && <div id="discount-element" className="card mb-4">
                    <div className="row">
                        <div className="col-12 col-md-3 mt-3 mt-md-0 pe-md-0 d-flex justify-content-center align-items-center">
                            <div id="img-container" className="my-md-2 p-1 d-flex justify-content-center align-items-center">
                                <img className="d-flex justify-content-center align-items-center" src={discount.images.length>0 ? `${process.env.REACT_APP_API_URL}/static/${discount._id}/${discount.images[0]}` : noImage} alt="..."/>
                            </div>
                        </div>

                        <div className="col-12 col-md-9">
                            <div className="card-header">
                                <h4 className="card-title mx-0 my-1">{discount.title}</h4>
                            </div>

                            <div className="card-body">
                                <p className="card-text d-flex flex-wrap align-items-center">
                                    <span id="main-price" className="me-2">{Number.parseFloat(discount.price/100).toFixed(2)} zł</span>
                                    {discount.prevprice!==0 && <span className="me-3">
                                        <span id="previous-price" className="text-decoration-line-through me-1">{Number.parseFloat(discount.prevprice/100).toFixed(2)} zł</span>
                                        <span id="discount-percentage">{sale>0 ? '-' : '+'}{Math.abs(sale)}%</span>
                                    </span>}
                                    {discount.store && <span id="store-badge" className="badge me-1">
                                        <i className="bi bi-bag-check me-1"/>{discount.store}
                                    </span>}
                                    {discount.freeShipping && <span id="delivery-badge" className="badge me-1">
                                        <i className="bi bi-truck me-1"/>Darmowa dostawa
                                    </span>}
                                    {discount.category!=='inne' && <span className="ms-1 fst-italic">
                                        <small>{
                                            discount.category==='artykuly_spozywcze' ? 'Artykuły spożywcze' : 
                                            discount.category==='dom_i_ogrod' ? 'Dom i ogród' : 
                                            discount.category==='elektronika' ? 'Elektronika' : 
                                            discount.category==='moda' ? 'Moda' : 
                                            discount.category==='podroze' ? 'Podróże' : 
                                            discount.category==='rozrywka' ? 'Rozrywka' : 
                                            discount.category==='sport' ? 'Sport' : 
                                            discount.category==='subskrypcje_i_uslugi' ? 'Subskrypcje i usługi' : 
                                            discount.category==='zdrowie_i_uroda' ? 'Zdrowie i uroda' : 
                                            'Inne'
                                        }</small>
                                    </span>}
                                </p>
                                {discount.description && <p id="description" className="card-text overflow-hidden">
                                    {discount.description}
                                </p>}
                                <p className="card-text">
                                    <small className="me-2">
                                        <i className="bi bi-person-circle me-1"/>
                                        <Link to={'/user/' + discount.addedBy._id} className="text-decoration-none" style={{color: "inherit"}}>
                                            <b>{userInfo && userInfo.id===discount.addedBy._id ? `Ty (${discount.addedBy.nick})` : discount.addedBy.nick}</b>
                                        </Link>,
                                    </small>
                                    <small>
                                        <Moment local={true} locale="pl" format="ddd, DD.MM.YYYY, HH:mm">{discount.createdAt}</Moment>
                                    </small>
                                </p>
                            </div>

                            <div className="card-footer px-0 py-3">
                                <div className="row">
                                    {discount.discountCode && <div className="col-12 col-sm-6 col-md-4">
                                        <button onClick={() => copyToClipboardHandler(discount.discountCode)} data-tip="Kliknij aby skopiować kod" type="button" id="button-code" className="btn btn-outline-secondary w-100">
                                            {discount.discountCode}<i className="bi bi-scissors ms-1"/>
                                        </button>

                                        <ReactTooltip effect="solid"/>
                                    </div>}
                                    <div className={discount.discountCode ? 'col-12 col-sm-6 col-md-4 mt-2 mt-sm-0' : 'col-12 col-md-8 mt-0'}>
                                        <button onClick={() => window.open(link, '_blank')} type="button" id="button-go" className="btn btn-secondary w-100">
                                            Idź do okazji <i className="bi bi-arrow-up-right-square ms-1"/>
                                        </button>
                                    </div>

                                    <DiscountLiker id={discount._id} addedBy={discount.addedBy._id} ratings={ratings}/>
                                </div>
                            </div>
                        </div>

                        <DiscountCommenter id={discount._id} addedBy={discount.addedBy._id} comments={comments ? comments : []}/>

                    </div>
                </div>}

            </div>
        </section>
    </main>
}

export default DiscountScreen
