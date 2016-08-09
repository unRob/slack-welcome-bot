'use strict';

var http = require('http');
var https = require('https');

var _require = require('url');

var parse = _require.parse;


var fetchBody = function fetchBody(req, callback) {
  var body = '';
  req.on('data', function (chunk) {
    return body += chunk;
  });
  req.on('end', function () {
    callback(JSON.parse(body));
  });
};

var Slack = {
  outbound: function outbound(url, message) {
    var _parse = parse(url);

    var hostname = _parse.hostname;
    var port = _parse.port;
    var path = _parse.pathname;

    var body = JSON.stringify(message);

    var req = https.request({
      hostname: hostname,
      port: port,
      path: path,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body)
      }
    });

    req.write(body);
    req.end();
    return req;
  }
};

var createServer = function createServer(config) {
  return http.createServer(function (req, res) {
    try {
      fetchBody(req, function (data) {
        switch (data.type) {
          case 'url_verification':
            if (data.token !== config.token) {
              res.statusCode = 401;
              return res.end();
            }
            break;
          case 'team_join':
            var outbound = config.outbound;
            var template = config.template;

            message = template(data.event);
            // console.log(message)
            Slack.outbound(outbound, message);
            return res.end('ok');
            break;
        }
      });
    } catch (err) {
      console.err(err);
      res.statusCode = 500;
      res.end();
    }
  });
};

if (!module.parent) {
  console.log('Reading config from ' + process.argv[2]);

  var path = require('path');
  var config = require(path.resolve(process.env.PWD, process.argv[2]));
  createServer(config).listen(process.env.SLACK_PORT || 3000, function () {
    console.log('Listening...');
  });
}

module.exports = createServer;
