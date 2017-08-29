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

public class LoginLogoutHandler {


    public static Handler<RoutingContext> checkIsLoggedInHandler = (request) -> {
        User user = request.user();

        HttpServerResponse response = request.response();
        response.putHeader("Content-Type", "application/json");

        // sending the increase counter value as a json string.
        JsonObject jsonObject = new JsonObject();
        jsonObject.put("isLoggedIn", user != null);
        if (user != null) {
            jsonObject.put("user", user.principal());
        }
        response.end(jsonObject.toString());

    };


    public static Handler<RoutingContext> loginHandler(AuthProvider authProvider) {
        return (context) -> {


            HttpServerRequest req = context.request();

            if (context.user() != null) {

                HttpServerResponse response = req.response();
                response.putHeader("Content-Type", "application/json");

                // sending the increase counter value as a json string.
                JsonObject jsonObject = new JsonObject();
                jsonObject.put("isLoggedIn", context.user() != null);
                if (context.user() != null) {
                    jsonObject.put("user", context.user().principal());
                }
                response.end(jsonObject.toString());
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


                            HttpServerResponse response = req.response();
                            response.putHeader("Content-Type", "application/json");

                            // sending the increase counter value as a json string.
                            JsonObject jsonObject = new JsonObject();
                            jsonObject.put("isLoggedIn", user != null);
                            if (user != null) {
                                jsonObject.put("user", user.principal());
                            }
                            response.end(jsonObject.toString());

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

        User user = request.user();
        if (user != null) {
            request.clearUser();
            user = null;
        }

        HttpServerResponse response = request.response();
        response.putHeader("Content-Type", "application/json");

        // sending the increase counter value as a json string.
        JsonObject jsonObject = new JsonObject();
        jsonObject.put("isLoggedIn", false);
        response.end(jsonObject.toString());

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
