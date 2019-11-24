import {getCookie, removeCookie, setCookie, COOKIE_KEY} from './cookie'
import { getSessionStorage, SESSION_KEY} from './session'

export const logout = () => {
    removeCookie(COOKIE_KEY.AVATAR)
    removeCookie(COOKIE_KEY.FULLNAME)
    removeCookie(COOKIE_KEY.USERNAME)
    window.location.href = '/login'
}

export const getUser = () => {
    let user = getCookie(COOKIE_KEY.USERNAME)
    return user ? {
        username: user,
        fullname: getCookie(COOKIE_KEY.FULLNAME),
        avatar: getCookie(COOKIE_KEY.AVATAR)
    } : null
}

export const setUserCookies = (username, fullname, avatar) => {
    setCookie(COOKIE_KEY.USERNAME, username)
    setCookie(COOKIE_KEY.FULLNAME, fullname)
    setCookie(COOKIE_KEY.AVATAR, avatar)
}