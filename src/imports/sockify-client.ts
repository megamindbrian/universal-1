import * as automock from './automock';
import { Observable } from 'rxjs/Observable';

var client = require('socket.io-client');
var subscriptions = {};
export function sockifyClient(req, dep, host = window.location.origin) {
    var socket = client.connect(host);
    let ctx;
    ctx = automock.mockValue(req, {
        stubCreator: (name) => {
            if (name.split('.').length === 1) {
                return req;
            }
            return function () {
                var args = [ 'call', name ];
                for (var i = 0; i < arguments.length; i++) {
                    args[ args.length ] = arguments[ i ];
                }
                if (typeof subscriptions[ dep ] === 'undefined') {
                    subscriptions[ dep ] = [];
                }

                return new Observable(observer => {
                    socket.once('result', function (n) {
                        if (n === name) {
                            var args2 = [];
                            for (var i = 1; i < arguments.length; i++) {
                                args2[ args2.length ] = arguments[ i ];
                            }
                            console.log('Received ' + n + ' ( ' + JSON.stringify(args2[ 0 ]) + ' ) ');
                            observer.next.apply(observer, args2);
                        }
                    });
                    socket.emit.apply(socket, args);
                });
            };
        },
        name: dep
    });
    socket.on('connect', function () {
        // TODO: socket.emit('handler') service provider
        socket.emit('handle', dep);
        socket.on('resolve', function (name) {
            var args = [];
            for (var i = 1; i < arguments.length; i++) {
                args[ args.length ] = arguments[ i ];
            }
            console.log('Can I resolve ' + name + '? ( ' + JSON.stringify(args[ 0 ]) + ' ) ');
            socket.emit('result', name, true);
        });
    });
    return ctx;
};

// TODO: output interactive angular component for controlling this server