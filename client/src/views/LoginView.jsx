import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Alert, Button, Card, CardActions, CardContent, CardHeader, Stack, TextField } from '@mui/material'
import { login } from '../store/loginActions'
import { selectLoginError } from '../store/loginSlice'

// demo credentials, see src/main/resources/vertx-users.properties
const DEFAULT_USERNAME = 'kai'
const DEFAULT_PASSWORD = 'sausages'

export default function LoginView() {
  const dispatch = useDispatch()
  const error = useSelector(selectLoginError)
  const [username, setUsername] = useState(DEFAULT_USERNAME)
  const [password, setPassword] = useState(DEFAULT_PASSWORD)

  const handleSubmit = (event) => {
    event.preventDefault()
    dispatch(login(username, password))
  }

  const handleCancel = () => {
    setUsername('')
    setPassword('')
  }

  return (
    <Card component="form" onSubmit={handleSubmit} sx={{ maxWidth: 400 }}>
      <CardHeader title="Provide login details" />
      <CardContent>
        <Stack spacing={2}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Username"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Stack>
      </CardContent>
      <CardActions>
        <Button type="submit" variant="contained">
          Login
        </Button>
        <Button color="secondary" onClick={handleCancel}>
          Cancel
        </Button>
      </CardActions>
    </Card>
  )
}
