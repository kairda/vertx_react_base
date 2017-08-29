package server;

import io.vertx.core.*;
import io.vertx.core.buffer.Buffer;
import io.vertx.core.http.HttpServerResponse;
import io.vertx.core.http.ServerWebSocket;
import io.vertx.core.http.WebSocketFrame;
import io.vertx.core.json.JsonObject;
import io.vertx.core.logging.Logger;
import io.vertx.core.logging.LoggerFactory;
import io.vertx.ext.auth.AuthProvider;
import io.vertx.ext.auth.shiro.ShiroAuth;
import io.vertx.ext.auth.shiro.ShiroAuthOptions;
import io.vertx.ext.auth.shiro.ShiroAuthRealmType;
import io.vertx.ext.web.Route;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.handler.*;
import io.vertx.ext.web.sstore.LocalSessionStore;
import server.login.LoginLogoutHandler;

import java.nio.charset.Charset;
import java.util.*;


/*
 * @author <a href="mailto:pmlopes@gmail.com">Paulo Lopes</a>
 */
public class Server extends AbstractVerticle {

    static boolean doSetWebRoot = false;

    static Logger logger = LoggerFactory.getLogger(Server.class.getName());


    static Set<ServerWebSocket> webSocketSet = new HashSet<>();
    static int counter = 0;

    // Convenience method so you can run it in your IDE
    public static void main(String[] args) {


        int port = -1;

        if (args.length >= 1) {
            for (String arg : args) {
                if (arg.startsWith("httpPort=")) {
                    port = Integer.parseInt(arg.substring(9));
                }
                if (arg.startsWith("isDevelopment")) {
                    doSetWebRoot = true;
                }
            }
        }


        DeploymentOptions deploymentOptions = new DeploymentOptions();

        if (port > 0) {
            Map<String, Object> configMap = new HashMap<>();
            configMap.put("http.port", port);
            deploymentOptions.setConfig(new JsonObject(configMap));

        }

        Vertx vertx = Vertx.vertx();

        Server thisServer = new Server();

        vertx.deployVerticle(thisServer, deploymentOptions);

    }

    @Override
    public void start() throws Exception {



        Router router = Router.router(vertx);


        // We need cookies, sessions and request bodies
        router.route().handler(CookieHandler.create());
        router.route().handler(BodyHandler.create());
        router.route().handler(SessionHandler.create(LocalSessionStore.create(vertx)));

        ShiroAuthOptions shiroAuthOptions = new ShiroAuthOptions();
        shiroAuthOptions.setType(ShiroAuthRealmType.PROPERTIES);
        JsonObject config = new JsonObject().put("properties_path", "classpath:vertx-users.properties");
        shiroAuthOptions.setConfig(config);

        // Simple auth service which uses a properties file for user/role info
        AuthProvider authProvider = ShiroAuth.create(vertx, shiroAuthOptions);

        // We need a user session handler too to make sure the user is stored in the session between requests
        router.route().handler(UserSessionHandler.create(authProvider));

        // this shows, if the user is logged in ....
        router.route("/api/isLoggedIn").handler(LoginLogoutHandler.checkIsLoggedInHandler);
        router.route("/api/logout").handler(LoginLogoutHandler.logoutHandler);
        router.route("/api/login").handler(LoginLogoutHandler.loginHandler(authProvider));

        router.route("/api/*").handler(LoginLogoutHandler.isLoggedInHandler);

        // Previously ... Handles the actual login
        // router.route("/loginhandler").handler(FormLoginHandler.create(authProvider));

        // Create a router endpoint for the static content.

        // in the case of a FAT JAR build, we do not need to set the WebRoot ..
        // do this using config from outside!

        StaticHandler staticHandler = StaticHandler.create();
        if (doSetWebRoot) {
            logger.info("Setting webroot for development environment!");
            staticHandler.setWebRoot("src/main/resources/webroot");
            staticHandler.setCachingEnabled(false);
            staticHandler.setMaxAgeSeconds(1L);
        }

        // this is only callable, if the user is logged in ...
        router.route("/api/counter").handler((request) -> {

            HttpServerResponse response = request.response();
            response.putHeader("Content-Type", "application/json");

            JsonObject jsonObject = new JsonObject();
            jsonObject.put("counter", (++counter));
            response.end(jsonObject.toString());
            // sending the increase counter value as a json string.
            // response.end("{\"counter\":" + (++counter) + "}");

            for (ServerWebSocket ws : webSocketSet) {

                logger.info("Writing buffer to Websocket ....");

                ws.writeTextMessage(jsonObject.toString());
                ws.writeBinaryMessage(Buffer.buffer("bincounter " + counter));
                ws.write(Buffer.buffer("My stuff !"));

                ws.writeFrame(WebSocketFrame.binaryFrame(Buffer.buffer("{\"counter\":" + (counter) + "}", "UTF8"), true));
//                ws.writeTextMessage("Hello World from Server!");
//                ws.writeTextMessage("{\"counter\":" + (counter) + "}");
//                ws.write(Buffer.buffer("{\"counter\":" + (counter) + "}"));
            }
            // vertx.eventBus().publish("counter",counter);
        });

        Route handler = router.route().handler(staticHandler);

        int port = config().getInteger("http.port", 8080);

        // Start the web server and tell it to use the router to handle requests.
        vertx.createHttpServer().requestHandler(router::accept).websocketHandler(
                (ServerWebSocket ws) -> {

                    logger.info("Websocket query is " + ws.query());
                    // the query can be checked for a valid token ....

                    MultiMap headers = ws.headers();
                    List<Map.Entry<String, String>> entries = headers.entries();
                    for (Map.Entry<String,String> entry : entries) {
                        logger.info("Header " + entry.getKey() + " has Value " + entry.getValue());
                    }
                    if (ws.path().startsWith("/ws")) {
                        logger.info("Inside WebSocketHandler. path is " + ws.path());
                        webSocketSet.add(ws);
                        ws.handler((Buffer data) -> {
                                logger.info("Inside WebSocketHandler handler. Data is " + data.toString(Charset.forName("UTF8")));

                                JsonObject jsonInputObject = new JsonObject(data);
                                if (jsonInputObject != null && jsonInputObject.getString("name").equals("counter")) {
                                    // then we increase the counter ....


                                    JsonObject jsonObject = new JsonObject();
                                    jsonObject.put("counter", (++counter));

                                    for (ServerWebSocket ws2 : webSocketSet) {


                                        logger.info("Writing buffer to Websocket ....");

                                        ws2.writeTextMessage(jsonObject.toString());
                                        ws2.writeBinaryMessage(Buffer.buffer("bincounter " + counter));
                                        ws2.write(Buffer.buffer("My stuff !"));
                                        ws2.writeFrame(WebSocketFrame.binaryFrame(Buffer.buffer("{\"counter\":" + (counter) + "}", "UTF8"), true));
                                    }
                                    return;

                                }

                                {
                                    JsonObject jsonObject = new JsonObject();
                                    jsonObject.put("message", "Hello World!");
                                    jsonObject.put("counter", counter);
                                    ws.writeTextMessage(jsonObject.toString());
                                }

                        });

                        ws.closeHandler((empty) -> {
                            logger.info("Removing websocket from webSocketSet");
                            webSocketSet.remove(ws);
                        });
                    } else {
                        ws.reject();
                    }

    }).

    listen(port);
}

}
