const http = require('http')
const https = require('https')
const { parse } = require('url')

const fetchBody = function(req, callback) {
  let body = '';
  req.on('data', chunk => body += chunk)
  req.on('end', function () { callback(JSON.parse(body)) })
}

const Slack = {
  outbound(url, message) {
    const { hostname, port, pathname: path } = parse(url)
    const body = JSON.stringify(message)

    const req = https.request({
      hostname,
      port,
      path,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body)
      }
    })

    req.write(body)
    req.end()
    return req
  }
}

const createServer = config => http.createServer(function (req, res) {
  try {
    fetchBody(req, function(data) {
      switch (data.type) {
        case 'url_verification':
          if (data.token !== config.token) {
            res.statusCode = 401
            return res.end()
          }
          break
        case 'team_join':
          const { outbound, template } = config
          message = template(data.event)
          // console.log(message)
          Slack.outbound(outbound, message)
          return res.end('ok')
          break
      }
    })
  } catch (err) {
    console.err(err)
    res.statusCode = 500
    res.end()
  }

})

if (!module.parent) {
  console.log('Reading config from '+process.argv[2])

  const path = require('path')
  const config = require(path.resolve(process.env.PWD, process.argv[2]))
  createServer(config).listen(process.env.SLACK_PORT || 3000, function() {
    console.log('Listening...')
  })
}

module.exports = createServer
