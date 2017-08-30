package server;

import io.vertx.core.*;
import io.vertx.core.http.HttpServer;
import io.vertx.core.http.HttpServerResponse;
import io.vertx.core.json.JsonObject;
import io.vertx.core.logging.Logger;
import io.vertx.core.logging.LoggerFactory;
import io.vertx.ext.auth.AuthProvider;
import io.vertx.ext.auth.User;
import io.vertx.ext.auth.shiro.ShiroAuth;
import io.vertx.ext.auth.shiro.ShiroAuthOptions;
import io.vertx.ext.auth.shiro.ShiroAuthRealmType;
import io.vertx.ext.web.Route;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.RoutingContext;
import io.vertx.ext.web.handler.*;
import io.vertx.ext.web.sstore.LocalSessionStore;
import server.businesslogic.BusinessLogicHandler;
import server.login.LoginLogoutHandler;
import server.websocket.WebSocketHandler;

import java.util.*;


/*
 * @author <a href="mailto:pmlopes@gmail.com">Paulo Lopes</a>
 */
public class Server extends AbstractVerticle {

    static boolean doSetWebRoot = false;

    static Logger logger = LoggerFactory.getLogger(Server.class.getName());




    BusinessLogicHandler businessLogicHandler = null;
    WebSocketHandler webSocketHandler = null;
    LoginLogoutHandler loginLogoutHandler = null;


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



        businessLogicHandler = new BusinessLogicHandler(this);

        webSocketHandler = new WebSocketHandler(this,businessLogicHandler);

        loginLogoutHandler = new LoginLogoutHandler();

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
        router.route("/api/isLoggedIn").handler(loginLogoutHandler.checkIsLoggedInHandler);
        router.route("/api/logout").handler(loginLogoutHandler.logoutHandler);
        router.route("/api/login").handler(loginLogoutHandler.loginHandler(authProvider));

        router.route("/api/*").handler(loginLogoutHandler.isLoggedInHandler);

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
        router.route("/api/counter").handler((RoutingContext request) -> {

            HttpServerResponse response = request.response();
            response.putHeader("Content-Type", "application/json");
            JsonObject jsonObject = businessLogicHandler.increaseCounterAndGetJSonObject();
            response.end(jsonObject.toString());

            webSocketHandler.brodacastMessage(jsonObject.toString());
        });

        // serves the static contnet.
        Route handler = router.route().handler(staticHandler);

        // default port is 8080, can be specified on the command line ....
        int port = config().getInteger("http.port", 8080);

        // this message is called by the Logout-Route to make
        // sure, that all Web-Sockets are closed, if a session is logged out.
        vertx.eventBus().localConsumer("closeSession",(message) -> {

            String sessionId = (String) message.body();
            logger.info("Receiving closeSession from eventBus ; closing websocket .... " +
            sessionId);

            webSocketHandler.closeWebSocketsForSessionId(sessionId);
        });

        // Start the web server and tell it to use the router to handle requests.
        HttpServer listen = vertx.createHttpServer().requestHandler(router::accept).websocketHandler(
                webSocketHandler.webSocketHandler).listen(port);
    }

    public void broadcastMessage(String s) {
        webSocketHandler.brodacastMessage(s);
    }

    public User getUserForSessionId(String sessionId) {
        return loginLogoutHandler.getUserForSessionId(sessionId);
    }
}
