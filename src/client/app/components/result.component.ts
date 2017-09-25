import { SearchService } from '../../../imports/search.service';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import * as Prism from 'prismjs';

require('../../../../node_modules/prismjs/plugins/line-numbers/prism-line-numbers.js');

@Component({
    selector: 'bc-result',
    templateUrl: './result.component.html',
    styleUrls: [ './result.component.scss' ]
})
export class ResultComponent implements OnInit, OnDestroy {
    @Input() selected: any = {};

    constructor(public service: SearchService,
                public ref: ChangeDetectorRef) {
    }

    ngOnInit(): void {
    }

    ngOnDestroy(): void {
    }

    highlight(code: string): string {
        if (typeof code === 'undefined' || code === null) {
            return '';
        }

        return Prism.highlight(code, Prism.languages.javascript);
    }
}
