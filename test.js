const test = require('tape')
const http = require('http')

const config = require('./config')
const middleware = require('./index')(config)
const PORT = process.env.PORT || 5000

test('Starts server', t => {
  // t.plan(1)
  middleware.listen(PORT, () => {
    t.pass('Server started')
    // console.log(middleware)
    t.end()
  })
})

test('Sends test message', function(t){
  t.plan(1)
  const body = JSON.stringify({
    type: "team_join",
    event: {
      user: {
        name: "rob",
        id: "@rob",
        profile: {
          first_name: "Roberto"
        }
      }
    }
  })

  const req = new http.ClientRequest({
      hostname: '0.0.0.0',
      port: PORT,
      path: '/',
      method: "POST",
      headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(body)
      }
  })
  const res = req.end(body)
  req.on('error', err => {
    console.error(err)
    t.fail(err)
  })

  req.on('response', function(res) {
    console.log(res.statusCode)
    if (res.statusCode !== 200) {
      t.fail(res.statusCode)
    } else {
      t.pass('Status: 200')
    }

    t.end()
  })
  //
})

test('Closes server', t => { middleware.close(); t.pass(); t.end() } )