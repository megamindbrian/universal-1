import {Injectable} from '@angular/core';

// TODO: add temporary storage and log entries
@Injectable()
export class LogService {

    debug(message: string) {
        //noinspection TsLint
        console.debug('DEBUG: ' + message);
    }

    info(message: string) {
        // TODO: implement into cloud log service
        //noinspection TsLint
        console.info('INFO: ' + message);
    }

    warn(message: string) {
        // TODO: implement into cloud log service
        console.warn('WARN: ' + message);
    }

    error(message: string) {
        // TODO: implement into cloud log service
        console.error('ERROR: ' + message);
    }
}