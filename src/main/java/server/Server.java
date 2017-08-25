package server;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.DeploymentOptions;
import io.vertx.core.Vertx;
import io.vertx.core.json.JsonObject;
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

  // Convenience method so you can run it in your IDE
  public static void main(String[] args) {


    System.out.println("I have args " + args + " length " + args.length);
    int port = -1;
    if (args != null && args.length == 1) {
      try {
        port = Integer.parseInt(args[0]);
      } catch (NumberFormatException e) {
        // TODO Auto-generated catch block
        e.printStackTrace();
      }

    }

    DeploymentOptions deploymentOptions = new DeploymentOptions();

    if (port > 0) {
      Map<String,Object> configMap = new HashMap<>();
      configMap.put("http.port",port);
      deploymentOptions.setConfig(new JsonObject(configMap));
    }

    Vertx vertx = Vertx.vertx();

    Server thisServer = new Server();

    vertx.deployVerticle(thisServer,deploymentOptions);

  }

  @Override
  public void start() throws Exception {

    Router router = Router.router(vertx);

    // Create a router endpoint for the static content.
    router.route().handler(StaticHandler.create());

    // Start the web server and tell it to use the router to handle requests.
    vertx.createHttpServer().requestHandler(router::accept).listen(8080);
  }
}
