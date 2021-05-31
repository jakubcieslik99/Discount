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
import axios from 'axios'
import Cookie from 'js-cookie'

const registerUserAction = (registerData) => async (dispatch) => {
    try {
        dispatch({type: REGISTER_USER_REQUEST})
        const {data} = await axios.post(process.env.REACT_APP_API_URL + '/users/register', registerData)
        dispatch({type: REGISTER_USER_SUCCESS, payload: data})
    }
    catch(error) {
        if(error.response.status===500 || error.response.status===429) dispatch({type: REGISTER_USER_FAIL, payload: 'Błąd serwera'})
        else dispatch({type: REGISTER_USER_FAIL, payload: error.response.data.message})
    }
}
const signinUserAction = (signinData) => async (dispatch) => {
    try {
        dispatch({type: SIGNIN_USER_REQUEST})
        const {data} = await axios.post(process.env.REACT_APP_API_URL + '/users/signin', signinData)
        Cookie.set('userInfo', JSON.stringify(data))
        dispatch({type: SIGNIN_USER_SUCCESS, payload: data})
    }
    catch(error) {
        if(error.response.status===500 || error.response.status===429) dispatch({type: SIGNIN_USER_FAIL, payload: 'Błąd serwera'})
        else dispatch({type: SIGNIN_USER_FAIL, payload: error.response.data.message})
    }
}
const fetchUserAction = () => async (dispatch, getState) => {
    try {
        dispatch({type: FETCH_USER_REQUEST})
        const {listUser: {userInfo}} = getState()
        await axios.post(process.env.REACT_APP_API_URL + '/users/fetch', null, userInfo && {
            headers: {
                Authorization: 'Bearer ' + userInfo.token
            }
        })
        dispatch({type: FETCH_USER_SUCCESS})
    }
    catch(error) {
        if(error.response.status===500 || error.response.status===429) dispatch({type: FETCH_USER_FAIL, payload: 'Błąd serwera'})
        else dispatch({type: FETCH_USER_FAIL, payload: error.response.data.message})
    }
}
const updateUserAction = (updateData) => async (dispatch, getState) => {
    try {
        dispatch({type: UPDATE_USER_REQUEST})
        const {listUser: {userInfo}} = getState()
        const {data} = await axios.put(process.env.REACT_APP_API_URL + '/users/update', updateData, userInfo && {
            headers: {
                Authorization: 'Bearer ' + userInfo.token
            }
        })
        Cookie.set('userInfo', JSON.stringify(data.data))
        dispatch({type: UPDATE_USER_SUCCESS, payload: data})
    }
    catch(error) {
        if(error.response.status===500 || error.response.status===429) dispatch({type: UPDATE_USER_FAIL, payload: 'Błąd serwera'})
        else dispatch({type: UPDATE_USER_FAIL, payload: error.response.data.message})
    }
}
const updateUserReset = () => (dispatch) => {
    dispatch({type: UPDATE_USER_RESET})
}
const deleteUserAction = () => async (dispatch, getState) => {
    try {
        dispatch({type: DELETE_USER_REQUEST})
        const {listUser: {userInfo}} = getState()
        const {data} = await axios.delete(process.env.REACT_APP_API_URL + '/users/delete', userInfo && {
            headers: {
                Authorization: 'Bearer ' + userInfo.token
            }
        })
        Cookie.remove('userInfo')
        dispatch({type: DELETE_USER_SUCCESS, payload: data})
    }
    catch(error) {
        if(error.response.status===500 || error.response.status===429) dispatch({type: DELETE_USER_FAIL, payload: 'Błąd serwera'})
        else dispatch({type: DELETE_USER_FAIL, payload: error.response.data.message})
    }
}
const logoutUserAction = () => (dispatch) => {
    Cookie.remove('userInfo')
    dispatch({type: LOGOUT_USER})
}
const listUserMessageErrorReset = () => (dispatch) => {
    dispatch({type: LIST_USER_MESSAGE_ERROR_RESET})
}

