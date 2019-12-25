import uuid from './uuid.js'
function createGame () {
  const state = {
    players: {},
    fruits: {},
    screen: { width: 9, height: 9 }
  }
  const observers = []

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

  function setState (newState) {
    Object.assign(state, newState)
  }

  function handlePlayerMovement (command) {
    
    const player = state.players[command.player]
    const movementFunction = movements[command.keyPressed]
    if (movementFunction && state.players[command.player]) {
      movementFunction(player)
      if (checkCollision(player)) {
        state.players[command.player].points += 1
      }
    }
    notifyAll(command)
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
    state.players[playerId] = {
      x: playerX,
      y: playerY,
      points: points
    }
    command = {
      type: 'add-player',
      playerId: playerId,
      playerX: playerX,
      playerY: playerY,
      points: points
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
    //setInterval(addFruit, frequency)
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

  function checkCollision (player) {
    for (const fruitId in state.fruits) {
      const fruit = state.fruits[fruitId]
      if (player.x === fruit.x && player.y === fruit.y) {
        removeFruit({ fruitId: fruitId })
        return true
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
    start
  }
}

export default createGame
