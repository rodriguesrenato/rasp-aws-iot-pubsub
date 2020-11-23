var awsIot = require('aws-iot-device-sdk');
const dotenv = require('dotenv').config();

// Load connection configurations from .env
configs_aws_iot = {
    accessKeyId: process.env.AWS_IOT_KEY,
    secretAccessKey: process.env.AWS_IOT_SECRET,
    region: process.env.AWS_IOT_REGION,
    keyPath: process.env.AWS_IOT_PRIVATE_KEY_PATH,
    certPath: process.env.AWS_IOT_CERT_PATH,
    caPath: process.env.AWS_IOT_CA_PATH,
    clientId: process.env.AWS_IOT_CLIENT_ID,
    region: process.env.AWS_IOT_REGION,
    host: process.env.AWS_IOT_ENDPOINT,
    keepalive: parseInt(process.env.AWS_IOT_KEEPALIVE),
    statusTopic: process.env.ROBOT_STATUS_TOPIC,
    intervalStatus: parseInt(process.env.ROBOT_INTERVAL_STATUS),
}

var i = 0;
// configure list of topics to be subscribed
var sub_topic_list = [configs_aws_iot.clientId+'/logs',configs_aws_iot.clientId+'/status'];

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
            status: "connected"
        }
        device.publish(sub_topic_list[0], JSON.stringify({
            message
        }));

        statusTimerObj = setInterval(getSystemParams, configs_aws_iot.intervalStatus);
    });

device
    .on('message', function (topic, payload) {
        console.log('>message');

        // convert the payload to a JSON object and show on console
        var payload = JSON.parse(payload.toString());
        console.log(payload);
    });
device
    .on('close', function () {
        console.log('>close');
        clearInterval(statusTimerObj);
    });
device
    .on('end', function () {
        console.log('>end');
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
        status: "robot_status",
        index:i
    }
    i++;
    device.publish(configs_aws_iot.clientId+'/status', JSON.stringify({
        message
    }));

}

// setInterval(getSystemParams, configs_aws_iot.intervalStatus);
