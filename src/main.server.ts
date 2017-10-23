import { enableProdMode } from '@angular/core';
import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import { Request, Response } from 'express';
import 'reflect-metadata';
import 'rxjs/Rx';
import 'zone.js/dist/zone-node';
import { ServerAppModule } from './app/server-app.module';

enableProdMode();
const app = express();
const port = 8000;
const baseUrl = `http://localhost:${port}`;

app.engine('html', ngExpressEngine({
    bootstrap: ServerAppModule
}));

app.set('view engine', 'html');
app.set('views', 'src');

app.use('/', express.static('dist', {index: false}));

[
    '/',
    '/lazy'
].forEach((route: string) => {
    app.get(route, (req: Request, res: Response) => {
        console.time(`GET: ${req.originalUrl}`);
        res.render('../dist/index', {
            req: req,
            res: res
        });
        console.timeEnd(`GET: ${req.originalUrl}`);
    });
});

app.listen(port, () => {
    console.log(`Listening at ${baseUrl}`);
});
