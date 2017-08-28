package server;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.DeploymentOptions;
import io.vertx.core.Vertx;
import io.vertx.core.VertxOptions;
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
import io.vertx.ext.web.handler.*;
import io.vertx.ext.web.handler.sockjs.BridgeEventType;
import io.vertx.ext.web.handler.sockjs.BridgeOptions;
import io.vertx.ext.web.handler.sockjs.PermittedOptions;
import io.vertx.ext.web.handler.sockjs.SockJSHandler;
import io.vertx.ext.web.sstore.LocalSessionStore;

import java.util.HashMap;
import java.util.Map;

/*
 * @author <a href="mailto:pmlopes@gmail.com">Paulo Lopes</a>
 */
public class Server extends AbstractVerticle {

    static boolean doSetWebRoot = false;

    static Logger logger = LoggerFactory.getLogger(Server.class.getName());


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
        router.route("/api/isLoggedIn").handler((request) -> {
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

        });

        router.route("/api/logout").handler( (request) -> {

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

        });


        router.route("/api/*").handler( (context) -> {
            if (context.user() != null) {
                // then we are logged in ....
                context.next();
            } else {
                context.failure();
            }
        });

        router.route("/eventbus/*").handler(eventBusHandler());

        // router.route("/api/*").handler(RedirectAuthHandler.create(authProvider, "/loginpage.html"));


        // Handles the actual login
        router.route("/loginhandler").handler(FormLoginHandler.create(authProvider));

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

            // sending the increase counter value as a json string.
            response.end("{\"counter\":" + (++counter) + "}");

            vertx.eventBus().publish("counter",counter);
        });

        Route handler = router.route().handler(staticHandler);


        int port = config().getInteger("http.port", 8080);

        // Start the web server and tell it to use the router to handle requests.
        vertx.createHttpServer().requestHandler(router::accept).listen(port);
    }

    private SockJSHandler eventBusHandler() {
        BridgeOptions options = new BridgeOptions()
                .addOutboundPermitted(new PermittedOptions().setAddress("counter"));
        return SockJSHandler.create(vertx).bridge(options, event -> {
            if (event.type() == BridgeEventType.SOCKET_CREATED) {
                logger.info("A socket was created");
            }
            event.complete(true);
        });
    }
}
