import React, {useState} from 'react'
import {useSelector, useDispatch} from 'react-redux'
import {saveDiscountRateAction, deleteDiscountRateAction} from '../actions/discountActions'
import InfoModal from './InfoModal'

const DiscountLiker = props => {
    const {userInfo} = useSelector(state => state.listUser)
    const {loading} = useSelector(state => state.discountRate)

    const [message, setMessage] = useState('')

    const dispatch = useDispatch()

    const checkStatusHandler = status => {
        if(userInfo && props.ratings.some(rating => rating.ratedBy===userInfo.id && rating.rating===status)) return true
        else return false
    }

    const checkHandler = rating => {
        if(userInfo) {
            dispatch(saveDiscountRateAction(props.id, rating))
            document.activeElement.blur()
        }
        else setMessage('Zaloguj się lub zarejestruj aby ocenić okazję.')
    }

    const uncheckHandler = () => {
        if(userInfo) {
            dispatch(deleteDiscountRateAction(props.id))
            document.activeElement.blur()
        }
        else setMessage('Zaloguj się lub zarejestruj aby usunąć ocenę okazji.')
    }

    const dismissMessageHandler = () => {
        setMessage('')
    }

    const countRatingsHandler = () => {
        if(props.ratings.length===0) return 'Nowe'
        else {
            let positive = 0, negative = 0

            for(let i=0; i<props.ratings.length; i++) {
                if(props.ratings[i].rating===true) positive++
                else if(props.ratings[i].rating===false) negative--
            }

            return positive + negative
        }
    }

    return <div id="liker-container" className="col-12 col-md-4 mt-3 mt-md-0 d-flex justify-content-center align-items-center">
        {message && <InfoModal status={'show'} message={message} onClose={dismissMessageHandler}/>}

        <div className="btn-group" role="group">

            <button 
                onClick={!loading ? (checkStatusHandler(true) ? uncheckHandler : () => checkHandler(true)) : undefined} 
                type="button" id={checkStatusHandler(true) ? 'liker-element-checked' : 'liker-element'} 
                className={userInfo && userInfo.id===props.addedBy ? 'btn btn-outline-secondary liker-element-hidden' : 'btn btn-outline-secondary'}
            >
                <i className="bi bi-hand-thumbs-up-fill"/>
            </button>

            <div id="liker-label" className={userInfo && userInfo.id===props.addedBy ? 'btn btn-secondary liker-label-alone' : 'btn btn-secondary'}>
                {countRatingsHandler() > 0 ? '+' + countRatingsHandler() : countRatingsHandler()}
            </div>

            <button 
                onClick={!loading ? (checkStatusHandler(false) ? uncheckHandler : () => checkHandler(false)) : undefined} 
                type="button" id={checkStatusHandler(false) ? 'liker-element-checked' : 'liker-element'} 
                className={userInfo && userInfo.id===props.addedBy ? 'btn btn-outline-secondary liker-element-hidden' : 'btn btn-outline-secondary'}
            >
                <i className="bi bi-hand-thumbs-down-fill"/>
            </button>

        </div>
    </div>
}

export default DiscountLiker
