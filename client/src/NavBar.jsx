import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppBar, Box, Button, Container, IconButton, Toolbar, Typography } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import { checkLogin, logout } from './store/loginActions'
import { selectIsLoggedIn, selectUser } from './store/loginSlice'
import LoginView from './views/LoginView'

/** Frame of the application: toolbar, and either the login form or the content (children). */
export default function NavBar({ children }) {
  const dispatch = useDispatch()
  const isLoggedIn = useSelector(selectIsLoggedIn)
  const user = useSelector(selectUser)

  // On start: are we still logged in from an earlier visit? If so, this also opens the WebSocket.
  useEffect(() => {
    dispatch(checkLogin())
  }, [dispatch])

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Vert.x React Base
          </Typography>
          {isLoggedIn ? (
            <>
              <Typography sx={{ mr: 2 }}>{user?.username}</Typography>
              <Button color="inherit" onClick={() => dispatch(logout())}>
                Logout
              </Button>
            </>
          ) : (
            <Typography>not logged in</Typography>
          )}
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 3 }}>
        <Box>{isLoggedIn ? children : <LoginView />}</Box>
      </Container>
    </>
  )
}
