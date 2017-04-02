var Junkiri = function(webSocket) {
  var slugify = function(string) {
    return string.toLowerCase()
                 .replace(/[^a-zA-Z0-9]+/g,'-')
                 .replace(/^-+/, '')
                 .replace(/-+$/, '');
  };

  this.init = function(data) {
    var tabTemplate = document.querySelector('#tab');

    var switchPanel = document.querySelector('#switch-panel');
    switchPanel.innerHTML = '';

    var switchCounter = 0;
    for (var floorIndex in data) {
      var floor = data[floorIndex];

      var tab = document.importNode(tabTemplate.content, true);
      tab.id = slugify(floor.name);

      var h5 = tab.querySelector('h5');
      h5.textContent = floor.name;

      var areaActiveFlag = true;
      for(var areaIndex in floor.area) {
        var area = floor.area[areaIndex];

        var ul = tab.querySelector('ul');
        ul.id = slugify(floor.name);

        var liTemplate = document.querySelector('#li');
        var li = document.importNode(liTemplate.content, true)
                         .querySelector('li');

        var a = li.querySelector('a');
        a.text = area.name;
        a.href = '#' + slugify(floor.name + '-' + area.name);

        ul.appendChild(li);

        var tabsContent = tab.querySelector('div div');
        tabsContent.setAttribute('data-tabs-content', slugify(floor.name))

        var tabsPanelTemplate = document.querySelector('#tabs-panel');
        var tabsPanel = document.importNode(tabsPanelTemplate.content, true)
                                .querySelector('div');
        tabsPanel.id = slugify(floor.name + '-' + area.name);

        area.switch.forEach(function(switch_) {
          var switchTemplate = document.querySelector('#switch');
          var switchHolder = document.importNode(switchTemplate.content, true);
          var switchId = slugify(switch_.node + '-p' + switch_.pin) +
                         '-' + switchCounter++;

          var input = switchHolder.querySelector('input');
          input.id = switchId;
          input.setAttribute('data-pin', switch_.pin);
          input.setAttribute('data-node', switch_.node);
          input.addEventListener('change', toggleSwitch);
          input.checked = (switch_.state_ == 1) ? 'checked' : '';
          input.disabled = (switch_.alive == 0) ? 'disabled' : '';

          var span = switchHolder.querySelector('span');
          span.textContent = switch_.name

          var label = switchHolder.querySelector('label');
          label.setAttribute('for', switchId);

          tabsPanel.appendChild(switchHolder);
        });

        if (areaActiveFlag) {
          a.setAttribute('aria-selected', 'true');
          li.className = li.className + ' is-active';
          tabsPanel.className = tabsPanel.className + ' is-active';

          areaActiveFlag = false;
        }

        tabsContent.appendChild(tabsPanel);
      }

      switchPanel.appendChild(tab);
    }

    $(document).foundation();
  };

  this.updateSwitch = function(data) {
    var query = '[data-node="' + data.node + '"][data-pin="' + data.pin + '"]';
    var switches = document.querySelectorAll(query);

    switches.forEach(function(switch_) {
      switch_.checked = data.state_;
    });
  };

  this.nodeConnected = function(data) {
    var query = '[data-node="' + data.node + '"]';
    var switches = document.querySelectorAll(query);

    switches.forEach(function(switch_) {
      switch_.disabled = '';
    });
  };

  this.nodeDisconnected = function(data) {
    var query = '[data-node="' + data.node + '"]';
    var switches = document.querySelectorAll(query);

    switches.forEach(function(switch_) {
      switch_.disabled = 'disabled';
    });
  };

  var toggleSwitch = function(event) {
    webSocket.send(JSON.stringify({
      event: 'toggleSwitch',
      data: {
        state_: event.target.checked,
        pin: event.target.dataset.pin,
        node: event.target.dataset.node
      }
    }));
  };
};
