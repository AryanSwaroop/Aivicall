class SocketService {

    constructor(io) {
        this.io = io;
        this.idToSocketIdMap = new Map();
        this.SocketIdToIdMap = new Map();
    }

    setup() {
        this.io.on("connection", (socket) => {
            console.log(`socket Connected`, socket.id);

            socket.on("room:join", (data) => {
                const { id, room } = data;
                this.idToSocketIdMap.set(id, socket.id);
                this.SocketIdToIdMap.set(socket.id, id);

                this.io.to(room).emit("user:joined", { id, socketId: socket.id });
                socket.join(room);

                this.io.to(socket.id).emit("room:join", data);
            });

            socket.on("user:call", ({ to, offer }) => {
                this.io.to(to).emit("incoming:call", { from: socket.id, offer });
            });

            socket.on("call:accepted", ({ to, ans }) => {
                this.io.to(to).emit("call:accepted", { from: socket.id, ans });
            });

            socket.on("peer:nego:needed", ({ to, offer }) => {
                console.log("peer:nego:needed", offer);
                this.io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
            });

            socket.on("peer:nego:done", ({ to, ans }) => {
                console.log("peer:nego:done", ans);
                this.io.to(to).emit("peer:nego:final", { from: socket.id, ans });
            });
        });
    }
}

module.exports = SocketService;
