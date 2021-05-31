import {
    REGISTER_USER_REQUEST,
    REGISTER_USER_SUCCESS,
    REGISTER_USER_FAIL,
    SIGNIN_USER_REQUEST,
    SIGNIN_USER_SUCCESS,
    SIGNIN_USER_FAIL,
    FETCH_USER_REQUEST,
    FETCH_USER_SUCCESS,
    FETCH_USER_FAIL,
    UPDATE_USER_REQUEST,
    UPDATE_USER_SUCCESS,
    UPDATE_USER_FAIL,
    UPDATE_USER_RESET,
    DELETE_USER_REQUEST,
    DELETE_USER_SUCCESS,
    DELETE_USER_FAIL,
    LOGOUT_USER,
    LIST_USER_MESSAGE_ERROR_RESET,
    SEND_USER_CONFIRMATION_LINK_REQUEST,
    SEND_USER_CONFIRMATION_LINK_SUCCESS,
    SEND_USER_CONFIRMATION_LINK_FAIL,
    SEND_USER_CONFIRMATION_LINK_RESET,
    CONFIRM_USER_REQUEST,
    CONFIRM_USER_SUCCESS,
    CONFIRM_USER_FAIL,
    SEND_PASSWORD_RESET_LINK_REQUEST,
    SEND_PASSWORD_RESET_LINK_SUCCESS,
    SEND_PASSWORD_RESET_LINK_FAIL,
    SEND_PASSWORD_RESET_LINK_RESET,
    RESET_PASSWORD_REQUEST,
    RESET_PASSWORD_SUCCESS,
    RESET_PASSWORD_FAIL,
    RESET_PASSWORD_RESET,
    LIST_USERS_REQUEST,
    LIST_USERS_SUCCESS,
    LIST_USERS_FAIL,
    LIST_USERS_ERROR_RESET,
    DELETE_MANAGED_USER_REQUEST,
    DELETE_MANAGED_USER_SUCCESS,
    DELETE_MANAGED_USER_FAIL,
    DELETE_MANAGED_USER_ERROR_RESET,
    DELETE_MANAGED_USER_RESET,
    CHANGE_USER_RANK_REQUEST,
    CHANGE_USER_RANK_SUCCESS,
    CHANGE_USER_RANK_FAIL,
    CHANGE_USER_RANK_RESET,
    LIST_USER_DATA_REQUEST,
    LIST_USER_DATA_SUCCESS,
    LIST_USER_DATA_FAIL
} from '../constants/userConstants'

const listUserReducer = (state = {
    userInfo: {}
}, action) => {
    switch(action.type) {
        case REGISTER_USER_REQUEST:
            return {loading: true}
        case REGISTER_USER_SUCCESS:
            return {loading: false, message: action.payload.message}
        case REGISTER_USER_FAIL:
            return {loading: false, error: action.payload}
        case SIGNIN_USER_REQUEST:
            return {loading: true}
        case SIGNIN_USER_SUCCESS:
            return {loading: false, userInfo: action.payload}
        case SIGNIN_USER_FAIL:
            return {loading: false, error: action.payload}
        case FETCH_USER_REQUEST:
            return {...state, loading: true}
        case FETCH_USER_SUCCESS:
            return {...state, loading: false}
        case FETCH_USER_FAIL:
            return {...state, loading: false, error: action.payload}
        case UPDATE_USER_REQUEST:
            return {...state, loading: true}
        case UPDATE_USER_SUCCESS:
            return {
                loading: false, 
                message: action.payload.message,
                userInfo: action.payload.data
            }
        case UPDATE_USER_FAIL:
            return {...state, loading: false, error: action.payload}
        case UPDATE_USER_RESET:
            return {userInfo: {...state.userInfo}}
        case DELETE_USER_REQUEST:
            return {...state, loading: true}
        case DELETE_USER_SUCCESS:
            return {loading: false, message: action.payload.message, userInfo: null}
        case DELETE_USER_FAIL:
            return {...state, loading: false, error: action.payload}
        case LOGOUT_USER:
            return {userInfo: null}
        case LIST_USER_MESSAGE_ERROR_RESET:
            return {...state, message: null, error: null}
        default:
            return state
    }
}

