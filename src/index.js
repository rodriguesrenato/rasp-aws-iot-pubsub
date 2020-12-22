var awsIot = require('aws-iot-device-sdk');
const dotenv = require('dotenv').config();
var wifi = require('node-wifi');

// Initialize node-wifi package on random iface
wifi.init({
    iface: null
});

IsRunningOnRasp = (process.env.ON_RASP == 'true');

if (IsRunningOnRasp) {
    var rpio = require('rpio');
}

// Load device configurations from .env
var configs_rasp = {
    raspId: process.env.RASP_ID,
    logsTopic: process.env.RASP_ID + '/logs',
    systemTopic: process.env.RASP_ID + '/system',
    sensorPin: process.env.RASP_BTN_PIN,
    ledPin: process.env.RASP_LED_PIN,
}

// Load connection configurations from .env
var configs_aws_iot = {
    accessKeyId: process.env.AWS_IOT_KEY,
    secretAccessKey: process.env.AWS_IOT_SECRET,
    region: process.env.AWS_IOT_REGION,
    keyPath: process.env.AWS_IOT_PRIVATE_KEY_PATH,
    certPath: process.env.AWS_IOT_CERT_PATH,
    caPath: process.env.AWS_IOT_CA_PATH,
    clientId: configs_rasp.raspId + "__" + Math.floor(new Date().getTime() / 1000).toString(),
    region: process.env.AWS_IOT_REGION,
    host: process.env.AWS_IOT_ENDPOINT,
    keepalive: parseInt(process.env.AWS_IOT_KEEPALIVE),
    intervalStatus: parseInt(process.env.RASP_INTERVAL_STATUS),
    offlineQueueing: true,
    offlineQueueMaxSize: 0,
    drainTimeMs: 250,
}

var i = 0;

// setup rasp sensor and initalize Led off
if (IsRunningOnRasp) {
    rpio.open(configs_rasp.sensorPin, rpio.INPUT, rpio.PULL_UP);
    rpio.open(configs_rasp.ledPin, rpio.OUTPUT, rpio.LOW);
    rpio.write(configs_rasp.ledPin, rpio.LOW);
}

// configure list of topics to be subscribed
var sub_topic_list = [configs_rasp.logsTopic, configs_rasp.systemTopic];

//setup paths to certificates
var device = awsIot.device(configs_aws_iot);

var statusTimerObj;

var ledStatus = 0;
var sensorStatus = -1;

async function getConnectionInfo() {
    var error;
    var connections;
    error, connections = await wifi.getCurrentConnections();

    return connections[0];
}

async function getSystemParams() {
    console.log('>>getSystemParams');

    // read sensor and add it to the message 
    if (IsRunningOnRasp) {
        sensorStatus = rpio.read(configs_rasp.sensorPin);
    }

    var connection = await getConnectionInfo();

    var message = {
        client_id: configs_aws_iot.clientId,
        rasp_id: configs_rasp.raspId,
        status: "rasp_status",
        index: i,
        sensorStatus: sensorStatus,
        ledStatus: ledStatus,
        wifiSsid: connection['wifi'],
        wifiSignalLevel: connection['signal_level'],
        wifiQuality: connection['quality'],
    }

    // sum up message index
    i++;

    // publish to system topic
    device.publish(configs_rasp.systemTopic, JSON.stringify({
        message
    }), { qos: 1 });
}

async function logStartup() {
    console.log('>>logStartup');

    // read sensor and add it to the message
    if (IsRunningOnRasp) {
        sensorStatus = rpio.read(configs_rasp.sensorPin);
    }

    var connection = await getConnectionInfo();

    var message = {
        client_id: configs_aws_iot.clientId,
        rasp_id: configs_rasp.raspId,
        status: "connected",
        sensorStatus: sensorStatus,
        wifiSsid: connection['wifi'],
        wifiSignalLevel: connection['signal_level'],
        wifiQuality: connection['quality'],
    }

    // publish to log topic
    device.publish(configs_rasp.logsTopic, JSON.stringify({
        message
    }));
}


device
    .on('connect', function () {
        console.log('>connect');
        for (var i = 0; i < sub_topic_list.length; i++) {
            device.subscribe(sub_topic_list[i]);
            console.log("subscribed to topic: " + sub_topic_list[i])
        }

        // publish a startup log message
        logStartup();

        statusTimerObj = setInterval(getSystemParams, configs_aws_iot.intervalStatus);
    });

device
    .on('message', function (topic, payload) {
        console.log('>message');
        var payload = JSON.parse(payload.toString());
        if (payload.hasOwnProperty('switch')) {
            if (IsRunningOnRasp) {
                if (payload.switch) {
                    rpio.write(configs_rasp.ledPin, rpio.HIGH);
                }
                else {
                    rpio.write(configs_rasp.ledPin, rpio.LOW);
                }
            }
            ledStatus = payload.switch;
        }
        console.log(payload);
    });

device
    .on('disconnect', function () {
        console.log('>disconnect');
        clearInterval(statusTimerObj);
    });

device
    .on('close', function () {
        console.log('>close');
        clearInterval(statusTimerObj);
    });

device
    .on('end', function () {
        console.log('>end');
        clearInterval(statusTimerObj);
    });
device
    .on('reconnect', function () {
        console.log('>reconnect');
    });

device
    .on('offline', function () {
        console.log('>offline');
    });

device
    .on('error', function (error) {
        console.log('>error', error);
    });