function createKeyboardListener (document) {
  const state = {
    observers: [],
    playerId: null
  }

  function registerPlayer (playerId) {
    state.playerId = playerId
  }
  function subscribe (observerFunction) {
    state.observers.push(observerFunction)
  }

  function notifyAll (command) {
    for(const observerFunction of state.observers) {
        observerFunction(command)
    }
  }

  document.addEventListener('keydown', handleKeydown)

  function handleKeydown (event) {
    const command = {
        type: 'move-player',
        player: state.playerId,
        keyPressed: event.key
    }
    notifyAll(command)
  }
  
  return {
      subscribe,
      registerPlayer
  }
}

export default createKeyboardListener
