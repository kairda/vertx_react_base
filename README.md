# A most simple web-application with Vert.x, Kotlin and React

Server: Kotlin 2.4 on Vert.x 5 (coroutines via `vertx-lang-kotlin-coroutines`), Java 21.
Client: React/Redux, bundled with webpack into `src/main/resources/webroot/js/bundle.js`.

Log in with user `kai`, password `sausages` (see `src/main/resources/vertx-users.properties`).

## Building and running

Requires JDK 21+ and Maven 3.9+.

```
npm install
npx webpack

mvn clean package

java -jar target/vertxreactbase-2.0.0-SNAPSHOT-fat.jar
```

Open browser and point to [http://localhost:8080](http://localhost:8080)

Command line options:

- `httpPort=<port>` – listen on another port than 8080
- `isDevelopment` – serve the web root directly from `src/main/resources/webroot` without caching

## Running within an IDE

Run webpack in watch mode:

```
npx webpack --watch --progress --colors --source-maps
```

Run `server.MainKt` (the `main` function in `src/main/kotlin/server/Main.kt`) with the program argument

> isDevelopment

(this will prevent the bundle.js file to be cached)

You can edit the Javascript files and bundle.js is automatically rebuilt.
A simple reload in the browser shows the effect immediately.

## Server structure

| File | Purpose |
|------|---------|
| `Main.kt` | Parses the command line and deploys the verticle |
| `Server.kt` | `CoroutineVerticle`: router, sessions, static files, HTTP/WebSocket server |
| `login/LoginLogoutHandler.kt` | `/api/login`, `/api/logout`, `/api/isLoggedIn` and the login guard for `/api/*` |
| `websocket/WebSocketHandler.kt` | Accepts WebSockets on `/ws/...` for logged-in sessions (`?token=<session id>`), broadcasts |
| `businesslogic/BusinessLogicHandler.kt` | The shared counter |
