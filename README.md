# slack-welcome-bot

## ./config.js

```javascript
module.exports = {
  token: 'SOME_TOKEN',
  outbound: 'SLACK_INBOUND_WEBHOOK_URL',
  template: ({ user }) => ({
    channel: user.id,
    username: 'Welcome-bot',
    icon_url: 'https://s3-us-west-2.amazonaws.com/slack-files2/avatars/2015-05-12/4870580147_ea2e1e558d8f997901d2_88.jpg',
    text: 'Welcome ' + user.profile.first_name,
    attachments: [{
      text: 'Take a look at our CoC: https://github.com/javascriptmx/codigo-de-conducta'    
    }]
  })
}
```


## Usage

### Setup

![By setting up your event subscriptions in slack](https://github.com/unRob/slack-welcome-bot/raw/master/slack-setup.png)


### CLI

```shell
SLACK_PORT=3000 welcome-bot ./config.js
```

### Middleware

```javascript
const WelcomeBot = require('slack-welcome-bot');

app.use('/slack-inbound', WelcomeBot(require('./config.js')))
```
[]: https://api.slack.com/apps/
