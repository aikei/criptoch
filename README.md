# cryptoch - encrypted chat

This is a simple implementation of an encrypted chat. It uses end-to-end **AES 128** encryption. 

Keys (passwords) are never sent to the server, so the system is immune to man-in-the-middle attacks. This, however, requires that a password be transmitted via a different channel.

**Cryptoch** contains two main modules: a client using jquery-mobile and angularJS and a server using node.js.

Cryptoch also works perfectly on mobile.

# Deployment

I assume you are using a Debian VPS.

## Install Node Js

If you have node.js installed, skip this step. If you don't have node.js installed, I recommend using https://github.com/creationix/nvm to install it:

```bash
wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.31.4/install.sh | bash
```

Then do:
```bash
source ~/.bashrc
```

Then install latest node.js and use it:

```bash
nvm install node
nvm use node
```

Now open .bashrc file in nano:

```bash
nano ~/.bashrc
```

And add this line at the end of this file:

```bash
nvm use node
```

Then use F3 to save and Ctrl+X to leave nano. Now node.js is installed.

## Deploy the client

First of all, clone git repository (If you don't have git installed do `sudo apt-get install git`):

```bash
git clone https://github.com/aikei/cryptoch
```

Then go into the created directory:

```bash
cd cryptoch
```

Now install an `http-server` module globally:

```bash
npm install -g http-server
```

Launch http-server which will serve the client:
```
http-server app
```

## Deploy the server

Install dependencies:
```
cd server
npm install
```

Then launch the server:

```bash
node srv.js
```

## SSL

If you want to use SSL, change **config.js** file in the following way:

- set `SSL` to `true` instead of `false`
- set the `keyPath` string to the path to your key file
- set the `certPath` string to the path to your cert file

SSL, however, is not requiered for security, since chat password is never tramsmitted anyway, and all text is transmitted in encrypted form. This way, you don't need to trust the server.
