tmr.alarm(0, 1000, 1, function()

  -- Wait for IP
  if wifi.sta.status() == 5 and wifi.sta.getip() ~= nil then
    tmr.stop(0)

    local node
    node = mqtt.Client(NODE_NAME, 60, "", "")
    -- Set up Last Will and Testament
    node:lwt("/lwt", "Oh noes! Plz! I don't wanna die!", 0, 0)

    -- Subscribe topic on connect
    node:on("connect", function(m)
      node:subscribe(PIN_LOW, 0, function (m)
        print("Subscribed to pin low topic")
      end)

      node:subscribe(PIN_HIGH, 0, function (m)
        print("Subscribed to pin high topic")
      end)
    end)

    -- Receive message
    node:on("message", function(m, topic, payload)
      local pin
      pin = tonumber(payload)

      if topic == PIN_LOW then
        gpio.write(pin, gpio.LOW)
      elseif topic == PIN_HIGH then
        gpio.write(pin, gpio.HIGH)
      end
    end)

    node:on("offline", function()
    end)

    -- MQTT client
    node:connect(BROKER_HOST, BROKER_PORT, 0, 1)

  end
end)
