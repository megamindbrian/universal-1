// polyfills
import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import 'rxjs/Rx';

// angular
import { APP_INITIALIZER, enableProdMode, Injector } from '@angular/core';
enableProdMode();

import { NgModuleFactory, Type, CompilerFactory, Compiler } from '@angular/core';
import { ResourceLoader } from '@angular/compiler';
import { renderModuleFactory, platformDynamicServer, INITIAL_CONFIG } from '@angular/platform-server';

import { AppServerModule } from './app/app.server.module';
import { FileLoader } from '@nguniversal/express-engine/src/file-loader';
import { Router } from '@angular/router';
import { APP_BASE_HREF } from '@angular/common';
import { REQUEST } from '@nguniversal/express-engine/tokens';

/**
 * Map of Module Factories
 */
const factoryCacheMap = new Map<Type<{}>, NgModuleFactory<{}>>();

/**
 * This is an express engine for handling Angular Applications
 */
function bootstrapRender(boot: any) {

    const compilerFactory: CompilerFactory = platformDynamicServer().injector.get(CompilerFactory);
    const compiler: Compiler = compilerFactory.createCompiler([
        {
            providers: [
                {provide: ResourceLoader, useClass: FileLoader}
            ]
        }
    ]);

    return function (url: string, callback: (err?: Error | null, html?: string) => void) {

        try {
            if (!boot) {
                return callback(new Error('You must pass in a NgModule or NgModuleFactory to be bootstrapped'));
            }

            getFactory(boot, compiler)
                .then(factory => {
                    return renderModuleFactory(factory, {
                        document: '<app-root></app-root>',
                        url: url,
                        extraProviders: [
                            {
                                provide: REQUEST,
                                useValue: {
                                    originalUrl: url
                                }
                            },
                            {
                                provide: APP_INITIALIZER,
                                useFactory: (injector: Injector) => {
                                    return () => {
                                        const router: Router = injector.get(Router);
                                        router.navigate([ url ]); // => This has NO effect
                                        console.log(router.url); // this logs: '/' instead of the 'domain.com/de-de/contact'
                                    }
                                },
                                deps: [ Injector ],
                                multi: true
                            },
                            {
                                provide: APP_BASE_HREF,
                                useValue: '/'
                            },
                            {
                                provide: INITIAL_CONFIG,
                                useValue: {
                                    document: '<app-root></app-root>',
                                    url: url
                                }
                            }
                        ]
                    });
                })
                .then((html: string) => {
                    callback(null, html);
                }, (err) => {
                    callback(err);
                });
        } catch (err) {
            callback(err);
        }
    };
}

/**
 * Get a factory from a bootstrapped module/ module factory
 */
function getFactory(moduleOrFactory: Type<{}> | NgModuleFactory<{}>, compiler: Compiler): Promise<NgModuleFactory<{}>> {
    return new Promise<NgModuleFactory<{}>>((resolve, reject) => {
        // If module has been compiled AoT
        if (moduleOrFactory instanceof NgModuleFactory) {
            resolve(moduleOrFactory);
            return;
        } else {
            let moduleFactory = factoryCacheMap.get(moduleOrFactory);

            // If module factory is cached
            if (moduleFactory) {
                resolve(moduleFactory);
                return;
            }

            // Compile the module and cache it
            compiler.compileModuleAsync(moduleOrFactory)
                .then((factory) => {
                    factoryCacheMap.set(moduleOrFactory, factory);
                    resolve(factory);
                }, (err => {
                    reject(err);
                }));
        }
    });
}

// Hacky way to get this function out of the Zone context?
(<any>global).renderer = bootstrapRender(AppServerModule);

