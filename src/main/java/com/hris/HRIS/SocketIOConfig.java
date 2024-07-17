package com.hris.HRIS;

import com.corundumstudio.socketio.SocketConfig;
import com.corundumstudio.socketio.SocketIOServer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Value;

@Configuration
public class SocketIOConfig {

    @Value("${socketio.host}")
    private String host;

    @Value("${socketio.port}")
    private Integer port;

    @Bean
    public SocketIOServer socketIOServer() {
        com.corundumstudio.socketio.Configuration socketConfig = new com.corundumstudio.socketio.Configuration();
        socketConfig.setHostname(host);
        socketConfig.setPort(port);

        SocketConfig serverConfig = new SocketConfig();
        serverConfig.setReuseAddress(true);

        socketConfig.setSocketConfig(serverConfig);

        return new SocketIOServer(socketConfig);
    }
}
