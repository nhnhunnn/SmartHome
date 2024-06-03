const mqtt = require('mqtt');

// Thông tin kết nối tới máy chủ MQTT
const mqttOptions = {
  host: 'localhost',
  port: 1888,
  username: 'nhung',
  password: '12345'
};

// Kết nối tới máy chủ MQTT
const client = mqtt.connect(mqttOptions);

const data_sensor = 'esp32/datasensor';
const led_status = 'esp32/ledStatus';
const fan_status = 'esp32/fanStatus';

client.on('connect', () => {
    console.log('Connected to MQTT broker');

    client.subscribe(data_sensor, (err) => {
        if (!err) {
            console.log('Subscribed to data_sensor topic');
        } else {
            console.error('Failed to subscribe to sensor_data topic: ', err);
        }
    });

    client.subscribe(fan_status, (err) => {
        if (!err) {
            console.log('Subscribed to fan_status topic');
        } else {
            console.error('Failed to subscribe to fan_status topic: ', err);
        }
    });

    client.subscribe(led_status, (err) => {
        if (!err) {
            console.log('Subscribed to led_status topic');
        } else {
            console.error('Failed to subscribe to led_status topic: ', err);
        }
    });

});

client.on('error', (err) => {
    console.error('MQTT error: ', err);
});


module.exports = client;