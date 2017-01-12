var uuid = require('node-uuid');

var rooms = new Map();

module.exports = {

    find: function(id) {
        return rooms.get(id);
    },

    join: function(socket) {
        join(null, socket);
    },

    join: function(id, socket) {
        if (!id) {
            id = uuid.v1();
        }

        var room = rooms.get(id);

        if (!room) {
            room = {};
            room.id = id;
            room.sockets = new Map;
            rooms.set(id,room);
        }

        room.sockets.set(socket.id,socket);
        socket.room = id;

        if (!room.host) {
            socket.is_host = true;
            room.host = socket.id;
        }
    },

    leave: function(socket) {
        if (socket.room) {
            var room = rooms.get(socket.room);

            if (room) {
                room.sockets.delete(socket.id);

                if (!room.sockets || room.sockets.length == 0) {

                    rooms.delete(socket.room);

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
