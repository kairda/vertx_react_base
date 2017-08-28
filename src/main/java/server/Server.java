package server;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.DeploymentOptions;
import io.vertx.core.Vertx;
import io.vertx.core.VertxOptions;
import io.vertx.core.http.HttpServerResponse;
import io.vertx.core.json.JsonObject;
import io.vertx.core.logging.Logger;
import io.vertx.core.logging.LoggerFactory;
import io.vertx.ext.web.Route;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.handler.*;
import io.vertx.ext.web.handler.sockjs.BridgeOptions;
import io.vertx.ext.web.handler.sockjs.PermittedOptions;
import io.vertx.ext.web.handler.sockjs.SockJSHandler;

import java.util.HashMap;
import java.util.Map;

/*
 * @author <a href="mailto:pmlopes@gmail.com">Paulo Lopes</a>
 */
public class Server extends AbstractVerticle {

    static boolean doSetWebRoot = false;

    static Logger logger =  LoggerFactory.getLogger(Server.class.getName());


    static int counter = 0;

    // Convenience method so you can run it in your IDE
    public static void main(String[] args) {



        int port = -1;

        if (args.length >= 1) {
            for (String arg: args) {
               if (arg.startsWith("httpPort=")) {
                   port=Integer.parseInt(arg.substring(9));
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


        router.route("/api/counter").handler( (request) -> {

            HttpServerResponse response = request.response();
            response.putHeader("Content-Type", "application/json");

            response.end("{\"counter\":" + counter++ + "}");
        });

        Route handler = router.route().handler(staticHandler);





        int port = config().getInteger("http.port", 8080);

        // Start the web server and tell it to use the router to handle requests.
        vertx.createHttpServer().requestHandler(router::accept).listen(port);
    }
}
