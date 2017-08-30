package server.login;

import io.vertx.core.Handler;
import io.vertx.core.MultiMap;
import io.vertx.core.http.HttpMethod;
import io.vertx.core.http.HttpServerRequest;
import io.vertx.core.http.HttpServerResponse;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.auth.AuthProvider;
import io.vertx.ext.auth.User;
import io.vertx.ext.web.RoutingContext;
import io.vertx.ext.web.Session;

import java.util.HashMap;
import java.util.Map;

public class LoginLogoutHandler {


    private Map<String,User> sessionIdToUserMap = new HashMap<>();

    public Handler<RoutingContext> checkIsLoggedInHandler = (request) -> {
        User user = request.user();
        Session session= request.session();
        generateResponse(request.response(),user,session.id());
    };

    public Handler<RoutingContext> loginHandler(AuthProvider authProvider) {
        return (context) -> {
            HttpServerRequest req = context.request();
            if (context.user() != null) {
                // we have a logged in user for the current session ...
                generateResponse(req.response(), context.user(), context.session().id());
                return;
            } else {
                context.failure();
            }
            if (req.method() != HttpMethod.POST) {
                context.fail(405);
            } else {

                JsonObject jsonInputObject = context.getBodyAsJson();

                String username = jsonInputObject.getString("username");
                String password = jsonInputObject.getString("password");

                if (username != null && password != null) {
                    Session session = context.session();
                    JsonObject authInfo = (new JsonObject()).put("username", username).put("password", password);
                    authProvider.authenticate(authInfo, (res) -> {
                        if (res.succeeded()) {
                            User user = (User) res.result();
                            context.setUser(user);
                            if (session != null) {
                                session.regenerateId();
                            }
                            sessionIdToUserMap.put(session.id(), user);

                            generateResponse(req.response(), user, session.id());

                        } else {
                            context.fail(403);
                        }

                    });

                } else {
                    context.fail(400);
                }
            }
        };
    }

    public Handler<RoutingContext> logoutHandler = (request) -> {

        String sessionId = request.session().id();
        // This makes sure, that the session id is no longer valid for connecting to the websocket-part
        sessionIdToUserMap.remove(sessionId);

        User user = request.user();
        if (user != null) {
            request.clearUser();
            user = null;
        }

        // now we have to signal, that all websockets will be closed ....
        request.vertx().eventBus().publish("closeSession",sessionId);

        generateResponse(request.response(),user,null);
    };

    public Handler<RoutingContext> isLoggedInHandler = (context) -> {
        if (context.user() != null) {
            // then we are logged in ....
            context.next();
        } else {
            context.failure();
        }
    };

    public User getUserForSessionId(String sessionId) {
       return sessionIdToUserMap.get(sessionId);
    }


    private void generateResponse(HttpServerResponse response, User user, String  sessionId) {

        response.putHeader("Content-Type", "application/json");

        // sending the increase counter value as a json string.
        JsonObject jsonObject = new JsonObject();
        jsonObject.put("isLoggedIn", user != null);
        if (user != null) {
            jsonObject.put("user", user.principal());
        }
        if (sessionId != null) {
            jsonObject.put("sessionid", sessionId);
        }
        response.end(jsonObject.toString());
    }

}
