/**
 * The single WebSocket connection to the server (`/ws/counter?token=<session id>`).
 *
 * Kept outside the Redux store on purpose: a socket is not serializable state.
 */

let socket = null

function webSocketUrl(path) {
  const protocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://'
  return protocol + window.location.host + window.location.pathname + path
}

/**
 * Opens the connection, closing a previous one.
 *
 * @param sessionId        the session id, used by the server to authenticate the socket
 * @param onMessage        called with each JSON message from the server
 * @param onUnexpectedClose called when the server closes the socket (e.g. logout in another tab)
 */
export function openConnection(sessionId, { onMessage, onUnexpectedClose }) {
  closeConnection()

  const ws = new WebSocket(webSocketUrl('ws/counter?token=' + encodeURIComponent(sessionId)))
  ws.onopen = () => ws.send(JSON.stringify({ name: 'initConnection', data: 'hello world!' }))
  ws.onmessage = (event) => {
    try {
      onMessage(JSON.parse(event.data))
    } catch (e) {
      console.warn('Ignoring non-JSON WebSocket message', event.data, e)
    }
  }
  ws.onclose = () => {
    if (socket === ws) {
      socket = null
      onUnexpectedClose()
    }
  }
  socket = ws
}

/** Closes the connection without triggering `onUnexpectedClose`. */
export function closeConnection() {
  const ws = socket
  socket = null
  if (ws && ws.readyState !== WebSocket.CLOSED) {
    ws.close()
  }
}

/** Sends a command, e.g. `send('counter')`. Ignored while not connected. */
export function send(name, data) {
  if (socket?.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ name, data }))
  }
}
