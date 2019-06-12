import * as actionTypes from './actionTypes'
import axios from 'axios'

export const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    }
}

export const authSuccess = (token,userId) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        token: token,
        userId: userId
    }
}

export const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAILED,
        error: error
    }
}

export const logOut = (error) => {
    localStorage.removeItem('token')
    localStorage.removeItem('expirationDate')    
    localStorage.removeItem('userId')   
    return {
        type: actionTypes.AUTH_LOGOUT,
    }
}

export const checkAuthTimeOut = (explarationTime) => {
    return dispatch => {
        setTimeout(() =>{
            dispatch(logOut())
        }, explarationTime * 1000)
    }
}


export const auth = (email, password, isSignUp) => {
    return dispatch =>  {
        dispatch(authStart())
        const authData = {
            email:email,
            password:  password,
            returnSecureToken: true
            
        }
        

        let url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=AIzaSyBEL-D9mR6nvRQnpmqw9yfSityc-jsdsZ0'
        if (!isSignUp)
            url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=AIzaSyBEL-D9mR6nvRQnpmqw9yfSityc-jsdsZ0'
        axios.post(
            url
            , authData)
            .then(response => 
                {
                    const expirationDate = new Date(new Date().getTime() + response.data.expiresIn*1000)
                    localStorage.setItem('token',response.data.idToken)
                    localStorage.setItem('userId',response.data.localId) 
                    localStorage.setItem('expirationDate',expirationDate)
                    dispatch(checkAuthTimeOut(response.data.expiresIn))
                    dispatch(authSuccess(response.data.idToken,response.data.localId))
                }) 
            .catch(error => dispatch(authFail(error.response.data.error)))
        
    }
}
export const setAuthRedirectPath = (path) =>{
    return {
        type: actionTypes.SET_AUTH_REDIRECT_PATH,
        path: path
    }
}

export const authCheckState = () =>{
    return dispatch => {
        const token = localStorage.getItem('token')
        if (!token){
            dispatch(logOut())
        }
        else {
            const expirationDate = new Date(localStorage.getItem('expirationDate'))
            const userId = localStorage.getItem('userId')
            if (expirationDate <= new Date()){
                dispatch(logOut())
            }
            else {
                dispatch(authSuccess(token,userId))
                dispatch(checkAuthTimeOut(
                    (expirationDate.getTime() - new Date().getTime())/1000
                ))
            }
        }
    }
}