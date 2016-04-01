# rooms
Nodejs simple rooms management wrapper for ws socket

## Install

    npm install rooms

## Usage

```js
var rooms = require("rooms");

...
rooms.join(socket);

var room = rooms.find(socket.room);
console.log(JSON.stringify(room));

rooms.leave(socket);
```
