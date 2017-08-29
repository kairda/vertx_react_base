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


    public static Map<String,User> sessionIdToUserMap = new HashMap<>();

    public static Handler<RoutingContext> checkIsLoggedInHandler = (request) -> {
        User user = request.user();
        Session session= request.session();

        generateResponse(request.response(),user,session.id());


    };

    private static void generateResponse(HttpServerResponse response, User user, String  sessionId) {

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

    public static Handler<RoutingContext> loginHandler(AuthProvider authProvider) {
        return (context) -> {


            HttpServerRequest req = context.request();

            if (context.user() != null) {

                generateResponse(req.response(),context.user(), context.session().id());
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

                            sessionIdToUserMap.put(session.id(),user);

                            generateResponse(req.response(),user,session.id());

                        } else {
                            context.fail(403);
                        }

                    });


                } else {
                    context.fail(400);
                }


            }
        }
                ;
    }

    public static Handler<RoutingContext> logoutHandler = (request) -> {

        sessionIdToUserMap.remove(request.session().id());
        User user = request.user();
        if (user != null) {
            request.clearUser();
            user = null;
        }

        generateResponse(request.response(),user,null);

    };

    public static Handler<RoutingContext> isLoggedInHandler = (context) -> {
        if (context.user() != null) {
            // then we are logged in ....
            context.next();
        } else {
            context.failure();
        }
    };
}
