import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createStore } from './store'
import { checkLogin, login, logout } from './loginActions'
import { closeConnection, openConnection } from '../server/connection'

vi.mock('../server/connection', () => ({
  openConnection: vi.fn(),
  closeConnection: vi.fn(),
}))

function mockFetch(status, body) {
  globalThis.fetch = vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    json: () => Promise.resolve(body),
  })
}

const kai = { username: 'kai' }

describe('login actions', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('logs in and opens the WebSocket with the session id', async () => {
    mockFetch(200, { isLoggedIn: true, user: kai, sessionid: 'abc' })
    const store = createStore()

    await store.dispatch(login('kai', 'sausages'))

    expect(fetch).toHaveBeenCalledWith('api/login', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ username: 'kai', password: 'sausages' }),
    }))
    expect(store.getState().login).toEqual({ isLoggedIn: true, user: kai, error: null })
    expect(openConnection).toHaveBeenCalledWith('abc', expect.any(Object))
  })

  it('reports a failed login', async () => {
    mockFetch(403, null)
    const store = createStore()

    await store.dispatch(login('kai', 'wrong'))

    expect(store.getState().login.isLoggedIn).toBe(false)
    expect(store.getState().login.error).toMatch(/Login failed/)
    expect(openConnection).not.toHaveBeenCalled()
  })

  it('treats an unreachable server as not logged in', async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'))
    const store = createStore()

    await store.dispatch(checkLogin())

    expect(store.getState().login.isLoggedIn).toBe(false)
  })

  it('updates the counter from WebSocket messages', async () => {
    mockFetch(200, { isLoggedIn: true, user: kai, sessionid: 'abc' })
    const store = createStore()
    await store.dispatch(checkLogin())

    const { onMessage } = openConnection.mock.calls[0][1]
    onMessage({ counter: 7 })
    expect(store.getState().counter.value).toBe(7)
    // 0 is a valid value, too (the old client ignored it)
    onMessage({ counter: 0 })
    expect(store.getState().counter.value).toBe(0)
  })

  it('logs out and closes the WebSocket', async () => {
    mockFetch(200, { isLoggedIn: false })
    const store = createStore({ counter: { value: 3 }, login: { isLoggedIn: true, user: kai, error: null } })

    await store.dispatch(logout())

    expect(store.getState().login.isLoggedIn).toBe(false)
    expect(closeConnection).toHaveBeenCalled()
  })
})
