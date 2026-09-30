package server.businesslogic

import io.vertx.core.json.JsonObject
import io.vertx.kotlin.core.json.jsonObjectOf
import org.slf4j.LoggerFactory

/**
 * The "business logic" of the demo: a counter shared by all clients.
 *
 * All calls happen on the verticle's event loop, so no synchronisation is needed.
 *
 * @param broadcast sends a message to every connected WebSocket client
 */
class BusinessLogicHandler(private val broadcast: (JsonObject) -> Unit) {

    private val logger = LoggerFactory.getLogger(BusinessLogicHandler::class.java)

    private var counter = 0

    /**
     * Handles a command received via WebSocket.
     *
     * @param reply sends a message back to the WebSocket the command came from
     * @return `true` if the command was understood
     */
    fun handleWebsocketMessage(message: JsonObject, reply: (JsonObject) -> Unit): Boolean =
        when (message.getString("name")) {
            "counter" -> {
                logger.info("Broadcasting increased counter")
                broadcast(increaseCounter())
                true
            }
            "initConnection" -> {
                reply(jsonObjectOf("counter" to counter))
                true
            }
            else -> false
        }

    fun increaseCounter(): JsonObject = jsonObjectOf("counter" to ++counter)
}
