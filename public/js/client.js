import createGame from './game.js'
import renderScreen from './renderScreen.js'
import createKeyboardListener from './keyboardListener.js'
const screen = document.getElementById('screen')
const game = createGame()
const keyboardListener= createKeyboardListener(document)
const socket = io()
socket.on('connect',() => {
    console.log(`logging with id ${socket.id}`)
})
let playerId
socket.on('setup',(state)=>{
    playerId = socket.id
    game.setState(state)
    keyboardListener.subscribe(game.handlePlayerMovement)
    keyboardListener.subscribe(command =>{
        socket.emit(command.type,command)
    })
    keyboardListener.registerPlayer(playerId)
    renderScreen(game.state, screen, playerId)
})

socket.on('add-player', command =>{
    if(command.playerId !== socket.id){
        console.log('player command', command)
        game.addPlayer(command)
    }
})

socket.on('add-fruit', command => {
    game.addFruit(command)
})

socket.on('remove-player', command =>{
    game.removePlayer(command)
})

socket.on('remove-fruit', command =>{
    game.removeFruit(command)
})

socket.on('move-player', command => {
    if(command.player !== playerId){
        game.handlePlayerMovement(command)
    }
})


