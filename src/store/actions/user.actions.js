import { userService } from "../../services/user.service"
import { SET_USER } from "../reducers/user.reducer"

export function loadUser() {
    return async (dispatch, getState) => {
        try {
            const loggedInUser = await userService.getUser()
            const action = {
                type: SET_USER,
                loggedInUser
            }
            dispatch(action)
        } catch (error) {
            console.error('error:', error)
        }
    }
}

export function signup(username, password) {
    return async (dispatch, getState) => {
        try {
            const user = await userService.signup(username, password)
            const action = {
                type: SET_USER,
                user
            }
            dispatch(action)
        } catch (error) {
            console.error('error:', error)
        }
    }
}

export function spendCoins(contact, amount) {
    return async (dispatch, getState) => {
        try {
            const loggedInUser = await userService.addMove(contact, amount)
            const action = {
                type: SET_USER,
                loggedInUser
            }
            dispatch(action)
        } catch (error) {
            console.error('error:', error)
        }
    }
}