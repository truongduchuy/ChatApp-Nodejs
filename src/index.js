const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage, generateLocationMessage} = require('./utils/messages')
const {addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))


io.on('connection', (socket) =>{
    console.log('New Websocket connection')

    socket.on('join', (options,callback) =>{
        const {error, user} = addUser({id: socket.id, ...options})

        if(error){
            return callback(error)
        }

        socket.join(user.room)

        socket.emit('greeting', generateMessage('Welcome!'));
        socket.broadcast.to(user.room).emit('greeting', generateMessage(`${user.username} has joined!`))

    })


    socket.on('sendMessage', ({message, room}, callback) =>{
        const filter = new Filter()
        
        if(filter.isProfane(message))
            return callback('Profanity is not allowed!')

        io.to(room).emit('greeting', generateMessage(message))
        callback()
    })

    socket.on('disconnect', ()=>{
        const user = removeUser(socket.id)

        if(user)
            io.to(user.room).emit('greeting', generateMessage(`${user.username} has left`))
    })

    socket.on('sendLocation', (coords, callback) => {
        io.emit('locationMessage', generateLocationMessage(`https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })
})

server.listen(port, ()=>{
    console.log(`Server is up on port ${port}!`)
})