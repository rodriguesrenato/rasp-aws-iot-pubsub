# rasp-aws-iot-pubsub
A basic Pub Sub code to send Raspberry Pi status through AWS IoT Core

# Product Name
> Short blurb about what your product does.

[![Build Status][travis-image]][travis-url]

A basic mqtt pub sub client on AWS IoT Core.

## Installation

Raspberry Pi & Linux:

```
yarn install
```

## Usage example

Before run the application, configure `.env` file with your AWS IoT variables and credentials paths, then run:
```
yarn pubsub
```
or
```
node src/index.js
```

## Meta

Renato Rodrigues – renato.rodrigues.rfr@gmail.com

Distributed under the MIT license. See ``LICENSE`` for more information.

[https://github.com/rodriguesrenato](https://github.com/rodriguesrenato)

## Contributing

1. Fork it (<https://github.com/rodriguesrenato/rasp-aws-iot-pubsub/fork>)
2. Create your feature branch (`git checkout -b feature/contribuition`)
3. Commit your changes (`git commit -am 'About your contribuitions'`)
4. Push to the branch (`git push origin feature/contribuition`)
5. Create a new Pull Request

<!-- Markdown link & img dfn's -->
[npm-image]: https://img.shields.io/npm/v/datadog-metrics.svg?style=flat-square
[npm-url]: https://npmjs.org/package/datadog-metrics
[npm-downloads]: https://img.shields.io/npm/dm/datadog-metrics.svg?style=flat-square
[travis-image]: https://img.shields.io/travis/dbader/node-datadog-metrics/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/dbader/node-datadog-metrics
