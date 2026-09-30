package server.login

import io.vertx.core.http.HttpMethod
import io.vertx.core.json.DecodeException
import io.vertx.ext.auth.User
import io.vertx.ext.auth.authentication.AuthenticationProvider
import io.vertx.ext.auth.authentication.UsernamePasswordCredentials
import io.vertx.ext.web.RoutingContext
import io.vertx.ext.web.handler.SessionHandler
import io.vertx.kotlin.core.json.jsonObjectOf
import io.vertx.kotlin.coroutines.coAwait
import org.slf4j.LoggerFactory

/**
 * JSON login/logout API used by the React client.
 *
 * Besides the Vert.x session, it remembers which user belongs to which session id,
 * because the client authenticates its WebSocket connection with the session id as token.
 */
class LoginLogoutHandler {

    companion object {
        /** Event bus address on which the id of a logged-out session is published. */
        const val CLOSE_SESSION_ADDRESS = "closeSession"
    }

    private val logger = LoggerFactory.getLogger(LoginLogoutHandler::class.java)

    private val sessionIdToUser = mutableMapOf<String, User>()

    fun getUserForSessionId(sessionId: String): User? = sessionIdToUser[sessionId]

    /** `/api/isLoggedIn`: reports whether the current session has a logged-in user. */
    fun checkIsLoggedIn(ctx: RoutingContext) {
        respond(ctx, ctx.user(), ctx.session()?.id())
    }

    /** `/api/login`: expects a POST with a JSON body `{ "username": ..., "password": ... }`. */
    suspend fun login(ctx: RoutingContext, authProvider: AuthenticationProvider, sessionHandler: SessionHandler) {
        val session = ctx.session()

        ctx.user()?.let { alreadyLoggedIn ->
            respond(ctx, alreadyLoggedIn, session.id())
            return
        }
        if (ctx.request().method() != HttpMethod.POST) {
            ctx.fail(405)
            return
        }

        val body = try {
            ctx.body().asJsonObject()
        } catch (e: DecodeException) {
            null
        }
        val username = body?.getString("username")
        val password = body?.getString("password")
        if (username == null || password == null) {
            ctx.fail(400)
            return
        }

        val user = try {
            authProvider.authenticate(UsernamePasswordCredentials(username, password)).coAwait()
        } catch (e: Exception) {
            logger.info("Login failed for user {}", username)
            ctx.fail(403)
            return
        }

        // New session id after login (protection against session fixation),
        // then bind the user to the session so it survives subsequent requests.
        session.regenerateId()
        sessionHandler.setUser(ctx, user).coAwait()
        sessionIdToUser[session.id()] = user

        respond(ctx, user, session.id())
    }

    /** `/api/logout`: logs the user out and closes all WebSockets of the session. */
    fun logout(ctx: RoutingContext) {
        val sessionId = ctx.session()?.id()
        if (sessionId != null) {
            // the session id is no longer valid for connecting to the WebSocket
            sessionIdToUser.remove(sessionId)
            ctx.vertx().eventBus().publish(CLOSE_SESSION_ADDRESS, sessionId)
        }
        // removes the user and destroys the session
        ctx.userContext().clear()

        respond(ctx, null, null)
    }

    /** Guard for all other `/api` routes. */
    fun requireLogin(ctx: RoutingContext) {
        if (ctx.user() != null) {
            ctx.next()
        } else {
            ctx.fail(401)
        }
    }

    private fun respond(ctx: RoutingContext, user: User?, sessionId: String?) {
        val json = jsonObjectOf("isLoggedIn" to (user != null))
        user?.let { json.put("user", it.principal()) }
        sessionId?.let { json.put("sessionid", it) }
        ctx.json(json)
    }
}