const sendUserConfirmationLinkAction = (userData) => async (dispatch) => {
    try {
        dispatch({type: SEND_USER_CONFIRMATION_LINK_REQUEST})
        const {data} = await axios.post(process.env.REACT_APP_API_URL + '/users/confirm/link', userData)
        dispatch({type: SEND_USER_CONFIRMATION_LINK_SUCCESS, payload: data})
    }
    catch(error) {
        if(error.response.status===500 || error.response.status===429) dispatch({type: SEND_USER_CONFIRMATION_LINK_FAIL, payload: 'Błąd serwera'})
        else dispatch({type: SEND_USER_CONFIRMATION_LINK_FAIL, payload: error.response.data.message})
    }
}
const sendUserConfirmationLinkReset = () => (dispatch) => {
    dispatch({type: SEND_USER_CONFIRMATION_LINK_RESET})
}
const confirmUserAction = (userData) => async (dispatch) => {
    try {
        if(userData.token!=='null') {
            dispatch({type: CONFIRM_USER_REQUEST})
            const {data} = await axios.post(process.env.REACT_APP_API_URL + '/users/confirm', userData)
            dispatch({type: CONFIRM_USER_SUCCESS, payload: data})
        }
        else dispatch({type: CONFIRM_USER_FAIL, payload: 'Błąd linku weryfikacyjnego'})
    }
    catch(error) {
        if(error.response.status===500 || error.response.status===429) dispatch({type: CONFIRM_USER_FAIL, payload: 'Błąd serwera'})
        else dispatch({type: CONFIRM_USER_FAIL, payload: error.response.data.message})
    }
}

const sendPasswordResetLinkAction = (userData) => async (dispatch) => {
    try {
        dispatch({type: SEND_PASSWORD_RESET_LINK_REQUEST})
        const {data} = await axios.post(process.env.REACT_APP_API_URL + '/users/reset/link', userData)
        dispatch({type: SEND_PASSWORD_RESET_LINK_SUCCESS, payload: data})
    }
    catch(error) {
        if(error.response.status===500 || error.response.status===429) dispatch({type: SEND_PASSWORD_RESET_LINK_FAIL, payload: 'Błąd serwera'})
        else dispatch({type: SEND_PASSWORD_RESET_LINK_FAIL, payload: error.response.data.message})
    }
}
const sendPasswordResetLinkReset = () => (dispatch) => {
    dispatch({type: SEND_PASSWORD_RESET_LINK_RESET})
}
const resetPasswordAction = (userData) => async (dispatch) => {
    try {
        if(userData.token!=='null') {
            dispatch({type: RESET_PASSWORD_REQUEST})
            const {data} = await axios.post(process.env.REACT_APP_API_URL + '/users/reset', userData)
            dispatch({type: RESET_PASSWORD_SUCCESS, payload: data})
        }
        else dispatch({type: RESET_PASSWORD_FAIL, payload: 'Błąd linku resetującego'})
    }
    catch(error) {
        if(error.response.status===500 || error.response.status===429) dispatch({type: RESET_PASSWORD_FAIL, payload: 'Błąd serwera'})
        else dispatch({type: RESET_PASSWORD_FAIL, payload: error.response.data.message})
    }
}
const resetPasswordReset = () => (dispatch) => {
    dispatch({type: RESET_PASSWORD_RESET})
}

