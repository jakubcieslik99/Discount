import {
    LIST_DISCOUNTS_REQUEST,
    LIST_DISCOUNTS_SUCCESS,
    LIST_DISCOUNTS_FAIL,
    LIST_DISCOUNTS_ERROR_RESET,
    DETAILS_DISCOUNT_REQUEST,
    DETAILS_DISCOUNT_SUCCESS,
    DETAILS_DISCOUNT_FAIL,
    DETAILS_DISCOUNT_SUCCESS_RESET,
    DETAILS_DISCOUNT_RESET,
    SAVE_MANAGED_DISCOUNT_REQUEST,
    SAVE_MANAGED_DISCOUNT_UPLOADING,
    SAVE_MANAGED_DISCOUNT_SUCCESS,
    SAVE_MANAGED_DISCOUNT_FAIL,
    SAVE_MANAGED_DISCOUNT_RESET,
    DELETE_MANAGED_DISCOUNT_REQUEST,
    DELETE_MANAGED_DISCOUNT_SUCCESS,
    DELETE_MANAGED_DISCOUNT_FAIL,
    DELETE_MANAGED_DISCOUNT_RESET,
    LIST_DISCOUNT_RATE_REQUEST,
    LIST_DISCOUNT_RATE_SUCCESS,
    LIST_DISCOUNT_RATE_FAIL,
    SAVE_DISCOUNT_RATE_REQUEST,
    SAVE_DISCOUNT_RATE_SUCCESS,
    SAVE_DISCOUNT_RATE_FAIL,
    DELETE_DISCOUNT_RATE_REQUEST,
    DELETE_DISCOUNT_RATE_SUCCESS,
    DELETE_DISCOUNT_RATE_FAIL,
    LIST_DISCOUNT_COMMENT_REQUEST,
    LIST_DISCOUNT_COMMENT_SUCCESS,
    LIST_DISCOUNT_COMMENT_FAIL,
    SAVE_DISCOUNT_COMMENT_REQUEST,
    SAVE_DISCOUNT_COMMENT_SUCCESS,
    SAVE_DISCOUNT_COMMENT_FAIL,
    DELETE_DISCOUNT_COMMENT_REQUEST,
    DELETE_DISCOUNT_COMMENT_SUCCESS,
    DELETE_DISCOUNT_COMMENT_FAIL
} from '../constants/discountConstants'

const listDiscountsReducer = (state = {}, action) => {
    switch(action.type) {
        case LIST_DISCOUNTS_REQUEST:
            return {...state, loading: true}
        case LIST_DISCOUNTS_SUCCESS:
            return {...state, loading: false, discounts: action.payload.discounts, parameters: action.payload.parameters}
        case LIST_DISCOUNTS_FAIL:
            return {...state, loading: false, error: action.payload}
        case LIST_DISCOUNTS_ERROR_RESET:
            return {...state, error: null}
        default:
            return state
    }
}
const detailsDiscountReducer = (state = {}, action) => {
    switch(action.type) {
        case DETAILS_DISCOUNT_REQUEST:
            return {loading: true}
        case DETAILS_DISCOUNT_SUCCESS:
            return {loading: false, success: true, discount: action.payload}
        case DETAILS_DISCOUNT_FAIL:
            return {loading: false, error: action.payload}
        case DETAILS_DISCOUNT_SUCCESS_RESET:
            return {...state, success: null}
        case DETAILS_DISCOUNT_RESET:
            return {}
        default:
            return state
    }
}

const saveManagedDiscountReducer = (state = {}, action) => {
    switch(action.type) {
        case SAVE_MANAGED_DISCOUNT_REQUEST:
            return {loading: true}
        case SAVE_MANAGED_DISCOUNT_UPLOADING:
            return {...state, progress: action.payload}
        case SAVE_MANAGED_DISCOUNT_SUCCESS:
            return {loading: false, progress: 100, message: action.payload.message, discount: action.payload.discount}
        case SAVE_MANAGED_DISCOUNT_FAIL:
            return {loading: false, progress: 0, error: action.payload}
        case SAVE_MANAGED_DISCOUNT_RESET:
            return {}
        default:
            return state
    }
}
const deleteManagedDiscountReducer = (state = {}, action) => {
    switch(action.type) {
        case DELETE_MANAGED_DISCOUNT_REQUEST:
            return {loading: true}
        case DELETE_MANAGED_DISCOUNT_SUCCESS:
            return {loading: false, message: action.payload.message}
        case DELETE_MANAGED_DISCOUNT_FAIL:
            return {loading: false, error: action.payload}
        case DELETE_MANAGED_DISCOUNT_RESET:
            return {}
        default:
            return state
    }
}

const discountRateReducer = (state = {}, action) => {
    switch(action.type) {
        case LIST_DISCOUNT_RATE_REQUEST:
            return {loading: true}
        case LIST_DISCOUNT_RATE_SUCCESS:
            return {loading: false, ratings: action.payload}
        case LIST_DISCOUNT_RATE_FAIL:
            return {loading: false, error: action.payload}
        case SAVE_DISCOUNT_RATE_REQUEST:
            return {...state, loading: true, message: 'refresh', error: null}
        case SAVE_DISCOUNT_RATE_SUCCESS:
            return {loading: false, message: action.payload.message, ratings: action.payload.ratings}
        case SAVE_DISCOUNT_RATE_FAIL:
            return {...state, loading: false, error: action.payload}
        case DELETE_DISCOUNT_RATE_REQUEST:
            return {...state, loading: true, message: 'refresh', error: null}
        case DELETE_DISCOUNT_RATE_SUCCESS:
            return {loading: false, message: action.payload.message, ratings: action.payload.ratings}
        case DELETE_DISCOUNT_RATE_FAIL:
            return {...state, loading: false, error: action.payload}

        default:
            return state
    }
}

const discountCommentReducer = (state = {}, action) => {
    switch(action.type) {
        case LIST_DISCOUNT_COMMENT_REQUEST:
            return {...state, loading: true, error: null}
        case LIST_DISCOUNT_COMMENT_SUCCESS:
            return {loading: false, comments: action.payload}
        case LIST_DISCOUNT_COMMENT_FAIL:
            return {...state, loading: false, error: action.payload}
        case SAVE_DISCOUNT_COMMENT_REQUEST:
            return {...state, loading: true, error: null}
        case SAVE_DISCOUNT_COMMENT_SUCCESS:
            return {loading: false, comments: action.payload}
        case SAVE_DISCOUNT_COMMENT_FAIL:
            return {...state, loading: false, error: action.payload}
        case DELETE_DISCOUNT_COMMENT_REQUEST:
            return {...state, loading: true, error: null}
        case DELETE_DISCOUNT_COMMENT_SUCCESS:
            return {loading: false, comments: action.payload}
        case DELETE_DISCOUNT_COMMENT_FAIL:
            return {...state, loading: false, error: action.payload}
        default:
            return state
    }
}

export {listDiscountsReducer, detailsDiscountReducer, saveManagedDiscountReducer, deleteManagedDiscountReducer, discountRateReducer, discountCommentReducer} 
