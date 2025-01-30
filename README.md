# what is this?

a tool to get the auth token from a Samsung CAC air conditioner

# how

First find the IP address of your Wifi module and then replace the address below:

```bash
# install node modules
npm install

# build the code
npm run build

# press the auth button on the wifi box and get your access code
npm run fetch 192.168.1.123
```

*NOTE: after pressing the button on the device you have about 10 seconds to run the command*
