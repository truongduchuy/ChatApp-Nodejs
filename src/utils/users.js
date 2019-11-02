const users = []

const addUser = ({id, username, room}) =>{
    //Clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //Validate the data
    if(username === '' || room === ''){
        console.log(id, username, room)
        return {error: 'Username and room are required!'}
    }

    //check for existing user 
    const existingUser = users.find(user => user.room === room && user.username === username)

    if(existingUser) {
        return {error : "Username is in use!"}
    }

    const user  =  {id, username, room}
    users.push(user)
    return {user}
}

const removeUser = id => {
    const index = users.findIndex(user => user.id === id)

    if(index !== -1){
        return users.splice(index, 1)[0]
    }
}

const getUser = id => users.find(user => user.id === id)

const getUsersInRoom = room => users.filter(user => user.room === room.trim().toLowerCase())

module.exports = {
    addUser, removeUser, getUser, getUsersInRoom
}