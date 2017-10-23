import { RouterModule, Routes } from '@angular/router';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { COMMON_MODULES } from '../../imports/core.module';
import { RecordingComponent } from './recording.component';

export const COMPONENTS = [
    RecordingComponent
];

export const recordingRoutes: Routes = [
    {
        path: '',
        component: RecordingComponent,
        data: {roles: [ 'anonymous', 'user' ]}
    }
];
export const routing: ModuleWithProviders = RouterModule.forChild(recordingRoutes);

@NgModule({
    imports: [
        ...COMMON_MODULES,
        routing
    ],
    declarations: COMPONENTS,
    exports: COMPONENTS
})
export class RecordingModule {
}
