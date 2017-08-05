import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
    MdButtonModule, MdCardModule, MdCheckboxModule, MdDialogModule, MdIconModule, MdInputModule,
    MdMenuModule,
    MdOptionModule, MdProgressSpinnerModule, MdSelectionModule, MdSelectModule,
    MdSidenavModule,
    MdToolbarModule, MdTooltipModule, OverlayModule
} from '@angular/material';
import { Http, HttpModule } from '@angular/http';
import { PlatformModule } from '@angular/material';
import { SearchService } from './search.service';

// this is from MaterialModule which is deprecated
export const materialModules = [
    PlatformModule,
    OverlayModule,
    MdInputModule,
    MdOptionModule,
    MdButtonModule,
    MdSelectModule,
    MdSelectionModule,
    MdCardModule,
    MdSidenavModule,
    MdIconModule,
    MdToolbarModule,
    MdCheckboxModule,
    MdMenuModule,
    MdTooltipModule,
    MdDialogModule,
    MdProgressSpinnerModule
];

export const sharedModules: Array<any> = [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    RouterModule,
    HttpModule,
    ...materialModules
];

export const SHARED_COMPONENTS: Array<any> = [];

@NgModule({
    imports: [
        ...sharedModules
    ],
    declarations: SHARED_COMPONENTS,
    exports: SHARED_COMPONENTS
})
export class SharedModule {
    static forRoot(searchFactory: (http: Http) => SearchService): ModuleWithProviders {
        return {
            ngModule: SharedModule,
            providers: [
                {
                    provide: SearchService,
                    useFactory: searchFactory,
                    deps: [ Http ]
                }
            ]
        };
    }
}

export const COMMON_MODULES = [
    ...sharedModules,
    SharedModule
];

