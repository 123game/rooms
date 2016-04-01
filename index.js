var uuid = require('node-uuid');

var rooms = {};

module.exports = {

  find: function(id) {
    return rooms[id];
  },

  join: function(socket) {
    join(null, socket);
  },

  join: function(id, socket) {
    if (!id) {
      id = uuid.v1();
    }

    var room = rooms[id];

    if (!room) {
      room = {};
      room.id = id;
      room.sockets = {};
      rooms[id] = room;
    }

    room.sockets[socket.id] = socket;
    socket.room = id;

    if (!room.host) {
      socket.is_host = true;
      room.host = socket.id;
    }
  },

  leave: function(socket) {
    if (socket.room) {
      var room = rooms[socket.room];

      if (room) {
        delete room.sockets[socket.id];

        if (!room.sockets || room.sockets.length == 0) {

          delete rooms[socket.room];

        } else if (socket.is_host) {

          var assigned = false;
          for (var s in room.sockets) {
            if (!assigned) {
              s.is_host = true;
              room.host = s.id;
              assigned = true;
            } else {
              s.is_host = false;
            }
          }
        }
      }
      socket.is_host = false;
      delete socket['room'];
    }
  }
};
