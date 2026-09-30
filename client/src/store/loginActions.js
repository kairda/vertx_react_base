import { counterChanged } from './counterSlice'
import { loggedIn, loggedOut, loginFailed, selectIsLoggedIn } from './loginSlice'
import { closeConnection, openConnection } from '../server/connection'

/** Fetches JSON from the server; resolves to `null` for error responses or when the server is unreachable. */
async function requestJson(url, options = {}) {
  try {
    const response = await fetch(url, {
      ...options,
      headers: { Accept: 'application/json', ...options.headers },
    })
    return response.ok ? await response.json() : null
  } catch (e) {
    console.warn('Request failed', url, e)
    return null
  }
}

/** Handles messages pushed by the server over the WebSocket. */
function handleServerMessage(dispatch, message) {
  if (typeof message.counter === 'number') {
    dispatch(counterChanged(message.counter))
  } else {
    console.info('Unhandled server message', message)
  }
}

/**
 * All login endpoints answer with `{ isLoggedIn, user?, sessionid? }`.
 * When logged in, the WebSocket is (re)opened with the session id as token.
 */
function applyLoginState(dispatch, loginState) {
  if (loginState?.isLoggedIn) {
    dispatch(loggedIn(loginState.user))
    openConnection(loginState.sessionid, {
      onMessage: (message) => handleServerMessage(dispatch, message),
      // the server closed the socket, e.g. after a logout in another tab: are we still logged in?
      onUnexpectedClose: () => dispatch(checkLogin()),
    })
  } else {
    closeConnection()
    dispatch(loggedOut())
  }
}

/** Checks whether the current session is already logged in (e.g. after a page reload). */
export const checkLogin = () => async (dispatch) => {
  applyLoginState(dispatch, await requestJson('api/isLoggedIn'))
}

export const login = (username, password) => async (dispatch, getState) => {
  if (selectIsLoggedIn(getState())) {
    return
  }
  const loginState = await requestJson('api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  if (loginState?.isLoggedIn) {
    applyLoginState(dispatch, loginState)
  } else {
    dispatch(loginFailed('Login failed – please check username and password.'))
  }
}

export const logout = () => async (dispatch) => {
  closeConnection()
  applyLoginState(dispatch, await requestJson('api/logout'))
}
