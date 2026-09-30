import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { createStore } from './store/store'
import { send } from './server/connection'
import App from './App'

vi.mock('./server/connection', () => ({ send: vi.fn() }))

function renderApp(preloadedState) {
  const store = createStore(preloadedState)
  render(
    <Provider store={store}>
      <App />
    </Provider>,
  )
  return store
}

describe('App', () => {
  it('shows the counter from the store in both cards', () => {
    renderApp({ counter: { value: 42 }, login: { isLoggedIn: true, user: null, error: null } })

    expect(screen.getAllByText('Counter is 42')).toHaveLength(2)
  })

  it('asks the server to increase the counter', async () => {
    renderApp({ counter: { value: 0 }, login: { isLoggedIn: true, user: null, error: null } })

    await userEvent.click(screen.getByRole('button', { name: 'Server-Call Counter Increase' }))

    expect(send).toHaveBeenCalledWith('counter')
  })

  it('disables the server call when not logged in', () => {
    renderApp()

    expect(screen.getByRole('button', { name: 'Server-Call Counter Increase' })).toBeDisabled()
  })
})