const listUsersAction = (searchKeyword, sortOrder, page) => async (dispatch, getState) => {
    try {
        dispatch({type: LIST_USERS_REQUEST})
        const parameters = {
            searchKeyword: searchKeyword,
            sortOrder: sortOrder,
            page: page,
            count: 0
        }
        const {listUser: {userInfo}} = getState()
        const {data} = await axios.get(process.env.REACT_APP_API_URL + '/users/manage?searchKeyword=' + searchKeyword + '&sortOrder=' + sortOrder + '&page=' + page + '&limit=15', userInfo && {
            headers: {
                Authorization: 'Bearer ' + userInfo.token
            }
        })
        parameters.count = parseInt(data.count)
        dispatch({type: LIST_USERS_SUCCESS, payload: {users: data.users, parameters}})
    }
    catch(error) {
        if(error.response.status===500 || error.response.status===429) dispatch({type: LIST_USERS_FAIL, payload: 'Błąd serwera'})
        else dispatch({type: LIST_USERS_FAIL, payload: error.response.data.message})
    }
}
const listUsersErrorReset = () => (dispatch) => {
    dispatch({type: LIST_USERS_ERROR_RESET})
}
const deleteManagedUserAction = (userId) => async (dispatch, getState) => {
    try {
        dispatch({type: DELETE_MANAGED_USER_REQUEST})
        const {listUser: {userInfo}} = getState()
        const {data} = await axios.delete(process.env.REACT_APP_API_URL + '/users/manage/' + userId, userInfo && {
            headers: {
                Authorization: 'Bearer ' + userInfo.token
            }
        })
        dispatch({type: DELETE_MANAGED_USER_SUCCESS, payload: data})
    }
    catch(error) {
        if(error.response.status===500 || error.response.status===429) dispatch({type: DELETE_MANAGED_USER_FAIL, payload: 'Błąd serwera'})
        else dispatch({type: DELETE_MANAGED_USER_FAIL, payload: error.response.data.message})
    }
}
const deleteManagedUserErrorReset = () => (dispatch) => {
    dispatch({type: DELETE_MANAGED_USER_ERROR_RESET})
}
const deleteManagedUserReset = () => (dispatch) => {
    dispatch({type: DELETE_MANAGED_USER_RESET})
}

const changeUserRankAction = (userId) => async (dispatch, getState) => {
    try {
        dispatch({type: CHANGE_USER_RANK_REQUEST})
        const {listUser: {userInfo}} = getState()
        const {data} = await axios.post(process.env.REACT_APP_API_URL + '/users/rank/' + userId, null, userInfo && {
            headers: {
                Authorization: 'Bearer ' + userInfo.token
            }
        })
        dispatch({type: CHANGE_USER_RANK_SUCCESS, payload: data})
    }
    catch(error) {
        if(error.response.status===500 || error.response.status===429) dispatch({type: CHANGE_USER_RANK_FAIL, payload: 'Błąd serwera'})
        else dispatch({type: CHANGE_USER_RANK_FAIL, payload: error.response.data.message})
    }
}
const changeUserRankReset = () => (dispatch) => {
    dispatch({type: CHANGE_USER_RANK_RESET})
}

const listUserDataAction = (userId) => async (dispatch) => {
    try {
        dispatch({type: LIST_USER_DATA_REQUEST})
        const {data} = await axios.get(process.env.REACT_APP_API_URL + '/users/' + userId)
        dispatch({type: LIST_USER_DATA_SUCCESS, payload: data})
    }
    catch(error) {
        if(error.response.status===500 || error.response.status===429) dispatch({type: LIST_USER_DATA_FAIL, payload: 'Błąd serwera'})
        else dispatch({type: LIST_USER_DATA_FAIL, payload: error.response.data.message})
    }
}

export {registerUserAction, signinUserAction, fetchUserAction, updateUserAction, updateUserReset, deleteUserAction, logoutUserAction, listUserMessageErrorReset, sendUserConfirmationLinkAction, sendUserConfirmationLinkReset, confirmUserAction, sendPasswordResetLinkAction, sendPasswordResetLinkReset, resetPasswordAction, resetPasswordReset, listUsersAction, listUsersErrorReset, deleteManagedUserAction, deleteManagedUserErrorReset, deleteManagedUserReset, changeUserRankAction, changeUserRankReset, listUserDataAction}
