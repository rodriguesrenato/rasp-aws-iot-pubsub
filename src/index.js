var awsIot = require('aws-iot-device-sdk');
const dotenv = require('dotenv').config();

// Load device configurations from .env
var configs_robot = {
    robotId: process.env.ROBOT_ID,
    logsTopic: process.env.ROBOT_ID + '/logs',
    statusTopic: process.env.ROBOT_ID + '/status',
}

// Load connection configurations from .env
var configs_aws_iot = {
    accessKeyId: process.env.AWS_IOT_KEY,
    secretAccessKey: process.env.AWS_IOT_SECRET,
    region: process.env.AWS_IOT_REGION,
    keyPath: process.env.AWS_IOT_PRIVATE_KEY_PATH,
    certPath: process.env.AWS_IOT_CERT_PATH,
    caPath: process.env.AWS_IOT_CA_PATH,
    clientId: configs_robot.robotId + "__" + Math.floor(new Date().getTime() / 1000).toString(),
    region: process.env.AWS_IOT_REGION,
    host: process.env.AWS_IOT_ENDPOINT,
    keepalive: parseInt(process.env.AWS_IOT_KEEPALIVE),
    intervalStatus: parseInt(process.env.ROBOT_INTERVAL_STATUS),
    offlineQueueing: true,
    offlineQueueMaxSize: 0,
    drainTimeMs: 250,
    maximumReconnectTimeMs: 10000,
}

var configs_last_will = {
    will: {
        topic: configs_robot.logsTopic,
        payload: {
            client_id: configs_aws_iot.clientId,
            robot_id: configs_robot.robotId,
        },
        qos: 1
    }
}

configs_aws_iot = {
    ...configs_aws_iot,
    configs_last_will
};

var i = 0;
// configure list of topics to be subscribed
var sub_topic_list = [configs_robot.logsTopic, configs_robot.statusTopic];

//setup paths to certificates
var device = awsIot.device(configs_aws_iot);

var statusTimerObj;

device
    .on('connect', function () {
        console.log('>connect');
        for (var i = 0; i < sub_topic_list.length; i++) {
            device.subscribe(sub_topic_list[i]);
            console.log("subscribed to topic: " + sub_topic_list[i])
        }

        // publish a startup log message
        var message = {
            client_id: configs_aws_iot.clientId,
            robot_id: configs_robot.robotId,
            status: "connected"
        }
        device.publish(configs_robot.logsTopic, JSON.stringify({
            message
        }));

        statusTimerObj = setInterval(getSystemParams, configs_aws_iot.intervalStatus);
    });

device
    .on('message', function (topic, payload) {
        console.log('>message');
        var payload = JSON.parse(payload.toString());
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

function getSystemParams() {
    console.log('>>getSystemParams');

    var message = {
        client_id: configs_aws_iot.clientId,
        robot_id: configs_robot.robotId,
        status: "robot_status",
        index: i
    }
    i++;
    device.publish(configs_robot.statusTopic, JSON.stringify({
        message
    }));

}
