# rasp-aws-iot-pubsub
A basic mqtt Pub Sub client to send Raspberry Pi status using AWS IoT Core. 

## Installation

Raspberry Pi & Linux:

```
yarn install
```
* Obs: Make sure you have openssl installed
`sudo apt-get install libssl-dev`
* If you want to use voice feature on received messages:
`sudo apt-get install festival festvox-kallpc16k`
## Usage example

Before run the application, configure `.env` file with your AWS IoT variables and credentials paths, then run:
```
yarn pubsub
```
or
```
node src/index.js
```

## License
Distributed under the MIT license. See ``LICENSE`` for more information.

## Contributing
1. Fork it (<https://github.com/rodriguesrenato/rasp-aws-iot-pubsub/fork>)
2. Create your feature branch (`git checkout -b feature/contribuition`)
3. Commit your changes (`git commit -am 'About your contribuitions'`)
4. Push to the branch (`git push origin feature/contribuition`)
5. Create a new Pull Request

