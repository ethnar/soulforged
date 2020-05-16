# Soulforged

The source code of the Soulforged game.

To get it going:

Create a file `.credentials/google-auth-config.jsona`

with content in the format of:

```
{
    "clientID": "...",
    "clientSecret": "...",
    "callbackURL": "http://localhost:8443/api/login/callback"
}
```

For this you'll need to create an application in Google developer console: https://console.developers.google.com/

With that read, you can run the server:

```
npm install
node index.js --reset
```

**Note:** once a save is created you should remove `--reset` as this parameter generates a new world:

```
node index.js
```