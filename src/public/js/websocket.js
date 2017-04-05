document.addEventListener('DOMContentLoaded', function() {
  var initWebSocket = function() {
    var appStauts = document.querySelector('#app-status');
    var webSocket = new WebSocket('ws://' + location.hostname + ':8000');

    webSocket.onopen = function(event) {
      appStauts.innerText = '';
    };

    webSocket.onclose = function(event) {
      var checkboxes = document.querySelectorAll('input[type="checkbox"]');

      checkboxes.forEach(function(checkbox) {
        checkbox.disabled = 'disabled';
      });

      appStauts.innerText = 'Connecting...';

      setTimeout(initWebSocket, 5000);
    };

    var junkiri = new Junkiri(webSocket);
    webSocket.onmessage = function(event) {
      var message = JSON.parse(event.data);

      switch (message.event) {
        case 'init':
          junkiri.init(message.data);
          break;

        case 'updateSwitch':
          junkiri.updateSwitch(message.data);
          break;

        case 'nodeConnected':
          junkiri.nodeConnected(message.data);
          break;

        case 'nodeDisconnected':
          junkiri.nodeDisconnected(message.data);
          break;
      }
    };
  };

  initWebSocket();
});
