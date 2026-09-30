# A most simple web-application with Vert.x, Kotlin and React

- **Server:** Kotlin 2.4 on Vert.x 5 (coroutines via `vertx-lang-kotlin-coroutines`), Java 21 – in `src/main/kotlin`
- **Client:** React 19, Redux Toolkit, Material UI, built with Vite – in `client/`

Log in with user `kai`, password `sausages` (see `src/main/resources/vertx-users.properties`).

## Building and running

Requires JDK 21+, Maven 3.9+ and Node.js 20.19+ / 22.12+ (with npm).

```
mvn clean package
java -jar target/vertxreactbase-2.0.0-SNAPSHOT-fat.jar
```

Open browser and point to [http://localhost:8080](http://localhost:8080)

`mvn package` also builds the client: it runs `npm ci` and `npm run build` in `client/`, which writes
the production bundle to `src/main/resources/webroot` (generated, not in git), from where it goes into the jar.
Use `mvn package -DskipFrontend` to package the server with the client build that is already there.

Command line options of the server:

- `httpPort=<port>` – listen on another port than 8080
- `isDevelopment` – serve the web root directly from `src/main/resources/webroot` without caching

## Development

Start the server (from the IDE: run `server.MainKt`, i.e. `main` in `src/main/kotlin/server/Main.kt`),
then start the Vite dev server:

```
cd client
npm install
npm run dev
```

and open [http://localhost:5173](http://localhost:5173). Vite serves the client with hot module replacement
and forwards `/api` and the WebSocket (`/ws`) to the Vert.x server on port 8080, so edits to the React code
show up immediately without reloading.

Other scripts in `client/`:

| Command | Purpose |
|---------|---------|
| `npm run build` | Production build into `src/main/resources/webroot` |
| `npm test` | Unit tests (Vitest + Testing Library) |
| `npm run lint` | ESLint |

## Structure

### Server (`src/main/kotlin/server`)

| File | Purpose |
|------|---------|
| `Main.kt` | Parses the command line and deploys the verticle |
| `Server.kt` | `CoroutineVerticle`: router, sessions, static files, HTTP/WebSocket server |
| `login/LoginLogoutHandler.kt` | `/api/login`, `/api/logout`, `/api/isLoggedIn` and the login guard for `/api/*` |
| `websocket/WebSocketHandler.kt` | Accepts WebSockets on `/ws/...` for logged-in sessions (`?token=<session id>`), broadcasts |
| `businesslogic/BusinessLogicHandler.kt` | The shared counter |

### Client (`client/src`)

| File | Purpose |
|------|---------|
| `main.jsx` | Entry point: Redux store, Material UI theme |
| `NavBar.jsx` | App bar with login state; shows `LoginView` or the content |
| `App.jsx` | The counter cards |
| `views/LoginView.jsx` | Login form |
| `store/` | Redux Toolkit slices (`counterSlice`, `loginSlice`) and the login/logout thunks (`loginActions`) |
| `server/connection.js` | The WebSocket connection to the server |
