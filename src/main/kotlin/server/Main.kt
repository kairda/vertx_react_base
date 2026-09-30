package server

import io.vertx.core.DeploymentOptions
import io.vertx.core.Vertx
import io.vertx.kotlin.core.json.jsonObjectOf
import org.slf4j.LoggerFactory
import kotlin.system.exitProcess

private val logger = LoggerFactory.getLogger("server.Main")

/**
 * Entry point for the fat jar and for running from the IDE.
 *
 * Supported arguments:
 *  - `httpPort=<port>`  listen on another port than 8080
 *  - `isDevelopment`    serve the web root from `src/main/resources/webroot` without caching
 */
fun main(args: Array<String>) {
    val config = jsonObjectOf("isDevelopment" to args.any { it.startsWith("isDevelopment") })
    args.firstOrNull { it.startsWith("httpPort=") }
        ?.removePrefix("httpPort=")
        ?.toInt()
        ?.let { config.put("http.port", it) }

    Vertx.vertx()
        .deployVerticle(Server(), DeploymentOptions().setConfig(config))
        .onSuccess { logger.info("Server verticle deployed") }
        .onFailure {
            logger.error("Could not deploy server verticle", it)
            exitProcess(1)
        }
}
