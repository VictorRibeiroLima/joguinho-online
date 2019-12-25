import uuid from './uuid.js'
function createGame () {
  const state = {
    players: {},
    fruits: {},
    screen: { width: 9, height: 9 }
  }
  const observers = []
  
  const servers = []

  let timerId
  const movements = {
    ArrowDown (player) {
      if (player.y < state.screen.width) {
        player.y += 1
      }
    },
    ArrowUp (player) {
      if (player.y > 0) {
        player.y -= 1
      }
    },
    ArrowLeft (player) {
      if (player.x > 0) {
        player.x -= 1
      }
    },
    ArrowRight (player) {
      if (player.x < state.screen.height) {
        player.x += 1
      }
    }
  }

  function notifyAll (command) {
    for (const observerFunction of observers) {
      observerFunction(command)
    }
  }

  function subscribe (observerFunction) {
    observers.push(observerFunction)
  }

  function registerServer (serverFunction) {
    servers.push(serverFunction)
  }

  function notifyServers (command) {
    for (const serverFunction of servers) {
      serverFunction(command)
    }
  }
  function setState (newState) {
    Object.assign(state, newState)
  }

  function handlePlayerMovement (command) {
    
    const player = state.players[command.player]
    const movementFunction = movements[command.keyPressed]
    if (movementFunction && state.players[command.player]) {
      movementFunction(player)
      if (checkCollision(command)) {
        
      }
    }
    notifyAll(command)
  }

  function handlePlayerPoints (command){
    state.players[command.player].points += 1
    if(state.players[command.player].points >= 10){
      command = {
        tyṕe: 'end-game',
        winner: command.player
      }
      notifyServers(command)
    }
  }

  function addPlayer (command) {
    const playerId = command.playerId
    const playerX = command.playerX
      ? command.playerX
      : Math.floor(Math.random() * (state.screen.height + 1))

    const playerY = command.playerY
      ? command.playerY
      : Math.floor(Math.random() * (state.screen.width + 1))

    const points = command.points ? command.points : 0
    const nick = command.nick? command.nick: 'net ruim kkk'
    state.players[playerId] = {
      x: playerX,
      y: playerY,
      points: points,
      nick: nick
    }
    command = {
      type: 'add-player',
      playerId: playerId,
      playerX: playerX,
      playerY: playerY,
      points: points,
      nick: nick
    }
    notifyAll(command)
  }

  function changeNick (command) {
    const playerId = command.playerId
    const nick = command.nick
    state.players[playerId].nick = nick
    command = {
      type: 'change-nick',
      playerId: playerId,
      nick: nick
    }
    notifyAll(command)

  }

  function removePlayer (command) {
    delete state.players[command.playerId]
    notifyAll({
      type: 'remove-player',
      playerId: command.playerId
    })
  }

  function start () {
    const frequency = 5000
    timerId = setInterval(addFruit, frequency)
  }

  function stop () {
    clearInterval(timerId)
  }

  function addFruit (command) {
    let fruitId
    let fruitX
    let fruitY
    if (command) {
      fruitId = [command.fruitId]
      fruitX = command.fruitX
      fruitY = command.fruitY
    } else {
      fruitId = uuid()
      fruitX = Math.floor(Math.random() * (state.screen.height + 1))
      fruitY = Math.floor(Math.random() * (state.screen.width+1))
    }
    state.fruits[fruitId] = {
      x: fruitX,
      y: fruitY
    }
    command = {
      type: 'add-fruit',
      fruitId: fruitId,
      fruitX: fruitX,
      fruitY: fruitY
    }
    notifyAll(command)
  }

  function removeFruit (command) {
    delete state.fruits[command.fruitId]
    notifyAll({
      type: 'remove-fruit',
      playerId: command.fruitId
    })
  }

  function checkCollision (command) {
    for (const fruitId in state.fruits) {
      const fruit = state.fruits[fruitId]
      if (state.players[command.player].x === fruit.x && state.players[command.player].y === fruit.y) {
        removeFruit({ fruitId: fruitId })
        handlePlayerPoints(command)
      }
    }
  }

  return {
    addFruit,
    state,
    addPlayer,
    removePlayer,
    handlePlayerMovement,
    setState,
    subscribe,
    changeNick,
    start,
    registerServer,
    stop
  }
}

export default createGame
