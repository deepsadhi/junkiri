-- Load configuration
dofile("config.lua")
dofile("config.broker.lua")

-- Connect WIFI
dofile("config.wifi.lua")
wifi.setmode(wifi.STATION)
wifi.sta.config(WIFI_SSID, WIFI_PASS)

-- Set all GPIO pins to low
local index, pin
for index = 1, #PINS, 1 do
    pin = PINS[index]
    gpio.mode(pin, gpio.OUTPUT)
    gpio.write(pin, gpio.LOW)
end

-- Initialize MQTT
dofile("main.lua")

