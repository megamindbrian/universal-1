'use strict';
var Observable = require('rxjs/Observable').Observable;
var automock = require('../imports/automock');
var server = require('socket.io');

var deps = {}, io = {};
var sockifyRequire = function (req, dep) {
    if (typeof deps[dep] !== 'undefined') {
        return deps[dep];
    }
    console.log('Requiring ' + dep);
    deps[dep] = automock.mockValue(req, {
        stubCreator: function (name) {
            // don't call original
            if (name.split('.').length === 1) {
                return req;
            }
            // var orig = req[name.split('.')[1]];
            return function () {
                var args = ['resolve', name];
                for (var i = 0; i < arguments.length; i++) {
                    args[args.length] = arguments[i];
                }
                return new Observable(function () {
                    var handlers = (typeof io.sockets.adapter.rooms[dep] !== 'undefined'
                        ? Object.keys(io.sockets.adapter.rooms[dep].sockets)
                        : [])
                        .map(function (k) {
                            return io.sockets.connected[k];
                        });
                    handlers.forEach(function (h) {
                        h.emit.apply(h, args);
                    });
                });
            };
        },
        name: dep
    });
    console.log(deps);
    return deps[dep];
};

var sockifyServer = function (port) {
    io = server.listen(port);
    var socketlist = [];
    io.sockets.on('connection', function (socket) {
        console.log('Client connection');
        socketlist.push(socket);

        socket.on('result', function (name) {
            console.log('Resulted in ' + name + ' ( ' + JSON.stringify(arguments[1]) + ' ) ');
            var args = ['result', name];
            for (var i = 1; i < arguments.length; i++) {
                args[args.length] = arguments[i];
            }
            var handlers = (typeof io.sockets.adapter.rooms[name] !== 'undefined'
                ? Object.keys(io.sockets.adapter.rooms[name].sockets)
                : [])
                .map(function (k) {
                    return io.sockets.connected[k];
                });
            handlers.forEach(function (h) {
                h.emit.apply(h, args);
            });
        });

        socket.on('call', function (name) {
            var args = [];
            for (var i = 1; i < arguments.length; i++) {
                args[args.length] = arguments[i];
            }
            var props = name.split('.');
            var dep = props[0];
            // join the result room
            if (!io.sockets.adapter.sids[socket.id][name]) {
                socket.join(name);
            }
            console.log(props);
            console.log(dep);
            console.log(deps);
            var func = deps[dep];
            for (var j = 1; j < props.length; j++) {
                func = func[props[j]];
            }
            console.log(name + ' ( ' + JSON.stringify(args[0]) + ' ) in ' + dep);
            var tmpsub;
            tmpsub = func.apply(deps[dep], args).subscribe(function () {
                tmpsub.unsubscribe();
            });
        });

        socket.on('handle', function (dep, cb) {
            console.log('Handler for ' + dep);
            if (!io.sockets.adapter.sids[socket.id][dep]) {
                socket.join(dep);
            }
            cb();
        });

        socket.on('close', function () {
            socketlist.splice(socketlist.indexOf(socket), 1);
            socketlist.forEach(function (socket) {
                socket.destroy();
            });
            io.server.close();
        });
    });
    return io;
};
sockifyServer;

module.exports = {
    sockifyRequire: sockifyRequire,
    sockifyServer: sockifyServer
};


// TODO: output interactive angular component for controlling this server
