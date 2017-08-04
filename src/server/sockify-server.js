'use strict';
var Observable = require('rxjs/Observable').Observable;
var automock = require('../imports/automock');

var deps = {}, io;
var sockifyRequire = function (req, dep) {
    if (typeof deps[dep] !== 'undefined') {
        return deps[dep];
    }
    console.log('Requiring ' + dep);
    let ctx;
    ctx = automock.mockValue(req, {
        stubCreator: (name) => {
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
                return new Observable(observer => {
                    var handlers = Object.keys(io.sockets.adapter.rooms[dep].sockets)
                        .map(k => io.sockets.connected[k]);
                    handlers.forEach(h => {
                        h.on('result', function (name) {
                            var args2 = [];
                            for (var i = 1; i < arguments.length; i++) {
                                args2[args2.length] = arguments[i];
                            }
                            observer.next.apply(observer, args2);
                        });
                        h.emit.apply(h, args);
                    });
                });
            };
        },
        name: dep
    });
    deps[dep] = ctx;
    return ctx;
}

var sockifyServer = (port) => {
    io = require('socket.io').listen(port);
    var socketlist = [];
    io.sockets.on('connection', function (socket) {
        socketlist.push(socket);
        socket.on('call', function (name) {
            var args = [];
            for (var i = 1; i < arguments.length; i++) {
                args[args.length] = arguments[i];
            }
            var props = name.split('.');
            var dep = props[0];
            socket.join(dep);
            var func = deps[dep];
            for (var j = 1; j < props.length; j++) {
                func = func[props[j]];
            }
            console.log(name + ' ( ' + JSON.stringify(args[0]) + ' ) in ' + dep);
            var callSub;
            callSub = func.apply(deps[dep], args).subscribe(function () {
                console.log('Resulted in ' + name + ' ( ' + JSON.stringify(arguments[0]) + ' ) ');
                var args2 = ['result', name];
                for (var i = 0; i < arguments.length; i++) {
                    args2[args2.length] = arguments[i];
                }
                socket.emit.apply(socket, args2);
                callSub.unsubscribe();
            });
        });
        socket.on('handle', function (dep) {
            socket.join(dep);
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

module.exports = {sockifyRequire, sockifyServer};


// TODO: output interactive angular component for controlling this server
