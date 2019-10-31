const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))


io.on('connection', (socket) =>{
    console.log('New Websocket connection')

    socket.emit('greeting', 'Welcome!');

    socket.on('sendMessage', message =>{
        io.emit('greeting', message)
    })
})

server.listen(port, ()=>{
    console.log(`Server is up on port ${port}!`)
})