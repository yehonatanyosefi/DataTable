import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'

export const userService = {
     getUser,
     signup,
     addMove,
     getMoves,
}

const USERS_KEY = 'usersDB'
const gUsers = utilService.loadFromStorage(USERS_KEY) || _createDemoUsers()
let loggedInUser = gUsers[gUsers.length - 1]

async function _saveUser(user) {
     if (!user._id) {
          storageService.post(USERS_KEY, user)
          return user
     }
     storageService.put(USERS_KEY, user)
     return user
}

function _createDemoUsers() {
     const users = [{
          _id: "u101",
          name: "Ochoa Hyde",
          coins: 100,
          moves: []
     }]
     utilService.saveToStorage(USERS_KEY, users)
     return users

}

function getUser() {
     return loggedInUser
}

function getMoves(number, contact = null) {
     let moves = loggedInUser.moves.slice(0, number + 1)
     if (contact) moves.map(move => move.toId === contact._id)
     return moves
}

async function signup(username, password) {
     const oldUser = gUsers.find(gUser => gUser.name === username)
     if (oldUser) return
     const user = {
          name: username,
          coins: 100,
          moves: [],
          username,
          password,
     }
     gUsers.push(user)
     loggedInUser = await _saveUser(user)
}

async function addMove(contact, amount) {
     if (loggedInUser.coins < amount) return loggedInUser
     const move = {
          toId: contact._id,
          to: contact.name,
          at: Date.now(),
          amount
     }
     loggedInUser.moves.unshift(move)
     loggedInUser.coins -= amount
     return await _saveUser(loggedInUser)
}