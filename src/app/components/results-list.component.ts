import { SearchService } from '../../imports/search.service';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import * as Prism from 'prismjs';

@Component({
    selector: 'bc-results-list',
    templateUrl: 'results-list.component.html',
    styleUrls: [ './results-list.component.scss' ]
})
export class ResultsListComponent implements OnInit {
    @Input() selected: any = {};
    @Output() change: EventEmitter<string> = new EventEmitter();
    @Input() results: Array<any> = [];

    constructor() {
    }

    ngOnInit(): void {
        this.selected = this.results[ 0 ];
    }

    getLineCount(r: any): number {
        return r.code.split('\n').length;
    }

    getGeneralizedFilename(filename: string): string {

        // figure out where this path is different than all the others
        const segments = filename.split('/');
        const parts = [];
        for (let j = 0; j < segments.length - 1; j++) {
            parts.push(segments.slice(0, j).join('/'));
        }
        const matching: { [index: string]: number } = {};
        for (const result of this.results) {
            for (const part of parts) {
                if (result.filename.indexOf(part) > -1) {
                    matching[ part ] = (typeof matching[ part ] !== 'undefined'
                            ? matching[ part ]
                            : 0) + 1;
                }
            }
        }

        const matchingFiles: { [index: string]: string } = {};
        for (const m in matching) {
            if (matching.hasOwnProperty(m)) {
                if (matching[ m ] > 5) {
                    matchingFiles[ m ] = filename.replace(m, '...');
                }
            }
        }

        return Object.keys(matchingFiles)
                .map(k => matchingFiles[ k ])
                .sort((a, b) => b.length - a.length)
                .pop() || filename;
    }
}
