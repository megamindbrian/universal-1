import { SearchService } from '../../../imports/search.service';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import * as Prism from 'prismjs';

@Component({
    selector: 'bc-results-list',
    templateUrl: 'results-list.component.html',
    styleUrls: [ './results-list.component.scss' ]
})
export class ResultsListComponent {
    @Input() index = 0;
    @Output() change: EventEmitter<number> = new EventEmitter();
    @Input() results: Array<any> = [];
    private resultsSub: Subscription;

    constructor() {
    }

    getLineCount(r: any): number {
        return r.code.split('\n').length;
    }
}
