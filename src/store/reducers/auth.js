import * as actionTypes from '../actions/actionTypes'
import { updateObj } from '../utility'
const initialState = {
    token: null,
    userId: null,
    error: null,
    loading: false,
    authRedirectPath: '/'
}


const authStart = (state, action ) =>{
    return updateObj(state, {error: null, loading: true})
}
const authSuccess = (state, action ) =>{
    return updateObj(state, {error: null, loading: false,token: action.token,
        userId: action.userId })
}
const authFail = (state, action ) =>{
    return updateObj(state, {error: action.error, loading: false })
}
const authLogOut = (state, action ) =>{
    return updateObj(state, {token: null, userId: null })
}
const setAuthRedirectPath = (state, action ) =>{
    return updateObj(state, { authRedirectPath: action.path })
}

const reducer = (state = initialState, action ) => {
    switch (action.type){
        case actionTypes.AUTH_START:
            return authStart(state, action)
        case actionTypes.AUTH_SUCCESS:
            return authSuccess(state, action)
        case actionTypes.AUTH_FAILED:
            return authFail(state, action)
        case actionTypes.AUTH_LOGOUT: 
            return authLogOut(state,action)
        case actionTypes.SET_AUTH_REDIRECT_PATH: 
            return setAuthRedirectPath(state,action)
        default: return state    
    }
}
export default reducer