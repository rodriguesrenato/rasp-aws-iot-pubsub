var awsIot = require('aws-iot-device-sdk');
const dotenv = require('dotenv').config();

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
  }


var topic_list = [configs_aws_iot.clientId];
//setup paths to certificates
var device = awsIot.device(configs_aws_iot);

device
    .on('connect', function () {
        console.log('connect');
        for (var i = 0; i < topic_list.length; i++) {
            device.subscribe(topic_list[i]);
            console.log("subscribed to topic: "+topic_list[0])
        }

        // publish a startup log message
        var message = {
            client_id:configs_aws_iot.clientId,
            status:"connected"
        }
        device.publish(topic_list[0], JSON.stringify({
            message
         }));    
    });

device
    .on('message', function (topic, payload) {
        // convert the payload to a JSON object
        var payload = JSON.parse(payload.toString());
        console.log(payload);
    });
device
    .on('close', function () {
        console.log('close');
    });
device
    .on('end', function () {
        console.log('end');
    });
device
    .on('reconnect', function () {
        console.log('reconnect');
    });
device
    .on('offline', function () {
        console.log('offline');
    });
device
    .on('error', function (error) {
        console.log('error', error);
    });