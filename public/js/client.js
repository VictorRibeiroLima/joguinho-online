import createGame from './game.js'
import renderScreen from './renderScreen.js'
import createKeyboardListener from './keyboardListener.js'
import renderScoreBoard from './renderScoreBoard.js'
const screen = document.getElementById('screen')
const div = document.getElementById('score-board')
const game = createGame()
const keyboardListener = createKeyboardListener(document)
const socket = io()
const nick = localStorage.getItem('nick')
socket.on('connect', () => {
  console.log(`logging with id ${socket.id}`)
})
let playerId
socket.on('setup', state => {
  playerId = socket.id
  game.setState(state)
  keyboardListener.subscribe(game.handlePlayerMovement)
  keyboardListener.subscribe(command => {
    socket.emit(command.type, command)
  })
  keyboardListener.registerPlayer(playerId)
  game.changeNick({playerId: playerId, nick:nick})
  socket.emit('change-nick',{playerId: playerId,nick:nick})
  renderScreen(game.state, screen, playerId)
  renderScoreBoard(div, game.state)
})

socket.on('add-player', command => {
  if (command.playerId !== socket.id) {
    console.log('player command', command)
    game.addPlayer(command)
  }
})

socket.on('disconnect', () => {
  keyboardListener.unsubscribeAll()
  keyboardListener.desregisterAll()
})

socket.on('add-fruit', command => {
  game.addFruit(command)
})

socket.on('remove-player', command => {
  game.removePlayer(command)
})

socket.on('move-player', command => {

  if (command.player !== playerId) {
    game.handlePlayerMovement(command)
  }
})

socket.on('change-nick', command=>{
  console.log(`${command.nick} entring the game`)
  if(command.playerId !== playerId){
    game.changeNick(command)
  }
})
