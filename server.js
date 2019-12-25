import express from 'express'
import http from 'http'
import createGame from './public/js/game.js'
import socketio from 'socket.io'

const app = express()
const server = http.createServer(app)
const game = createGame()
const sockets = socketio(server)
app.use(express.static('public'))

game.subscribe(command => {
    console.log(`notifying players of the command ${command.type}`)
    sockets.emit(command.type, command)
})

game.registerServer(command => {
    game.stop()
})

sockets.on('connection', (socket) => {
    const playerId = socket.id
    game.addPlayer({playerId:playerId})
    socket.emit('setup',game.state)

    socket.on('disconnect',()=>{
        game.removePlayer({playerId: playerId})
    })

    socket.on('move-player',command=>{
        command.type = 'move-player'
        command.player = playerId
        game.handlePlayerMovement(command)
    })

    socket.on('change-nick',command =>{
        console.log('change nick')
        command.type = 'change-nick'
        command.playerId = playerId
        game.changeNick(command)
    })
})
//game.start()
server.listen (5000,() =>{
    console.log('server started at port 5000')
})