function createKeyboardListener (document) {
  const state = {
    observers: [],
    playerId: null
  }

  function unsubscribeAll () {
    state.observers = []
  }

  function desregisterAll () {
    state.playerId = null
  }
  function registerPlayer (playerId) {
    state.playerId = playerId
  }
  function subscribe (observerFunction) {
    state.observers.push(observerFunction)
  }

  function notifyAll (command) {
    console.log(`notifying ${state.observers.length}`)
    for (const observerFunction of state.observers) {
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
    registerPlayer,
    unsubscribeAll,
    desregisterAll
  }
}

export default createKeyboardListener
