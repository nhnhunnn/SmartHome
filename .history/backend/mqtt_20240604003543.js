const mqtt = require('mqtt');
const db = require('./DBConnection');

// Thông tin kết nối tới máy chủ MQTT
const mqttOptions = {
  host: 'localhost',
  port: 1888,
  username: 'nhung',
  password: '12345'
};

// Kết nối tới máy chủ MQTT
const client = mqtt.connect(mqttOptions);
client.setMaxListeners(50);
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
client.on('message', (topic, message) => {
    if (topic === 'esp32/datasensor') {
        const data = JSON.parse(message.toString());
        console.log('Received datasensor:');
        console.log('Luminosity:', data.luminosity);
        console.log('Temperature:', data.temperature);
        console.log('Humidity:', data.humidity);

        const sqlInsert = 'INSERT INTO sensordata (temp, hum, light, time) VALUES (?, ?, ?, NOW())';
        const valuesInsert = [data.temperature, data.humidity, data.luminosity];
    
        db.query(sqlInsert, valuesInsert, (insertErr, insertResult) => {
            if (insertErr) {
                console.error('Error executing insert query:', insertErr);
            }
            console.log('New record added to the database');
        });
    }
});

module.exports = client;