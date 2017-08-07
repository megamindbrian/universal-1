import { SearchService } from '../../../imports/search.service';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import * as Prism from 'prismjs';

@Component({
    selector: 'bc-results',
    template: `
        <pre *ngFor="let r of results" [innerHTML]="highlight(r.code)">
        </pre>
    `,
    styles: [ `
    ` ]
})
export class ResultsComponent implements OnInit, OnDestroy {
    query = '';
    results: Array<any> = [];
    private resultsSub: Subscription;

    constructor(public service: SearchService,
                public ref: ChangeDetectorRef) {
    }

    ngOnInit(): void {
        this.resultsSub = this.service.results(this.query).subscribe(r => {
            console.log('hit');
            console.log(r);
            this.results = r as Array<any>;
            this.ref.detectChanges();
        });
    }

    ngOnDestroy(): void {
        this.resultsSub.unsubscribe();
    }

    highlight(code: string): string {
        return Prism.highlight(code, Prism.languages.javascript);
    }
}

