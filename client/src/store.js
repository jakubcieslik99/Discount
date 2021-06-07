import {createStore, combineReducers, applyMiddleware, compose} from 'redux'
import thunk from 'redux-thunk'
import Cookie from 'js-cookie'
import {
    listUserReducer,
    sendUserConfirmationLinkReducer,
    confirmUserReducer,
    sendPasswordResetLinkReducer,
    resetPasswordReducer,
    listUsersReducer,
    deleteManagedUserReducer,
    changeUserRankReducer,
    listUserDataReducer
} from './reducers/userReducers'
import {
    listDiscountsReducer, 
    detailsDiscountReducer,
    saveManagedDiscountReducer,
    deleteManagedDiscountReducer,
    discountRateReducer,
    discountCommentReducer
} from './reducers/discountReducers'

const userInfo = Cookie.getJSON('userInfo') || null

const initialState = {
    listUser: {
        userInfo: userInfo
    }
}

const reducer = combineReducers({
    //user state
    listUser: listUserReducer, //state defined
    sendUserConfirmationLink: sendUserConfirmationLinkReducer,
    confirmUser: confirmUserReducer,
    sendPasswordResetLink: sendPasswordResetLinkReducer,
    resetPassword: resetPasswordReducer,
    listUsers: listUsersReducer,
    deleteManagedUser: deleteManagedUserReducer,
    changeUserRank: changeUserRankReducer,
    listUserData: listUserDataReducer,
    //discount state
    listDiscounts: listDiscountsReducer,
    detailsDiscount: detailsDiscountReducer,
    saveManagedDiscount: saveManagedDiscountReducer,
    deleteManagedDiscount: deleteManagedDiscountReducer,
    discountRate: discountRateReducer,
    discountComment: discountCommentReducer
})

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(reducer, initialState, composeEnhancer(applyMiddleware(thunk)))
//const store = createStore(reducer, initialState, compose(applyMiddleware(thunk)))

export default store
