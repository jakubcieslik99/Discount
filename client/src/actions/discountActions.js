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
import axios from 'axios'

const listDiscountsAction = (category, searchKeyword, sortOrder, page) => async (dispatch) => {
    try {
        dispatch({type: LIST_DISCOUNTS_REQUEST})
        const parameters = {
            category: category,
            searchKeyword: searchKeyword,
            sortOrder: sortOrder,
            page: page,
            count: 0
        }
        const {data} = await axios.get(process.env.REACT_APP_API_URL + '/discounts?category=' + category + '&searchKeyword=' + searchKeyword + '&sortOrder=' + sortOrder + '&page=' + page + '&limit=15')
        parameters.count = parseInt(data.count)
        dispatch({type: LIST_DISCOUNTS_SUCCESS, payload: {discounts: data.discounts, parameters}})
    }
    catch(error) {
        if(error.response.status===500 || error.response.status===429) dispatch({type: LIST_DISCOUNTS_FAIL, payload: 'Błąd serwera'})
        else dispatch({type: LIST_DISCOUNTS_FAIL, payload: error.response.data.message})
    }
}
const listDiscountsErrorReset = () => (dispatch) => {
    dispatch({type: LIST_DISCOUNTS_ERROR_RESET})
}
const detailsDiscountAction = (discountId) => async (dispatch) => {
    try {
        dispatch({type: DETAILS_DISCOUNT_REQUEST})
        const {data} = await axios.get(process.env.REACT_APP_API_URL + '/discounts/' + discountId)
        dispatch({type: DETAILS_DISCOUNT_SUCCESS, payload: data})
    }
    catch(error) {
        if(error.response.status===500 || error.response.status===429) dispatch({type: DETAILS_DISCOUNT_FAIL, payload: 'Błąd serwera'})
        else dispatch({type: DETAILS_DISCOUNT_FAIL, payload: error.response.data.message})
    }
}
const detailsDiscountSuccessReset = () => (dispatch) => {
    dispatch({type: DETAILS_DISCOUNT_SUCCESS_RESET})
}
const detailsDiscountReset = () => (dispatch) => {
    dispatch({type: DETAILS_DISCOUNT_RESET})
}

const saveManagedDiscountAction = (discountData) => async (dispatch, getState) => {
    try {
        dispatch({type: SAVE_MANAGED_DISCOUNT_REQUEST})
        const {listUser: {userInfo}} = getState()

        const parsedDiscountData = new FormData()
        parsedDiscountData.append('title', discountData.title)
        parsedDiscountData.append('price', discountData.price)
        parsedDiscountData.append('prevprice', discountData.prevprice)
        parsedDiscountData.append('store', discountData.store)
        parsedDiscountData.append('freeShipping', discountData.freeShipping)
        parsedDiscountData.append('description', discountData.description)
        parsedDiscountData.append('discountCode', discountData.discountCode)
        parsedDiscountData.append('link', discountData.link)
        parsedDiscountData.append('category', discountData.category)
        discountData.images.forEach(image => parsedDiscountData.append('images', image))
        discountData.files.forEach(file => parsedDiscountData.append('files', file))

        if(!discountData.id) {
            const {data} = await axios.post(process.env.REACT_APP_API_URL + '/discounts/manage', parsedDiscountData, userInfo && {
                onUploadProgress: event => {
                    const {loaded, total} = event
                    const progress = Math.floor((loaded * 100) / total)
                    dispatch({type: SAVE_MANAGED_DISCOUNT_UPLOADING, payload: progress})
                },
                headers: {
                    Authorization: 'Bearer ' + userInfo.token
                }
            })
            dispatch({type: SAVE_MANAGED_DISCOUNT_SUCCESS, payload: data})
        }
        else {
            const {data} = await axios.put(process.env.REACT_APP_API_URL + '/discounts/manage/' + discountData.id, parsedDiscountData, userInfo && {
                onUploadProgress: event => {
                    const {loaded, total} = event
                    const progress = Math.floor((loaded * 100) / total)
                    dispatch({type: SAVE_MANAGED_DISCOUNT_UPLOADING, payload: progress})
                },
                headers: {
                    Authorization: 'Bearer ' + userInfo.token
                }
            })
            dispatch({type: SAVE_MANAGED_DISCOUNT_SUCCESS, payload: data})
        }
    }
    catch(error) {
        if(error.response.status===500 || error.response.status===429) dispatch({type: SAVE_MANAGED_DISCOUNT_FAIL, payload: 'Błąd serwera'})
        else dispatch({type: SAVE_MANAGED_DISCOUNT_FAIL, payload: error.response.data.message})
    }
}
const saveManagedDiscountReset = () => (dispatch) => {
    dispatch({type: SAVE_MANAGED_DISCOUNT_RESET})
}
const deleteManagedDiscountAction = (discountId) => async (dispatch, getState) => {
    try {
        dispatch({type: DELETE_MANAGED_DISCOUNT_REQUEST})
        const {listUser: {userInfo}} = getState()
        const {data} = await axios.delete(process.env.REACT_APP_API_URL + '/discounts/manage/' + discountId, userInfo && {
            headers: {
                Authorization: 'Bearer ' + userInfo.token
            }
        })
        dispatch({type: DELETE_MANAGED_DISCOUNT_SUCCESS, payload: data})
    }
    catch(error) {
        if(error.response.status===500 || error.response.status===429) dispatch({type: DELETE_MANAGED_DISCOUNT_FAIL, payload: 'Błąd serwera'})
        else dispatch({type: DELETE_MANAGED_DISCOUNT_FAIL, payload: error.response.data.message})
    }
}
const deleteManagedDiscountReset = () => (dispatch) => {
    dispatch({type: DELETE_MANAGED_DISCOUNT_RESET})
}

