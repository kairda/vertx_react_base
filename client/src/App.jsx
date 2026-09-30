import { useSelector } from 'react-redux'
import { Button, Card, CardActions, CardContent, CardHeader, Stack, Typography } from '@mui/material'
import { selectCounter } from './store/counterSlice'
import { selectIsLoggedIn } from './store/loginSlice'
import { send } from './server/connection'

function CounterCard({ title, subheader, counter }) {
  return (
    <Card sx={{ minWidth: 260 }}>
      <CardHeader title={title} subheader={subheader} />
      <CardContent>
        <Typography>Counter is {counter}</Typography>
      </CardContent>
      <CardActions>
        {/* the server does not know "action" and answers with "Unknown command" */}
        <Button size="small" onClick={() => send('action')}>
          Action 1
        </Button>
        <Button size="small" color="secondary">
          Action 2
        </Button>
      </CardActions>
    </Card>
  )
}

/** Content shown after login: the shared counter, updated live via WebSocket. */
export default function App() {
  const counter = useSelector(selectCounter)
  const isLoggedIn = useSelector(selectIsLoggedIn)

  return (
    <Stack spacing={3}>
      <Typography variant="h3" component="h1">
        Hello, Material UI!
      </Typography>

      <Stack direction="row" spacing={2} useFlexGap sx={{ flexWrap: 'wrap' }}>
        <CounterCard title="Counter" subheader="Zählt hoch" counter={counter} />
        <CounterCard title="Counter – der gleiche …" subheader="Zählt auch hoch" counter={counter} />
      </Stack>

      <div>
        <Button variant="contained" disabled={!isLoggedIn} onClick={() => send('counter')}>
          Server-Call Counter Increase
        </Button>
      </div>
    </Stack>
  )
}
