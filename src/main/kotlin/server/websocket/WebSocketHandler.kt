package server.websocket

import io.vertx.core.buffer.Buffer
import io.vertx.core.http.ServerWebSocket
import io.vertx.core.http.ServerWebSocketHandshake
import io.vertx.core.json.DecodeException
import io.vertx.core.json.JsonObject
import io.vertx.ext.auth.User
import io.vertx.kotlin.core.json.jsonObjectOf
import org.slf4j.LoggerFactory
import server.businesslogic.BusinessLogicHandler

/**
 * Manages the WebSocket connections below `/ws`.
 *
 * A client authenticates by passing its session id as `?token=...`; the connection is only
 * accepted if that session belongs to a logged-in user. All sockets of a session are closed on logout.
 */
class WebSocketHandler(
    private val businessLogicHandler: BusinessLogicHandler,
    private val userForSessionId: (String) -> User?,
) {

    private val logger = LoggerFactory.getLogger(WebSocketHandler::class.java)

    private val webSocketsBySessionId = mutableMapOf<String, MutableList<ServerWebSocket>>()

    /** Decides whether an incoming WebSocket upgrade is accepted. */
    fun handshake(handshake: ServerWebSocketHandshake) {
        val sessionId = sessionIdFromQuery(handshake.query())
        when {
            !handshake.path().startsWith("/ws") -> handshake.reject()
            sessionId == null || userForSessionId(sessionId) == null -> {
                logger.warn("Rejecting WebSocket: no logged-in user for session {}", sessionId)
                handshake.reject()
            }
            else -> handshake.accept()
        }
    }

    /** Called for every accepted WebSocket. */
    fun connected(ws: ServerWebSocket) {
        val sessionId = sessionIdFromQuery(ws.query())
        if (sessionId == null) {
            ws.close()
            return
        }
        logger.info("WebSocket connected on {} for session {}", ws.path(), sessionId)

        val sockets = webSocketsBySessionId.getOrPut(sessionId) { mutableListOf() }
        sockets += ws
        logger.info("{} sessions with WebSockets, {} for this session", webSocketsBySessionId.size, sockets.size)

        ws.handler { data -> onMessage(ws, data) }
        ws.closeHandler {
            webSocketsBySessionId[sessionId]?.let {
                it.remove(ws)
                if (it.isEmpty()) webSocketsBySessionId.remove(sessionId)
            }
            logger.info("WebSocket of session {} closed", sessionId)
        }
    }

    fun broadcastMessage(message: JsonObject) {
        val text = message.encode()
        webSocketsBySessionId.values.flatten().forEach { it.writeTextMessage(text) }
    }

    fun closeWebSocketsForSessionId(sessionId: String) {
        // remove first: close() triggers the closeHandler, which must not modify the list we iterate
        val sockets = webSocketsBySessionId.remove(sessionId) ?: return
        logger.info("Closing {} WebSockets of session {}", sockets.size, sessionId)
        sockets.forEach { it.close() }
    }

    private fun onMessage(ws: ServerWebSocket, data: Buffer) {
        val message = try {
            JsonObject(data)
        } catch (e: DecodeException) {
            null
        }
        val handled = message != null &&
            businessLogicHandler.handleWebsocketMessage(message) { reply -> ws.writeTextMessage(reply.encode()) }

        if (!handled) {
            ws.writeTextMessage(jsonObjectOf("message" to "Unknown command").encode())
        }
    }

    private fun sessionIdFromQuery(query: String?): String? =
        query?.split('&')
            ?.firstOrNull { it.startsWith("token=") }
            ?.removePrefix("token=")
            ?.takeIf { it.isNotEmpty() }
}
