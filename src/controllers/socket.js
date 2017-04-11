/** @module controllers/socket */
var mosca = require('mosca');
var webSocket = require('ws');
var config = require('../../config');
var utils = require('../utils/common');
var logger = require('../services/logger');
var socket = require('../services/socket');

/**
 * WebSocket connection
 * @memberof controllers/Socket
 * @param  {Object} wsServer WebSocket server
 */
module.exports = function (wsServer) {
  // Crete MQTT Broker
  var mqttBroker = new mosca.Server(config.mqtt.broker);

  logger.info('WebSocket server started');

  /**
   * Broadcast message to all clients connected to WebSocket server
   * @param  {string} message Message to be sent
   */
  wsServer.broadcast = function broadcast(message) {
    wsServer.clients.forEach(function (client) {
      if (client.readyState === webSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    })
  };

  // Set all nodes to dead
  socket.setNodeToDead(function() {
    wsServer.on('connection', function(client) {
      // New WebSocket client connected
      socket.switches(function(switches) {
        logger.info('Client connected');

        // Send switch panel
        client.send(JSON.stringify({
          event: 'init',
          data: switches,
        }));
      });

      // New message received
      client.on('message', function(message) {
        message = JSON.parse(message);

        switch (message.event) {
          // WebSocket client toggled switch
          case 'toggleSwitch':
            publish(message.data.node, message.data.pin, message.data.state_);
            break;
        }
      });

      // WebSocket client disconnected
      client.on('close', function(cleint) {
        logger.info('Client disconnected');
      });
    });

    // Send ping signal to Junkiri nodes every minute
    socket.nodes(function(nodes) {
      var pong = function() {
        setTimeout(function() {
          for (var i in nodes) {
            var node = nodes[i];
            var topic = '/' + node.name + '/ping';

            ping(topic);
            pong();
          }
        }, 60000);
      };
      pong();
    });

    // MQTT broker is ready
    mqttBroker.on('ready', function() {
      logger.info('MQTT broker started');
    });

    // NodeMCU connected
    mqttBroker.on('clientConnected', function(node) {
      logger.info('Node: ' + node.id + ' connected');

      var data = {alive: 1};
      var param = {name: node.id};

      // Update NodeMCU alive state in database
      socket.updateNodeAliveState(param, data, function() {
      });

      // Broadcast NodeMCU connected to all WebSocket clients
      wsServer.broadcast({
        data: {
          node: node.id,
        },
        event: 'nodeConnected'
      });
    });

    // NodeMCU disconnected
    mqttBroker.on('clientDisconnected', function(node) {
      logger.warn('Node: ' + node.id + ' disconnected');

      var data = {alive: 0};
      var param = {name: node.id};

      // Update NodeMCU dead state in database
      socket.updateNodeAliveState(param, data, function() {
      });

      // Broadcast NodeMCU disconnected to all WebSocket clients
      wsServer.broadcast({
        data: {
          node: node.id,
        },
        event: 'nodeDisconnected',
      });
    });

    // Message published to NodeMCU
    mqttBroker.on('published', function(packet, node) {
      logger.info('Message published to node');
    });

    // Send ping message to node
    function ping(topic) {
      var message = {
        qos: 1,
        topic: topic,
        payload: 'ping',
        retain: false,
      };

      // Publish message to NodeMCU
      mqttBroker.publish(message, function() {
      });
    };

    /**
     * Publish message to NodeMCU
     * @param  {string}  node   Node name
     * @param  {string}  pin    Pin number
     * @param  {boolean} state_ Pin state
     */
    function publish(node, pin, state_) {
      var topic = '/' + node + '/pin/';
      topic += (state_) ? 'high' : 'low';

      var message = {
        qos: 1,
        topic: topic,
        payload: pin,
        retain: false,
      };

      // Publish message to NodeMCU
      mqttBroker.publish(message, function() {
      });

      // Broadcast switch new state to all WebSocket clients
      wsServer.broadcast({
        data: {
          pin: pin,
          node: node,
          state_: state_,
        },
        event: 'updateSwitch',
      });

      // Update switch state in database
      socket.updateSwitchState(
        {pin: pin, node: node},
        {state_: state_},
        function() {}
      );

      logger.info('Client toggled switch to ' + topic);
    }
  });

  logger.info('Junkiri daemon started');
};
