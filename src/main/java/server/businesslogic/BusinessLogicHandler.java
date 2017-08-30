package server.businesslogic;

import io.vertx.core.http.ServerWebSocket;
import io.vertx.core.http.WebSocket;
import io.vertx.core.json.JsonObject;
import io.vertx.core.logging.Logger;
import io.vertx.core.logging.LoggerFactory;
import server.Server;

import java.util.List;

public class BusinessLogicHandler {

    static Logger logger = LoggerFactory.getLogger(BusinessLogicHandler.class.getName());

    private int counter = 0;

    Server server = null;

    public BusinessLogicHandler(Server server) {
        this.server = server;
    }


    public boolean handleWebsocketMessage(JsonObject message, ServerWebSocket ws) {

        boolean handled = false;
        JsonObject jsonObject = new JsonObject();

        if (message != null) {
            String messageName = message.getString("name");
            if (messageName != null) {
               switch (message.getString("name")) {
                    case "counter":
                        jsonObject.put("counter", (++counter));
                        logger.info("calling server broadcast on increased counter object ...");
                        server.broadcastMessage(jsonObject.toString());
                        handled = true;
                        break;
                    case "initConnection":
                        jsonObject.put("counter", (counter));
                        ws.writeTextMessage(jsonObject.toString());
                        handled = true;
                        break;

                    default:
                        break;
                }
            }
        }
        return handled;

    }

    public JsonObject increaseCounterAndGetJSonObject() {

        JsonObject jsonObject = new JsonObject();
        jsonObject.put("counter", (++counter));

        return jsonObject;

    }
}
