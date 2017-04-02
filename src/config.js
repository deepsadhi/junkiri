module.exports = {
  logger: {
    filename: 'junkiri.log',
  },
  server: {
    port: 8000,
    host: '0.0.0.0',
  },
  mqtt: {
    server: {
      port: 1883,
      host: '0.0.0.0',
    },
  },
  database: {
    filename: 'junkiri.db',
  },
  nodemcu: {
    pins: ['0', '1', '2', '3', '4', '5', '6', '7', '8'],
  },
};
