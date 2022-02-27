const { Server } = require("socket.io");

const io = new Server({ cors: {
        origin: '*',
        methods: ["GET", "POST"]
    } 
});

io.on("connection", (socket) => {
    socket.broadcast.emit("post", {
        id: id,
        payload: msg,
    });
  
    socket.on('put', (id, msg) => {
        socket.broadcast.emit("put", {
            id: id,
            payload: msg,
        });
    })

    socket.on('disconnect', (id, msg) => {
        socket.broadcast.emit("delete", {
            id: id,
            payload: msg,
        });
    })
});

io.listen(3000);