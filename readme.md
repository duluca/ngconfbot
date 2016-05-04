# NgConfBot

- This uses the Tessel Ambient module
- Create a `config.js` file at the root of your project, that looks something like below. Go to http://app.twitter.com to create the tokens below.

```
module.exports = {
  consumer_key: '******',
  consumer_secret: '********',
  access_token_key: '***********',
  access_token_secret: '***********'
}
```

- Run `npm install`
- Then `t2 run index.js`