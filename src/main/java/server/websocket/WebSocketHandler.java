package server.websocket;

import io.vertx.core.Handler;
import io.vertx.core.buffer.Buffer;
import io.vertx.core.http.ServerWebSocket;
import io.vertx.core.http.WebSocketFrame;
import io.vertx.core.json.JsonObject;
import io.vertx.core.logging.Logger;
import io.vertx.core.logging.LoggerFactory;
import io.vertx.ext.auth.User;
import server.Server;
import server.businesslogic.BusinessLogicHandler;
import server.login.LoginLogoutHandler;

import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class WebSocketHandler {

    static Logger logger = LoggerFactory.getLogger(WebSocketHandler.class.getName());

    private Server server = null;
    private BusinessLogicHandler businessLogicHandler = null;

    private Map<String, List<ServerWebSocket>> sessionIdwebSocketMap = new HashMap<>();


    public WebSocketHandler(Server server, BusinessLogicHandler businessLogicHandler) {
        this.server = server;
        this.businessLogicHandler = businessLogicHandler;
    }


    public Handler<ServerWebSocket> webSocketHandler =
            (ServerWebSocket ws) -> {

                String sessionId = ws.query().substring("token=".length());

                User user = server.getUserForSessionId(sessionId);
                if (user == null) {
                    logger.warn("No user for sessionID " + sessionId);
                    ws.reject();
                    return;
                }
                logger.info("Websocket query is " + ws.query());
                // the query can be checked for a valid token ....

                if (ws.path().startsWith("/ws")) {
                    logger.info("Inside WebSocketHandler. path is " + ws.path());
                    addServerWebSocket(ws, sessionId);

                    ws.handler(getWebSocketReceiveHandler(ws));
                    ws.closeHandler(getWebSocketCloseHandler(ws,sessionId));
                } else {
                    ws.reject();
                }

            };


    public void brodacastMessage(String message) {
        for (List<ServerWebSocket> wsList : sessionIdwebSocketMap.values()) {
            for (ServerWebSocket ws : wsList) {
                logger.info("Writing message to Websocket ....");
                ws.writeTextMessage(message);
            }
        }
    }

    public void closeWebSocketsForSessionId(String sessionId) {

        List<ServerWebSocket> serverWebSockets = sessionIdwebSocketMap.get(sessionId);
        if (serverWebSockets != null) {
            logger.info("number of serverWebSockets for session before closing " + serverWebSockets.size());
            for (ServerWebSocket ws : serverWebSockets) {
                logger.info("Closing websocket from list ....");
                ws.close();
            }
            sessionIdwebSocketMap.remove(sessionId);
        }
    }


    private void addServerWebSocket(ServerWebSocket ws, String sessionId) {
        List<ServerWebSocket> serverWebSockets = sessionIdwebSocketMap.get(sessionId);
        if (serverWebSockets == null) {
            serverWebSockets = new ArrayList<>();
            sessionIdwebSocketMap.put(sessionId, serverWebSockets);
        }
        serverWebSockets.add(ws);

        logger.info("sessionIdWebSocketMap has " + sessionIdwebSocketMap.size() + " entries. Num ServerWebSocks " + serverWebSockets.size());
    }

    private Handler<Buffer> getWebSocketReceiveHandler(ServerWebSocket ws) {
        return (Buffer data) -> {
            logger.info("Inside WebSocketHandler handler. Data is " + data.toString(Charset.forName("UTF8")));

            JsonObject jsonInputObject = new JsonObject(data);
            boolean messageHandled = false;
            if (jsonInputObject != null) {
                messageHandled = businessLogicHandler.handleWebsocketMessage(jsonInputObject, ws);
            }

            if (!messageHandled) {
                JsonObject jsonObject = new JsonObject();
                jsonObject.put("message", "Unknown command");
                ws.writeTextMessage(jsonObject.toString());
            }

        };
    }

    private Handler<Void> getWebSocketCloseHandler(ServerWebSocket ws, String sessionId) {
        return (empty) -> {
            logger.info("ServerWebSocket, closeHandler ... Removing websocket from webSocketSet");
            // then we have to close every websocket for the same session ....

            List<ServerWebSocket> wsList = sessionIdwebSocketMap.get(sessionId);
            if (wsList != null) {
                wsList.remove(ws);
                logger.info("Size of websocketlist after remove " + wsList.size());
            }
        };
    }

}
