'use strict';
var Observable = require('rxjs/Observable').Observable;
var automock = require('./automock');
var client = require('socket.io-client');

var subscriptions = {};
var sockifyClient = function (req, dep, host) {
    var socket = client.connect(host || window.location.origin, {secure: host.match(/https/ig)});
    socket.on('connect', function () {
        // TODO: socket.emit('handler') service provider
    });
    return automock.mockValue(req, {
        stubCreator: function (name) {
            console.log(name);
            if (name.split('.').length === 1) {
                return req;
            }
            return function () {
                var args = ['call', name];
                for (var i = 0; i < arguments.length; i++) {
                    args[args.length] = arguments[i];
                }
                if (typeof subscriptions[dep] === 'undefined') {
                    subscriptions[dep] = [];
                }

                return new Observable(function (observer) {
                    socket.on('result', function (n) {
                        if (n === name) {
                            var args2 = [];
                            for (var i = 1; i < arguments.length; i++) {
                                args2[args2.length] = arguments[i];
                            }
                            console.log('Received ' + n + ' ( ' + JSON.stringify(args2[0]).substr(0, 200) + ' ) ');
                            observer.next.apply(observer, args2);
                        }
                    });
                    socket.emit.apply(socket, args);
                });
            };
        },
        name: dep
    });
};
sockifyClient;

module.exports = {
    sockifyClient: sockifyClient
};

// TODO: output interactive angular component for controlling this server