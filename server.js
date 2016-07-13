var Server = function () {
    this.clients = {};
    return this;
};

Server.prototype.addClient = function (socket, simulationIdentifier) {
    if (!this.clients[simulationIdentifier]) {
        this.clients[simulationIdentifier] = [];
    }

    this.clients[simulationIdentifier].push(socket);

    var self = this;
    socket.on('disconnect', function() {
        self.removeClient(socket, simulationIdentifier);
    });

    return this;
};

Server.prototype.removeClient = function (socket, simulationIdentifier) {
    if (this.clients[simulationIdentifier]) {
        var index = this.clients[simulationIdentifier].indexOf(socket);
        if (index != -1) {
            this.clients[simulationIdentifier].splice(index, 1);
        }
    }

    return this;
};

Server.prototype.emit = function (simulationIdentifier, name, data, except) {
    if (this.clients[simulationIdentifier]) {
        for (var index = 0; index < this.clients[simulationIdentifier].length; index++) {
            if (this.clients[simulationIdentifier][index] != except) {
                this.clients[simulationIdentifier][index].emit(name, data);
            }
        }
    }

    return this;
};

module.exports.Server = function() {
    return new Server();
};