const sendUserConfirmationLinkReducer = (state = {}, action) => {
    switch(action.type) {
        case SEND_USER_CONFIRMATION_LINK_REQUEST:
            return {loading: true}
        case SEND_USER_CONFIRMATION_LINK_SUCCESS:
            return {loading: false, message: action.payload.message}
        case SEND_USER_CONFIRMATION_LINK_FAIL:
            return {loading: false, error: action.payload}
        case SEND_USER_CONFIRMATION_LINK_RESET:
            return {}
        default:
            return state
    }
}
const confirmUserReducer = (state = {}, action) => {
    switch(action.type) {
        case CONFIRM_USER_REQUEST:
            return {loading: true}
        case CONFIRM_USER_SUCCESS:
            return {loading: false, message: action.payload.message}
        case CONFIRM_USER_FAIL:
            return {loading: false, error: action.payload}
        default:
            return state
    }
}
const sendPasswordResetLinkReducer = (state = {}, action) => {
    switch(action.type) {
        case SEND_PASSWORD_RESET_LINK_REQUEST:
            return {loading: true}
        case SEND_PASSWORD_RESET_LINK_SUCCESS:
            return {loading: false, message: action.payload.message}
        case SEND_PASSWORD_RESET_LINK_FAIL:
            return {loading: false, error: action.payload}
        case SEND_PASSWORD_RESET_LINK_RESET:
            return {}
        default:
            return state
    }
}
const resetPasswordReducer = (state = {}, action) => {
    switch(action.type) {
        case RESET_PASSWORD_REQUEST:
            return {loading: true}
        case RESET_PASSWORD_SUCCESS:
            return {loading: false, message: action.payload.message}
        case RESET_PASSWORD_FAIL:
            return {loading: false, error: action.payload}
        case RESET_PASSWORD_RESET:
            return {}
        default:
            return state
    }
}

const listUsersReducer = (state = {}, action) => {
    switch(action.type) {
        case LIST_USERS_REQUEST:
            return {...state, loading: true}
        case LIST_USERS_SUCCESS:
            return {...state, loading: false, users: action.payload.users, parameters: action.payload.parameters}
        case LIST_USERS_FAIL:
            return {...state, loading: false, error: action.payload}
        case LIST_USERS_ERROR_RESET:
            return {...state, error: null}
        default:
            return state
    }
}
const deleteManagedUserReducer = (state = {}, action) => {
    switch(action.type) {
        case DELETE_MANAGED_USER_REQUEST:
            return {loading: true}
        case DELETE_MANAGED_USER_SUCCESS:
            return {loading: false, message: action.payload.message}
        case DELETE_MANAGED_USER_FAIL:
            return {loading: false, error: action.payload}
        case DELETE_MANAGED_USER_ERROR_RESET:
            return {...state, error: null}
        case DELETE_MANAGED_USER_RESET:
            return {}
        default:
            return state
    }
}

const changeUserRankReducer = (state = {}, action) => {
    switch(action.type) {
        case CHANGE_USER_RANK_REQUEST:
            return {loading: true}
        case CHANGE_USER_RANK_SUCCESS:
            return {loading: false, message: action.payload.message}
        case CHANGE_USER_RANK_FAIL:
            return {loading: false, error: action.payload}
        case CHANGE_USER_RANK_RESET:
            return {}
        default:
            return state
    }
}

const listUserDataReducer = (state = {}, action) => {
    switch(action.type) {
        case LIST_USER_DATA_REQUEST:
            return {loading: true}
        case LIST_USER_DATA_SUCCESS:
            return {loading: false, nick: action.payload.nick, isAdmin: action.payload.isAdmin, discounts: action.payload.discounts}
        case LIST_USER_DATA_FAIL:
            return {loading: false, error: action.payload}
        default:
            return state
    }
}

export {listUserReducer, sendUserConfirmationLinkReducer, confirmUserReducer, sendPasswordResetLinkReducer, resetPasswordReducer, listUsersReducer, deleteManagedUserReducer, changeUserRankReducer, listUserDataReducer}
