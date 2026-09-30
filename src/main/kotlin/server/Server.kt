package server

import io.vertx.ext.auth.properties.PropertyFileAuthentication
import io.vertx.ext.web.Router
import io.vertx.ext.web.handler.BodyHandler
import io.vertx.ext.web.handler.SessionHandler
import io.vertx.ext.web.handler.StaticHandler
import io.vertx.ext.web.sstore.LocalSessionStore
import io.vertx.kotlin.coroutines.CoroutineRouterSupport
import io.vertx.kotlin.coroutines.CoroutineVerticle
import io.vertx.kotlin.coroutines.coAwait
import org.slf4j.LoggerFactory
import server.businesslogic.BusinessLogicHandler
import server.login.LoginLogoutHandler
import server.websocket.WebSocketHandler

/**
 * The single verticle of the application: REST API for login/logout and the counter,
 * WebSocket endpoint for live counter updates, and static hosting of the React client.
 *
 * Originally based on work by Paulo Lopes.
 */
class Server : CoroutineVerticle(), CoroutineRouterSupport {

    private val logger = LoggerFactory.getLogger(Server::class.java)

    override suspend fun start() {
        val loginLogoutHandler = LoginLogoutHandler()
        lateinit var webSocketHandler: WebSocketHandler
        val businessLogicHandler = BusinessLogicHandler(broadcast = { webSocketHandler.broadcastMessage(it) })
        webSocketHandler = WebSocketHandler(businessLogicHandler, loginLogoutHandler::getUserForSessionId)

        // Simple authentication which reads users/roles from a properties file on the classpath
        val authProvider = PropertyFileAuthentication.create(vertx, "vertx-users.properties")
        val sessionHandler = SessionHandler.create(LocalSessionStore.create(vertx))

        val router = Router.router(vertx)

        // We need request bodies and sessions. Cookies are built into Vert.x Web since 4.0,
        // and the SessionHandler keeps the logged-in user in the session.
        router.route().handler(BodyHandler.create())
        router.route().handler(sessionHandler)

        router.route("/api/isLoggedIn").handler(loginLogoutHandler::checkIsLoggedIn)
        router.route("/api/logout").handler(loginLogoutHandler::logout)
        router.route("/api/login").coHandler { loginLogoutHandler.login(it, authProvider, sessionHandler) }

        // everything else below /api requires a logged-in user
        router.route("/api/*").handler(loginLogoutHandler::requireLogin)

        router.route("/api/counter").handler { ctx ->
            val counter = businessLogicHandler.increaseCounter()
            ctx.json(counter)
            webSocketHandler.broadcastMessage(counter)
        }

        // Static content. In the fat jar it comes from the classpath ("webroot");
        // in development mode straight from the source tree, so a fresh `npm run build` shows up on reload
        // without restarting the server. (For live editing, the Vite dev server is the better option.)
        val staticHandler = if (config.getBoolean("isDevelopment", false)) {
            logger.info("Serving webroot from src/main/resources/webroot (development mode)")
            StaticHandler.create("src/main/resources/webroot")
                .setCachingEnabled(false)
                .setMaxAgeSeconds(1L)
        } else {
            StaticHandler.create()
        }
        router.route().handler(staticHandler)

        // Published by the logout route so that all WebSockets of a logged-out session are closed.
        vertx.eventBus().localConsumer<String>(LoginLogoutHandler.CLOSE_SESSION_ADDRESS) { message ->
            val sessionId = message.body()
            logger.info("Received closeSession from event bus; closing websockets for session {}", sessionId)
            webSocketHandler.closeWebSocketsForSessionId(sessionId)
        }

        val port = config.getInteger("http.port", 8080)
        val httpServer = vertx.createHttpServer()
            .requestHandler(router)
            .webSocketHandshakeHandler(webSocketHandler::handshake)
            .webSocketHandler(webSocketHandler::connected)
            .listen(port)
            .coAwait()

        logger.info("HTTP server listening on port {}", httpServer.actualPort())
    }
}
