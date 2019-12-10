import {getCookie, removeCookie, setCookie} from './cookie'
import axios from 'axios'
import {host} from './common'

export const logout = () => {
    removeCookie('TOKEN')
    window.location.href = '/login'
}

export const createAuthApi = async ({url, method, data, params}) => {
    try {
        const token = getCookie('TOKEN')
        const {data: resp} = await axios({
            method,
            url: `${host}${url}`,
            data,
            params,
            headers: {
                'x-access-token': token,
                'Content-Type': 'application/json'
            }
        })
        return resp
    }   
    catch(e) {
        const {response} = e
        const message = response ? response.statusText : e.message || e
        return {
            error: true,
            message
        }
    }
}

export const checkAuth = () => {
    let token = getCookie("TOKEN")
    return token ? true : false
}

export const getUser = async () => {
    let token = getCookie('TOKEN')
    if (token) {
        const resp = await createAuthApi({
            url: '/api/me',
            method: 'GET'
        })
        return resp
    }
    return null
}

export const setUserCookies = (token) => {
    setCookie('TOKEN', token)
}