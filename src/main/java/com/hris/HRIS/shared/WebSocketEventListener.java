package com.hris.HRIS.shared;

import com.corundumstudio.socketio.SocketIOServer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;

@Component
public class WebSocketEventListener {

    private final SocketIOServer server;

    @Autowired
    public WebSocketEventListener(SocketIOServer server) {
        this.server = server;
    }

    @PostConstruct
    private void startServer() {
        server.addConnectListener(client -> System.out.println("Client connected: " + client.getSessionId()));
        server.addDisconnectListener(client -> System.out.println("Client disconnected: " + client.getSessionId()));
        server.addEventListener("message", String.class, (client, data, ackSender) -> {
            System.out.println("Message received: " + data);
            client.sendEvent("message", data);
        });

        server.start();
    }

    @PreDestroy
    private void stopServer() {
        server.stop();
    }
}