const listDiscountRateAction = (discountId) => async (dispatch) => {
    try {
        dispatch({type: LIST_DISCOUNT_RATE_REQUEST})
        const {data} = await axios.get(process.env.REACT_APP_API_URL + '/discounts/rate/' + discountId)
        dispatch({type: LIST_DISCOUNT_RATE_SUCCESS, payload: data})
    }
    catch(error) {
        if(error.response.status===500 || error.response.status===429) dispatch({type: LIST_DISCOUNT_RATE_FAIL, payload: 'Błąd serwera'})
        else dispatch({type: LIST_DISCOUNT_RATE_FAIL, payload: error.response.data.message})
    }
}
const saveDiscountRateAction = (discountId, discountRating) => async (dispatch, getState) => {
    try {
        dispatch({type: SAVE_DISCOUNT_RATE_REQUEST})
        const {listUser: {userInfo}} = getState()

        const {data} = await axios.post(process.env.REACT_APP_API_URL + '/discounts/rate/' + discountId, {rating: discountRating}, userInfo && {
            headers: {
                Authorization: 'Bearer ' + userInfo.token
            }
        })
        dispatch({type: SAVE_DISCOUNT_RATE_SUCCESS, payload: data})
    }
    catch(error) {
        if(error.response.status===500 || error.response.status===429) dispatch({type: SAVE_DISCOUNT_RATE_FAIL, payload: 'Błąd serwera'})
        else dispatch({type: SAVE_DISCOUNT_RATE_FAIL, payload: error.response.data.message})
    }
}
const deleteDiscountRateAction = (discountId) => async (dispatch, getState) => {
    try {
        dispatch({type: DELETE_DISCOUNT_RATE_REQUEST})
        const {listUser: {userInfo}} = getState()

        const {data} = await axios.delete(process.env.REACT_APP_API_URL + '/discounts/rate/' + discountId, userInfo && {
            headers: {
                Authorization: 'Bearer ' + userInfo.token
            }
        })
        dispatch({type: DELETE_DISCOUNT_RATE_SUCCESS, payload: data})
    }
    catch(error) {
        if(error.response.status===500 || error.response.status===429) dispatch({type: DELETE_DISCOUNT_RATE_FAIL, payload: 'Błąd serwera'})
        else dispatch({type: DELETE_DISCOUNT_RATE_FAIL, payload: error.response.data.message})
    }
}

const listDiscountCommentAction = (discountId) => async (dispatch) => {
    try {
        dispatch({type: LIST_DISCOUNT_COMMENT_REQUEST})
        const {data} = await axios.get(process.env.REACT_APP_API_URL + '/discounts/comment/' + discountId)
        dispatch({type: LIST_DISCOUNT_COMMENT_SUCCESS, payload: data})
    }
    catch(error) {
        if(error.response.status===500 || error.response.status===429) dispatch({type: LIST_DISCOUNT_COMMENT_FAIL, payload: 'Błąd serwera'})
        else dispatch({type: LIST_DISCOUNT_COMMENT_FAIL, payload: error.response.data.message})
    }
}
const saveDiscountCommentAction = (discountId, commentMessage) => async (dispatch, getState) => {
    try {
        dispatch({type: SAVE_DISCOUNT_COMMENT_REQUEST})
        const {listUser: {userInfo}} = getState()

        const {data} = await axios.post(process.env.REACT_APP_API_URL + '/discounts/comment/' + discountId, {message: commentMessage}, userInfo && {
            headers: {
                Authorization: 'Bearer ' + userInfo.token
            }
        })
        dispatch({type: SAVE_DISCOUNT_COMMENT_SUCCESS, payload: data})
    }
    catch(error) {
        if(error.response.status===500 || error.response.status===429) dispatch({type: SAVE_DISCOUNT_COMMENT_FAIL, payload: 'Błąd serwera'})
        else dispatch({type: SAVE_DISCOUNT_COMMENT_FAIL, payload: error.response.data.message})
    }
}
const deleteDiscountCommentAction = (discountId, commentId) => async (dispatch, getState) => {
    try {
        dispatch({type: DELETE_DISCOUNT_COMMENT_REQUEST})
        const {listUser: {userInfo}} = getState()

        const {data} = await axios.delete(process.env.REACT_APP_API_URL + '/discounts/comment/' + discountId + '/' + commentId, userInfo && {
            headers: {
                Authorization: 'Bearer ' + userInfo.token
            }
        })
        dispatch({type: DELETE_DISCOUNT_COMMENT_SUCCESS, payload: data})
    }
    catch(error) {
        if(error.response.status===500 || error.response.status===429) dispatch({type: DELETE_DISCOUNT_COMMENT_FAIL, payload: 'Błąd serwera'})
        else dispatch({type: DELETE_DISCOUNT_COMMENT_FAIL, payload: error.response.data.message})
    }
}

export {listDiscountsAction, listDiscountsErrorReset, detailsDiscountAction, detailsDiscountSuccessReset, detailsDiscountReset, saveManagedDiscountAction, saveManagedDiscountReset, deleteManagedDiscountAction, deleteManagedDiscountReset, listDiscountRateAction, saveDiscountRateAction, deleteDiscountRateAction, listDiscountCommentAction, saveDiscountCommentAction, deleteDiscountCommentAction}
